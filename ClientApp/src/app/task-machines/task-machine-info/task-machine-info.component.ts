// Angular Core
import { Component, OnInit, ViewContainerRef, Type, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatStepper } from '@angular/material';
// Models
import { TaskMachine } from '../shared/task-machine.model';
import { TypeMachine } from '../../machines/shared/type-machine.model';
import { TaskMachineStatus } from '../shared/task-machine-status.enum';
import { ProgressTaskMachine } from '../shared/progress-task-machine.model';
import { StandardTime } from '../../standard-times/shared/standard-time.model';
import { ProgressTaskMachineStatus } from '../shared/progress-task-machine-status.enum';
// Components
import { BaseInfoComponent } from '../../shared/base-info-component';
import { StandardTimeDialogComponent } from '../../dialogs/standard-time-dialog/standard-time-dialog.component';
// Services
import { TaskMachineService } from '../shared/task-machine.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { EmployeeService } from '../../employees/shared/employee.service';
import { TypeMachineService } from '../../machines/shared/type-machine.service';
import { ProgressTaskMachineService } from '../shared/progress-task-machine.service';
import { JobcardDetailService } from '../../jobcard-masters/shared/jobcard-detail.service';
import { TaskMachineCommunicateService } from '../shared/task-machine-communicate.service';
// Rxjs
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { JobcardMaster } from '../../jobcard-masters/shared/jobcard-master.model';
import { Machine } from '../../machines/shared/machine.model';
import { AuthService } from '../../core/auth/auth.service';
import { StandardTimeService } from '../../standard-times/shared/standard-time.service';
import { ScheduleMode } from '../shared/schedule-mode.model';
import * as moment from "moment";

@Component({
  selector: 'app-task-machine-info',
  templateUrl: './task-machine-info.component.html',
  styleUrls: ['./task-machine-info.component.scss']
})

export class TaskMachineInfoComponent extends BaseInfoComponent<TaskMachine, TaskMachineService, TaskMachineCommunicateService> {
  constructor(
    service: TaskMachineService,
    serviceCom: TaskMachineCommunicateService,
    private serivceEmp: EmployeeService,
    private serviceProgress: ProgressTaskMachineService,
    private serviceJobDetail: JobcardDetailService,
    private serviceTypeMachine: TypeMachineService,
    private serviceStandard: StandardTimeService, 
    private serviceAuth:AuthService,
    private dialog: MatDialog,
    private serviceDialogs: DialogsService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder
  ) {
    super(service, serviceCom);
  }

  // Parameter
  indexItem: number;
  isProgress: number = 0;
  typeMachines: Array<TypeMachine>;
  jobMaster: JobcardMaster;
  standardTime: StandardTime;
  currentDate: Date;
  scheduleMode: ScheduleMode = { Mode:2 };
  standardDay: number;
  totalDay: number;
  sunDDay = function (sDate: Date, eDate: Date): number {
    let getDateArray = function (start: Date, end: Date) {
      var arr = new Array<Date>();
      var dt = new Date(start);
      while (dt <= end) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    }
    let hasSunday: number = 0;
    for (let entry of getDateArray(sDate, eDate)) {
      //console.log(entry);
      if (entry.getDay() === 0) {
        hasSunday++;
      }
    }
    return hasSunday;
  };
  onlyProgress: boolean = false;
  //On get data from api
  onGetDataByKey(InfoValue?: TaskMachine): void {
    if (InfoValue && InfoValue.JobCardDetailId) {
      // set index
      if (InfoValue.IsProgress) {
        this.isProgress = 1;
        this.onlyProgress = true;
      }

      if (InfoValue.TaskMachineId) {
        this.service.getOneKeyNumber(InfoValue)
          .subscribe(dbData => {
            this.InfoValue = dbData;
            this.scheduleMode = {
              PickDate: dbData.PlannedStartDate,
              Mode: 2,
            };
            this.standardDay = this.InfoValue.PlanManHours;
            //debug here
            // console.log(JSON.stringify(this.InfoValue));

            if (this.InfoValue) {
              this.serviceProgress.getByMasterId(this.InfoValue.TaskMachineId)
                .subscribe(dbDetail => {
                  this.InfoValue.ProgressTaskMachines = new Array;
                  if (dbDetail) {
                    dbDetail.forEach(item => {
                      this.InfoValue.ProgressTaskMachines.push(Object.assign({}, item));
                    });

                    this.InfoValueForm.patchValue({
                      ProgressTaskMachines: this.InfoValue.ProgressTaskMachines
                    });
                  }
                });

              //Get job card detail
              this.OnGetJobCardDetail();

              if (this.InfoValue.StandardTimeId) {
                this.serviceStandard.getOneKeyNumber({ StandardTimeId: this.InfoValue.StandardTimeId })
                  .subscribe(dbStandard => {
                    if (dbStandard) {
                      this.standardTime = dbStandard;
                    }
                  });
              }
            }
          }, error => console.error(error), () => this.buildForm());
      } else {
        this.InfoValue = {
          TaskMachineId: 0,
          TaskMachineStatus: TaskMachineStatus.Wait,
          JobCardDetailId: InfoValue.JobCardDetailId,
          ProgressTaskMachines: new Array,
        };

        if (this.serviceAuth.getAuth) {
          this.InfoValue.AssignedBy = this.serviceAuth.getAuth.EmpCode;
          this.InfoValue.AssignedByString = this.serviceAuth.getAuth.NameThai;
		      this.InfoValue.ReceiveBy = this.serviceAuth.getAuth.NameThai;
        }
        this.buildForm();
        this.OnGetJobCardDetail();
      }
   
    } else {
      this.InfoValue = {
        TaskMachineId: 0,
        TaskMachineStatus: TaskMachineStatus.Wait,
        ProgressTaskMachines: new Array,
      };

      if (this.serviceAuth.getAuth) {
        this.InfoValue.AssignedBy = this.serviceAuth.getAuth.EmpCode;
        this.InfoValue.AssignedByString = this.serviceAuth.getAuth.NameThai;
        this.InfoValue.ReceiveBy = this.serviceAuth.getAuth.NameThai;
      }
      this.buildForm();
    }

    this.serviceProgress.getCurrentDate()
      .subscribe(currentDate => {
        this.currentDate = new Date(currentDate.CurrentDate);
        if (this.InfoValue && !this.InfoValue.TaskMachineId) {
          this.InfoValueForm.patchValue({
            PlannedStartDate: this.currentDate
          });
          this.scheduleMode.PickDate = this.currentDate;
          this.scheduleMode = Object.assign({}, this.scheduleMode);
        }
      });
  }

  //BulidForm
  buildForm(): void {
    if (!this.typeMachines) {
      this.typeMachines = new Array();
      this.serviceTypeMachine.getAll()
        .subscribe(dbData => {
          if (dbData) {
            this.typeMachines = dbData.slice();
          }
        });
    }
    //debug here
    // console.log("buildForm");
    this.InfoValueForm = this.fb.group({
      TaskMachineId: [this.InfoValue.TaskMachineId],
      TaskMachineName: [this.InfoValue.TaskMachineName],
      Description: new FormControl(
        { value: this.InfoValue.Description, disabled: this.denySave || this.onlyProgress },
        [Validators.maxLength(200)]
      ),
      TaskMachineStatus: [this.InfoValue.TaskMachineStatus],
      Priority: [this.InfoValue.Priority],
      TotalQuantity: new FormControl(
        { value: this.InfoValue.TotalQuantity, disabled: this.denySave || this.onlyProgress },
        [Validators.min(0)]
      ),
      CurrentQuantity: new FormControl(
        { value: this.InfoValue.CurrentQuantity, disabled: this.denySave || this.onlyProgress }
      ),
      Weight: new FormControl(
        {
          value: this.InfoValue.Weight,
          disabled: this.denySave || this.onlyProgress,
        },
        [ Validators.min(0), Validators.required ],
      ),
      PlannedStartDate: new FormControl(
        {
          value: this.InfoValue.PlannedStartDate,
          disabled: this.denySave || this.onlyProgress,
        },
        [Validators.required]
      ),
      PlannedEndDate: new FormControl(
        { value: this.InfoValue.PlannedEndDate, disabled: true },
        [Validators.required]
      ),
      ActualStartDate: new FormControl(
        { value: this.InfoValue.ActualStartDate, disabled: true }
      ),
      ActualEndDate: new FormControl(
        { value: this.InfoValue.ActualEndDate, disabled: true }
      ),
      TaskDueDate: new FormControl(
        { value: this.InfoValue.TaskDueDate, disabled: this.denySave || this.onlyProgress },
        [ Validators.required ]
      ),
      HasOverTime: new FormControl(
        { value: this.InfoValue.HasOverTime, disabled: this.denySave || this.onlyProgress },
      ),
      ReceiveBy: new FormControl(
        { value: this.InfoValue.ReceiveBy, disabled: this.denySave || this.onlyProgress },
      ),
      ActualManHours: [this.InfoValue.ActualManHours],
      PlanManHours: [this.InfoValue.PlanManHours],
      MachineId: [this.InfoValue.MachineId],
      JobCardDetailId: [this.InfoValue.JobCardDetailId],
      StandardTimeId: [this.InfoValue.StandardTimeId],
      AssignedBy: [this.InfoValue.AssignedBy],
      PrecedingTaskMachineId: [this.InfoValue.PrecedingTaskMachineId],
      ProgressTaskMachines: [this.InfoValue.ProgressTaskMachines],
      // BaseModel
      Creator: [this.InfoValue.Creator],
      CreateDate: [this.InfoValue.CreateDate],
      Modifyer: [this.InfoValue.Modifyer],
      ModifyDate: [this.InfoValue.ModifyDate],
      // ViewModel
      MachineString: new FormControl({ value: this.InfoValue.MachineString, disabled: this.denySave || this.onlyProgress }, [Validators.required]),
      CuttingPlanNo: new FormControl({ value: this.InfoValue.CuttingPlanNo, disabled: this.denySave || this.onlyProgress }),
      StandardTimeString: new FormControl({ value: this.InfoValue.StandardTimeString, disabled: this.denySave || this.onlyProgress }, [Validators.required]),
      AssignedByString: new FormControl({ value: this.InfoValue.AssignedByString, disabled: this.denySave || this.onlyProgress }, [Validators.required]),
      TaskMachineStatusString: [this.InfoValue.TaskMachineStatusString],
    });
    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => this.onValueChanged(data));

    if (this.InfoValueForm) {
      Object.keys(this.InfoValueForm.controls).forEach(field => {
        const control = this.InfoValueForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
    //debug here
    // console.log(JSON.stringify(this.InfoValueForm.getRawValue() as TaskMachine));

    if (this.InfoValueForm) {
      // Get Control
      this.InfoValueForm.get("Weight").valueChanges
        .pipe(debounceTime(1000), distinctUntilChanged()).subscribe((data: string) => {
          if (this.standardTime) {
            const infoValue = this.InfoValueForm.getRawValue() as TaskMachine;
            this.setDate(infoValue, this.standardTime);
          }
        });

      this.InfoValueForm.get("PlannedStartDate").valueChanges
        .pipe(debounceTime(150), distinctUntilChanged()).subscribe((data: string) => {
          if (this.standardTime) {
            const infoValue = this.InfoValueForm.getRawValue() as TaskMachine;
            // Schedule
            this.scheduleMode.PickDate = infoValue.PlannedStartDate;
            this.scheduleMode = Object.assign({}, this.scheduleMode);

            this.setDate(infoValue, this.standardTime);
          }
        });

      this.InfoValueForm.get("HasOverTime").valueChanges
        .pipe(debounceTime(150), distinctUntilChanged()).subscribe((data: number) => {
          if (this.standardTime) {
            const infoValue = this.InfoValueForm.getRawValue() as TaskMachine;
            this.setDate(infoValue, this.standardTime);
          }
        });
    }
  }

  // On JobcardDetail
  OnDetailSelect(Item: { data?: ProgressTaskMachine, option: number }) {
    if (this.denySave) {
      return;
    }
    if (Item) {
      if (!Item.data) {
        this.indexItem = -1;
      } else {
        this.indexItem = this.InfoValue.ProgressTaskMachines.indexOf(Item.data);
      }
      if (Item.option === 1) {
        let detailInfoValue: ProgressTaskMachine;
        let TotalQty = 0;
        if (this.InfoValue.ProgressTaskMachines) {
          this.InfoValue.ProgressTaskMachines.forEach(item => TotalQty += item.Quantity);
          TotalQty = this.jobMaster.JobCardDetails[0].Quality - TotalQty;

          console.log(TotalQty);

          if (TotalQty < 0) {
            this.serviceDialogs.error("Warning Message", "This quality is max.", this.viewContainerRef);
            return;
          }
        } else {
          TotalQty = this.jobMaster.JobCardDetails[0].Quality;
        }
        // IF Edit data
        if (Item.data) {
          if (this.onlyProgress) {
            if (Item.data.ProgressId) {
              this.serviceDialogs.error("Warning Message", "Could't edit progress !!!", this.viewContainerRef)
                .subscribe();
              return;
            }
          }

          detailInfoValue = Object.assign({}, Item.data);
          detailInfoValue.ReadOnly = detailInfoValue.ProgressDate <= this.currentDate;
          detailInfoValue.MaxQuantity = TotalQty + detailInfoValue.Quantity;
        } else { // Else New data
          let timeString: any = (new Date(this.currentDate.getTime())).toLocaleTimeString("th-TH", { hour12: false });
          // console.log("TotalQty", TotalQty);
          detailInfoValue = {
            ProgressId: 0,
            ProgressTaskMachineStatus: ProgressTaskMachineStatus.Use,
            ProgressDate: this.currentDate,
            ProgressDateTime: timeString,
            MaxQuantity: TotalQty
          };
        }

        this.serviceDialogs.dialogInfoProgressTaskMachine(this.viewContainerRef, detailInfoValue)
          .subscribe(progressTask => {
            if (progressTask) {
              if (this.indexItem > -1) {
                // remove item
                this.InfoValue.ProgressTaskMachines.splice(this.indexItem, 1);
              }
              progressTask.ProgressTaskMachineStatusString = ProgressTaskMachineStatus[progressTask.ProgressTaskMachineStatus];
              this.InfoValue.ProgressTaskMachines.push(Object.assign({}, progressTask));
              this.InfoValue.ProgressTaskMachines = this.InfoValue.ProgressTaskMachines.slice();
              // Update to form
              this.InfoValueForm.patchValue({
                ProgressTaskMachines: this.InfoValue.ProgressTaskMachines
              });
            }
          });
      }
      else if (Item.option === 0) // Remove
      {
        if (this.onlyProgress) {
          if (Item.data.ProgressId) {
            this.serviceDialogs.error("Warning Message", "Could't remove progress !!!", this.viewContainerRef)
              .subscribe();
            return;
          }
        }

        this.InfoValue.ProgressTaskMachines.splice(this.indexItem, 1);
        this.InfoValue.ProgressTaskMachines = this.InfoValue.ProgressTaskMachines.slice();
        // Update to form
        this.InfoValueForm.patchValue({
          ProgressTaskMachines: this.InfoValue.ProgressTaskMachines
        });
      }
    }
  }

  // On Get jobcardDetail
  OnGetJobCardDetail():void {
    this.serviceJobDetail.getJobcardMasterByDetail(this.InfoValue.JobCardDetailId)
      .subscribe(dbJobMaster => {
        this.jobMaster = Object.assign({}, dbJobMaster);
        this.scheduleMode.TypeMachineId = this.jobMaster.TypeMachineId;
        if (this.InfoValue.JobCardDetailId && this.jobMaster.JobCardDetails && this.jobMaster.JobCardDetails[0]) {
          this.InfoValueForm.patchValue({
            TotalQuantity: this.jobMaster.JobCardDetails[0].Quality,
            ReceiveBy: this.jobMaster.EmployeeRequireString,
          });

          if (!this.InfoValue.TaskMachineId) {
            this.InfoValueForm.patchValue({
              TaskDueDate: this.jobMaster.DueDate,
              Weight: this.jobMaster.Weight || 0,
            });
          }
        }
      });
  }

  // Open Dialog
  openDialog(type?: string): void {
    if (this.denySave) {
      return;
    }
    if (type) {
      if (type.indexOf("Employee") !== -1) {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef)
          .subscribe(emp => {
            if (emp) {
              this.InfoValueForm.patchValue({
                AssignedBy: emp.EmpCode,
                AssignedByString: `คุณ${emp.NameThai}`,
              });
            }
          });
      } else if (type.indexOf("StandardTime") !== -1) {
        const infoValue = this.InfoValueForm.getRawValue() as TaskMachine;
        if (!infoValue.Weight || infoValue.Weight < 1) {
          this.serviceDialogs.error("Warning Message", "Please specify weight befor select standard-time.", this.viewContainerRef);
          return;
        }

        let config: MatDialogConfig = new MatDialogConfig();
        config.viewContainerRef = this.viewContainerRef;
        config.data = 0;
        config.hasBackdrop = true;

        const dialogRef = this.dialog.open(StandardTimeDialogComponent, config);
        dialogRef.afterClosed().subscribe((standardTime: StandardTime) => {
          this.InfoValueForm.patchValue({
            StandardTimeId: standardTime ? standardTime.StandardTimeId : undefined,
            StandardTimeString: standardTime ? `${standardTime.StandardTimeCode} / ${standardTime.Description} / ${standardTime.StandardTimeValue} Kg/McH` : undefined,
          });

          if (standardTime) {
            this.standardTime = Object.assign({}, standardTime);
            this.setDate(infoValue, this.standardTime);
          }
        });
      } else if (type.indexOf("Machine") !== -1) {
        this.serviceDialogs.dialogSelectMachines(this.viewContainerRef, { mode: 0, TypeMachineId: this.jobMaster.TypeMachineId })
          .subscribe((machine: Machine) => {
            this.InfoValueForm.patchValue({
              MachineId: machine ? machine.MachineId : undefined,
              MachineString: machine ? `${machine.MachineCode}/${machine.MachineName}` : undefined,
            });
          });
      } else if (type.indexOf("JobCard") !== -1) {
        if (this.jobMaster && this.jobMaster.JobCardDetails[0]) {
          this.serviceDialogs.dialogSelectRequireMachine(this.jobMaster.JobCardDetails[0], this.viewContainerRef, false)
            .subscribe();
        }
      }
    }
  }

  //setDate
  setDate(infoValue:TaskMachine,standard:StandardTime): void {
    this.standardDay = this.calculateStandardTime(infoValue.Weight || 1, standard.StandardTimeValue || 1);
    this.InfoValueForm.patchValue({
      PlanManHours: this.standardDay.toFixed(2)
    });

    moment.locale('th-TH');
    let startDate = moment(infoValue.PlannedStartDate);
    let ManHrPerDay: number = 8 + (infoValue.HasOverTime || 0);
    this.totalDay = this.standardDay / ManHrPerDay;
    //debug here
    // Set Date
    let tempDate = startDate.add((this.standardDay / ManHrPerDay), 'days');
    let totalSun = this.sunDDay(startDate.toDate(), tempDate.toDate());
    // console.log(totalSun);
    if (totalSun > 0) {
      tempDate.add(totalSun,"day");
    }
    if (startDate) {
      this.InfoValueForm.patchValue({
        PlannedEndDate: tempDate
      });
      this.setStep(1);
    }
  }

  // Calculate Time
  calculateStandardTime(weight:number,kgPerHour:number): number {
    return (weight / kgPerHour);
  }

  //////////////
  // Override //
  //////////////

  // on valid data
  onFormValid(isValid: boolean): void {
    if (isValid && !this.denySave) {
      // get raw value for formcontrol is disable
      this.InfoValue = this.InfoValueForm.getRawValue() as TaskMachine;
      this.communicateService.toParent(this.InfoValue);
    }
  }
}


