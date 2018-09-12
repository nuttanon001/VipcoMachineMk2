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
    public class ProjectCodeDetailController : GenericMachineController<ProjectCodeDetail>
    {
        public ProjectCodeDetailController
              (IRepositoryMachine<ProjectCodeDetail> repo,
              IMapper mapper) : base(repo, mapper)
        {}

        // GET: api/ProjectCodeDetail/GetByMaster/5
        [HttpGet("GetByMaster")]
        public async Task<IActionResult> GetByMaster(int key)
        {
            if (key > 0)
            {
                var HasBoms = await this.repository.FindAllAsync(b => b.ProjectCodeMasterId == key);
                if (HasBoms.Any())
                    return new JsonResult(HasBoms.ToList(), this.DefaultJsonSettings);
            }
            return BadRequest(new { Error = "Key not been found." });
        }
    }
}
