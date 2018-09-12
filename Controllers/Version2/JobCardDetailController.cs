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
    public class JobCardDetailController : GenericMachineController<JobCardDetail>
    {
        private readonly IRepositoryMachine<JobCardMaster> repositoryJobMaster;
        private readonly IRepositoryMachine<ProjectCodeDetail> repositoryProjectD;
        private readonly IRepositoryMachine<TypeMachine> repositoryTypeMachine;
        private readonly IRepositoryMachine<JobCardMasterHasAttach> repositoryHasAttach;
        public JobCardDetailController(IRepositoryMachine<JobCardDetail> repo,
            IRepositoryMachine<ProjectCodeDetail> repoProjectD,
            IRepositoryMachine<TypeMachine> repoTypeMachine,
            IRepositoryMachine<JobCardMasterHasAttach> repoHasAttach,
            IRepositoryMachine<JobCardMaster> repoJobMaster, IMapper mapper) : base(repo, mapper)
        {
            //Repository
            this.repositoryJobMaster = repoJobMaster;
            this.repositoryProjectD = repoProjectD;
            this.repositoryTypeMachine = repoTypeMachine;
            this.repositoryHasAttach = repoHasAttach;
        }

        #region Private
        private async Task<string> GeneratedCode(int ProjectDetailId, int TypeMachineId)
        {
            if (ProjectDetailId > 0 && TypeMachineId > 0)
            {
                var projectD = await this.repositoryProjectD.FindAsync(x => x.ProjectCodeDetailId == ProjectDetailId, x => x.ProjectCodeMaster);
                var typeMachine = await this.repositoryTypeMachine.GetAsync(TypeMachineId);
                if (projectD != null && typeMachine != null)
                {
                    var Runing = await this.repositoryJobMaster.CountWithMatchAsync(x => x.ProjectCodeDetail.ProjectCodeMasterId == projectD.ProjectCodeMasterId &&
                                                                                x.TypeMachineId == TypeMachineId) + 1;
                    return $"{projectD.ProjectCodeMaster.ProjectCode}/{typeMachine.TypeMachineCode}/{Runing.ToString("0000")}";
                }
            }
            return "xxxx/xx/xx";
        }

        private async Task<JobCardDetail> UpdateJobCard(int JobCardDetailId, string Create, JobCardDetailStatus Status = JobCardDetailStatus.Task)
        {
            var jobCardDetail = await this.repository.GetFirstOrDefaultAsync
                                        (x => x, x => x.JobCardDetailId == JobCardDetailId);

            if (jobCardDetail != null)
            {
                jobCardDetail.JobCardDetailStatus = Status;
                jobCardDetail.ModifyDate = DateTime.Now;
                jobCardDetail.Modifyer = Create;
                if (await this.repository.UpdateAsync(jobCardDetail, jobCardDetail.JobCardDetailId) != null)
                {
                    // Check JobCardMaster Status
                    if (jobCardDetail.JobCardMasterId != null)
                    {
                        var jobCardMaster = await this.repositoryJobMaster.GetFirstOrDefaultAsync
                            (x => x, x => x.JobCardMasterId == jobCardDetail.JobCardMasterId, null, x => x.Include(z => z.JobCardDetails));

                        if (jobCardMaster != null)
                        {
                            jobCardMaster.JobCardMasterStatus = jobCardMaster.JobCardDetails.Any(z => z.JobCardDetailStatus == JobCardDetailStatus.Wait)
                                                                ? JobCardMasterStatus.InProcess : JobCardMasterStatus.Complete;
                            jobCardMaster.ModifyDate = DateTime.Now;
                            jobCardMaster.Modifyer = Create;
                            await this.repositoryJobMaster.UpdateAsync(jobCardMaster, jobCardMaster.JobCardMasterId);
                        }
                    }
                    return jobCardDetail;
                }
            }
            return null;
        }

        #endregion

        // GET: api/version2/JobCardDetail/GetKeyNumber/5
        [HttpGet("GetKeyNumber")]
        public override async Task<IActionResult> Get(int key)
        {
            var HasData = await this.repository.GetFirstOrDefaultAsync
                (x => x,x => x.JobCardDetailId == key,null,
                x => x.Include(z => z.JobCardMaster.ProjectCodeDetail.ProjectCodeMaster)
                .Include(z => z.CuttingPlan)
                .Include(z => z.StandardTime));

            if (HasData != null)
                return new JsonResult(this.mapper.Map<JobCardDetail,JobCardDetailViewModel>(HasData), this.DefaultJsonSettings);
            return BadRequest(new { error = "Data not been found." });
        }

        // GET: api/version2/JobCardDetail/GetByMaster/5
        [HttpGet("GetByMaster")]
        public async Task<IActionResult> GetByMaster(int key)
        {
            var HasData = await this.repository.GetToListAsync(
                x => x,e => e.JobCardMasterId == key,null,x => x.Include(z => z.CuttingPlan).Include(z => z.StandardTime));
            var MapDatas = new List<JobCardDetailViewModel>();
            if (HasData.Any())
            {
                foreach (var item in HasData)
                    MapDatas.Add(this.mapper.Map<JobCardDetail, JobCardDetailViewModel>(item));
                return new JsonResult(MapDatas, this.DefaultJsonSettings);
            }
            else
                return NoContent();
        }

        // GET: api/version2/JobCardDetail/GetJobMasterByJobDetail/5
        [HttpGet("GetJobMasterByJobDetail")]
        public async Task<IActionResult> GetJobMasterByJobDetail(int key)
        {
            var HasData = await this.repository.GetFirstOrDefaultAsync(
                x => x, e => e.JobCardDetailId == key, null, 
                x => x.Include(z => z.CuttingPlan)
                      .Include(z => z.StandardTime));
            
            if (HasData != null)
            {
                var MapData = this.mapper.Map<JobCardDetail, JobCardDetailViewModel>(HasData);
                var JobMaster = await this.repositoryJobMaster.GetFirstOrDefaultAsync(
                    x => x,
                    x => x.JobCardMasterId == MapData.JobCardMasterId, null,
                    x => x.Include(z => z.ProjectCodeDetail.ProjectCodeMaster).Include(z => z.TypeMachine));

                if (JobMaster != null)
                {
                    var JobMasterMap = this.mapper.Map<JobCardMaster, JobCardMasterViewModel>(JobMaster);
                    JobMasterMap.JobCardDetails.Add(MapData);
                    return new JsonResult(JobMasterMap, this.DefaultJsonSettings);
                }
            }
            
            return BadRequest(new { Error = "Key not been found." });
        }    

        // POST: api/version2/JobCardDetail/CancelJobCardDetail
        [HttpPost("CancelJobCardDetail")]
        public async Task<IActionResult> CancelJobCardDetail([FromBody] JobCardDetailViewModel jobCard)
        {
            var Message = "";
            try
            {
                if (jobCard != null)
                {
                    var hasJobCard = await this.repository.GetFirstOrDefaultAsync(x => x, x => x.JobCardDetailId == jobCard.JobCardDetailId);
                    if (hasJobCard != null)
                    {
                        hasJobCard.ModifyDate = DateTime.Now;
                        hasJobCard.Modifyer = jobCard.Modifyer;
                        hasJobCard.JobCardDetailStatus = JobCardDetailStatus.Cancel;

                        await this.repository.UpdateAsync(hasJobCard, hasJobCard.JobCardDetailId);

                        // Check JobCardMaster Status
                        if (hasJobCard.JobCardMasterId != null)
                        {
                            var jobCardMaster = await this.repositoryJobMaster.GetFirstOrDefaultAsync
                                (x => x, x => x.JobCardMasterId == hasJobCard.JobCardMasterId, null, x => x.Include(z => z.JobCardDetails));

                            if (jobCardMaster != null)
                            {
                                jobCardMaster.JobCardMasterStatus = jobCardMaster.JobCardDetails.Any(z => z.JobCardDetailStatus == JobCardDetailStatus.Wait)
                                                                    ? JobCardMasterStatus.InProcess : JobCardMasterStatus.Complete;
                                jobCardMaster.ModifyDate = DateTime.Now;
                                jobCardMaster.Modifyer = hasJobCard.Modifyer;
                                await this.repositoryJobMaster.UpdateAsync(jobCardMaster, jobCardMaster.JobCardMasterId);
                            }
                        }

                        return new JsonResult(new { Result = true }, this.DefaultJsonSettings);
                    }
                }
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return BadRequest(new { error = Message });
        }

        // POST: api/version2/JobCardDetail/Autocomplate
        [HttpPost("Autocomplate")]
        public async Task<IActionResult> GetAutocomplate([FromBody] AutoComplateViewModel autoComplate)
        {
            if (autoComplate.ByColumn.IndexOf("Material") != -1)
            {
                var HasAutoComplate = await this.repository.GetToListAsync(x => new ResultAutoComplateViewModel { AutoComplate = x.Material },
                    x => x.Material.ToLower().Contains(autoComplate.Filter.ToLower()),null,null,null,100);
                if (HasAutoComplate.Any())
                    return new JsonResult(HasAutoComplate.Distinct(), DefaultJsonSettings);
            }
            return NoContent();
        }

        // POST: api/version2/JobCardDetail/RequireJobCardDetalScheduleOnlyGmCm
        [HttpPost("RequireJobCardDetalScheduleOnlyGmCm")]
        public async Task<IActionResult> RequireJobCardDetalScheduleOnlyGmCm([FromBody] OptionScheduleViewModel Schedule)
        {
            var Message = "Data not been found.";

            try
            {
                if (Schedule != null)
                {
                    int TotalRow;
                    var predicate = PredicateBuilder.False<JobCardDetail>();
                    // Filter
                    var filters = string.IsNullOrEmpty(Schedule.Filter) ? new string[] { "" }
                                        : Schedule.Filter.ToLower().Split(null);
                    foreach (var keyword in filters)
                    {
                        string temp = keyword;
                        predicate = predicate.Or(x => x.CuttingPlan.CuttingPlanNo.ToLower().Contains(temp) ||
                                                             x.Material.ToLower().Contains(temp) ||
                                                             x.Remark.ToLower().Contains(temp) ||
                                                             x.JobCardMaster.ProjectCodeDetail.ProjectCodeMaster.ProjectCode.ToLower().Contains(temp) ||
                                                             x.JobCardMaster.ProjectCodeDetail.ProjectCodeDetailCode.ToLower().Contains(temp) ||
                                                             x.JobCardMaster.JobCardMasterNo.ToLower().Contains(temp));
                    }

                    predicate = predicate.And(x => x.JobCardDetailStatus != null &&
                                                   x.JobCardDetailStatus == JobCardDetailStatus.Wait &&
                                                   x.JobCardMaster.JobCardMasterStatus != JobCardMasterStatus.Cancel);

                    // Option ProjectCodeMaster
                    if (Schedule.ProjectMasterId.HasValue)
                        predicate = predicate.And(x => x.JobCardMaster.ProjectCodeDetail.ProjectCodeMasterId == Schedule.ProjectMasterId);

                    if (Schedule.ProjectDetailId.HasValue)
                        predicate = predicate.And(x => x.JobCardMaster.ProjectCodeDetailId == Schedule.ProjectDetailId);

                    // Option Status
                    if (Schedule.TypeMachineId.HasValue)
                        predicate = predicate.And(x => x.JobCardMaster.TypeMachineId == Schedule.TypeMachineId);
                    else
                        predicate = predicate.And(x => x.JobCardMaster.TypeMachine.TypeMachineCode.Contains("GM") || 
                                                       x.JobCardMaster.TypeMachine.TypeMachineCode.Contains("CM"));

                    TotalRow = await this.repository.GetLengthWithAsync(predicate);

                    var HasData = await this.repository.GetToListAsync(
                        selector: x => x,
                        predicate: predicate,
                        include: x => x.Include(z => z.CuttingPlan)
                                       .Include(z => z.JobCardMaster.TypeMachine)
                                       .Include(z => z.JobCardMaster.ProjectCodeDetail.ProjectCodeMaster),
                        skip: Schedule.Skip ?? 0,
                        take: Schedule.Take ?? 10,
                        orderBy: x => x.OrderByDescending(z => z.JobCardMaster.JobCardDate));

                    if (HasData.Any())
                    {
                        List<string> Columns = new List<string>();
                        // PlanDate
                        List<DateTime?> ListDate = new List<DateTime?>()
                        {
                            //START Date
                            HasData.Min(x => x.CreateDate),
                            HasData.Min(x => x?.JobCardMaster?.JobCardDate) ?? null,
                            HasData.Min(x => x?.JobCardMaster?.DueDate) ?? null,
                            //END Date
                            HasData.Max(x => x.CreateDate),
                            HasData.Max(x => x?.JobCardMaster?.JobCardDate) ?? null,
                            HasData.Max(x => x?.JobCardMaster?.DueDate) ?? null,
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

                        var DataTable = new List<IDictionary<String, Object>>();
                        foreach(var GroupMachine in HasData.GroupBy(z => z.JobCardMaster.TypeMachine))
                        {
                            foreach (var Data in GroupMachine.OrderBy(x => x.CreateDate))
                            {
                                var JobNumber = $"{Data?.JobCardMaster?.ProjectCodeDetail?.ProjectCodeMaster?.ProjectCode ?? "No-Data"}" +
                                                $"/{(Data?.JobCardMaster?.ProjectCodeDetail == null ? "No-Data" : Data.JobCardMaster.ProjectCodeDetail.ProjectCodeDetailCode)}";

                                IDictionary<String, Object> rowData;
                                var WorkGroup = Data?.JobCardMaster?.TypeMachine?.TypeMachineCode ?? "";
                                bool update = false;
                                if (DataTable.Any(x => (string)x["JobNumber"] == JobNumber && (string)x["GroupMachine"] == WorkGroup))
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
                                    var Master = new JobCardDetailViewModel()
                                    {
                                        JobCardMasterId = Data.JobCardMasterId,
                                        JobCardDetailId = Data.JobCardDetailId,
                                        Quality = Data.Quality,
                                        // RequireString = $"{EmployeeReq} | No.{Data.RequireNo}",
                                        CuttingPlanString = $"{(Data.CuttingPlan != null ? Data.CuttingPlan.CuttingPlanNo : "-")}",
                                    };

                                    if (rowData.Any(x => x.Key == Key))
                                    {
                                        // New Value
                                        var ListMaster = (List<JobCardDetailViewModel>)rowData[Key];
                                        ListMaster.Add(Master);
                                        // add to row data
                                        rowData[Key] = ListMaster;
                                    }
                                    else // add new
                                        rowData.Add(Key, new List<JobCardDetailViewModel>() { Master });
                                }

                                if (!update)
                                {
                                    rowData.Add("JobNumber", JobNumber);
                                    rowData.Add("GroupMachine", Data.JobCardMaster.TypeMachine.TypeMachineCode);
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
                    {
                        return NoContent();
                    }
                }
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { error = Message });
        }

        // POST: api/version2/JobCardDetail/ChangeJobCardDetailGroup/
        [HttpPost("ChangeJobCardDetailGroup")]
        public async Task<IActionResult> ChangeJobCardDetailGroup([FromBody] ChangeJobCardDetailViewModel Option)
        {
            if (Option == null)
                return BadRequest();

            var jobDetail = await this.repository.GetFirstOrDefaultAsync(
                x => x, 
                x => x.JobCardDetailId == Option.JobcardDetailId,
                null,
                x => x.Include(z => z.JobCardMaster.JobCardMasterHasAttachs));

            if (jobDetail != null)
            {
                var newJobMaster = new JobCardMaster()
                {
                    Creator = Option.ChangeBy,
                    CreateDate = DateTime.Now,
                    Description = jobDetail.JobCardMaster.Description,
                    DueDate = jobDetail.JobCardMaster.DueDate,
                    EmpRequire = jobDetail.JobCardMaster.EmpRequire,
                    EmpWrite = jobDetail.JobCardMaster.EmpWrite,
                    GroupCode = jobDetail.JobCardMaster.GroupCode, 
                    JobCardDate = jobDetail.JobCardMaster.JobCardDate,
                    JobCardMasterStatus = JobCardMasterStatus.Wait,
                    MailReply = jobDetail.JobCardMaster.MailReply,
                    JobCardMasterNo = await this.GeneratedCode(jobDetail.JobCardMaster.ProjectCodeDetailId.Value,Option.TypeMachineId.Value),
                    ProjectCodeDetailId = jobDetail.JobCardMaster.ProjectCodeDetailId,
                    Remark = jobDetail.JobCardMaster.Remark,
                    TypeMachineId = Option.TypeMachineId,
                };

                var insertComplate = await this.repositoryJobMaster.AddAsync(newJobMaster);
                if (insertComplate != null)
                {
                    var newJobDetail = new JobCardDetail()
                    {
                        CreateDate = insertComplate.CreateDate,
                        Creator = insertComplate.Creator,
                        CuttingPlanId = jobDetail.CuttingPlanId,
                        JobCardDetailStatus = JobCardDetailStatus.Wait,
                        JobCardMasterId = insertComplate.JobCardMasterId,
                        Material = jobDetail.Material,
                        Quality = jobDetail.Quality,
                        Remark = jobDetail.Remark,
                        StandardTimeId = jobDetail.StandardTimeId,
                        UnitMeasureId = jobDetail.UnitMeasureId,
                        UnitNo = jobDetail.UnitNo,
                    };

                    await this.repository.AddAsync(newJobDetail);

                    if (jobDetail.JobCardMaster.JobCardMasterHasAttachs.Any())
                    {
                        foreach (var item in jobDetail.JobCardMaster.JobCardMasterHasAttachs)
                        {
                            var attach = new JobCardMasterHasAttach()
                            {
                                AttachFileId = item.AttachFileId,
                                CreateDate = insertComplate.CreateDate,
                                Creator = insertComplate.Creator,
                                JobCardMasterId = insertComplate.JobCardMasterId,
                            };

                            await this.repositoryHasAttach.AddAsync(attach);
                        }
                    }

                    await this.UpdateJobCard(jobDetail.JobCardDetailId, Option.ChangeBy, JobCardDetailStatus.Change);

                    return new JsonResult(insertComplate, this.DefaultJsonSettings);
                }
            }

            return BadRequest(new { Error = "Has error." });
        }

        [HttpPost("SplitJobCardDetail")]
        public async Task<IActionResult> SplitJobCardDetail([FromBody] JobCardDetailViewModel jobCard)
        {
            var Message = "Data not been found.";
            try
            {
                if (jobCard != null)
                {
                    if (jobCard.SplitQuality != null && jobCard.SplitQuality > 0)
                    {
                        var splitJobDetail = new JobCardDetail()
                        {
                            CreateDate = DateTime.Now,
                            Creator = jobCard.Creator,
                            CuttingPlanId = jobCard.CuttingPlanId,
                            JobCardDetailStatus = JobCardDetailStatus.Wait,
                            JobCardMasterId = jobCard.JobCardMasterId,
                            Material = jobCard.Material,
                            Quality = jobCard.SplitQuality,
                            Remark = jobCard.Remark,
                            SplitFormJobCardId = jobCard.JobCardDetailId,
                            StandardTimeId = jobCard.StandardTimeId,
                            UnitMeasureId = jobCard.UnitMeasureId,
                            UnitNo = jobCard.UnitNo,
                        };

                        var hasData = await this.repository.AddAsync(splitJobDetail);
                        if (hasData != null)
                        {
                            var updateJobCard = await this.repository.GetFirstOrDefaultAsync(x => x, x => x.JobCardDetailId == jobCard.JobCardDetailId);
                            if (updateJobCard != null)
                            {
                                updateJobCard.ModifyDate = DateTime.Now;
                                updateJobCard.Modifyer = jobCard.Creator;
                                updateJobCard.Quality = updateJobCard.Quality - jobCard.SplitQuality;

                                await this.repository.UpdateAsync(updateJobCard, updateJobCard.JobCardDetailId);
                            }

                            return new JsonResult(hasData, this.DefaultJsonSettings);
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { Error = Message });
        }
    }
}
