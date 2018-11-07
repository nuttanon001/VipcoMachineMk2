using System;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using VipcoMachine.Services;
using VipcoMachine.ViewModels;
using VipcoMachine.Models;

using AutoMapper;
using VipcoMachine.Helper;
using System.Dynamic;

namespace VipcoMachine.Controllers.Version2
{
    [Route("api/version2/[controller]")]
    [ApiController]
    public class CuttingPlanController : GenericMachineController<CuttingPlan>
    {
        private readonly IRepositoryMachine<JobCardMaster> repositoryJobCardM;
        private readonly IRepositoryMachine<JobCardDetail> repositoryJobCardD;
        private readonly IRepositoryMachine<ProjectCodeMaster> repositoryProjectM;
        private readonly IRepositoryMachine<ProjectCodeDetail> repositoryProjectD;
        private readonly IRepositoryMachine<TaskMachine> repositoryTask;
        private readonly IRepositoryMachine<User> repositoryUser;
        public CuttingPlanController(IRepositoryMachine<CuttingPlan> repo,
            IRepositoryMachine<JobCardMaster> repoJobCardM,
            IRepositoryMachine<JobCardDetail> repoJobCardD,
            IRepositoryMachine<ProjectCodeMaster> repoProjectM,
            IRepositoryMachine<ProjectCodeDetail> repoProjectD,
            IRepositoryMachine<TaskMachine> repoTask,
            IRepositoryMachine<User> repoUser,
            IMapper mapper)
            : base(repo,mapper)
        {
            // Repository
            this.repositoryJobCardM = repoJobCardM;
            this.repositoryJobCardD = repoJobCardD;
            this.repositoryProjectM = repoProjectM;
            this.repositoryProjectD = repoProjectD;
            this.repositoryTask = repoTask;
            this.repositoryUser = repoUser;
        }

        // GET: api/controller/5
        [HttpGet("GetKeyNumber")]
        public override async Task<IActionResult> Get(int key)
        {
            var HasData = await this.repository.FindAsync(x => x.CuttingPlanId == key,x => x.ProjectCodeDetail.ProjectCodeMaster);
            var MapData = this.mapper.Map<CuttingPlan, CuttingPlanViewModel>(HasData);
            return new JsonResult(MapData, this.DefaultJsonSettings);
        }
        // GET: api/version2/CuttingPlan/CheckCuttingPlan
        [HttpGet("CheckCuttingPlan")]
        public async Task<IActionResult> CheckCuttingPlan()
        {
            var hasData = await this.repository.FindAllAsync(c => !c.JobCardDetails.Any() &&
                                                             c.TypeCuttingPlan == TypeCuttingPlan.CuttingPlan,
                                                             c => c.ProjectCodeDetail.ProjectCodeMaster);
            var Data = new List<Tuple<string, string>>();
            if (hasData != null)
            {
                foreach (var CodeDetail in hasData.GroupBy(x => x.ProjectCodeDetail))
                {
                    var HasJobMasters = await this.repositoryJobCardM.FindAllAsync(m => m.ProjectCodeDetailId == CodeDetail.Key.ProjectCodeDetailId);
                    if (HasJobMasters.Any())
                    {
                        if (HasJobMasters.Any(x => x.JobCardMasterStatus == JobCardMasterStatus.Wait))
                            continue;
                    }
                    Data.Add(new Tuple<string, string>(CodeDetail.Key.ProjectCodeDetailCode,
                                                       CodeDetail.Key.ProjectCodeMaster.ProjectCode));
                }

                if (Data.Any())
                {
                    var RuningNumber = 1;
                    var Message = new List<string>();
                    foreach (var item in Data.OrderBy(x => x.Item2).ThenBy(x => x.Item1))
                    {
                        Message.Add($"{RuningNumber}. {item.Item2}/{item.Item1}");
                        RuningNumber++;
                    }
                    return new JsonResult(new { Message }, this.DefaultJsonSettings);
                }
            }

            return NotFound(new { Error = "No CuttingPlan Waiting." });
        }

        [HttpPost("CuttingPlanNotFinish")]
        public async Task<IActionResult> CuttingPlanNotFinish([FromBody] ScrollViewModel Scroll)
        {
            var Message = "";
            try
            {
                if (Scroll == null)
                    return BadRequest();

                int TotalRow;
                var predicate = PredicateBuilder.False<CuttingPlan>();
                // Filter
                var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                    : Scroll.Filter.Split(null);
                foreach (string temp in filters)
                {
                    string keyword = temp;
                    predicate = predicate.Or(x => x.Description.ToLower().Contains(keyword) ||
                                                   x.CuttingPlanNo.ToLower().Contains(keyword) ||
                                                   x.MaterialSize.ToLower().Contains(keyword) ||
                                                   x.ProjectCodeDetail.ProjectCodeDetailCode.ToLower().Contains(keyword) ||
                                                   x.ProjectCodeDetail.ProjectCodeMaster.ProjectCode.ToLower().Contains(keyword));
                }

                predicate = predicate.And(x =>
                    x.JobCardDetails.Any(z => z.JobCardDetailStatus == JobCardDetailStatus.Wait && 
                    z.JobCardMaster.JobCardMasterStatus != JobCardMasterStatus.Complete &&
                    z.JobCardMaster.JobCardMasterStatus != JobCardMasterStatus.Cancel) &&
                    x.TypeCuttingPlan == TypeCuttingPlan.CuttingPlan);

                // Option ProjectDetailId
                if (Scroll.WhereId.HasValue)
                    predicate = predicate.And(x => x.ProjectCodeDetail.ProjectCodeDetailId == Scroll.WhereId);

                // Option SDate
                if (Scroll.SDate.HasValue)
                {
                    Scroll.SDate = Scroll.SDate.Value.AddHours(7);
                    predicate = predicate.And(x =>
                                   x.CreateDate.Value.Date >= Scroll.SDate.Value.Date);
                }

                // Option EDate
                if (Scroll.EDate.HasValue)
                {
                    Scroll.EDate = Scroll.EDate.Value.AddHours(7);
                    predicate = predicate.And(x =>
                                   x.CreateDate.Value.Date <= Scroll.EDate.Value.Date);
                }

                TotalRow = await this.repository.GetLengthWithAsync(predicate);
                var HasData = await this.repository.GetToListAsync(
                    x => x, predicate, 
                    x => x.OrderBy(z => z.CreateDate),
                    x => x.Include(z => z.ProjectCodeDetail.ProjectCodeMaster),
                    Scroll.Skip ?? 0, Scroll.Take ?? 10);

                if (HasData.Any())
                {
                    List<string> Columns = new List<string>();
                    // PlanDate
                    List<DateTime?> ListDate = new List<DateTime?>()
                        {
                            //START Date
                            HasData.Min(x => x.CreateDate),
                            //END Date
                            HasData.Max(x => x.CreateDate),
                        };

                    DateTime? MinDate = ListDate.Min();
                    DateTime? MaxDate = ListDate.Max();

                    if (MinDate == null && MaxDate == null)
                        return BadRequest(new { Error = Message });

                    // EachDay
                    var EachDate = new Helper.LoopEachDate();

                    foreach (DateTime day in EachDate.EachDate(MinDate.Value, MaxDate.Value.AddDays(1)).OrderByDescending(x => x.Value))
                    {
                        if (HasData.Any(x => x.CreateDate.Value.Date == day.Date))
                            Columns.Add(day.Date.ToString("dd/MM/yy"));
                    }

                    var DataTable = new List<IDictionary<string, object>>();

                    foreach (var Data in HasData.OrderBy(x => x.CreateDate))
                    {
                        var JobNumber = $"{Data?.ProjectCodeDetail?.ProjectCodeMaster?.ProjectCode ?? "No-Data"}" +
                                        $"/{(Data?.ProjectCodeDetail == null ? "No-Data" : Data.ProjectCodeDetail.ProjectCodeDetailCode)}";

                        IDictionary<string, object> rowData;
                        bool update = false;
                        if (DataTable.Any(x => (string)x["JobNumber"] == JobNumber))
                        {
                            var FirstData = DataTable.FirstOrDefault(x => (string)x["JobNumber"] == JobNumber);
                            if (FirstData != null)
                            {
                                rowData = FirstData;
                                update = true;
                            }
                            else
                                rowData = new ExpandoObject();
                        }
                        else
                            rowData = new ExpandoObject();

                        if (Data.CreateDate != null)
                        {
                            //Get Employee Name

                            var Key = Data.CreateDate.Value.ToString("dd/MM/yy");
                            // New Data
                            var Master = new CuttingPlanViewModel()
                            {
                                CuttingPlanId = Data.CuttingPlanId,
                                // RequireString = $"{EmployeeReq} | No.{Data.RequireNo}",
                                CuttingPlanNo = Data.CuttingPlanNo,
                            };

                            if (rowData.Any(x => x.Key == Key))
                            {
                                // New Value
                                var ListMaster = (List<CuttingPlanViewModel>)rowData[Key];
                                ListMaster.Add(Master);
                                // add to row data
                                rowData[Key] = ListMaster;
                            }
                            else // add new
                                rowData.Add(Key, new List<CuttingPlanViewModel>() { Master });
                        }

                        if (!update)
                        {
                            rowData.Add("JobNumber", JobNumber);
                            DataTable.Add(rowData);
                        }
                    }

                    return new JsonResult(new
                    {
                        TotalRow,
                        Columns,
                        DataTable
                    }, this.DefaultJsonSettings);
                }
                else
                    return NoContent();
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { Error = Message });
        }

        [HttpPost("CloseCuttingPlanNotFinish")]
        public async Task<IActionResult> CloaseCuttingPlanNotFinish([FromBody] CuttingPlanViewModel cuttingPlan)
        {
            var Message = "Not been found data.";
            try
            {
                if (cuttingPlan != null)
                {
                    var ExcludeId = await this.repositoryTask.GetToListAsync(x => x.JobCardDetailId,
                        x => x.JobCardDetail.CuttingPlanId == cuttingPlan.CuttingPlanId);

                    var jobDetails = await this.repositoryJobCardD.GetToListAsync(x => x,
                        x => x.CuttingPlanId == cuttingPlan.CuttingPlanId &&
                        x.JobCardDetailStatus == JobCardDetailStatus.Wait && 
                        x.JobCardMaster.JobCardMasterStatus != JobCardMasterStatus.Cancel &&
                        x.JobCardMaster.JobCardMasterStatus != JobCardMasterStatus.Complete &&
                        !ExcludeId.Contains(x.JobCardDetailId));

                    if (jobDetails.Any())
                    {
                        foreach (var item in jobDetails)
                        {
                            item.JobCardDetailStatus = JobCardDetailStatus.Cancel;
                            item.ModifyDate = DateTime.Now;
                            item.Modifyer = cuttingPlan.Creator;
                            //update jobcard detail
                            await this.repositoryJobCardD.UpdateAsync(item, item.JobCardDetailId);
                            if (item.JobCardMasterId != null)
                            {
                                var jobCardM = await this.repositoryJobCardM.GetFirstOrDefaultAsync(x => x,
                                    x => x.JobCardMasterId == item.JobCardMasterId,null,x => x.Include(z => z.JobCardDetails));
                                if (jobCardM != null)
                                {
                                    jobCardM.JobCardMasterStatus = jobCardM.JobCardDetails.Any(z => z.JobCardDetailStatus == JobCardDetailStatus.Wait)
                                                                    ? JobCardMasterStatus.InProcess : JobCardMasterStatus.Complete;

                                    jobCardM.ModifyDate = DateTime.Now;
                                    jobCardM.Modifyer = cuttingPlan.Creator;
                                    await this.repositoryJobCardM.UpdateAsync(jobCardM, jobCardM.JobCardMasterId);
                                }
                            }
                        }

                        return new JsonResult(new { Result = true }, this.DefaultJsonSettings);
                    }
                    return NoContent();
                }
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { Error = Message });
        }

        // GET: api/version2/CuttingPlan/GetByMaster/5
        [HttpGet("GetByMaster")]
        public async Task<IActionResult> GetByMaster(int key)
        {
            var HasData = await this.repository.FindAllAsync(e => e.ProjectCodeDetailId == key,p => p.ProjectCodeDetail.ProjectCodeMaster);
            var MapDatas = new List<CuttingPlanViewModel>();
            if (HasData.Any())
            {
                foreach (var item in HasData)
                    MapDatas.Add(this.mapper.Map<CuttingPlan, CuttingPlanViewModel>(item));
                return new JsonResult(HasData, this.DefaultJsonSettings);
            }
            else
                return BadRequest(new { Error = "Key not been found." });
        }

        // POST: api/version2/CuttingPlan/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll2([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                .Include(x => x.ProjectCodeDetail.ProjectCodeMaster)
                                .AsQueryable();
            // Where
            if (Scroll.WhereId.HasValue)
                QueryData = QueryData.Where(x => x.ProjectCodeDetailId == Scroll.WhereId);

            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.CuttingPlanNo.ToLower().Contains(keyword) ||
                                                 x.Description.ToLower().Contains(keyword) ||
                                                 x.ProjectCodeDetail.ProjectCodeDetailCode.ToLower().Contains(keyword) ||
                                                 x.ProjectCodeDetail.Description.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "CuttingPlanNo":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.CuttingPlanNo) :
                        QueryData.OrderBy(e => e.CuttingPlanNo);
                    break;
                case "Description":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.Description) :
                        QueryData.OrderBy(e => e.Description);
                    break;
                case "ProjectCodeString":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.ProjectCodeDetail.ProjectCodeDetailCode) :
                        QueryData.OrderBy(e => e.ProjectCodeDetail.ProjectCodeDetailCode);
                    break;
                case "MaterialSize":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.MaterialSize) :
                        QueryData.OrderBy(e => e.MaterialSize);
                    break;
                default:
                    QueryData = QueryData.OrderBy(e => e.CuttingPlanNo);
                    break;
            }
            // Get TotalRow
            Scroll.TotalRow = await QueryData.CountAsync();
            // Skip and Take
            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 10);
            var MapDatas = new List<CuttingPlanViewModel>();
            // Foreach
            foreach (var item in await QueryData.ToListAsync())
                MapDatas.Add(this.mapper.Map<CuttingPlan, CuttingPlanViewModel>(item));

            return new JsonResult(new ScrollDataViewModel<CuttingPlanViewModel>
                (Scroll, MapDatas), this.DefaultJsonSettings);
        }

        // POST: api/version2/CuttingPlan/GetScroll
        [HttpPost("GetScrollNotUser")]
        public async Task<IActionResult> GetScrollNotUser([FromBody] ScrollViewModel Scroll)
        {
            var predicate = PredicateBuilder.False<CuttingPlan>();

            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                predicate = predicate.Or(x => x.CuttingPlanNo.ToLower().Contains(keyword) ||
                                                x.Description.ToLower().Contains(keyword) ||
                                                x.ProjectCodeDetail.ProjectCodeDetailCode.ToLower().Contains(keyword) ||
                                                x.ProjectCodeDetail.Description.ToLower().Contains(keyword));
            }
            predicate = predicate.And(p => !p.JobCardDetails.Any() && p.TypeCuttingPlan == TypeCuttingPlan.CuttingPlan);
            //Order by
            Func<IQueryable<CuttingPlan>, IOrderedQueryable<CuttingPlan>> order;
            // Order
            switch (Scroll.SortField)
            {
                case "CuttingPlanNo":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.CuttingPlanNo);
                    else
                        order = o => o.OrderBy(x => x.CuttingPlanNo);
                    break;
                case "Description":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Description);
                    else
                        order = o => o.OrderBy(x => x.Description);
                    break;
                case "ProjectCodeString":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.ProjectCodeDetail.ProjectCodeDetailCode);
                    else
                        order = o => o.OrderBy(x => x.ProjectCodeDetail.ProjectCodeDetailCode);
                    break;
                case "MaterialSize":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.MaterialSize);
                    else
                        order = o => o.OrderBy(x => x.MaterialSize);
                    break;
                default:
                    order = o => o.OrderByDescending(x => x.CuttingPlanNo);
                    break;
            }

            var QueryData = await this.repository.GetToListAsync(
                                   selector: selected => selected,  // Selected
                                   predicate: predicate, // Where
                                   orderBy: order, // Order
                                   include: x => x.Include(z => z.ProjectCodeDetail.ProjectCodeMaster)
                                   .Include(z => z.JobCardDetails), // Include
                                   skip: Scroll.Skip ?? 0, // Skip
                                   take: Scroll.Take ?? 10); // Take

            // Get TotalRow
            Scroll.TotalRow = await this.repository.GetLengthWithAsync(predicate: predicate);
            var MapDatas = new List<CuttingPlanViewModel>();
            // Get employee user
            var userList = QueryData.Select(z => z.Creator).Distinct().ToList();
            var employee = await this.repositoryUser.GetToListAsync(
                x => new { x.Employee.NameThai, x.UserName},
                x => userList.Contains(x.UserName), null,
                x => x.Include(z => z.Employee));
            // Foreach
            foreach (var item in QueryData.ToList())
            {
                var mapData = this.mapper.Map<CuttingPlan, CuttingPlanViewModel>(item);
                mapData.CreateNameThai = employee.FirstOrDefault(z => z.UserName == mapData.Creator)?.NameThai;
                MapDatas.Add(mapData);
            }

            return new JsonResult(new ScrollDataViewModel<CuttingPlanViewModel>
                (Scroll, MapDatas), this.DefaultJsonSettings);
        }

        // POST: api/version2/CuttingPlan/ImportData
        [HttpPost("ImportData")]
        public async Task<IActionResult> CuttingPlanImportData([FromBody] IEnumerable<CuttingImportViewModel> ImportDatas, string UserName = "")
        {
            string Message = "";
            try
            {
                if (ImportDatas != null)
                {
                    var date = DateTime.Now;

                    foreach (var Jobs in ImportDatas.GroupBy(x => x.JobNo.Trim()))
                    {
                        var ProjectM = await this.repositoryProjectM.GetAllAsQueryable()
                                                    .Where(x => x.ProjectCode.Trim().ToLower()
                                                                 .Equals(Jobs.Key.Trim().ToLower()))
                                                    .Include(x => x.ProjectCodeDetails)
                                                        .ThenInclude(z => z.CuttingPlans)
                                                    .FirstOrDefaultAsync();

                        if (ProjectM != null)
                        {
                            foreach (var JDetails in Jobs.GroupBy(x => x.Level23.Trim()))
                            {
                                var PDetail = ProjectM.ProjectCodeDetails
                                                .FirstOrDefault(x => x.ProjectCodeDetailCode.Trim()
                                                    .ToLower().Equals(JDetails.Key.Trim().ToLower()));

                                if (PDetail != null)
                                {
                                    foreach (var Import in JDetails.GroupBy(x => x.CuttingPlan.Trim() + x.MaterialSize.Trim()))
                                    {
                                        var Cutting = PDetail.CuttingPlans
                                                        .FirstOrDefault(x =>
                                                        ((x.CuttingPlanNo != null ? x.CuttingPlanNo.ToLower() : "") +
                                                         (x.MaterialSize != null ? x.MaterialSize.ToLower() : ""))
                                                        .Equals(Import.Key.ToLower()));

                                        if (Cutting == null)
                                        {
                                            foreach (var import2 in Import)
                                            {
                                                double.TryParse(import2.Quantity, out double qty);
                                                // Insert CuttingPlan and Material
                                                var nCuttingPlan = new CuttingPlan()
                                                {
                                                    ProjectCodeDetailId = PDetail.ProjectCodeDetailId,
                                                    CreateDate = date,
                                                    Creator = UserName,
                                                    CuttingPlanNo = import2.CuttingPlan,
                                                    Description = "Did not has description yet",
                                                    Quantity = qty,
                                                    TypeCuttingPlan = TypeCuttingPlan.CuttingPlan,
                                                    MaterialSize = string.IsNullOrEmpty(import2.MaterialSize) ? "" : import2.MaterialSize.Trim(),
                                                    MaterialGrade = string.IsNullOrEmpty(import2.MaterialGrade) ? "" : import2.MaterialGrade.Trim(),
                                                };

                                                await this.repository.AddAsync(nCuttingPlan);
                                            }
                                        }
                                    }
                                }
                                // if don't have add all data in this level2/3
                                else
                                {
                                    // Insert ProjectDetail
                                    var nProDetail = new ProjectCodeDetail()
                                    {
                                        CreateDate = date,
                                        Creator = UserName,
                                        Description = "Did not has description yet.",
                                        ProjectCodeDetailCode = JDetails.Key,
                                        ProjectCodeMasterId = ProjectM.ProjectCodeMasterId,
                                        CuttingPlans = new List<CuttingPlan>()
                                    };

                                    foreach (var Import in JDetails)
                                    {
                                        // Insert CuttingPlan and Material
                                        double.TryParse(Import.Quantity, out double qty);

                                        var nCuttingPlan = new CuttingPlan()
                                        {
                                            CreateDate = date,
                                            Creator = UserName,
                                            CuttingPlanNo = Import.CuttingPlan,
                                            Description = "Did not has description yet",
                                            Quantity = qty,
                                            TypeCuttingPlan = TypeCuttingPlan.CuttingPlan,
                                            MaterialSize = string.IsNullOrEmpty(Import.MaterialSize) ? "" : Import.MaterialSize.Trim(),
                                            MaterialGrade = string.IsNullOrEmpty(Import.MaterialGrade) ? "" : Import.MaterialGrade.Trim(),
                                        };
                                        nProDetail.CuttingPlans.Add(nCuttingPlan);
                                    }

                                    // Insert ProjectDetail to DataBase
                                    await this.repositoryProjectD.AddAsync(nProDetail);
                                }
                            }
                        }
                        // if don't have add all data in this job
                        else
                        {
                            // Insert ProjectMaster
                            var nProMaster = new ProjectCodeMaster()
                            {
                                CreateDate = date,
                                Creator = UserName,
                                ProjectCode = Jobs.Key,
                                ProjectName = "Did not has name yet.",
                                StartDate = date,
                                ProjectCodeDetails = new List<ProjectCodeDetail>()
                            };
                            // Insert all ProjectDetail ,CuttingPlan and Material
                            foreach (var JDetails in Jobs.GroupBy(x => x.Level23))
                            {
                                // Insert ProjectDetail
                                var nProDetail = new ProjectCodeDetail()
                                {
                                    CreateDate = date,
                                    Creator = UserName,
                                    Description = "Did not has description yet.",
                                    ProjectCodeDetailCode = JDetails.Key,
                                    CuttingPlans = new List<CuttingPlan>()
                                };
                                foreach (var Import in JDetails)
                                {
                                    // Insert CuttingPlan and Material
                                    double.TryParse(Import.Quantity, out double qty);
                                    var nCuttingPlan = new CuttingPlan()
                                    {
                                        CreateDate = date,
                                        Creator = UserName,
                                        CuttingPlanNo = Import.CuttingPlan,
                                        Description = "Did not has description yet",
                                        Quantity = qty,
                                        TypeCuttingPlan = TypeCuttingPlan.CuttingPlan,
                                        MaterialSize = string.IsNullOrEmpty(Import.MaterialSize) ? "" : Import.MaterialSize.Trim(),
                                        MaterialGrade = string.IsNullOrEmpty(Import.MaterialGrade) ? "" : Import.MaterialGrade.Trim(),
                                    };
                                    nProDetail.CuttingPlans.Add(nCuttingPlan);
                                }

                                nProMaster.ProjectCodeDetails.Add(nProDetail);
                            }
                            // Insert ProjectMaster to DataBase
                            await this.repositoryProjectM.AddAsync(nProMaster);
                        }
                    }

                    // alway return true
                    return new JsonResult(true, this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Message });
        }
    }
}
