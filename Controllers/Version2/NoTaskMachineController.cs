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

namespace VipcoMachine.Controllers.Version2
{
    [Route("api/version2/[controller]")]
    [ApiController]
    public class NoTaskMachineController : GenericMachineController<NoTaskMachine>
    {
        private readonly IRepositoryMachine<JobCardMaster> repositoryJobMaster;
        private readonly IRepositoryMachine<JobCardDetail> repositoryJobDetail;
        private readonly IRepositoryMachine<Employee> repositoryEmp;
        private readonly IRepositoryMachine<EmployeeGroupMIS> repositoryGroupMis;
        //Email
        private readonly EmailClass EmailClass;// Private 
        //Includes
        private readonly Func<IQueryable<NoTaskMachine>, IIncludableQueryable<NoTaskMachine, object>> includes;
        public NoTaskMachineController(IRepositoryMachine<NoTaskMachine> repo,
            IRepositoryMachine<JobCardDetail> repoJobDetail,
            IRepositoryMachine<JobCardMaster> repoJobMaster,
            IRepositoryMachine<EmployeeGroupMIS> reposGroupMis,
            IRepositoryMachine<Employee> repoEmp, IMapper mapper) : base(repo, mapper)
        {
            //Repository
            this.repositoryJobMaster = repoJobMaster;
            this.repositoryJobDetail = repoJobDetail;
            this.repositoryGroupMis = reposGroupMis;
            this.repositoryEmp = repoEmp;
            // include
            this.includes = e => e.Include(x => x.Employee)
                                .Include(x => x.EmployeeGroup)
                                .Include(x => x.EmployeeGroupMIS)
                                .Include(x => x.Employee)
                                .Include(x => x.JobCardDetail.CuttingPlan);
            //Helper
            this.EmailClass = new EmailClass();
        }

        #region Private

        private async Task<JobCardDetail> UpdateJobCard(int JobCardDetailId, string Create, JobCardDetailStatus Status = JobCardDetailStatus.Task)
        {
            var jobCardDetail = await this.repositoryJobDetail.GetFirstOrDefaultAsync
                                        (x => x,x => x.JobCardDetailId == JobCardDetailId);

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

        private async Task<bool> SendMailAsync(JobCardMaster jobMaster, NoTaskMachine NotaskMachine)
        {
            try
            {
                if (jobMaster != null)
                {
                    if (!string.IsNullOrEmpty(jobMaster.MailReply))
                    {
                        var ListMail = new List<string>();
                        if (jobMaster.MailReply.IndexOf(',') != -1)
                            ListMail = jobMaster.MailReply.Split(',').ToList();
                        else if (jobMaster.MailReply.IndexOf(';') != -1)
                            ListMail = jobMaster.MailReply.Split(';').ToList();
                        else
                            ListMail.Add(jobMaster.MailReply);

                        var EmpName = await this.repositoryEmp.GetFirstOrDefaultAsync(x => x.NameThai, x => x.EmpCode == jobMaster.EmpWrite);
                        var GroupName = await this.repositoryGroupMis.GetFirstOrDefaultAsync(x => x.GroupDesc, x => x.GroupMIS == NotaskMachine.GroupMis);
                        var BodyMessage = "<body style=font-size:11pt;font-family:Tahoma>" +
                                            "<h4 style='color:steelblue;'>เมล์ฉบับนี้เป็นแจ้งเตือนจากระบบงาน VIPCO MACHINE SYSTEM</h4>" +
                                            $"เรียน คุณ{EmpName}" +
                                            $"<p>เรื่อง การเปิดใบงานเลขที่ {jobMaster.JobCardMasterNo} ได้รับการทำงานโดยหน่วยงานอื่นๆช</p>" +
                                            $"<p>ณ.ขณะนี้ ทางหน่วยงาน{GroupName}ได้ทำการนำชิ้นงานไปทำงานเรียบร้อย</p>" +
                                            "<span style='color:steelblue;'>This mail auto generated by VIPCO MACHINE SYSTEM. Do not reply this email.</span>" +
                                          "</body>";

                        await this.EmailClass.SendMailMessage(ListMail[0], EmpName,
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

        // GET: api/version2/NoTaskMachine/GetKeyNumber
        [HttpGet("GetKeyNumber")]
        public override async Task<IActionResult> Get(int key)
        {
            var HasData = await this.repository.GetFirstOrDefaultAsync(
                selector: x => x,
                predicate: x => x.NoTaskMachineId == key,
                include: this.includes);

            if (HasData != null)
            {
                var mapData = this.mapper.Map<NoTaskMachine, NoTaskMachineViewModel>(HasData);
                return new JsonResult(mapData, this.DefaultJsonSettings);
            }

            return BadRequest(new { error = "Data not been found." });
        }
        // POST: api/version2/NoTaskMachine/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            if (Scroll == null)
                return BadRequest();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.Split(null);

            var predicate = PredicateBuilder.False<NoTaskMachine>();

            foreach (string keyword in filters)
            {
                string temp = keyword;
                predicate = predicate.Or(x => x.Description.ToLower().Contains(keyword) ||
                                            x.NoTaskMachineCode.ToLower().Contains(keyword) ||
                                            x.JobCardDetail.CuttingPlan.CuttingPlanNo.ToLower().Contains(keyword) ||
                                            x.EmployeeGroup.Description.ToLower().Contains(keyword) ||
                                            x.EmployeeGroupMIS.GroupDesc.ToLower().Contains(keyword) ||
                                            x.Employee.NameThai.ToLower().Contains(keyword));
            }
            if (!string.IsNullOrEmpty(Scroll.Where))
                predicate = predicate.And(p => p.Creator == Scroll.Where);
            //Order by
            Func<IQueryable<NoTaskMachine>, IOrderedQueryable<NoTaskMachine>> order;
            // Order
            switch (Scroll.SortField)
            {
                case "NoTaskMachineCode":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.NoTaskMachineCode);
                    else
                        order = o => o.OrderBy(x => x.NoTaskMachineCode);
                    break;
                case "CuttingPlanNo":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.JobCardDetail.CuttingPlan.CuttingPlanNo);
                    else
                        order = o => o.OrderBy(x => x.JobCardDetail.CuttingPlan.CuttingPlanNo);
                    break;
                case "AssignedByString":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Employee.NameThai);
                    else
                        order = o => o.OrderBy(x => x.Employee.NameThai);
                    break;
                case "GroupMisString":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.EmployeeGroupMIS.GroupDesc);
                    else
                        order = o => o.OrderBy(x => x.EmployeeGroupMIS.GroupDesc);
                    break;
                case "Date":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Date);
                    else
                        order = o => o.OrderBy(x => x.Date);
                    break;
                default:
                    order = o => o.OrderByDescending(x => x.Date);
                    break;
            }

            var QueryData = await this.repository.GetToListAsync(
                                    selector: selected => selected,  // Selected
                                    predicate: predicate, // Where
                                    orderBy: order, // Order
                                    include: x => x.Include(z => z.Employee)
                                    .Include(z => z.JobCardDetail.CuttingPlan)
                                    .Include(z => z.EmployeeGroup)
                                    .Include(z => z.EmployeeGroupMIS), // Include
                                    skip: Scroll.Skip ?? 0, // Skip
                                    take: Scroll.Take ?? 10); // Take

            // Get TotalRow
            Scroll.TotalRow = await this.repository.GetLengthWithAsync(predicate: predicate);

            var mapDatas = new List<NoTaskMachineViewModel>();
            foreach (var item in QueryData)
            {
                var MapItem = this.mapper.Map<NoTaskMachine, NoTaskMachineViewModel>(item);
                mapDatas.Add(MapItem);
            }

            return new JsonResult(new ScrollDataViewModel<NoTaskMachineViewModel>(Scroll, mapDatas), this.DefaultJsonSettings);
        }

        [HttpPost]
        public override async Task<IActionResult> Create([FromBody] NoTaskMachine record)
        {
            // Set date for CrateDate Entity
            if (record == null)
                return BadRequest();
            // +7 Hour
            record = this.helper.AddHourMethod(record);

            if (record.GetType().GetProperty("CreateDate") != null)
                record.GetType().GetProperty("CreateDate").SetValue(record, DateTime.Now);

            record.NoTaskMachineCode = DateTime.Now.ToString("ddMMyyhhmm");

            if (await this.repository.AddAsync(record) == null)
                return BadRequest();

            if (record.JobCardDetailId > 0)
            {
                await this.UpdateJobCard(record.JobCardDetailId, record.Creator);
                var jobMaster = await this.repositoryJobDetail.GetFirstOrDefaultAsync
                                 (x => x.JobCardMaster,x => x.JobCardDetailId == record.JobCardDetailId, null, x => x.Include(z => z.JobCardMaster));

                if (jobMaster != null)
                    await this.SendMailAsync(jobMaster, record);
            }
            return new JsonResult(record, this.DefaultJsonSettings);
        }

        [HttpPut]
        public override async Task<IActionResult> Update(int key, [FromBody] NoTaskMachine record)
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
            if (await this.repository.UpdateAsync(record, key) == null)
                return BadRequest();

            if (record.JobCardDetailId > 0)
                await this.UpdateJobCard(record.JobCardDetailId, record.Modifyer);

            return new JsonResult(record, this.DefaultJsonSettings);
        }
    }
}
