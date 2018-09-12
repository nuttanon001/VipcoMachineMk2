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
    public class EmployeeGroupController : GenericMachineController<EmployeeGroup>
    {
        private readonly IRepositoryMachine<Employee> repositoryEmployee;
        public EmployeeGroupController(
            IRepositoryMachine<EmployeeGroup> repo,
            IRepositoryMachine<Employee> repoEmployee,
            IMapper mapper) : base(repo, mapper)
        {
            this.repositoryEmployee = repoEmployee;
        }
        // POST: api/version2/EmployeeGroup/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                                                .Where(x => !x.GroupCode.StartsWith('1') &&
                                                       !x.GroupCode.StartsWith("2") &&
                                                       !x.GroupCode.StartsWith("3"));
            // Where
            if (!string.IsNullOrEmpty(Scroll.Where))
            {
                // QueryData = QueryData.Where(x => x.GroupCode == Scroll.Where);
            }
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.Description.ToLower().Contains(keyword) ||
                                                 x.GroupCode.ToLower().Contains(keyword) ||
                                                 x.Remark.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "GroupMis":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.GroupCode) :
                        QueryData.OrderBy(e => e.GroupCode);
                    break;

                case "GroupDesc":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.Description) :
                        QueryData.OrderBy(e => e.Description);
                    break;

                default:
                    QueryData = QueryData.OrderBy(e => e.Description);
                    break;
            }
            // Get TotalRow
            Scroll.TotalRow = await QueryData.CountAsync();
            // Skip and Take
            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 10);

            return new JsonResult(new ScrollDataViewModel<EmployeeGroup>
                (Scroll, await QueryData.ToListAsync()), this.DefaultJsonSettings);
        }

        [HttpGet("GroupByEmpCode")]
        public async Task<IActionResult> GetGroupMisByEmpCode(string EmpCode)
        {
            var GroupCode = await this.repositoryEmployee.GetFirstOrDefaultAsync(x => x.GroupCode, x => x.EmpCode == EmpCode);
            if (!string.IsNullOrEmpty(GroupCode))
            {
                var HasData = await this.repository.GetFirstOrDefaultAsync(x => x, x => x.GroupCode == GroupCode);
                return new JsonResult(HasData, this.DefaultJsonSettings);
            }
            return NoContent();
        }
    }
}
