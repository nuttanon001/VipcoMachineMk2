using System;
using System.IO;
using System.Linq;
using System.Dynamic;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

using VipcoMachine.Models;
using VipcoMachine.Helper;
using VipcoMachine.Helpers;
using VipcoMachine.Services;
using VipcoMachine.ViewModels;

using AutoMapper;
using ReportClasses;

namespace VipcoMachine.Controllers.Version2
{
    [Route("api/version2/[controller]")]
    [ApiController]
    public class TaskMachineController : GenericMachineController<TaskMachine>
    {
        // IRepository
        private readonly IRepositoryMachine<Machine> repositoryMachine;
        private readonly IRepositoryMachine<MachineHasOperator> repositoryOperator;
        private readonly IRepositoryMachine<ProgressTaskMachine> repositoryProgress;
        private readonly IRepositoryMachine<JobCardMaster> repositoryJobMaster;
        private readonly IRepositoryMachine<JobCardDetail> repositoryJobDetail;
        private readonly IRepositoryMachine<Employee> repositoryEmp;
        private readonly IRepositoryMachine<User> repositoryUser;
        private readonly IHostingEnvironment hosting;
        //Includes
        private readonly Func<IQueryable<TaskMachine>, IIncludableQueryable<TaskMachine, object>> includes;
        //Email
        private readonly EmailClass EmailClass;// Private 
        public TaskMachineController(IRepositoryMachine<TaskMachine> repo,
            IRepositoryMachine<JobCardDetail> repoJobDetail,
            IRepositoryMachine<JobCardMaster> repoJobMaster,
            IRepositoryMachine<Machine> repoMachine,
            IRepositoryMachine<ProgressTaskMachine> repoProgress,
            IRepositoryMachine<Employee> repoEmp,
            IRepositoryMachine<MachineHasOperator> repoOperator,
            IRepositoryMachine<User> repoUser,
            IHostingEnvironment hosting,
            IMapper mapper) : base(repo, mapper)
        {
            //IRepository
            this.repositoryJobMaster = repoJobMaster;
            this.repositoryJobDetail = repoJobDetail;
            this.repositoryMachine = repoMachine;
            this.repositoryProgress = repoProgress;
            this.repositoryEmp = repoEmp;
            this.repositoryOperator = repoOperator;
            this.repositoryUser = repoUser;
            // include
            this.includes = e => e.Include(x => x.Employee)
                                .Include(x => x.Machine)
                                .Include(x => x.JobCardDetail.CuttingPlan)
                                .Include(x => x.StandardTime)
                                .Include(x => x.ProgressTaskMachines);
            //Helper
            this.EmailClass = new EmailClass();
            // Hosing
            this.hosting = hosting;
        }

        #region Private_Method
        private async Task<string> GeneratedTaskMachineCode(int JobDetailId, int MachineId)
        {
            if (MachineId > 0 && MachineId > 0)
            {
                var jobDetail = await this.repositoryJobDetail.GetFirstOrDefaultAsync(
                    x => x,
                    x => x.JobCardDetailId == JobDetailId,
                    null,x => x.Include(z => z.JobCardMaster));

                var machine = await this.repositoryMachine.GetFirstOrDefaultAsync(x => x,x => x.MachineId == MachineId);

                if (jobDetail != null && machine != null)
                {
                    var date = DateTime.Today;
                    var Runing = await this.repository.GetLengthWithAsync(x => x.CreateDate.Value.Year == date.Year) + 1;

                    return $"{jobDetail.JobCardMaster.JobCardMasterNo}_{machine.MachineCode}/{date.ToString("dd/MM/yy")}/{Runing.ToString("0000")}";
                }
            }

            return "xxxx/xx/xx_xx-xx/xx/xx/xx/xxxx";
        }
        private async Task<bool> SendMailAsync(JobCardMaster jobMaster,TaskMachine taskMachine)
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
                                            $"<p>เรื่อง การเปิดใบงานเลขที่ {jobMaster.JobCardMasterNo} ได้รับการวางแผน</p>" +
                                            $"<p>ณ.ขณะนี้ ทางหน่วยงานแมชชีนได้ทำการวางแผนการทำงานในใบงานของแผนกแมชชีนเลขที่ {taskMachine.TaskMachineName}</p>" +
                                            $"<p>\"คุณ{EmpName}\" " +
                                            $"สามารถเข้าไปตรวจติดตามข้อมูลได้ <a href='http://{Request.Host}/machinemk2/task-machine/link-mail/{taskMachine.TaskMachineId}'>ที่นี้</a> </p>" +
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
        private async Task<JobCardDetail> UpdateJobCard(int JobCardDetailId, string Create, JobCardDetailStatus Status = JobCardDetailStatus.Task)
        {
            var jobCardDetail = await this.repositoryJobDetail.GetFirstOrDefaultAsync
                                        (x => x, x => x.JobCardDetailId == JobCardDetailId);

            if (jobCardDetail != null)
            {
                jobCardDetail.JobCardDetailStatus = Status;
                jobCardDetail.ModifyDate = DateTime.Now;
                jobCardDetail.Modifyer = Create;
                if (await this.repositoryJobDetail.UpdateAsync(jobCardDetail, jobCardDetail.JobCardDetailId) != null)
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
        public int SunDayInMonth(DateTime thisMonth)
        {
            int sunday = 0;
            int month = thisMonth.Month;
            int year = thisMonth.Year;
            int daysThisMonth = DateTime.DaysInMonth(year, month);
            DateTime beginingOfThisMonth = new DateTime(year, month, 1);
            for (int i = 0; i < daysThisMonth; i++)
                if (beginingOfThisMonth.AddDays(i).DayOfWeek == DayOfWeek.Sunday)
                    sunday++;
            return sunday;
        }
        private async Task<double> CalculatorManHour(TaskMachine taskMachine)
        {
            if (taskMachine != null)
            {
                if (taskMachine.ActualStartDate.HasValue && taskMachine.ActualEndDate.HasValue
                    && taskMachine.MachineId.HasValue)
                {
                    var Operator = new List<MachineHasOperator>();
                    var ErrorMessage = "";
                    try
                    {
                        Operator = (await this.repositoryOperator.
                            GetToListAsync(x => x, x => x.MachineId == taskMachine.MachineId)).ToList();
                    }
                    catch (Exception ex)
                    {
                        ErrorMessage = $"Has error {ex.ToString()}";
                    }

                    var ManDay = 1;
                    if (Operator.Any())
                        ManDay = Operator.Count();

                    double ManHour = 0;
                    int TotalDay = (taskMachine.ActualEndDate.Value.Date - taskMachine.ActualStartDate.Value.Date).Days;
                    TotalDay = TotalDay == 0 ? 1 : TotalDay;
                    // Day x Hour x Operator
                    ManHour = (TotalDay * (8 + (taskMachine?.HasOverTime ?? 0))) * ManDay;
                    return ManHour;
                }
            }

            return 0;
        }
        private double CalculatorManHourSchedule(DateTime SDate,DateTime EDate,int Overtime = 0,int Operator = 1)
        {
            var ManDay = Operator;
            double ManHour = 0;
            int TotalDay = (EDate.Date - SDate.Date).Days;
            TotalDay = TotalDay == 0 ? 1 : TotalDay;
            // Day x Hour x Operator
            ManHour = (TotalDay * (8 + Overtime)) * ManDay;
            return ManHour;
        }
        #endregion

        // GET: api/version2/TaskMachine/GetKeyNumber/5
        [HttpGet("GetKeyNumber")]
        public override async Task<IActionResult> Get(int key)
        {
            var HasData = await this.repository.GetFirstOrDefaultAsync(
                selector: x => x,
                predicate: x => x.TaskMachineId == key,
                include: this.includes);

            if (HasData != null)
            {
                var mapData = this.mapper.Map<TaskMachine, TaskMachineViewModel>(HasData);
                return new JsonResult(mapData, this.DefaultJsonSettings);
            }

            return BadRequest(new { error = "Data not been found." });
        }

        // POST: api/version2/TaskMachine/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            if (Scroll == null)
                return BadRequest();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.Split(null);

            var predicate = PredicateBuilder.False<TaskMachine>();

            foreach (string keyword in filters)
            {
                string temp = keyword;
                predicate = predicate.Or(x => x.Description.ToLower().Contains(keyword) ||
                                            x.TaskMachineName.ToLower().Contains(keyword) ||
                                            x.JobCardDetail.CuttingPlan.CuttingPlanNo.ToLower().Contains(keyword) ||
                                            x.StandardTime.StandardTimeCode.ToLower().Contains(keyword) ||
                                            x.Employee.NameThai.ToLower().Contains(keyword) ||
                                            x.Machine.MachineCode.ToLower().Contains(keyword));
            }
            if (!string.IsNullOrEmpty(Scroll.Where))
                predicate = predicate.And(p => p.Creator == Scroll.Where);
            //Order by
            Func<IQueryable<TaskMachine>, IOrderedQueryable<TaskMachine>> order;
            // Order
            switch (Scroll.SortField)
            {
                case "TaskMachineName":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.TaskMachineName);
                    else
                        order = o => o.OrderBy(x => x.TaskMachineName);
                    break;
                case "CuttingPlanNo":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.JobCardDetail.CuttingPlan.CuttingPlanNo);
                    else
                        order = o => o.OrderBy(x => x.JobCardDetail.CuttingPlan.CuttingPlanNo);
                    break;
                case "StandardTimeString":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.StandardTime.StandardTimeCode);
                    else
                        order = o => o.OrderBy(x => x.StandardTime.StandardTimeCode);
                    break;
                case "MachineString":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Machine.MachineCode).ThenByDescending(x => x.Machine.MachineName);
                    else
                        order = o => o.OrderBy(x => x.Machine.MachineCode).ThenBy(x => x.Machine.MachineName);
                    break;
                case "AssignedByString":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Employee.NameThai);
                    else
                        order = o => o.OrderBy(x => x.Employee.NameThai);
                    break;
                default:
                    order = o => o.OrderByDescending(x => x.CreateDate);
                    break;
            }

            var QueryData = await this.repository.GetToListAsync(
                                    selector: selected => selected,  // Selected
                                    predicate: predicate, // Where
                                    orderBy: order, // Order
                                    include: x => x.Include(z => z.Employee)
                                    .Include(z => z.JobCardDetail.CuttingPlan)
                                    .Include(z => z.StandardTime)
                                    .Include(z => z.Machine), // Include
                                    skip: Scroll.Skip ?? 0, // Skip
                                    take: Scroll.Take ?? 10); // Take

            // Get TotalRow
            Scroll.TotalRow = await this.repository.GetLengthWithAsync(predicate: predicate);

            var mapDatas = new List<TaskMachineViewModel>();
            foreach (var item in QueryData)
            {
                var MapItem = this.mapper.Map<TaskMachine, TaskMachineViewModel>(item);
                mapDatas.Add(MapItem);
            }

            return new JsonResult(new ScrollDataViewModel<TaskMachineViewModel>(Scroll, mapDatas), this.DefaultJsonSettings);
        }

        // POST: api/version2/TaskMachine/
        [HttpPost]
        public override async Task<IActionResult> Create([FromBody] TaskMachine record)
        {
            // Set date for CrateDate Entity
            if (record == null)
                return BadRequest();
            // +7 Hour
            record = this.helper.AddHourMethod(record);
            // Generated TaskMachine code
            record.TaskMachineName = await this.GeneratedTaskMachineCode(record.JobCardDetailId, record.MachineId ?? 0);

            if (record.GetType().GetProperty("CreateDate") != null)
                record.GetType().GetProperty("CreateDate").SetValue(record, DateTime.Now);

            var helperPro = new Helpers.HelpersClass<ProgressTaskMachine>();
            // Has ProgressTaskMachines
            if (record.ProgressTaskMachines != null)
            {
                foreach (var item in record.ProgressTaskMachines)
                {
                    var deepCopy = helperPro.AddHourMethod(item);
                    //Update date
                    item.ProgressDate = deepCopy.ProgressDate;
                    //Set Create
                    item.CreateDate = record.CreateDate;
                    item.Creator = record.Creator;
                }

                record.ActualStartDate = record.ProgressTaskMachines.Min(x => x.ProgressDate);
                record.CurrentQuantity = record.ProgressTaskMachines.Sum(x => x.Quantity);
                if (record.CurrentQuantity >= record.TotalQuantity)
                {
                    record.TaskMachineStatus = TaskMachineStatus.Complate;
                    record.ActualEndDate = record.ProgressTaskMachines.Max(x => x.ProgressDate);
                }
                else
                    record.TaskMachineStatus = TaskMachineStatus.Process;
            }

            if (await this.repository.AddAsync(record) == null)
                return BadRequest();
            // Update JobCardMaster
            if (record.JobCardDetailId > 0)
            {
                await this.UpdateJobCard(record.JobCardDetailId, record.Creator);
                var jobMaster = await this.repositoryJobDetail.GetFirstOrDefaultAsync
                  (x => x.JobCardMaster,
                   x => x.JobCardDetailId == record.JobCardDetailId, null, x => x.Include(z => z.JobCardMaster));
                if (jobMaster != null)
                {
                    await this.SendMailAsync(jobMaster, record);
                }
            }

            // Send Mail
            if (record.TaskMachineStatus == TaskMachineStatus.Complate)
            {
                record.ActualManHours = await this.CalculatorManHour(record);
                await this.repository.UpdateAsync(record, record.TaskMachineId);
            }

            return new JsonResult(record, this.DefaultJsonSettings);
        }

        // Put: api/version2/TaskMachine/
        [HttpPut]
        public override async Task<IActionResult> Update(int key, [FromBody] TaskMachine record)
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

            if (record.ProgressTaskMachines.Any())
            {
                record.ActualStartDate = record.ProgressTaskMachines.Min(x => x.ProgressDate);
                record.CurrentQuantity = record.ProgressTaskMachines.Sum(x => x.Quantity);
                if (record.CurrentQuantity >= record.TotalQuantity)
                {
                    record.TaskMachineStatus = TaskMachineStatus.Complate;
                    record.ActualEndDate = record.ProgressTaskMachines.Max(x => x.ProgressDate);
                }
                else
                    record.TaskMachineStatus = TaskMachineStatus.Process;
            }

            if (await this.repository.UpdateAsync(record, key) == null)
            return BadRequest();

            if (record != null)
            {
                var dbProgresses = await this.repositoryProgress.GetToListAsync(x => x, x => x.TaskMachineId == key);
                //Remove Progress if edit remove it
                foreach (var dbProgress in dbProgresses)
                {
                    if (!record.ProgressTaskMachines.Any(x => x.ProgressId == dbProgress.ProgressId))
                    {
                        record.CurrentQuantity = record.CurrentQuantity - dbProgress.Quantity;
                        await this.repositoryProgress.DeleteAsync(dbProgress.ProgressId);
                        await this.repository.UpdateAsync(record, record.TaskMachineId);
                    }
                }
                //Update Progress or New Progress
                foreach (var uProgress in record.ProgressTaskMachines)
                {
                    if (uProgress.ProgressId > 0)
                    {
                        uProgress.Modifyer = record.Modifyer;
                        uProgress.ModifyDate = record.ModifyDate;
                        await this.repositoryProgress.UpdateAsync(uProgress, uProgress.ProgressId);
                    }
                    else
                    {
                        if (uProgress.TaskMachineId == null || uProgress.TaskMachineId < 1)
                            uProgress.TaskMachineId = record.TaskMachineId;

                        uProgress.CreateDate = record.ModifyDate;
                        uProgress.Creator = record.Modifyer;
                        await this.repositoryProgress.AddAsync(uProgress);
                    }
                }
            }

            // Update JobCardMaster
            if (record.JobCardDetailId > 0)
                await this.UpdateJobCard(record.JobCardDetailId, record.Creator);

            // Send Mail
            if (record.TaskMachineStatus == TaskMachineStatus.Complate)
            {
                record.ActualManHours = await this.CalculatorManHour(record);
                record = await this.repository.UpdateAsync(record, record.TaskMachineId);

                // var jobMaster = await this.repositoryJobDetail.GetFirstOrDefaultAsync
                //    (x => x.JobCardMaster,
                //     x => x.JobCardDetailId == record.JobCardDetailId, null, x => x.Include(z => z.JobCardMaster));
                // if (jobMaster != null)
                // {
                //   await this.SendMailAsync(jobMaster, record);
                // }
            }

            return new JsonResult(record, this.DefaultJsonSettings);
        }

        // POST: api/version2/TaskMachine/TaskMachineWaitAndProcess
        [HttpPost("TaskMachineSchedule")]
        public async Task<IActionResult> TaskMachineSchedule([FromBody] ScrollViewModel Schedule)
        {
            string Message = "Data not been found.";
            try
            {
                if (Schedule != null)
                {
                    int TotalRow;
                    Expression<Func<TaskMachine, bool>> predicate = x => x.TaskMachineStatus != TaskMachineStatus.Cancel;

                    var filters = string.IsNullOrEmpty(Schedule.Filter) ? new string[] { "" }
                                       : Schedule.Filter.ToLower().Split(null);
                    foreach (var temp in filters)
                    {
                        string keyword = temp;
                        predicate = predicate.And(x => x.JobCardDetail.CuttingPlan.CuttingPlanNo.ToLower().Trim().Contains(keyword) ||
                                                      x.JobCardDetail.CuttingPlan.MaterialSize.ToLower().Trim().Contains(keyword) ||
                                                      x.Machine.MachineName.ToLower().Trim().Contains(keyword) ||
                                                      x.TaskMachineName.ToLower().Trim().Contains(keyword) ||
                                                      x.JobCardDetail.JobCardMaster.JobCardMasterNo.ToLower().Trim().Contains(keyword));
                    }
                    // Option MachineId
                    if (Schedule.WhereId.HasValue)
                        predicate = predicate.And(x => x.MachineId == Schedule.WhereId);
                    // Option TypeMachineId
                    if (Schedule.WhereId2.HasValue)
                        predicate = predicate.And(x => x.Machine.TypeMachineId == Schedule.WhereId2);
                    // Option ProjectDetailId
                    if (Schedule.WhereId3.HasValue)
                        predicate = predicate.And(x => x.JobCardDetail.JobCardMaster.ProjectCodeDetail.ProjectCodeDetailId == Schedule.WhereId3);
                    // Option TaskMachineId
                    if (Schedule.WhereId4.HasValue)
                        predicate = predicate.And(x => x.TaskMachineId == Schedule.WhereId4);
                    // Option EmpWrith
                    if (!string.IsNullOrEmpty(Schedule.Where5))
                        predicate = predicate.And(x => x.JobCardDetail.JobCardMaster.EmpWrite == Schedule.Where5);

                    // Option Order type
                    Func<IQueryable<TaskMachine>, IOrderedQueryable<TaskMachine>> order;
                    if (Schedule.WhereId5.HasValue)
                        order = o => o.OrderByDescending(x => x.Machine.MachineCode)
                                        .ThenBy(x => x.PlannedStartDate)
                                            .ThenBy(x => x.PlannedEndDate);
                    else
                        order = o => o.OrderByDescending(z => z.PlannedStartDate)
                                      .ThenBy(z => z.PlannedEndDate);

                    // Option PickDate
                    if (Schedule.SDate.HasValue)
                    {
                        Schedule.SDate = Schedule.SDate.Value.AddHours(7);
                        predicate = predicate.And(x =>
                                       x.PlannedStartDate.Date >= Schedule.SDate.Value.Date ||
                                       x.PlannedEndDate.Date >= Schedule.SDate.Value.Date);
                    }

                    
                    if (Schedule.ScheduleStatus.HasValue)
                    {
                        if (Schedule.ScheduleStatus == ScheduleStatus.WaitAndProgress)
                            predicate = predicate.And(x => x.TaskMachineStatus == TaskMachineStatus.Wait || x.TaskMachineStatus == TaskMachineStatus.Process);
                        else if (Schedule.ScheduleStatus == ScheduleStatus.Complate)
                            predicate = predicate.And(x => x.TaskMachineStatus == TaskMachineStatus.Complate);
                    }

                    TotalRow = await this.repository.GetLengthWithAsync(predicate);

                    var HasData = await this.repository.GetToListAsync(
                        selector: x => x,
                        predicate: predicate,
                        include: x => x.Include(z => z.JobCardDetail.CuttingPlan)
                                       .Include(z => z.StandardTime)
                                       .Include(z => z.JobCardDetail.JobCardMaster.ProjectCodeDetail.ProjectCodeMaster)
                                       .Include(z => z.ProgressTaskMachines)
                                       .Include(z => z.Machine.MachineHasOperators),
                        skip: Schedule.Skip ?? 0,
                        take: Schedule.Take ?? 10,
                        orderBy: order); //.OrderBy(z => z.Machine.MachineCode)

                    if (HasData.Any())
                    {
                        List<string> Columns = new List<string>();
                        IDictionary<string, int> ColumnGroupTop = new Dictionary<string, int>();
                        IDictionary<DateTime, string> ColumnGroupBtm = new Dictionary<DateTime, string>();
                        // PlanDate
                        List<DateTime?> ListDate = new List<DateTime?>()
                        {
                            //START Date
                            //HasData.Min(x => x.CreateDate),
                            HasData.Min(x => x.TaskDueDate),
                            HasData.Min(x => x?.JobCardDetail?.JobCardMaster?.DueDate)  ?? null,
                            HasData.Min(x => x?.PlannedStartDate) ?? null,
                            HasData.Min(x => x?.PlannedEndDate) ?? null,
                            //END Date
                            //HasData.Max(x => x.CreateDate),
                            HasData.Max(x => x.TaskDueDate),
                            HasData.Max(x => x?.JobCardDetail?.JobCardMaster?.DueDate) ?? null,
                            HasData.Max(x => x?.PlannedStartDate) ?? null,
                            HasData.Max(x => x?.PlannedEndDate) ?? null,
                        };

                        DateTime? MinDate = ListDate.Min();
                        DateTime? MaxDate = ListDate.Max();

                        if (MinDate == null && MaxDate == null)
                            return NoContent();

                        if (MinDate.Value.Year > 2500)
                            MinDate = new DateTime(MinDate.Value.Year - 543, MinDate.Value.Month, MinDate.Value.Day);

                        if (MaxDate.Value.Year > 2500)
                            MaxDate = new DateTime(MaxDate.Value.Year - 543, MaxDate.Value.Month, MaxDate.Value.Day);

                        int countCol = 1;
                        // EachDay
                        var EachDate = new Helper.LoopEachDate();
                        foreach (DateTime day in EachDate.EachDate(MinDate.Value, MaxDate.Value).OrderByDescending(x => x.Value))
                        {
                            // Get Month
                            if (ColumnGroupTop.Any(x => x.Key == day.ToString("MMMM yy")))
                                ColumnGroupTop[day.ToString("MMMM yy")] += 1;
                            else
                                ColumnGroupTop.Add(day.ToString("MMMM yy"), 1);

                            ColumnGroupBtm.Add(day.Date, $"Col{countCol.ToString("00")}");
                            countCol++;
                        }

                        var DataTable = new List<IDictionary<string, Object>>();
                        foreach (var Machine in HasData.GroupBy(x => x.MachineId))
                        {
                            // OrderBy(x => x.Machine.TypeMachineId).ThenBy(x => x.Machine.MachineCode)
                            foreach (var Data in Machine.OrderByDescending(x => x.PlannedStartDate).ThenBy(x => x.PlannedEndDate))
                            {
                                IDictionary<String, Object> rowData = new ExpandoObject();
                                double Production = Data.TotalQuantity ?? 0;
                                double Quantity;

                                if (Data.ProgressTaskMachines.Any())
                                    Quantity = Data.ProgressTaskMachines.Sum(z => z.Quantity) ?? 0;
                                else
                                    Quantity = Data.CurrentQuantity ?? 0;

                                // var JobNo = $"{Data?.JobCardDetail?.JobCardMaster?.ProjectCodeDetail?.ProjectCodeMaster.ProjectCode ?? "-"}";
                                var JobNo = $"{Data?.JobCardDetail?.JobCardMaster?.ProjectCodeDetail?.ProjectCodeMaster.ProjectCode ?? "-"}/{Data?.JobCardDetail?.JobCardMaster?.ProjectCodeDetail?.ProjectCodeDetailCode ?? "-"}";

                                // Set Operator
                                var MachineOp = await this.repositoryOperator.GetToListAsync(x => x.Employee.NameThai, x => x.MachineId == Data.MachineId);
                                var NameOp = MachineOp.Any() ? string.Join("<br/>", MachineOp) : "";
                                // add column time
                                rowData.Add("MachineNo", (Data.Machine.MachineCode ?? "-") + (string.IsNullOrEmpty(NameOp) ? "" : $"<br/> {NameOp}"));
                                rowData.Add("JobNo", JobNo);
                                var Infor = Data?.JobCardDetail?.CuttingPlan?.CuttingPlanNo +
                                            (string.IsNullOrEmpty(Data?.JobCardDetail?.Material) || string.IsNullOrWhiteSpace(Data?.JobCardDetail?.Material) ? "" : $"<br/>{Data?.JobCardDetail?.Material.Trim()}") +
                                            (Data?.JobCardDetail?.UnitNo == null ? "" : $" | UnitNo.{Data?.JobCardDetail?.UnitNo}");

                                if (Data?.JobCardDetail?.JobCardMaster != null)
                                {
                                    if (!string.IsNullOrEmpty(Data?.JobCardDetail?.JobCardMaster.Description))
                                    {
                                        Infor += $"<br/> Desc. {Data?.JobCardDetail?.JobCardMaster.Description}";
                                    }
                                }

                                rowData.Add("Description", Infor);
                                // rowData.Add("StandardTime",Data.Weight > 0 && Data.StandardTime != null ? (Data.Weight / (Data?.StandardTime?.StandardTimeValue ?? 0)).Value.ToString("0.00") + " Hr." : "-");

                                if (Data.ActualManHours == null || Data.ActualManHours < 0)
                                {
                                    if (Data.ProgressTaskMachines.Any())
                                    {
                                        Data.ActualManHours = CalculatorManHourSchedule(
                                            Data.ProgressTaskMachines.Min(z => z.ProgressDate).Value,
                                            Data.ProgressTaskMachines.Max(z => z.ProgressDate).Value,
                                            Data.HasOverTime ?? 0,
                                            Data.Machine.MachineHasOperators.Count()
                                            );
                                    }
                                }

                                rowData.Add("StandardTime", (Data.PlanManHours != null && Data.PlanManHours > 0 ? Data.PlanManHours.Value.ToString("0.0") + " Hr." : "- Hr.") + " / " + (Data.ActualManHours != null && Data.ActualManHours > 0 ? Data.ActualManHours.Value.ToString("0.0") + " Hr." : "- Hr."));
                                rowData.Add("Weight", Data.Weight > 0 ? $"{(Data?.Weight ?? 0).ToString("0,0.0")} Kg." : "-");
                                rowData.Add("CurrentQuantity", string.Format("{0:#,##0}",Quantity));
                                rowData.Add("TotalQuantity", string.Format("{0:#,##0}",Data.TotalQuantity ?? 0));
                                rowData.Add("Progress", $"{(Quantity > 0 ? (Math.Round(((Quantity / Production) * 100), 1)) : 0)}%");
                                rowData.Add("TaskMachineId", Data?.TaskMachineId ?? 1);
                                rowData.Add("JobCardDetailId", Data?.JobCardDetailId ?? 1);

                                var DueDate = Data?.TaskDueDate ?? Data?.JobCardDetail?.JobCardMaster?.DueDate;
                                if (DueDate != null)
                                    rowData.Add("DueDate", ColumnGroupBtm.FirstOrDefault(x => x.Key == DueDate.Value.Date).Value);

                                if (Data.TaskMachineStatus != TaskMachineStatus.Complate)
                                    rowData.Add("DeadLine", DueDate.Value.Date <= DateTime.Today);
                                else
                                {
                                    if (Data.ActualEndDate != null)
                                        rowData.Add("DeadLine", DueDate.Value.Date < Data.ActualEndDate.Value.Date);
                                }

                                // Data is 1:Plan,2:Actual,3:PlanAndActual
                                // For Plan
                                if (Data.PlannedStartDate != null && Data.PlannedEndDate != null)
                                {
                                    foreach (DateTime day in EachDate.EachDate(Data.PlannedStartDate.Date, Data.PlannedEndDate.Date))
                                    {
                                        if (ColumnGroupBtm.Any(x => x.Key == day.Date))
                                            rowData.Add(ColumnGroupBtm.FirstOrDefault(x => x.Key == day.Date).Value, 1);
                                    }
                                }
                                //For Actual
                                if (Data.ActualStartDate != null)
                                {
                                    var EndDate = Data.ActualEndDate ?? (MaxDate > DateTime.Today ? DateTime.Today : MaxDate);
                                    foreach (DateTime day in EachDate.EachDate(Data.ActualStartDate.Value.Date, EndDate.Value.Date))
                                    {
                                        if (ColumnGroupBtm.Any(x => x.Key == day.Date))
                                        {
                                            var Col = ColumnGroupBtm.FirstOrDefault(x => x.Key == day.Date);
                                            // if Have Plan change value to 3
                                            if (rowData.Keys.Any(x => x == Col.Value))
                                                rowData[Col.Value] = 3;
                                            else // else Don't have plan value is 2
                                                rowData.Add(Col.Value, 2);
                                        }
                                    }
                                }
                                DataTable.Add(rowData);
                            }
                        }

                        if (DataTable.Any())
                            ColumnGroupBtm.OrderByDescending(x => x.Key.Date).Select(x => x.Value)
                                .ToList().ForEach(item => Columns.Add(item));

                        return new JsonResult(new
                        {
                            TotalRow,
                            ColumnUppers = ColumnGroupTop.Select(x => new
                            {
                                Name = x.Key,
                                x.Value
                            }),
                            ColumnLowers = ColumnGroupBtm.OrderByDescending(x => x.Key.Date).Select(x => x.Key.Day),
                            Columns,
                            DataTable
                        }, this.DefaultJsonSettings);
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NoContent();
            //return NotFound(new { Error = Message });
        }

        [HttpGet("GetReportTaskMachine/{TaskMachineId}")]
        public async Task<IActionResult> GetReportTaskMachine(int TaskMachineId)
        {
            var Message = "Not found TaskMachineId";
            try
            {
                if (TaskMachineId > 0)
                {
                    var paper = await this.repository.GetFirstOrDefaultAsync(x => x,x => x.TaskMachineId == TaskMachineId, null,
                        x => x.Include(z => z.JobCardDetail.CuttingPlan).Include(z => z.Employee));
                    if (paper != null)
                    {
                        var jobMaster = await this.repositoryJobMaster.GetFirstOrDefaultAsync(x => x ,x => x.JobCardMasterId == paper.JobCardDetail.JobCardMasterId , null, 
                                x => x.Include(z => z.ProjectCodeDetail.ProjectCodeMaster).Include(z => z.EmployeeRequire).Include(z => z.EmployeeWrite).Include(z => z.JobCardMasterHasAttachs));
                        if (jobMaster != null)
                        {
                            var JobNo = "-";
                            var Level23 = "-";
                            if (jobMaster?.ProjectCodeDetail != null)
                            {
                                if (jobMaster?.ProjectCodeDetail?.ProjectCodeMaster != null)
                                {
                                    JobNo = $"{jobMaster.ProjectCodeDetail.ProjectCodeMaster.ProjectCode}";
                                    Level23 = $"{jobMaster.ProjectCodeDetail.ProjectCodeDetailCode}";
                                }
                            }

                            var onePage = new OnePage()
                            {
                                TemplateFolder = this.hosting.WebRootPath + "/reports/"
                            };//general class for work

                            var PaperModel = new PaperTaskMachine()
                            {
                                Actual = paper.ActualStartDate == null ? "-" : (paper.ActualStartDate.Value.ToString("dd/MM/yy") + "  ถึง  " +
                                         (paper.ActualEndDate == null ? "-" : paper.ActualEndDate.Value.ToString("dd/MM/yy"))),
                                CreateBy = jobMaster?.EmployeeWrite.NameThai ?? "-",
                                DueDate = jobMaster.DueDate == null ? "-" : jobMaster.DueDate.Value.ToString("dd/MM/yy"),
                                DateRequired = jobMaster.JobCardDate == null ? "-" : jobMaster.JobCardDate.Value.ToString("dd/MM/yy"),
                                Employee1 = "-",
                                Employee2 = "-",
                                Employee3 = "-",
                                Employee4 = "-",
                                Level23 = Level23,
                                JobNo = JobNo,
                                Weight = string.Format("{0:#,##0} kg.", paper.Weight ?? 0),
                                Remark2 = jobMaster?.Description ?? "",
                                Mate1 = paper?.JobCardDetail?.Material ?? "-",
                                Plan = paper.PlannedStartDate.ToString("dd/MM/yy") + "  ถึง  " + paper.PlannedEndDate.ToString("dd/MM/yy"),
                                Recevied = paper.ReceiveBy ?? "-",
                                Remark = paper?.Description ?? "-",
                                ShopDrawing = paper?.JobCardDetail?.CuttingPlan?.CuttingPlanNo ?? "-",
                                TaskMachineNo = paper?.TaskMachineName ?? "",
                                TotalAttach = jobMaster?.JobCardMasterHasAttachs?.Count() > 0 ? jobMaster.JobCardMasterHasAttachs.Count().ToString("00") : "-",
                            };

                            var machine = await this.repositoryMachine.GetFirstOrDefaultAsync(x => x,x => x.MachineId == paper.MachineId, null, 
                                x => x.Include(z => z.TypeMachine).Include(z => z.MachineHasOperators).ThenInclude(z => z.Employee));
                            if (machine != null)
                            {
                                PaperModel.MachineNo = machine?.MachineCode ?? "-";
                                PaperModel.TypeMachine = machine?.TypeMachine?.TypeMachineCode ?? "-";

                                int row = 1;
                                foreach (var emp in machine.MachineHasOperators)
                                {
                                    switch (row)
                                    {
                                        case 1:
                                            PaperModel.Employee1 = emp.Employee.NameThai;
                                            break;

                                        case 2:
                                            PaperModel.Employee2 = emp.Employee.NameThai;
                                            break;

                                        case 3:
                                            PaperModel.Employee3 = emp.Employee.NameThai;
                                            break;

                                        case 4:
                                            PaperModel.Employee4 = emp.Employee.NameThai;
                                            break;

                                        default:
                                            break;
                                    }
                                    row++;
                                }
                            }

                            var stream = onePage.Export<PaperTaskMachine>(PaperModel, "PaperTaskMachine2");

                            stream.Seek(0, SeekOrigin.Begin);
                            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reports.xlsx");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

        #region Chart
        // POST: api/version2/TaskMachine/TaskMachineChartData
        [HttpPost("TaskMachineChartDataProduct")]
        public async Task<IActionResult> TaskMachineChartDataProduct([FromBody]OptionChartViewModel ChartOption)
        {
            var Message = "Not been found data.";

            try
            {
                if (ChartOption != null)
                {
                    Expression<Func<TaskMachine, bool>> predicate1;
                    predicate1 = x => x.TaskMachineStatus != TaskMachineStatus.Cancel;

                    if (ChartOption.TypeMachineId.HasValue)
                        predicate1 = predicate1.And(x => x.Machine.TypeMachineId == ChartOption.TypeMachineId);

                    var Labels = new List<string>();
                    var HasData = new List<ChartDataViewModel>();

                    if (ChartOption.EndDate.HasValue && ChartOption.StartDate.HasValue)
                    {
                        var StartDate = ChartOption.StartDate.Value.AddHours(7);
                        var EndDate = ChartOption.EndDate.Value.AddHours(7);
                       
                        // Filter Start and End Date
                        predicate1 = predicate1.And(x => x.PlannedStartDate.Date >= StartDate &&
                                                       x.PlannedEndDate.Date <= EndDate);
                        // ListMonth
                        var ListMonth = Enumerable.Range(0, (EndDate - StartDate).Days)
                                                  .Select(index => new DateTime?(StartDate.AddMonths(index)))
                                                  .TakeWhile(date => date <= EndDate)
                                                  .ToList();

                        var Machines = (await this.repository.GetToListAsync(
                            selector: x => x,
                            predicate: predicate1,
                            include: x => x.Include(z => z.Machine).Include(z => z.ProgressTaskMachines),
                            orderBy: x => x.OrderBy(z => z.Machine.MachineCode))).GroupBy(x => x.Machine).ToList();

                        foreach (var PickMonth in ListMonth)
                        {
                            var ActualChartData = new List<double>();
                            foreach (var Machine in Machines.OrderBy(x => x.Key.MachineCode))
                            {
                                if (!Labels.Any(x => x == Machine.Key.MachineCode))
                                    Labels.Add(Machine.Key.MachineCode);

                                var ActualData = Machine.Where(x => x.ActualStartDate != null &&
                                                                    x.ActualStartDate.Value.Month == PickMonth.Value.Month &&
                                                                    x.ActualStartDate.Value.Year == PickMonth.Value.Year);

                                ActualChartData.Add(ActualData.Sum(x => x.CurrentQuantity ?? 0));
                            }

                            HasData.Add(new ChartDataViewModel
                            {
                                Label = $"{PickMonth.Value.ToString("MMM yy")}",
                                DataChart = ActualChartData,
                            });
                        }

                        return new JsonResult(new
                        {
                            Labels = Labels.OrderBy(x => x),
                            Datas = HasData,
                        }, this.DefaultJsonSettings);
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

        // POST: api/version2/TaskMachine/TaskMachineChartDataProductWithProgress
        [HttpPost("TaskMachineChartDataProductWithProgress")]
        public async Task<IActionResult> TaskMachineChartDataProductWithProgress([FromBody]OptionChartViewModel ChartOption)
        {
            var Message = "Not been found data.";

            try
            {
                if (ChartOption != null)
                {
                    Expression<Func<TaskMachine, bool>> predicate1;
                    predicate1 = x => x.TaskMachineStatus != TaskMachineStatus.Cancel;

                    if (ChartOption.TypeMachineId.HasValue)
                        predicate1 = predicate1.And(x => x.Machine.TypeMachineId == ChartOption.TypeMachineId);

                    var Labels = new List<string>();
                    var HasData = new List<ChartDataViewModel>();

                    if (ChartOption.EndDate.HasValue && ChartOption.StartDate.HasValue)
                    {
                        var StartDate = ChartOption.StartDate.Value.AddHours(7);
                        var EndDate = ChartOption.EndDate.Value.AddHours(7);

                        // Filter Start and End Date
                        predicate1 = predicate1.And(x => x.PlannedStartDate.Date >= StartDate &&
                                                       x.PlannedEndDate.Date <= EndDate);
                        // ListMonth
                        var ListMonth = Enumerable.Range(0, (EndDate - StartDate).Days)
                                                  .Select(index => new DateTime?(StartDate.AddMonths(index)))
                                                  .TakeWhile(date => date <= EndDate)
                                                  .ToList();

                        var Machines = (await this.repository.GetToListAsync(
                            selector: x => x,
                            predicate: predicate1,
                            include: x => x.Include(z => z.Machine).Include(z => z.ProgressTaskMachines),
                            orderBy: x => x.OrderBy(z => z.Machine.MachineCode))).GroupBy(x => x.Machine).ToList();

                        foreach (var PickMonth in ListMonth)
                        {
                            var ActualChartData = new List<double>();
                            foreach (var Machine in Machines.OrderBy(x => x.Key.MachineCode))
                            {
                                if (!Labels.Any(x => x == Machine.Key.MachineCode))
                                    Labels.Add(Machine.Key.MachineCode);

                                var ActualData = Machine.Where(x => x.ProgressTaskMachines != null &&
                                                                    x.ProgressTaskMachines
                                                                        .Any(z => z.ProgressDate.Value.Month == PickMonth.Value.Month &&
                                                                                  z.ProgressDate.Value.Year == PickMonth.Value.Year));

                                ActualChartData.Add(ActualData.Sum(x => x.ProgressTaskMachines.Sum(z => z.Quantity ?? 0)));
                            }

                            HasData.Add(new ChartDataViewModel
                            {
                                Label = $"{PickMonth.Value.ToString("MMM yy")}",
                                DataChart = ActualChartData,
                            });
                        }

                        return new JsonResult(new
                        {
                            Labels = Labels.OrderBy(x => x),
                            Datas = HasData,
                        }, this.DefaultJsonSettings);
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

        // POST: api/version2/TaskMachine/TaskMachineChartDataWorkLoad
        [HttpPost("TaskMachineChartDataWorkLoad")]
        public async Task<IActionResult> TaskMachineChartDataWorkLoad([FromBody]OptionChartViewModel ChartOption)
        {
            var Message = "Data not been found.";
            try
            {
                if (ChartOption != null)
                {
                    if (ChartOption.EndDate.HasValue && ChartOption.StartDate.HasValue)
                    {
                        ChartOption = new HelpersClass<OptionChartViewModel>().AddHourMethod(ChartOption);
                        // Set first and last day of select range of date
                        var EndDate = ChartOption.EndDate; //DateTime.Today;
                        var StartDate = ChartOption.StartDate;
                        // new ChartData here
                        var ChartWorkLoadData = new List<ChartWorkloadViewModel>();
                        // Count month of range
                        var ListOfMonth = Enumerable.Range(0, 24)
                                             .Select(index => new DateTime?(StartDate.Value.AddMonths(index)))
                                             .TakeWhile(date => date <= EndDate)
                                             .ToList();

                        Expression<Func<TaskMachine, bool>> predicate = x => 
                                                       x.ActualStartDate.Value.Date >= StartDate.Value.Date &&
                                                       x.ActualEndDate.Value.Date <= EndDate.Value.Date;
          
                        if (ChartOption.TypeMachineId.HasValue)
                            predicate = predicate.And(x => x.Machine.TypeMachineId == ChartOption.TypeMachineId);

                        // get machines
                        var machines = (await this.repository.GetToListAsync(x => x,
                                                predicate,
                                                x => x.OrderBy(z => z.Machine.MachineCode),
                                                x => x.Include(z => z.Machine))
                                        ).GroupBy(x => x.Machine).Select(x => x.Key).ToList();

                        foreach (var PickMonth in ListOfMonth)
                        {
                            var FirstDayMonth = new DateTime(PickMonth.Value.Year, PickMonth.Value.Month, 1); ;
                            var LastDayMonth = new DateTime(PickMonth.Value.Year, PickMonth.Value.Month, DateTime.DaysInMonth(PickMonth.Value.Year, PickMonth.Value.Month));
                            var ListOfDays = Enumerable.Range(0, (LastDayMonth - FirstDayMonth).Days)
                                                        .Select(index => FirstDayMonth.AddDays(index))
                                                        .TakeWhile(date => date <= EndDate).ToList();
                            // ChartData
                            var newChartData = new ChartWorkloadViewModel()
                            {
                                MonthName = PickMonth.Value.ToString("MMM yy"),
                                WorkLoadDatas = new List<WorkLoadData>()
                            };

                            machines.ForEach(item =>
                            {
                                newChartData.WorkLoadDatas.Add(new WorkLoadData
                                {
                                    MachineNo = item.MachineCode,
                                    WorkDay = 0,
                                    TotalDay = LastDayMonth.Day - SunDayInMonth(PickMonth.Value)
                                });
                            });

                            // Foreach day
                            foreach (var DateMonth in ListOfDays)
                            {
                                var taskMachines = (await this.repository.GetToListAsync(x => x,
                                                            x => DateMonth.Date >= x.ActualStartDate.Value.Date &&
                                                                 DateMonth.Date <= x.ActualEndDate.Value.Date,null,x => x.Include(z => z.Machine)))
                                                                .GroupBy(x => x.Machine).ToList();

                                foreach (var taskMachine in taskMachines)
                                {
                                    var getData = newChartData.WorkLoadDatas.FirstOrDefault(x => x.MachineNo == taskMachine.Key.MachineCode);
                                    if (getData != null)
                                    {
                                        if (getData.WorkDay <= DateMonth.Day)
                                            getData.WorkDay += 1;
                                    }
                                }
                            }

                            ChartWorkLoadData.Add(newChartData);
                        }

                        if (ChartWorkLoadData.Any())
                        {
                            return new JsonResult(new
                            {
                                Labels = machines.Select(x => x.MachineCode),
                                Datas = ChartWorkLoadData.Select(x => new ChartDataViewModel
                                {
                                    Label = x.MonthName,
                                    DataChart = x.WorkLoadDatas.OrderBy(z => z.MachineNo)
                                                               .Select(z => Math.Round(z.Percent, 2)).ToList()
                                })
                            }, this.DefaultJsonSettings);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

        // POST: api/version2/TaskMachine/TaskMachineChartDataWorkLoad
        [HttpPost("TaskMachineChartDataWorkLoadWithProgress")]
        public async Task<IActionResult> TaskMachineChartDataWorkLoadWithProgress([FromBody]OptionChartViewModel ChartOption)
        {
            var Message = "Data not been found.";
            try
            {
                if (ChartOption != null)
                {
                    if (ChartOption.EndDate.HasValue && ChartOption.StartDate.HasValue)
                    {
                        ChartOption = new HelpersClass<OptionChartViewModel>().AddHourMethod(ChartOption);
                        // Set first and last day of select range of date
                        var EndDate = ChartOption.EndDate; //DateTime.Today;
                        var StartDate = ChartOption.StartDate;
                        // new ChartData here
                        var ChartWorkLoadData = new List<ChartWorkloadViewModel>();
                        // Count month of range
                        var ListOfMonth = Enumerable.Range(0, 24)
                                             .Select(index => new DateTime?(StartDate.Value.AddMonths(index)))
                                             .TakeWhile(date => date <= EndDate)
                                             .ToList();

                        Expression<Func<TaskMachine, bool>> predicate = x =>
                                                       x.ProgressTaskMachines.Any(z => z.ProgressDate.Value.Date >= StartDate.Value.Date &&
                                                       z.ProgressDate.Value.Date <= EndDate.Value.Date);

                        if (ChartOption.TypeMachineId.HasValue)
                            predicate = predicate.And(x => x.Machine.TypeMachineId == ChartOption.TypeMachineId);

                        // get machines
                        var machines = (await this.repository.GetToListAsync(x => x,
                                                predicate,
                                                x => x.OrderBy(z => z.Machine.MachineCode),
                                                x => x.Include(z => z.Machine).Include(z => z.ProgressTaskMachines))
                                        ).GroupBy(x => x.Machine).Select(x => x.Key).ToList();

                        foreach (var PickMonth in ListOfMonth)
                        {
                            var FirstDayMonth = new DateTime(PickMonth.Value.Year, PickMonth.Value.Month, 1); ;
                            var LastDayMonth = new DateTime(PickMonth.Value.Year, PickMonth.Value.Month, DateTime.DaysInMonth(PickMonth.Value.Year, PickMonth.Value.Month));
                            var ListOfDays = Enumerable.Range(0, (LastDayMonth - FirstDayMonth).Days)
                                                        .Select(index => FirstDayMonth.AddDays(index))
                                                        .TakeWhile(date => date <= EndDate).ToList();
                            // ChartData
                            var newChartData = new ChartWorkloadViewModel()
                            {
                                MonthName = PickMonth.Value.ToString("MMM yy"),
                                WorkLoadDatas = new List<WorkLoadData>()
                            };

                            machines.ForEach(item =>
                            {
                                newChartData.WorkLoadDatas.Add(new WorkLoadData
                                {
                                    MachineNo = item.MachineCode,
                                    WorkDay = 0,
                                    TotalDay = LastDayMonth.Day - SunDayInMonth(PickMonth.Value)
                                });
                            });

                            // Foreach day
                            foreach (var DateMonth in ListOfDays)
                            {
                                var taskMachines = (await this.repository.GetToListAsync(x => x,
                                                            x => x.ProgressTaskMachines.Any(z => DateMonth.Date == z.ProgressDate.Value.Date), 
                                                            null, x => x.Include(z => z.Machine))).GroupBy(x => x.Machine).ToList();

                                foreach (var taskMachine in taskMachines)
                                {
                                    var getData = newChartData.WorkLoadDatas.FirstOrDefault(x => x.MachineNo == taskMachine.Key.MachineCode);
                                    if (getData != null)
                                    {
                                        if (getData.WorkDay <= DateMonth.Day)
                                            getData.WorkDay += 1;
                                    }
                                }
                            }

                            ChartWorkLoadData.Add(newChartData);
                        }

                        if (ChartWorkLoadData.Any())
                        {
                            return new JsonResult(new
                            {
                                Labels = machines.Select(x => x.MachineCode),
                                Datas = ChartWorkLoadData.Select(x => new ChartDataViewModel
                                {
                                    Label = x.MonthName,
                                    DataChart = x.WorkLoadDatas.OrderBy(z => z.MachineNo)
                                                               .Select(z => Math.Round(z.Percent, 2)).ToList()
                                })
                            }, this.DefaultJsonSettings);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

        // POST: api/version2/TaskMachine/TaskMachineChartDataPlanAndActual
        [HttpPost("TaskMachineChartDataPlanAndActual")]
        public async Task<IActionResult> TaskMachineChartDataPlanAndActual([FromBody]OptionChartViewModel ChartOption)
        {
            var Message = "Data not been found.";
            try
            {
                if (ChartOption != null)
                {
                    if (ChartOption.EndDate.HasValue && ChartOption.StartDate.HasValue)
                    {
                        ChartOption = new HelpersClass<OptionChartViewModel>().AddHourMethod(ChartOption);
                        // Set first and last day of select range of date
                        var EndDate = ChartOption.EndDate.Value; //DateTime.Today;
                        var StartDate = ChartOption.StartDate.Value;
                        // new ChartData here
                        var ChartWorkLoadData = new List<ChartWorkloadViewModel>();
                        // Count month of range
                        var ListOfMonth = Enumerable.Range(0, 24)
                                             .Select(index => new DateTime?(StartDate.AddMonths(index)))
                                             .TakeWhile(date => date <= EndDate)
                                             .ToList();

                        Expression<Func<TaskMachine, bool>> predicate = x => 
                                                        x.PlannedStartDate.Date >= StartDate.Date &&
                                                        x.PlannedEndDate.Date <= EndDate.Date;

                        if (ChartOption.TypeMachineId.HasValue)
                            predicate = predicate.And(x => x.Machine.TypeMachineId == ChartOption.TypeMachineId);

                        // get machines
                        var machines = (await this.repository.GetToListAsync
                            (x => x,predicate,
                            x => x.OrderBy(z => z.Machine.MachineCode),
                            x => x.Include(z => z.Machine))).GroupBy(x => x.Machine)
                                                    .Select(x => x.Key).ToList();
                        // Plan
                        foreach (var PickMonth in ListOfMonth)
                        {
                            var FirstDayMonth = new DateTime(PickMonth.Value.Year, PickMonth.Value.Month, 1); ;
                            var LastDayMonth = new DateTime(PickMonth.Value.Year, PickMonth.Value.Month, DateTime.DaysInMonth(PickMonth.Value.Year, PickMonth.Value.Month));
                            var ListOfDays = Enumerable.Range(0, (LastDayMonth - FirstDayMonth).Days)
                                                        .Select(index => FirstDayMonth.AddDays(index))
                                                        .TakeWhile(date => date <= EndDate).ToList();
                            //Plan
                            #region Plan
                            // ChartData
                            var newChartDataPlan = new ChartWorkloadViewModel()
                            {
                                MonthName = PickMonth.Value.ToString("MMM yy") + "(Plan)",
                                WorkLoadDatas = new List<WorkLoadData>()
                            };

                            machines.ForEach(item =>
                            {
                                newChartDataPlan.WorkLoadDatas.Add(new WorkLoadData
                                {
                                    MachineNo = item.MachineCode,
                                    WorkDay = 0,
                                    TotalDay = LastDayMonth.Day - SunDayInMonth(PickMonth.Value)
                                });
                            });

                            // Foreach day
                            foreach (var DateMonth in ListOfDays)
                            {
                                var taskMachines = (await this.repository.GetToListAsync(x => x,x => DateMonth.Date >= x.PlannedStartDate.Date &&
                                                                                                    DateMonth.Date <= x.PlannedEndDate.Date,null,x => x.Include(z => z.Machine)))
                                                                                          .GroupBy(x => x.Machine).ToList();

                                foreach (var taskMachine in taskMachines)
                                {
                                    var getData = newChartDataPlan.WorkLoadDatas.FirstOrDefault(x => x.MachineNo == taskMachine.Key.MachineCode);
                                    if (getData != null)
                                    {
                                        if (getData.WorkDay <= DateMonth.Day)
                                            getData.WorkDay += 1;
                                    }
                                }
                            }

                            ChartWorkLoadData.Add(newChartDataPlan);
                            #endregion

                            //Actual
                            #region Actual
                            // ChartData
                            var newChartDataActual = new ChartWorkloadViewModel()
                            {
                                MonthName = PickMonth.Value.ToString("MMM yy") + "(Actual)",
                                WorkLoadDatas = new List<WorkLoadData>()
                            };

                            machines.ForEach(item =>
                            {
                                newChartDataActual.WorkLoadDatas.Add(new WorkLoadData
                                {
                                    MachineNo = item.MachineCode,
                                    WorkDay = 0,
                                    TotalDay = LastDayMonth.Day - SunDayInMonth(PickMonth.Value)
                                });
                            });

                            // Foreach day
                            foreach (var DateMonth in ListOfDays)
                            {
                                var taskMachines = (await this.repository.GetToListAsync(x => x,x => (x.ActualEndDate != null && x.ActualStartDate != null) ?
                                                                                                    (DateMonth.Date >= x.ActualStartDate.Value.Date &&
                                                                                                     DateMonth.Date <= x.ActualEndDate.Value.Date) : false,null,
                                                                                                     x => x.Include(z => z.Machine)))
                                                                                            .GroupBy(x => x.Machine).ToList();

                                foreach (var taskMachine in taskMachines)
                                {
                                    var getData = newChartDataActual.WorkLoadDatas.FirstOrDefault(x => x.MachineNo == taskMachine.Key.MachineCode);
                                    if (getData != null)
                                    {
                                        if (getData.WorkDay <= DateMonth.Day)
                                            getData.WorkDay += 1;
                                    }
                                }
                            }

                            ChartWorkLoadData.Add(newChartDataActual);
                            #endregion
                        }

                        if (ChartWorkLoadData.Any())
                        {
                            return new JsonResult(new
                            {
                                Labels = machines.Select(x => x.MachineCode),
                                Datas = ChartWorkLoadData.Select(x => new ChartDataViewModel
                                {
                                    Label = x.MonthName,
                                    DataChart = x.WorkLoadDatas.OrderBy(z => z.MachineNo)
                                                               .Select(z => Math.Round(z.Percent, 2)).ToList()
                                })
                            }, this.DefaultJsonSettings);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

        // POST: api/version2/TaskMachine/TaskMachineChartDataWeight
        [HttpPost("TaskMachineChartDataWeight")]
        public async Task<IActionResult> TaskMachineChartDataWeight([FromBody]OptionChartViewModel ChartOption)
        {
            var Message = "Not been found data.";
            try
            {
                if (ChartOption != null)
                {
                    Expression<Func<TaskMachine, bool>> predicate1;
                    predicate1 = x => x.TaskMachineStatus != TaskMachineStatus.Cancel;

                    if (ChartOption.TypeMachineId.HasValue)
                        predicate1 = predicate1.And(x => x.Machine.TypeMachineId == ChartOption.TypeMachineId);

                    var Labels = new List<string>();
                    var HasData = new List<ChartDataViewModel>();

                    if (ChartOption.EndDate.HasValue && ChartOption.StartDate.HasValue)
                    { 
                        var StartDate = ChartOption.StartDate.Value.AddHours(7);
                        var EndDate = ChartOption.EndDate.Value.AddHours(7);

                        // Filter Start and End Date
                        predicate1 = predicate1.And(x => x.ProgressTaskMachines.Any(z => z.ProgressDate.Value.Date >= StartDate.Date) &&
                                                         x.ProgressTaskMachines.Any(z => z.ProgressDate.Value.Date <= EndDate.Date));
                        // ListMonth
                        var ListMonth = Enumerable.Range(0, (EndDate - StartDate).Days)
                                                  .Select(index => new DateTime?(StartDate.AddMonths(index)))
                                                  .TakeWhile(date => date <= EndDate)
                                                  .ToList();

                        var Machines = (await this.repository.GetToListAsync(
                            selector: x => x,
                            predicate: predicate1,
                            include: x => x.Include(z => z.Machine).Include(z => z.ProgressTaskMachines),
                            orderBy: x => x.OrderBy(z => z.Machine.MachineCode))).GroupBy(x => x.Machine).ToList();

                        foreach (var PickMonth in ListMonth)
                        {
                            var ActualChartData = new List<double>();
                            foreach (var Machine in Machines.OrderBy(x => x.Key.MachineCode))
                            {
                                if (!Labels.Any(x => x == Machine.Key.MachineCode))
                                    Labels.Add(Machine.Key.MachineCode);

                                var ActualData = Machine.Where(x => x.ProgressTaskMachines != null &&
                                                                    x.ProgressTaskMachines.Any(z => 
                                                                        z.ProgressDate.Value.Month == PickMonth.Value.Month &&
                                                                        z.ProgressDate.Value.Year == PickMonth.Value.Year));

                                ActualChartData.Add(
                                    ActualData.Sum(x => 
                                        ((x.ProgressTaskMachines.Sum(z => z.Quantity ?? 0) / (x.TotalQuantity ?? 0)) * (x.Weight ?? 0)) / 1000
                                    )
                                );
                            }
                            HasData.Add(new ChartDataViewModel
                            {
                                Label = $"{PickMonth.Value.ToString("MMM yy")}",
                                DataChart = ActualChartData,
                            });
                        }

                        return new JsonResult(new
                        {
                            Labels = Labels.OrderBy(x => x),
                            Datas = HasData,
                        }, this.DefaultJsonSettings);
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }
        #endregion
    }
}
