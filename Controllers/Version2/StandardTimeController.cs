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
    public class StandardTimeController : GenericMachineController<StandardTime>
    {
        public StandardTimeController(IRepositoryMachine<StandardTime>repo,IMapper mapper)
            : base(repo, mapper) { }

        // POST: api/version2/StandardTime/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable();
            // Where
            if (Scroll.WhereId.HasValue)
                QueryData = QueryData.Where(x => x.TypeStandardTimeId == Scroll.WhereId.Value);
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.StandardTimeCode.ToLower().Contains(keyword) ||
                                                 x.Description.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "StandardTimeCode":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.StandardTimeCode) :
                        QueryData.OrderBy(e => e.StandardTimeCode);
                    break;
                case "Description":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.Description) :
                        QueryData.OrderBy(e => e.Description);
                    break;
                case "StandardTimeValue":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.StandardTimeValue) :
                        QueryData.OrderBy(e => e.StandardTimeValue);
                    break;
                default:
                    QueryData = QueryData.OrderBy(e => e.StandardTimeCode);
                    break;
            }
            // Get TotalRow
            Scroll.TotalRow = await QueryData.CountAsync();
            // Skip and Take
            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 10);
            var MapDatas = new List<StandardTimeViewModel>();
            // Foreach
            foreach (var item in await QueryData.ToListAsync())
                MapDatas.Add(this.mapper.Map<StandardTime, StandardTimeViewModel>(item));

            return new JsonResult(new ScrollDataViewModel<StandardTimeViewModel>
                (Scroll, MapDatas), this.DefaultJsonSettings);
        }
    }
}
