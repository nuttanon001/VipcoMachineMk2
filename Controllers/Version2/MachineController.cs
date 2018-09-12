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
    public class MachineController : GenericMachineController<Machine>
    {
        private readonly IRepositoryMachine<MachineHasOperator> repositoryOperator;

        public MachineController(
            IRepositoryMachine<Machine> repo,
            IRepositoryMachine<MachineHasOperator> repoOperator,
            IMapper mapper): base(repo, mapper)
        {
            // Repository Machine
            this.repositoryOperator = repoOperator;
        }

        // POST: api/version2/Machine/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                .Include(x => x.TypeMachine)
                                .AsQueryable();
            // Where
            if (Scroll.WhereId.HasValue)
                QueryData = QueryData.Where(x => x.TypeMachineId == Scroll.WhereId.Value);
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.MachineCode.ToLower().Contains(keyword) ||
                                                  x.MachineName.ToLower().Contains(keyword) ||
                                                  x.TypeMachine.TypeMachineCode.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "MachineCode":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.MachineCode) :
                        QueryData.OrderBy(e => e.MachineCode);
                    break;

                case "MachineName":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.MachineName) :
                        QueryData.OrderBy(e => e.MachineName);
                    break;

                case "MachineStatus":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.MachineStatus) :
                        QueryData.OrderBy(e => e.MachineStatus);
                    break;

                case "TypeMachineString":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.TypeMachine.TypeMachineCode) :
                        QueryData.OrderBy(e => e.TypeMachine.TypeMachineCode);
                    break;

                default:
                    QueryData = QueryData.OrderBy(e => e.MachineCode);
                    break;
            }
            // Get TotalRow
            Scroll.TotalRow = await QueryData.CountAsync();
            // Skip and Take
            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 10);
            var ListData = new List<MachineViewModel>();
            // Foreach
            foreach (var item in await QueryData.ToListAsync())
                ListData.Add(this.mapper.Map<Machine, MachineViewModel>(item));

            return new JsonResult(new ScrollDataViewModel<MachineViewModel>
                (Scroll, ListData), this.DefaultJsonSettings);
        }

        [HttpPost]
        public override async Task<IActionResult> Create([FromBody] Machine record)
        {
            // Set date for CrateDate Entity
            if (record == null)
                return BadRequest();
            // +7 Hour
            record = this.helper.AddHourMethod(record);

            if (record.GetType().GetProperty("CreateDate") != null)
                record.GetType().GetProperty("CreateDate").SetValue(record, DateTime.Now);

            if (record.MachineHasOperators != null)
            {
                foreach (var item in record.MachineHasOperators)
                {
                    item.CreateDate = record.CreateDate;
                    item.Creator = record.Creator;
                    item.Employee = null;
                }
            }

            if (await this.repository.AddAsync(record) == null)
                return BadRequest();
            return new JsonResult(record, this.DefaultJsonSettings);
        }

        [HttpPut]
        public override async Task<IActionResult> Update(int key, [FromBody] Machine record)
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
            if (record.MachineHasOperators != null)
            {
                foreach (var item in record.MachineHasOperators)
                {
                    if (item == null)
                        continue;

                    item.Employee = null;

                    if (item.MachineOperatorId > 0)
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

            if (record.MachineHasOperators != null)
            {
                // Find requisition of item maintenance
                var dbOperators = await this.repositoryOperator.FindAllAsync(r => r.MachineId == key);
                //Remove requisition if edit remove it
                foreach (var item in dbOperators)
                {
                    if (!record.MachineHasOperators.Any(x => x.MachineOperatorId == item.MachineOperatorId))
                        await this.repositoryOperator.DeleteAsync(item.MachineOperatorId);
                }
                //Update or insert ProjectCodeDetail
                foreach (var item in record.MachineHasOperators)
                {
                    if (item == null)
                        continue;

                    if (item.MachineOperatorId > 0)
                        await this.repositoryOperator.UpdateAsync(item, item.MachineOperatorId);
                    else
                    {
                        item.MachineId = record.MachineId;
                        await this.repositoryOperator.AddAsync(item);
                    }
                }
            }

            return new JsonResult(record, this.DefaultJsonSettings);
        }
    }
}
