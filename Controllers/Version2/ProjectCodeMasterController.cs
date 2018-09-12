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

namespace VipcoMachine.Controllers.Version2
{
    [Route("api/version2/[controller]")]
    [ApiController]
    public class ProjectCodeMasterController : GenericMachineController<ProjectCodeMaster>
    {
        private readonly IRepositoryMachine<ProjectCodeDetail> repositoryProjectDetail;
        // GET: api/ProjectCodeMaster
        public ProjectCodeMasterController
            (IRepositoryMachine<ProjectCodeMaster> repo,
            IRepositoryMachine<ProjectCodeDetail> repoProjectDetail,
            IMapper mapper) : base(repo, mapper)
        {
            this.repositoryProjectDetail = repoProjectDetail;
        }

        // POST: api/version2/ProjectCodeMaster/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                .AsQueryable();
            // Where
           
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.ProjectCode.ToLower().Contains(keyword) ||
                                                 x.ProjectName.ToLower().Contains(keyword) ||
                                                 x.ProjectCodeDetails.Any(z => z.ProjectCodeDetailCode.ToLower().Contains(keyword)) ||
                                                 x.ProjectCodeDetails.Any(z => z.Description.ToLower().Contains(keyword)));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "ProjectCode":
                    QueryData = Scroll.SortOrder == 1 ?
                       QueryData.OrderByDescending(e => e.ProjectCode) :
                       QueryData.OrderBy(e => e.ProjectCode);
                    break;

                case "ProjectName":
                    QueryData = Scroll.SortOrder == 1 ?
                       QueryData.OrderByDescending(e => e.ProjectName) :
                       QueryData.OrderBy(e => e.ProjectName);
                    break;

                case "StartDate":
                    QueryData = Scroll.SortOrder == 1 ?
                       QueryData.OrderByDescending(e => e.StartDate) :
                       QueryData.OrderBy(e => e.StartDate);
                    break;

                default:
                    QueryData = QueryData.OrderByDescending(e => e.ProjectCode);
                    break;
            }
            // Get TotalRow
            Scroll.TotalRow = await QueryData.CountAsync();
            // Skip and Take
            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 10);
            var ListData = new List<ProjectCodeMasterViewModel>();
            // Foreach
            foreach (var item in await QueryData.ToListAsync())
                ListData.Add(this.mapper.Map<ProjectCodeMaster, ProjectCodeMasterViewModel>(item));

            return new JsonResult(new ScrollDataViewModel<ProjectCodeMasterViewModel>
                (Scroll, ListData), this.DefaultJsonSettings);
        }

        [HttpPost]
        public override async Task<IActionResult> Create([FromBody] ProjectCodeMaster record)
        {
            // Set date for CrateDate Entity
            if (record == null)
                return BadRequest();
            // +7 Hour
            record = this.helper.AddHourMethod(record);

            if (record.GetType().GetProperty("CreateDate") != null)
                record.GetType().GetProperty("CreateDate").SetValue(record, DateTime.Now);

            if (record.ProjectCodeDetails != null)
            {
                foreach (var item in record.ProjectCodeDetails)
                {
                    item.CreateDate = record.CreateDate;
                    item.Creator = record.Creator;
                }
            }

            if (await this.repository.AddAsync(record) == null)
                return BadRequest();
            return new JsonResult(record, this.DefaultJsonSettings);
        }

        [HttpPut]
        public override async Task<IActionResult> Update(int key, [FromBody] ProjectCodeMaster record)
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

            // Update ProjectCodeDetails
            if (record.ProjectCodeDetails != null)
            {
                foreach (var item in record.ProjectCodeDetails)
                {
                    if (item.ProjectCodeDetailId > 0)
                    {
                        item.ModifyDate = record.ModifyDate;
                        item.Modifyer = record.Modifyer;
                    }
                    else
                    {
                        item.CreateDate = record.ModifyDate;
                        item.Creator = record.Modifyer;
                    }
                }
            }

            if (await this.repository.UpdateAsync(record, key) == null)
                return BadRequest();

            if (record.ProjectCodeDetails != null)
            {
                // Find requisition of item maintenance
                var dbProjectDetail = await this.repositoryProjectDetail.FindAllAsync(r => r.ProjectCodeMasterId == key);
                //Remove requisition if edit remove it
                foreach (var item in dbProjectDetail)
                {
                    if (!record.ProjectCodeDetails.Any(x => x.ProjectCodeDetailId == item.ProjectCodeDetailId))
                        await this.repositoryProjectDetail.DeleteAsync(item.ProjectCodeDetailId);
                }
                //Update or insert ProjectCodeDetail
                foreach (var item in record.ProjectCodeDetails)
                {
                    if (item == null)
                        continue;

                    if (item.ProjectCodeDetailId > 0)
                        await this.repositoryProjectDetail.UpdateAsync(item, item.ProjectCodeDetailId);
                    else
                    {
                        item.ProjectCodeMasterId = record.ProjectCodeMasterId;
                        await this.repositoryProjectDetail.AddAsync(item);
                    }
                }
            }

            return new JsonResult(record, this.DefaultJsonSettings);
        }
    }
}
