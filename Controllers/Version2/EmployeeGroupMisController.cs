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
    public class EmployeeGroupMisController : GenericMachineController<EmployeeGroupMIS>
    {
        public EmployeeGroupMisController
           (IRepositoryMachine<EmployeeGroupMIS> repo, IMapper mapper) : base(repo, mapper)
        { }

        // POST: api/version2/EmployeeGroupMis/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable().Where(x => !x.GroupMIS.StartsWith("00"));
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
                QueryData = QueryData.Where(x => x.GroupDesc.ToLower().Contains(keyword) ||
                                                 x.GroupMIS.ToLower().Contains(keyword) ||
                                                 x.Remark.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "GroupMis":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.GroupMIS) :
                        QueryData.OrderBy(e => e.GroupMIS);
                    break;

                case "GroupDesc":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.GroupDesc) :
                        QueryData.OrderBy(e => e.GroupDesc);
                    break;

                default:
                    QueryData = QueryData.OrderBy(e => e.GroupDesc);
                    break;
            }
            // Get TotalRow
            Scroll.TotalRow = await QueryData.CountAsync();
            // Skip and Take
            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 10);

            return new JsonResult(new ScrollDataViewModel<EmployeeGroupMIS>
                (Scroll, await QueryData.ToListAsync()), this.DefaultJsonSettings);
        }

        [HttpGet("GroupMisByEmpCode")]
        public async Task<IActionResult> GetGroupMisByEmpCode(string EmpCode)
        {
            var HasData = await this.repository.GetFirstOrDefaultAsync(x => x, x => x.Employees.Any(z => z.EmpCode == EmpCode));
            return new JsonResult(HasData, this.DefaultJsonSettings);
        }
    }
}
