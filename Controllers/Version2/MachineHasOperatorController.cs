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
    public class MachineHasOperatorController : GenericMachineController<MachineHasOperator>
    {
        public MachineHasOperatorController(IRepositoryMachine<MachineHasOperator> repo, IMapper mapper) : 
            base(repo, mapper) { }

        // GET: api/version2/MachineHasOperator/GetByMaster/5
        [HttpGet("GetByMaster")]
        public async Task<IActionResult> GetByMaster(int key)
        {
            if (key > 0)
            {
                var HasData = await this.repository.FindAllAsync(o => o.MachineId == key,o => o.Employee);
                var MapDatas = new List<MachineHasOperatorViewModel>();
                if (HasData.Any())
                {
                    foreach (var item in HasData)
                        MapDatas.Add(this.mapper.Map<MachineHasOperator, MachineHasOperatorViewModel>(item));
                    return new JsonResult(MapDatas, this.DefaultJsonSettings);
                }
                else
                    return NoContent();

            }
            return BadRequest(new { Error = "Key not been found." });
        }

    }
}
