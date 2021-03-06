﻿using AutoMapper;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using VipcoMachine.Models;
using VipcoMachine.ViewModels;
using VipcoMachine.Services;

namespace VipcoMachine.Controllers
{
    [Produces("application/json")]
    [Route("api/GradeMaterial")]
    public class GradeMaterialController : Controller
    {
        #region PrivateMenbers
        private readonly IRepository<GradeMaterial> repository;
        private readonly IMapper mapper;

        private JsonSerializerSettings DefaultJsonSettings =>
            new JsonSerializerSettings()
            {
                Formatting = Formatting.Indented,
                PreserveReferencesHandling = PreserveReferencesHandling.Objects,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            };
        private List<MapType> ConverterTableToViewModel<MapType, TableType>(ICollection<TableType> tables)
        {
            var listData = new List<MapType>();
            foreach (var item in tables)
                listData.Add(this.mapper.Map<TableType, MapType>(item));
            return listData;
        }
        #endregion PrivateMenbers

        #region Constructor

        public GradeMaterialController(IRepository<GradeMaterial> repo, IMapper map)
        {
            this.repository = repo;
            this.mapper = map;
        }

        #endregion

        #region GET
        // GET: api/GradeMaterial
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return new JsonResult(await this.repository.GetAllAsync(), this.DefaultJsonSettings);
        }

        // GET: api/GradeMaterial/5
        [HttpGet("{key}")]
        public async Task<IActionResult> Get(int key)
        {
            return new JsonResult(await this.repository.GetAsync(key), this.DefaultJsonSettings);
        }
        #endregion

        #region POST
        // POST: api/GradeMaterial
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]GradeMaterial nGradeMaterial)
        {
            if (nGradeMaterial != null)
            {
                nGradeMaterial.CreateDate = DateTime.Now;
                nGradeMaterial.Creator = nGradeMaterial.Creator ?? "Someone";

                return new JsonResult(await this.repository.AddAsync(nGradeMaterial), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Grade Material not found." });

        }
        #endregion

        #region PUT
        // PUT: api/GradeMaterial/5
        [HttpPut("{key}")]
        public async Task<IActionResult> PutByNumber(int key, [FromBody]GradeMaterial uGradeMaterial)
        {
            if (uGradeMaterial != null)
            {
                uGradeMaterial.ModifyDate = DateTime.Now;
                uGradeMaterial.Modifyer = uGradeMaterial.Modifyer ?? "Someone";

                return new JsonResult(await this.repository.UpdateAsync(uGradeMaterial, key), this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "Grade Material not found." });
        }
        #endregion

        #region DELETE
        // DELETE: api/GradeMaterial/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return new JsonResult(await this.repository.DeleteAsync(id), this.DefaultJsonSettings);
        }
        #endregion
    }
}
