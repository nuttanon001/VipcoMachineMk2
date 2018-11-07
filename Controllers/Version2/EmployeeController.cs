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
    public class EmployeeController : GenericMachineController<Employee>
    {
        public EmployeeController
            (IRepositoryMachine<Employee> repo,IMapper mapper) : base(repo, mapper)
        { }

        // GET: api/version2/Employee/GetByMaster/5
        [HttpGet("GetByMaster")]
        public async Task<IActionResult> GetByMaster(string key)
        {
            var HasBoms = await this.repository.FindAllAsync(e => e.GroupMIS == key);
            if (HasBoms.Any())
                return new JsonResult(HasBoms.ToList(), this.DefaultJsonSettings);
            else
                return BadRequest(new { Error = "Key not been found." });
        }

        // POST: api/version2/Employee/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                .Where(x => x.GroupCode != "999999")
                                .Include(x => x.EmployeeGroupMIS)
                                .AsQueryable();

            // Where
            if (!string.IsNullOrEmpty(Scroll.Where))
                QueryData = QueryData.Where(x => x.GroupCode == Scroll.Where);

            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.NameEng.ToLower().Contains(keyword) ||
                                                 x.NameThai.ToLower().Contains(keyword) ||
                                                 x.EmpCode.ToLower().Contains(keyword) ||
                                                 x.GroupCode.ToLower().Contains(keyword) ||
                                                 x.GroupName.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "EmpCode":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.EmpCode) :
                        QueryData.OrderBy(e => e.EmpCode);
                    break;
                case "NameThai":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.NameThai) :
                        QueryData.OrderBy(e => e.NameThai);
                    break;
                case "GroupName":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.GroupName) :
                        QueryData.OrderBy(e => e.GroupName);
                    break;
                default:
                    QueryData = QueryData.OrderByDescending(e => e.NameThai)
                                         .ThenBy(e => e.EmpCode);
                    break;
            }
            // Get TotalRow
            Scroll.TotalRow = await QueryData.CountAsync();
            // Skip and Take
            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 10);
            var ListData = new List<EmployeeViewModel>();
            // Foreach
            foreach (var item in await QueryData.ToListAsync())
                ListData.Add(this.mapper.Map<Employee, EmployeeViewModel>(item));

            return new JsonResult(new ScrollDataViewModel<EmployeeViewModel>
                (Scroll, ListData), this.DefaultJsonSettings);
        }

        [HttpPost]
        public override async Task<IActionResult> Create([FromBody] Employee record)
        {
            // Set date for CrateDate Entity
            if (record == null)
                return BadRequest();

            var hasEmp = await this.repository.GetAsync(record.EmpCode);
            if (hasEmp != null)
            {
                if (await this.repository.UpdateAsync(record, record.EmpCode) == null)
                    return BadRequest();
            }
            else
            {
                if (await this.repository.AddAsync(record) == null)
                    return BadRequest();
            }
            return new JsonResult(record, this.DefaultJsonSettings);
        }
    }
}
