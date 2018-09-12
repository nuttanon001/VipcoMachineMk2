using System;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using AutoMapper;
using VipcoMachine.Models;
using VipcoMachine.ViewModels;

namespace VipcoMachine.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            #region User

            //User
            CreateMap<User, UserViewModel>()
                // CuttingPlanNo
                .ForMember(x => x.NameThai,
                           o => o.MapFrom(s => s.Employee == null ? "-" : $"คุณ{s.Employee.NameThai}"))
                .ForMember(x => x.Employee, o => o.Ignore());

            #endregion User

            #region Employee

            //Employee
            CreateMap<Employee, EmployeeViewModel>()
                .ForMember(x => x.Users, o => o.Ignore())
                .ForMember(x => x.GroupMIS, o => o.Ignore());

            #endregion

            #region ProjectCodeMaster
            CreateMap<ProjectCodeMaster, ProjectCodeMasterViewModel>()
                .ForMember(x => x.ProjectCodeDetails, o => o.Ignore())
                .ForMember(x => x.OverTimeMasters, o => o.Ignore());
            #endregion

            #region Machine

            CreateMap<Machine, MachineViewModel>()
                .ForMember(x => x.TypeMachineString, o => o.MapFrom(s => s.TypeMachine.TypeMachineCode ?? "-"))
                .ForMember(x => x.TypeMachine, o => o.Ignore())
                .ForMember(x => x.MachineImageString, o => o.Ignore())
                .ForMember(x => x.MachineImage, o => o.Ignore());

            #endregion

            #region MachineHasOperators

            CreateMap<MachineHasOperator, MachineHasOperatorViewModel>()
                .ForMember(x => x.EmployeeString, o => o.MapFrom(s => s.Employee.NameThai ?? "-"))
                .ForMember(x => x.Employee, o => o.Ignore())
                .ForMember(x => x.Machine, o => o.Ignore());

            #endregion

            #region CuttingPlan

            CreateMap<CuttingPlan, CuttingPlanViewModel>()
                .ForMember(x => x.ProjectCodeString, o => o.MapFrom(s => s.ProjectCodeDetail == null ? "-" : $"{s.ProjectCodeDetail.ProjectCodeMaster.ProjectCode}/{s.ProjectCodeDetail.ProjectCodeDetailCode}"))
                .ForMember(x => x.ProjectCodeDetail, o => o.Ignore())
                .ForMember(x => x.TypeCuttingPlanString, o => o.MapFrom(s => System.Enum.GetName(typeof(TypeCuttingPlan), s.TypeCuttingPlan)));

            #endregion

            #region StandardTime

            CreateMap<StandardTime, StandardTimeViewModel>()
                .ForMember(x => x.GradeMaterial, o => o.Ignore())
                .ForMember(x => x.JobCardDetails, o => o.Ignore())
                .ForMember(x => x.TypeStandardTime, o => o.Ignore());

            #endregion

            #region JobCardMaster

            CreateMap<JobCardMaster,JobCardMasterViewModel>()
                // JobCardMasterStatus
                .ForMember(x => x.StatusString,
                           o => o.MapFrom(s => System.Enum.GetName(typeof(JobCardMasterStatus), s.JobCardMasterStatus)))
                // TypeMachine
                .ForMember(x => x.TypeMachineString,
                           o => o.MapFrom(s => s.TypeMachine == null ? "-" : $"{s.TypeMachine.TypeMachineCode}/{s.TypeMachine.Name}"))
                .ForMember(x => x.TypeMachine, o => o.Ignore())
                // ProjectCodeDetail
                .ForMember(x => x.ProjectDetailString,
                           o => o.MapFrom(s => s.ProjectCodeDetail == null ? "-" : $"{s.ProjectCodeDetail.ProjectCodeMaster.ProjectCode}/{s.ProjectCodeDetail.ProjectCodeDetailCode}"))
                .ForMember(x => x.ProjectCodeDetail, o => o.Ignore())
                // EmployeeWrite
                .ForMember(x => x.EmployeeWriteString,
                           o => o.MapFrom(s => s.EmployeeWrite == null ? "-" : $"{s.EmployeeWrite.NameThai}"))
                .ForMember(x => x.EmployeeWrite, o => o.Ignore())
                // EmployeeRequire
                .ForMember(x => x.EmployeeRequireString,
                           o => o.MapFrom(s => s.EmployeeGroup == null ? "-" : $"{s.EmployeeGroup.Description}"))
                .ForMember(x => x.EmployeeGroup, o => o.Ignore())
                .ForMember(x => x.EmployeeRequire, o => o.Ignore());

            #endregion

            #region JobCardDetail

            CreateMap<JobCardDetail, JobCardDetailViewModel>()
                // TypeMachine
                .ForMember(x => x.TypeMachineString,
                           o => o.MapFrom(s => s.JobCardMaster == null ? "-" : s.JobCardMaster.TypeMachine.TypeMachineCode))
                // JobMasterNo
                .ForMember(x => x.JobMasterNoString,
                           o => o.MapFrom(s => s.JobCardMaster == null ? "-" : s.JobCardMaster.JobCardMasterNo))
                // FullName
                .ForMember(x => x.FullNameString,
                           o => o.MapFrom(s => s.JobCardMaster.ProjectCodeDetail.ProjectCodeMaster.ProjectCode + "/ " +
                                               s.JobCardMaster.ProjectCodeDetail.ProjectCodeDetailCode))
                .ForMember(x => x.JobCardMaster, o => o.Ignore())
                // UnitMeasure
                .ForMember(x => x.UnitsMeasure, o => o.Ignore())
                // StandardTime
                .ForMember(x => x.StandardTimeString,
                           o => o.MapFrom(s => s.StandardTime == null ? "-" : $"{s.StandardTime.GradeMaterial.GradeName} - {s.StandardTime.StandardTimeCode}"))
                .ForMember(x => x.StandardTime, o => o.Ignore())
                .ForMember(x => x.StatusString,o => o.MapFrom(s => System.Enum.GetName(typeof(JobCardDetailStatus), s.JobCardDetailStatus)))
                // CuttingPlan
                .ForMember(x => x.CuttingPlanString,
                           o => o.MapFrom(s => s.CuttingPlan == null ? "-" : s.CuttingPlan.CuttingPlanNo + (s.UnitNo != null ? $" | Unit.{s.UnitNo}" : "")))
                .ForMember(x => x.CuttingPlan, o => o.Ignore());

            #endregion

            #region TypeStandardTime
            //TypeStandardTime
            CreateMap<TypeStandardTime, TypeStandardTimeViewModel>()
                // TypeMachine
                .ForMember(x => x.TypeMachineString,
                           o => o.MapFrom(s => s.TypeMachine == null ? "-" : $"{s.TypeMachine.TypeMachineCode}/{s.TypeMachine.Name}"))
                .ForMember(x => x.TypeMachineCodeString,o => o.MapFrom(s => s.TypeMachine.TypeMachineCode))
                .ForMember(x => x.TypeMachine, o => o.Ignore());
            #endregion

            #region TaskMachine
            //TypeStandardTime
            CreateMap<TaskMachine, TaskMachineViewModel>()
                .ForMember(x => x.TaskMachineStatusString,o => o.MapFrom(s => System.Enum.GetName(typeof(TaskMachineStatus), s.TaskMachineStatus)))
                // CuttingPlanNo
                .ForMember(x => x.CuttingPlanNo,
                           o => o.MapFrom(s => s.JobCardDetail.CuttingPlan == null ? "-" : s.JobCardDetail.CuttingPlan.CuttingPlanNo))
                .ForMember(x => x.JobCardDetail, o => o.Ignore())
                .ForMember(x => x.StandardTimeString,
                            o => o.MapFrom(s => s.StandardTime == null ? "-" : s.StandardTime.StandardTimeCode))
                .ForMember(x => x.StandardTime,o => o.Ignore())
                // Machine
                .ForMember(x => x.MachineString,
                           o => o.MapFrom(s => s.Machine == null ? "-" : $"{ s.Machine.MachineCode}/{ s.Machine.MachineName}"))
                .ForMember(x => x.Machine, o => o.Ignore())
                // Machine
                .ForMember(x => x.MachineString,
                           o => o.MapFrom(s => s.Machine == null ? "-" : $"{ s.Machine.MachineCode}/{ s.Machine.MachineName}"))
                .ForMember(x => x.Machine, o => o.Ignore())
                // Employee
                .ForMember(x => x.AssignedByString,
                           o => o.MapFrom(s => s.Employee == null ? "-" : s.Employee.NameThai))
                .ForMember(x => x.Employee, o => o.Ignore());
            #endregion

            #region NoTaskMachine

            CreateMap<NoTaskMachine, NoTaskMachineViewModel>()
                .ForMember(x => x.AssignedByString, o => o.MapFrom(s => s.Employee.NameThai))
                .ForMember(x => x.Employee, o => o.Ignore())
                .ForMember(x => x.GroupCodeString, o => o.MapFrom(s => s.EmployeeGroup.Description))
                .ForMember(x => x.EmployeeGroup, o => o.Ignore())
                .ForMember(x => x.GroupMisString, o => o.MapFrom(s => s.EmployeeGroupMIS.GroupDesc))
                .ForMember(x => x.EmployeeGroupMIS, o => o.Ignore())
                .ForMember(x => x.CuttingPlanNo, o => o.MapFrom(s => s.JobCardDetail.CuttingPlan.CuttingPlanNo))
                .ForMember(x => x.JobCardDetail, o => o.Ignore());

            #endregion
        }
    }
}
