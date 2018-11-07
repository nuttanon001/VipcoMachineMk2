using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

using VipcoMachine.Services;
using VipcoMachine.ViewModels;
using VipcoMachine.Models;

using AutoMapper;
using Microsoft.EntityFrameworkCore.Query;
using VipcoMachine.Helper;
using System.Dynamic;
using VipcoMachine.Helpers;

namespace VipcoMachine.Controllers.Version2
{
    [Route("api/version2/[controller]")]
    [ApiController]
    public class JobCardMasterController : GenericMachineController<JobCardMaster>
    {
        private readonly IRepositoryMachine<ProjectCodeDetail> repositoryProjectD;
        private readonly IRepositoryMachine<TypeMachine> repositoryTypeMachine;
        private readonly IRepositoryMachine<CuttingPlan> repositoryCuttingPlan;
        private readonly IRepositoryMachine<JobCardDetail> repositoryJobCardD;
        private readonly IRepositoryMachine<JobCardMasterHasAttach> repositoryHasAttach;
        private readonly IRepositoryMachine<AttachFile> repositoryAttach;
        private readonly IRepositoryMachine<User> repositoryUser;
        private readonly IRepositoryMachine<Employee> repositoryEmp;
        private readonly IHostingEnvironment hosting;
        private readonly EmailClass EmailClass;// Private 
        // Private 
        private readonly Func<IQueryable<JobCardMaster>, IIncludableQueryable<JobCardMaster, object>> includes;
        public JobCardMasterController(
            IRepositoryMachine<JobCardMaster> repo, 
            IRepositoryMachine<ProjectCodeDetail> repoProjectD,
            IRepositoryMachine<TypeMachine> repoTypeMachine,
            IRepositoryMachine<AttachFile> repoAttach,
            IRepositoryMachine<JobCardMasterHasAttach> repoHasAttach,
            IRepositoryMachine<CuttingPlan> repoCuttingPlan,
            IRepositoryMachine<JobCardDetail> repoJobCardD,
            IRepositoryMachine<User> repoUser,
            IRepositoryMachine<Employee> repoEmp,
            IMapper mapper,
            IHostingEnvironment hosting) :
            base(repo, mapper)
        {
            // Repository
            this.repositoryProjectD = repoProjectD;
            this.repositoryTypeMachine = repoTypeMachine;
            this.repositoryAttach = repoAttach;
            this.repositoryHasAttach = repoHasAttach;
            this.repositoryJobCardD = repoJobCardD;
            this.repositoryCuttingPlan = repoCuttingPlan;
            this.repositoryEmp = repoEmp;
            this.repositoryUser = repoUser;
            // Hosting
            this.hosting = hosting;
            // include
            this.includes = e => e.Include(x => x.EmployeeRequire)
                                .Include(x => x.EmployeeGroup)
                                .Include(x => x.EmployeeWrite)
                                .Include(x => x.TypeMachine)
                                .Include(x => x.ProjectCodeDetail.ProjectCodeMaster);
            // Mail
            this.EmailClass = new EmailClass();
        }

        #region PrivateMethod
        private async Task<string> GeneratedCode(int ProjectDetailId, int TypeMachineId)
        {
            if (ProjectDetailId > 0 && TypeMachineId > 0)
            {
                var projectD = await this.repositoryProjectD.FindAsync(x => x.ProjectCodeDetailId == ProjectDetailId, x => x.ProjectCodeMaster);
                var typeMachine = await this.repositoryTypeMachine.GetAsync(TypeMachineId);
                if (projectD != null && typeMachine != null)
                {
                    var Runing = await this.repository.CountWithMatchAsync(x => x.ProjectCodeDetail.ProjectCodeMasterId == projectD.ProjectCodeMasterId &&
                                                                                x.TypeMachineId == TypeMachineId) + 1;
                    return $"{projectD.ProjectCodeMaster.ProjectCode}/{typeMachine.TypeMachineCode}/{Runing.ToString("0000")}";
                }
            }
            return "xxxx/xx/xx";
        }
        private async Task<bool> SendMailAsync(JobCardMaster jobMaster)
        {
            try
            {
                if (jobMaster != null)
                {

                    var ListMail = new List<string>();
                    if (!string.IsNullOrEmpty(jobMaster.MailReply))
                    {
                        if (jobMaster.MailReply.IndexOf(',') != -1)
                            ListMail = jobMaster.MailReply.Split(',').ToList();
                        else if (jobMaster.MailReply.IndexOf(';') != -1)
                            ListMail = jobMaster.MailReply.Split(';').ToList();
                        else
                            ListMail.Add(jobMaster.MailReply);
                    }
                    else
                    {
                        var user = await this.repositoryUser.GetAllAsQueryable()
                                       .Include(x => x.Employee)
                                       .Where(x => x.EmpCode == jobMaster.EmpWrite)
                                       .FirstOrDefaultAsync();
                        if (user != null)
                            ListMail.Add(user.MailAddress);
                    }

                    if (ListMail.Any())
                    {
                        var EmpName = await this.repositoryEmp.GetFirstOrDefaultAsync(x => x.NameThai, x => x.EmpCode == jobMaster.EmpWrite);

                        var BodyMessage = "<body style=font-size:11pt;font-family:Tahoma>" +
                                            "<h4 style='color:steelblue;'>เมล์ฉบับนี้เป็นแจ้งเตือนจากระบบงาน VIPCO MACHINE SYSTEM</h4>" +
                                            $"เรียน คุณ{EmpName}" +
                                            $"<p>เรื่อง การเปิดใบงานเลขที่ {jobMaster.JobCardMasterNo}</p>" +
                                            $"<p style='color:red;'>ณ.ขณะนี้ ทางหน่วยงานแมชชีนได้ทำการ \"<b>ยกเลิกคำขอ</b>\" งานแมชชีนจากระบบ</p>" +
                                            $"<p>โดยให้คำอธิบายดังนี้ \"{ jobMaster.Remark }\" หากมีขอสงสัยโปรดติดต่อ หน่วยงานแมชชีน</p>" +
                                            "<span style='color:steelblue;'>This mail auto generated by VIPCO MACHINE SYSTEM. Do not reply this email.</span>" +
                                          "</body>";

                        return await this.EmailClass.SendMailMessage(ListMail[0], EmpName,
                                              ListMail,
                                              BodyMessage, "Notification mail from VIPCO Machine system.");
                    }
                }
            }
            catch (Exception ex)
            {
                var message = $"Has error {ex.ToString()}";
            }

            return false;
        }

        #endregion

        // GET: api/version2/JobCardMaster/CheckCuttingPlanWaiting
        [HttpGet("CheckCuttingPlanWaiting")]
        public async Task<IActionResult> CheckCuttingPlanWaiting()
        {
            var Message = "Not found Cutting plan waiting.";
            try
            {
                var hasCpWaiting = await this.repositoryCuttingPlan.GetToListAsync(
                    x => x, x => !x.JobCardDetails.Any() && x.TypeCuttingPlan == TypeCuttingPlan.CuttingPlan,
                    null);

                if (hasCpWaiting.Any())
                {
                    foreach (var cutting in hasCpWaiting)
                    {
                        IOrderedQueryable<JobCardMaster> order(IQueryable<JobCardMaster> o) => o.OrderByDescending(z => z.JobCardMasterId);
                        var mode = "";
                        if (cutting.CuttingPlanNo.ToLower().Contains("pl"))
                            mode = "gm"; 
                        else
                            mode = "cm";

                        var HasJobMaster = await this.repository.GetFirstOrDefaultAsync(
                            selector: x => x,
                            predicate: x => x.ProjectCodeDetailId == cutting.ProjectCodeDetailId &&
                                                   x.JobCardMasterStatus != JobCardMasterStatus.Cancel &&
                                                   x.TypeMachine.TypeMachineCode.ToLower().Contains(mode),
                            orderBy: order);

                        if (HasJobMaster != null)
                        {
                            // add JobCardDetail
                            await this.repositoryJobCardD.AddAsync(
                               new JobCardDetail()
                               {
                                   JobCardMasterId = HasJobMaster.JobCardMasterId,
                                   CuttingPlanId = cutting.CuttingPlanId,
                                   JobCardDetailStatus = JobCardDetailStatus.Wait,
                                   Material = $"{cutting.MaterialSize ?? ""} {cutting.MaterialGrade ?? ""}",
                                   Quality = cutting.Quantity == null ? 1 : (cutting.Quantity < 1 ? 1 : cutting.Quantity),
                                   Remark = "Add by system",
                                   CreateDate = HasJobMaster.JobCardDate,
                                   Creator = "System"
                               });

                            //check JobCardMaster status
                            if (HasJobMaster.JobCardMasterStatus != JobCardMasterStatus.InProcess)
                            {
                                HasJobMaster.JobCardMasterStatus = JobCardMasterStatus.InProcess;
                                await this.repository.UpdateAsync(HasJobMaster, HasJobMaster.JobCardMasterId);
                            }
                        }
                    }
                    return new JsonResult(new { Complate = true }, this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }

        // GET: api/version2/JobCardMaster/5
        [HttpGet("GetKeyNumber")]
        public override async Task<IActionResult> Get(int key)
        {
            var HasData = await this.repository.GetFirstOrDefaultAsync(
                selector: x => x,
                predicate: x => x.JobCardMasterId == key,
                include:this.includes);

            if (HasData != null)
            {
                var mapData = this.mapper.Map<JobCardMaster, JobCardMasterViewModel>(HasData);
                return new JsonResult(mapData, this.DefaultJsonSettings);
            }

            return BadRequest(new { error = "Data not been found." });
        }

        // POST: api/version2/JobCardMaster/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            if (Scroll == null)
                return BadRequest();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.Split(null);

            var predicate = PredicateBuilder.False<JobCardMaster>();

            foreach (string temp in filters)
            {
                string keyword = temp;
                predicate = predicate.Or( x => x.Description.ToLower().Contains(keyword) ||
                                                x.JobCardMasterNo.ToLower().Contains(keyword) ||
                                                x.EmployeeGroup.Description.ToLower().Contains(keyword) ||
                                                x.EmpRequire.ToLower().Contains(keyword) ||
                                                x.EmployeeWrite.NameThai.ToLower().Contains(keyword) ||
                                                x.EmpWrite.ToLower().Contains(keyword) ||
                                                x.Remark.ToLower().Contains(keyword) ||
                                                x.ProjectCodeDetail.ProjectCodeDetailCode.ToLower().Contains(keyword) ||
                                                x.ProjectCodeDetail.ProjectCodeMaster.ProjectCode.ToLower().Contains(keyword));
            }
            if (!string.IsNullOrEmpty(Scroll.Where))
                predicate = predicate.And(p => p.Creator == Scroll.Where);
            //Order by
            Func<IQueryable<JobCardMaster>, IOrderedQueryable<JobCardMaster>> order;
            // Order
            switch (Scroll.SortField)
            {
                case "JobCardMasterNo":
                    if (Scroll.SortOrder == 1)
                        order = o => o.OrderByDescending(x => x.JobCardMasterNo);
                    else
                        order = o => o.OrderBy(x => x.JobCardMasterNo);
                    break;
                case "ProjectDetailString":
                    if (Scroll.SortOrder == 1)
                        order = o => o.OrderByDescending(x => x.ProjectCodeDetail.ProjectCodeDetailCode);
                    else
                        order = o => o.OrderBy(x => x.ProjectCodeDetail.ProjectCodeDetailCode);
                    break;
                case "EmployeeRequireString":
                    if (Scroll.SortOrder == 1)
                        order = o => o.OrderByDescending(x => x.EmployeeGroup.Description);
                    else
                        order = o => o.OrderBy(x => x.EmployeeGroup.Description);
                    break;
                case "StatusString":
                    if (Scroll.SortOrder == 1)
                        order = o => o.OrderByDescending(x => x.JobCardMasterStatus);
                    else
                        order = o => o.OrderBy(x => x.JobCardMasterStatus);
                    break;
                case "JobCardDate":
                    if (Scroll.SortOrder == 1)
                        order = o => o.OrderByDescending(x => x.JobCardDate);
                    else
                        order = o => o.OrderBy(x => x.JobCardDate);
                    break;
                case "TypeMachineString":
                    if (Scroll.SortOrder == 1)
                        order = o => o.OrderByDescending(x => x.TypeMachine.TypeMachineCode);
                    else
                        order = o => o.OrderBy(x => x.TypeMachine.TypeMachineCode);
                    break;
                default:
                    order = o => o.OrderByDescending(x => x.JobCardDate);
                    break;
            }

            var QueryData = await this.repository.GetToListAsync(
                                    selector: selected => selected,  // Selected
                                    predicate: predicate, // Where
                                    orderBy: order, // Order
                                    include:  z => z.Include(x => x.EmployeeRequire)
                                        .Include(x => x.EmployeeGroup)
                                        .Include(x => x.EmployeeWrite)
                                        .Include(x => x.TypeMachine)
                                        .Include(x => x.ProjectCodeDetail.ProjectCodeMaster), // Include
                                    skip: Scroll.Skip ?? 0, // Skip
                                    take: Scroll.Take ?? 10); // Take

            // Get TotalRow
            Scroll.TotalRow = await this.repository.GetLengthWithAsync(predicate: predicate);

            var mapDatas = new List<JobCardMasterViewModel>();
            foreach (var item in QueryData)
            {
                var MapItem = this.mapper.Map<JobCardMaster, JobCardMasterViewModel>(item);
                mapDatas.Add(MapItem);
            }

            return new JsonResult(new ScrollDataViewModel<JobCardMasterViewModel>(Scroll, mapDatas), this.DefaultJsonSettings);
        }

        [HttpPost("CancelJobMaster")]
        public async Task<IActionResult> CancelJobMaster([FromBody] JobCardMasterViewModel model)
        {
            var Message = "Data not been found.";
            try
            {
                var jobMaster = await this.repository.GetFirstOrDefaultAsync(x => x, 
                    x => x.JobCardMasterId == model.JobCardMasterId,null,
                    x => x.Include(z => z.JobCardDetails));

                if (jobMaster != null)
                {
                    if (!jobMaster.JobCardDetails.Any() || jobMaster.JobCardDetails.
                        Any(x => x.JobCardDetailStatus != JobCardDetailStatus.Task || 
                            x.JobCardDetailStatus != JobCardDetailStatus.Change))
                    {
                        jobMaster.JobCardMasterStatus = JobCardMasterStatus.Cancel;
                        jobMaster.ModifyDate = DateTime.Now;
                        jobMaster.Modifyer = model.Modifyer;
                        jobMaster.Remark = model.Remark;

                        var result = await this.repository.UpdateAsync(jobMaster, jobMaster.JobCardMasterId);
                        if (result != null)
                        {
                            await this.SendMailAsync(result);
                        }

                        return Ok();
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { Message });
        }

        [HttpPost]
        public override async Task<IActionResult> Create([FromBody] JobCardMaster record)
        {
            var Message = "Data not been found.";

            try
            {
                // Set date for CrateDate Entity
                if (record == null)
                    return BadRequest();

                record.JobCardMasterNo = await this.GeneratedCode(record.ProjectCodeDetailId ?? 0,
                                                                  record.TypeMachineId ?? 0);
                record.JobCardMasterStatus = record.JobCardMasterStatus ?? JobCardMasterStatus.Wait;
                // +7 Hour
                record = this.helper.AddHourMethod(record);

                if (record.GetType().GetProperty("CreateDate") != null)
                    record.GetType().GetProperty("CreateDate").SetValue(record, DateTime.Now);

                if (record.JobCardDetails != null)
                {
                    foreach (var recordDetail in record.JobCardDetails)
                    {
                        recordDetail.JobCardDetailStatus = recordDetail.JobCardDetailStatus ?? JobCardDetailStatus.Wait;
                        recordDetail.CreateDate = record.CreateDate;
                        recordDetail.Creator = record.Creator;
                        // Insert UnitMeasure
                        recordDetail.UnitsMeasure = null;
                        // Insert CuttingPlan
                        if (recordDetail.CuttingPlanId < 1 && recordDetail.CuttingPlan != null)
                        {
                            recordDetail.CuttingPlan.CreateDate = record.CreateDate;
                            recordDetail.CuttingPlan.Creator = record.Creator;
                            if (string.IsNullOrEmpty(recordDetail?.CuttingPlan.MaterialSize))
                                recordDetail.CuttingPlan.MaterialSize = recordDetail.Material;
                            if (recordDetail?.CuttingPlan?.Quantity == null || recordDetail?.CuttingPlan?.Quantity < 1)
                                recordDetail.CuttingPlan.Quantity = recordDetail.Quality;
                        }
                        else
                            recordDetail.CuttingPlan = null;
                    }
                }

                if (await this.repository.AddAsync(record) != null)
                    return new JsonResult(record, this.DefaultJsonSettings);
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { Error = Message });

            
        }

        [HttpPost("GetWaitJobCardScheduleOnlyLmSm")]
        public async Task<IActionResult> GetWaitJobCardScheduleOnlyLmSm([FromBody] OptionScheduleViewModel Schedule)
        {
            if (Schedule == null)
                return BadRequest();

            var Message = "";
            try
            {
                int TotalRow;
                var predicate = PredicateBuilder.False<JobCardMaster>();
                // Filter
                var filters = string.IsNullOrEmpty(Schedule.Filter) ? new string[] { "" }
                                    : Schedule.Filter.ToLower().Split(null);
                foreach (var keyword in filters)
                {
                    string temp = keyword;
                    predicate = predicate.Or(x => x.EmployeeRequire.NameThai.ToLower().Contains(temp) ||
                                                  x.EmployeeWrite.NameThai.ToLower().Contains(temp) ||
                                                  x.EmployeeGroup.Description.ToLower().Contains(temp) ||
                                                  x.ProjectCodeDetail.ProjectCodeDetailCode.ToLower().Contains(temp) ||
                                                  x.ProjectCodeDetail.ProjectCodeMaster.ProjectCode.ToLower().Contains(temp) ||
                                                  x.Description.ToLower().Contains(temp));
                }

                predicate = predicate.And(x => (x.JobCardMasterStatus == JobCardMasterStatus.Wait ||
                                                x.JobCardMasterStatus == JobCardMasterStatus.InProcess));

                // Option ProjectCodeMaster
                if (Schedule.ProjectMasterId.HasValue)
                    predicate = predicate.And(x => x.ProjectCodeDetail.ProjectCodeMasterId == Schedule.ProjectMasterId);

                if (Schedule.ProjectDetailId.HasValue)
                    predicate = predicate.And(x => x.ProjectCodeDetailId == Schedule.ProjectDetailId);

                // Option Status
                if (Schedule.TypeMachineId.HasValue)
                    predicate = predicate.And(x => x.TypeMachineId == Schedule.TypeMachineId);
                else
                    predicate = predicate.And(x => x.TypeMachine.TypeMachineCode.Contains("LM") ||
                                                   x.TypeMachine.TypeMachineCode.Contains("SM"));

                TotalRow = await this.repository.GetLengthWithAsync(predicate);


                var HasData = await this.repository.GetToListAsync(
                    selector: x => x,
                    predicate: predicate,
                    include: x => x.Include(z => z.EmployeeRequire)
                                   .Include(z => z.EmployeeWrite)
                                   .Include(z => z.EmployeeGroup)
                                   .Include(z => z.TypeMachine)
                                   .Include(z => z.ProjectCodeDetail.ProjectCodeMaster),
                    skip: Schedule.Skip ?? 0,
                    take: Schedule.Take ?? 10,
                    orderBy: x => x.OrderByDescending(z => z.JobCardDate));

                if (HasData.Any())
                {
                    List<string> Columns = new List<string>();
                    // PlanDate
                    List<DateTime?> ListDate = new List<DateTime?>()
                        {
                            //START Date
                            HasData.Min(x => x.CreateDate),
                            HasData.Min(x => x.JobCardDate) ?? null,
                            HasData.Min(x => x.DueDate) ?? null,
                            //END Date
                            HasData.Max(x => x.CreateDate),
                            HasData.Max(x => x.JobCardDate) ?? null,
                            HasData.Max(x => x.DueDate) ?? null,
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
                    foreach(var machineGroup in HasData.GroupBy(z => z.TypeMachine))
                    {
                        foreach (var Data in machineGroup.OrderBy(x => x.CreateDate))
                        {
                            var JobNumber = $"{Data?.ProjectCodeDetail?.ProjectCodeMaster?.ProjectCode ?? "No-Data"}" +
                                            $"/{(Data?.ProjectCodeDetail == null ? "No-Data" : Data?.ProjectCodeDetail?.ProjectCodeDetailCode)}";

                            var WorkGroup = Data?.TypeMachine?.TypeMachineCode ?? "";
                            IDictionary<string, object> rowData;
                            bool update = false;
                            if (DataTable.Any(x => (string)x["JobNumber"] == JobNumber && 
                                                   (string)x["GroupMachine"] == WorkGroup &&
                                                   (string)x["Employee"] == Data?.EmployeeWrite?.NameThai))
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
                                // var Employee = await this.repositoryEmp.GetAsync(Data.RequireEmp);
                                // var EmployeeReq = Employee != null ? $"คุณ{(Employee?.NameThai ?? "")}" : "No-Data";

                                var Key = Data.CreateDate.Value.ToString("dd/MM/yy");
                                // New Data
                                var Master = new JobCardMasterViewModel()
                                {
                                    JobCardMasterId = Data.JobCardMasterId,
                                    JobCardMasterNo = Data.JobCardMasterNo
                                };

                                if (rowData.Any(x => x.Key == Key))
                                {
                                    // New Value
                                    var ListMaster = (List<JobCardMasterViewModel>)rowData[Key];
                                    ListMaster.Add(Master);
                                    // add to row data
                                    rowData[Key] = ListMaster;
                                }
                                else // add new
                                    rowData.Add(Key, new List<JobCardMasterViewModel>() { Master });
                            }

                            if (!update)
                            {
                                rowData.Add("GroupMachine", Data?.TypeMachine?.TypeMachineCode);
                                rowData.Add("JobNumber", JobNumber);
                                rowData.Add("Employee", Data?.EmployeeWrite?.NameThai);
                                DataTable.Add(rowData);
                            }
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

        [HttpPut]
        public override async Task<IActionResult> Update(int key, [FromBody] JobCardMaster record)
        {
            var Message = "Data not been found.";

            try
            {
                if (key < 1)
                    return BadRequest();
                if (record == null)
                    return BadRequest();

                // +7 Hour
                record = this.helper.AddHourMethod(record);

                // Set date for CrateDate Entity
                if (record.GetType().GetProperty("ModifyDate") != null)
                    record.GetType().GetProperty("ModifyDate").SetValue(record, DateTime.Now);

                if (record.JobCardMasterStatus != JobCardMasterStatus.Complete)
                {
                    if (record.JobCardDetails.Any())
                        record.JobCardMasterStatus = record.JobCardDetails.Any(x => x.JobCardDetailStatus == JobCardDetailStatus.Wait)
                            ? JobCardMasterStatus.Wait : JobCardMasterStatus.InProcess;
                    else
                        record.JobCardMasterStatus = JobCardMasterStatus.Wait;
                }

                if (record.JobCardDetails != null)
                {
                    foreach (var recordDetail in record.JobCardDetails)
                    {
                        if (recordDetail.JobCardDetailId > 0)
                        {
                            recordDetail.ModifyDate = record.ModifyDate;
                            recordDetail.Modifyer = record.Modifyer;
                        }
                        else
                        {
                            recordDetail.CreateDate = record.ModifyDate;
                            recordDetail.Creator = record.Modifyer;
                            recordDetail.JobCardDetailStatus = recordDetail.JobCardDetailStatus ?? JobCardDetailStatus.Wait;
                        }

                        if (recordDetail.CuttingPlanId < 1 && recordDetail.CuttingPlan != null)
                        {
                            if (recordDetail.CuttingPlan != null)
                            {
                                recordDetail.CuttingPlan.CreateDate = record.ModifyDate;
                                recordDetail.CuttingPlan.Creator = record.Modifyer;

                                if (string.IsNullOrEmpty(recordDetail.CuttingPlan.MaterialSize))
                                    recordDetail.CuttingPlan.MaterialSize = recordDetail.Material;

                                if (recordDetail.CuttingPlan?.Quantity == null || recordDetail.CuttingPlan?.Quantity < 1)
                                    recordDetail.CuttingPlan.Quantity = recordDetail.Quality;

                                recordDetail.CuttingPlan = await this.repositoryCuttingPlan.AddAsync(recordDetail.CuttingPlan);
                                recordDetail.CuttingPlanId = recordDetail.CuttingPlan.CuttingPlanId;
                            }
                        }

                        recordDetail.CuttingPlan = null;
                        recordDetail.UnitsMeasure = null;
                    }
                }

                if (await this.repository.UpdateAsync(record, key) != null)
                {
                    if (record != null)
                    {
                        // filter
                        var dbDetails = await this.repositoryJobCardD.FindAllAsync(x => x.JobCardMasterId == key);
                        //Remove Job if edit remove it
                        foreach (var dbDetail in dbDetails)
                        {
                            if (!record.JobCardDetails.Any(x => x.JobCardDetailId == dbDetail.JobCardDetailId))
                                await this.repositoryJobCardD.DeleteAsync(dbDetail.JobCardDetailId);
                        }
                        //Update JobCardDetail or New JobCardDetail
                        foreach (var uDetail in record.JobCardDetails)
                        {
                            if (uDetail.JobCardDetailId > 0)
                                await this.repositoryJobCardD.UpdateAsync(uDetail, uDetail.JobCardDetailId);
                            else
                            {
                                if (uDetail.JobCardDetailId < 1)
                                    uDetail.JobCardMasterId = record.JobCardMasterId;
                                await this.repositoryJobCardD.AddAsync(uDetail);
                            }
                        }
                    }
                    return new JsonResult(record, this.DefaultJsonSettings);
                }
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { Error = Message });
          
        }

        #region ATTACH
        // GET: api/version2/JobCardMaster/GetAttach/5
        [HttpGet("GetAttach")]
        public async Task<IActionResult> GetAttach(int key)
        {
            var HasData = await this.repositoryHasAttach.GetToListAsync(x => x.AttachFile,x => x.JobCardMasterId == key,null,x => x.Include(z => z.AttachFile));
            if (HasData != null)
            {
                return new JsonResult(HasData, this.DefaultJsonSettings);
            }
            return NoContent();
        }
        // POST: api/version2/JobCardMaster/PostAttach/5/Someone
        [HttpPost("PostAttach")]
        public async Task<IActionResult> PostAttac(int key, string CreateBy, IEnumerable<IFormFile> input2)
        {
            string Message = "";
            try
            {
                long size = input2.Sum(f => f.Length);

                // full path to file in temp location
                var filePath1 = Path.GetTempFileName();

                foreach (var formFile in input2)
                {
                    string FileName = Path.GetFileName(formFile.FileName).ToLower();
                    // create file name for file
                    string FileNameForRef = $"{DateTime.Now.ToString("ddMMyyhhmmssfff")}{ Path.GetExtension(FileName).ToLower()}";
                    // full path to file in temp location
                    var filePath = Path.Combine(this.hosting.WebRootPath + "/files", FileNameForRef);

                    if (formFile.Length > 0)
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                            await formFile.CopyToAsync(stream);
                    }

                    var returnData = await this.repositoryAttach.AddAsync(new AttachFile()
                    {
                        FileAddress = $"/machinemk2/files/{FileNameForRef}",
                        FileName = FileName,
                        CreateDate = DateTime.Now,
                        Creator = CreateBy ?? "Someone"
                    });

                    await this.repositoryHasAttach.AddAsync(new JobCardMasterHasAttach()
                    {
                        AttachFileId = returnData.AttachFileId,
                        CreateDate = DateTime.Now,
                        Creator = CreateBy ?? "Someone",
                        JobCardMasterId = key
                    });
                }

                return Ok(new { count = 1, size, filePath1 });

            }
            catch (Exception ex)
            {
                Message = ex.ToString();
            }

            return NotFound(new { Error = "Not found " + Message });
        }

        // POST: api/version2/JobCardMaster/PostAttach/5/Someone
        [HttpPost("PostAttach2"), DisableRequestSizeLimit]
        public async Task<IActionResult> PostAttact2(int key, string CreateBy)
        {
            string Message = "";
            try
            {
                var files = Request.Form.Files;
                long size = files.Sum(f => f.Length);

                // full path to file in temp location
                var filePath1 = Path.GetTempFileName();

                foreach (var formFile in files)
                {
                    string FileName = Path.GetFileName(formFile.FileName).ToLower();
                    // create file name for file
                    string FileNameForRef = $"{DateTime.Now.ToString("ddMMyyhhmmssfff")}{ Path.GetExtension(FileName).ToLower()}";
                    // full path to file in temp location
                    var filePath = Path.Combine(this.hosting.WebRootPath + "/files", FileNameForRef);

                    if (formFile.Length > 0)
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                            await formFile.CopyToAsync(stream);
                    }

                    var returnData = await this.repositoryAttach.AddAsync(new AttachFile()
                    {
                        FileAddress = $"/machinemk2/files/{FileNameForRef}",
                        FileName = FileName,
                        CreateDate = DateTime.Now,
                        Creator = CreateBy ?? "Someone"
                    });

                    await this.repositoryHasAttach.AddAsync(new JobCardMasterHasAttach()
                    {
                        AttachFileId = returnData.AttachFileId,
                        CreateDate = DateTime.Now,
                        Creator = CreateBy ?? "Someone",
                        JobCardMasterId = key
                    });
                }

                return Ok(new { count = 1, size, filePath1 });

            }
            catch (Exception ex)
            {
                Message = ex.ToString();
            }

            return NotFound(new { Error = "Not found " + Message });
        }
        // DELETE: api/TrainingCousre/DeleteAttach/5
        [HttpDelete("DeleteAttach")]
        public async Task<IActionResult> DeleteAttach(int AttachFileId)
        {
            if (AttachFileId > 0)
            {
                var AttachFile = await this.repositoryAttach.GetAsync(AttachFileId);
                if (AttachFile != null)
                {
                    var filePath = Path.Combine(this.hosting.WebRootPath + AttachFile.FileAddress);
                    FileInfo delFile = new FileInfo(filePath);

                    if (delFile.Exists)
                        delFile.Delete();
                    // Condition
                    Expression<Func<JobCardMasterHasAttach, bool>> condition = c => c.AttachFileId == AttachFile.AttachFileId;
                    var JobMasterHasAttach = this.repositoryHasAttach.FindAsync(condition).Result;
                    if (JobMasterHasAttach != null)
                        this.repositoryHasAttach.Delete(JobMasterHasAttach.JobMasterHasAttachId);
                    // remove attach
                    return new JsonResult(await this.repositoryAttach.DeleteAsync(AttachFile.AttachFileId), this.DefaultJsonSettings);
                }
            }
            return NotFound(new { Error = "Not found attach file." });
        }
        #endregion

        #region NoUse
        public async Task<IActionResult> GetScroll2([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                .Include(x => x.EmployeeRequire)
                                .Include(x => x.EmployeeGroup)
                                .Include(x => x.EmployeeWrite)
                                .Include(x => x.TypeMachine)
                                .Include(x => x.ProjectCodeDetail.ProjectCodeMaster)
                                .AsQueryable();
            // Where
            if (!string.IsNullOrEmpty(Scroll.Where))
                QueryData = QueryData.Where(x => x.Creator == Scroll.Where);
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.Description.ToLower().Contains(keyword) ||
                                                      x.JobCardMasterNo.ToLower().Contains(keyword) ||
                                                      x.EmployeeGroup.Description.ToLower().Contains(keyword) ||
                                                      x.EmpRequire.ToLower().Contains(keyword) ||
                                                      x.EmployeeWrite.NameThai.ToLower().Contains(keyword) ||
                                                      x.EmpWrite.ToLower().Contains(keyword) ||
                                                      x.Remark.ToLower().Contains(keyword) ||
                                                      x.ProjectCodeDetail.ProjectCodeDetailCode.ToLower().Contains(keyword) ||
                                                      x.ProjectCodeDetail.ProjectCodeMaster.ProjectCode.ToLower().Contains(keyword));
            }
            // Order
            switch (Scroll.SortField)
            {
                case "JobCardMasterNo":
                    QueryData = Scroll.SortOrder == 1 ?
                       QueryData.OrderByDescending(e => e.JobCardMasterNo) :
                       QueryData.OrderBy(e => e.JobCardMasterNo);
                    break;
                case "ProjectDetailString":
                    QueryData = Scroll.SortOrder == 1 ?
                       QueryData.OrderByDescending(e => e.ProjectCodeDetail.ProjectCodeDetailCode) :
                       QueryData.OrderBy(e => e.ProjectCodeDetail.ProjectCodeDetailCode);
                    break;
                case "EmployeeRequireString":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.EmployeeGroup.Description) :
                        QueryData.OrderBy(e => e.EmployeeGroup.Description);
                    break;
                case "StatusString":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.JobCardMasterStatus) :
                        QueryData.OrderBy(e => e.JobCardMasterStatus);
                    break;
                case "JobCardDate":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.JobCardDate) :
                        QueryData.OrderBy(e => e.JobCardDate);
                    break;
                default:
                    QueryData = QueryData.OrderByDescending(e => e.JobCardDate);
                    break;
            }
            // Get TotalRow
            Scroll.TotalRow = await QueryData.CountAsync();
            // Skip and Take
            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 10);
            var MapDatas = new List<JobCardMasterViewModel>();
            // Foreach
            foreach (var item in await QueryData.ToListAsync())
                MapDatas.Add(this.mapper.Map<JobCardMaster, JobCardMasterViewModel>(item));

            return new JsonResult(new ScrollDataViewModel<JobCardMasterViewModel>
                (Scroll, MapDatas), this.DefaultJsonSettings);
        }

        #endregion
       
    }
}
