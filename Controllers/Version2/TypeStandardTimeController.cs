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
    public class TypeStandardTimeController : GenericMachineController<TypeStandardTime>
    {
        public TypeStandardTimeController(IRepositoryMachine<TypeStandardTime> repo , IMapper mapper)
            : base(repo, mapper) { }

        // GET: api/controller
        [HttpGet]
        public override async Task<IActionResult> Get()
        {
            var ListData = await this.repository.GetAllAsync(x => x.TypeMachine);
            if (ListData.Any())
            {
                var MapDatas = new List<TypeStandardTimeViewModel>();
                foreach (var item in ListData)
                    MapDatas.Add(this.mapper.Map<TypeStandardTime, TypeStandardTimeViewModel>(item));
                return new JsonResult(MapDatas, this.DefaultJsonSettings);
            }
            return NoContent();
            // return BadRequest(new { error = "Data not been found." });
        }

        // POST: api/version2/TypeStandardTime/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var QueryData = this.repository.GetAllAsQueryable()
                .Include(x => x.TypeMachine).AsQueryable();
         
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);
            foreach (var keyword in filters)
            {
                QueryData = QueryData.Where(x => x.Name.ToLower().Contains(keyword));
            }

            // Order
            switch (Scroll.SortField)
            {
                case "Name":
                    QueryData = Scroll.SortOrder == 1 ?
                        QueryData.OrderByDescending(e => e.Name) :
                        QueryData.OrderBy(e => e.Name);
                    break;

                default:
                    QueryData = QueryData.OrderBy(e => e.Name);
                    break;
            }
            // Get TotalRow
            Scroll.TotalRow = await QueryData.CountAsync();
            // Skip and Take
            QueryData = QueryData.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 10);

            var MapDatas = new List<TypeStandardTimeViewModel>();
            // Foreach
            foreach (var item in await QueryData.ToListAsync())
                MapDatas.Add(this.mapper.Map<TypeStandardTime, TypeStandardTimeViewModel>(item));

            return new JsonResult(new ScrollDataViewModel<TypeStandardTimeViewModel>
                (Scroll, MapDatas), this.DefaultJsonSettings);
        }
    }
}
