using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

using VipcoMachine.Services;
using VipcoMachine.ViewModels;
using VipcoMachine.Models;

using AutoMapper;
using VipcoMachine.Helper;

namespace VipcoMachine.Controllers.Version2
{
    [Route("api/version2/[controller]")]
    [ApiController]
    public class ProgressTaskMachineController : GenericMachineController<ProgressTaskMachine>
    {
        public ProgressTaskMachineController(IRepositoryMachine<ProgressTaskMachine> repo,IMapper mapper) : base(repo, mapper)
        { }
        // GET: api/version2/ProgressTaskMachine/GetKeyNumber/5
        [HttpGet("GetKeyNumber")]
        public override async Task<IActionResult> Get(int key)
        {
            var HasData = await this.repository.GetFirstOrDefaultAsync
                (x => x, x => x.ProgressId == key, null);
            if (HasData != null)
                return new JsonResult(HasData, this.DefaultJsonSettings);
            return BadRequest(new { error = "Data not been found." });
        }

        // GET: api/version2/ProgressTaskMachine/GetByMaster/5
        [HttpGet("GetByMaster")]
        public async Task<IActionResult> GetByMaster(int key)
        {
            var HasData = await this.repository.GetToListAsync(
                x => x, e => e.TaskMachineId == key, null);
            if (HasData.Any())
                return new JsonResult(HasData, this.DefaultJsonSettings);
            else
                return NoContent();
        }

        // GET: api/version2/ProgressTaskMachine/CurrentDate
        [HttpGet("CurrentDate")]
        public IActionResult CurrentDate()
        {
            var currentDate = new CurrentDateViewModel { CurrentDate = DateTime.Now };
            return new JsonResult(currentDate, this.DefaultJsonSettings);
        }
    }
}
