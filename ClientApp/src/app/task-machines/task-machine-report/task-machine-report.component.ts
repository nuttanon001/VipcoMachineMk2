import { Component, OnInit } from '@angular/core';
import { TaskMachineService } from '../shared/task-machine.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TypeMachineService } from '../../machines/shared/type-machine.service';
import { OptionChart } from '../shared/option-chart.model';
import { TypeMachine } from '../../machines/shared/type-machine.model';
import { DataChart } from '../shared/data-chart.model';

@Component({
  selector: 'app-task-machine-report',
  templateUrl: './task-machine-report.component.html',
  styleUrls: ['./task-machine-report.component.scss']
})
export class TaskMachineReportComponent implements OnInit {

  constructor(
    private service: TaskMachineService,
    private serviceTypeMachine:TypeMachineService,
    private fb: FormBuilder,
  ) { }
  //Parameter
  // model
  chart: OptionChart;
  // form
  reportForm: FormGroup;
  // chart
  chartLabel: Array<string>;
  chartData: Array<{ data: Array<any>, label: string, backgroundColor: string, borderColor: string }>;
  chartType: string = "";
  chartOption: any;
  xLabel: string = "xLabel";
  yLabel: string = "yLabel";
  uomChart: string = "";
  needReset: boolean = false;
  // array
  typeMachines: Array<TypeMachine>;
  chartMode: Array<{ label:string, mode:number, sub:string }>;

  ngOnInit() {
    if (!this.chartLabel) {
      this.chartLabel = new Array;
    }
    if (!this.chartData) {
      this.chartData = new Array;
    }
    this.chartType = "bar";

    if (!this.chartMode) {
      this.chartMode =  [
        { label: "Production per Month", mode: 1, sub: "TaskMachineChartDataProduct/" },
        { label: "Production per Month(Update)", mode: 5, sub: "TaskMachineChartDataProductWithProgress/" },
        { label: "Weight per Month", mode: 4, sub: "TaskMachineChartDataWeight/" },
        { label: "Performance Efficiency", mode: 2, sub: "TaskMachineChartDataWorkLoad/" },
        { label: "Performance Efficiency(Update)", mode: 6, sub: "TaskMachineChartDataWorkLoadWithProgress/" },
        { label: "Plan/Actual per Month", mode: 3, sub: "TaskMachineChartDataPlanAndActual/"},
      ];
    }

    this.buildForm();
    this.getTypeMachineArray();
  }

  // build form
  buildForm(): void {
    const toDay = new Date;
    this.chart = {
      EndDate: new Date(toDay.getFullYear(),toDay.getMonth()+1,0),
      StartDate: new Date(toDay.getFullYear(),toDay.getMonth()-1,1),
      ChartMode: 1,
    };

    this.reportForm = this.fb.group({
      TypeMachineId: [this.chart.TypeMachineId],
      StartDate: [this.chart.StartDate],
      EndDate: [this.chart.EndDate],
      MachineId: [this.chart.MachineId],
      ChartMode: [this.chart.ChartMode],
    });

    this.reportForm.valueChanges.debounceTime(500).subscribe((data: any) => this.onValueChanged(data));
    this.onValueChanged();
  }

  // on value change
  onValueChanged(data?: any): void {
    if (!this.reportForm) { return; }
    // get data
    this.onGetChartData();
  }

  // get chart data
  onGetChartData(): void {
    if (!this.reportForm) { return; }
    if (this.needReset) { return; }

    this.needReset = true;
    let option: OptionChart = this.reportForm.value;

    if (option.ChartMode === 1 || option.ChartMode === 5) {
      this.xLabel = "Quantity material";
      this.yLabel = "Machine name";
      this.uomChart = "pcs.";
    } else if (option.ChartMode === 2 || option.ChartMode === 3 || option.ChartMode === 6) {
      this.xLabel = "Percent performance";
      this.yLabel = "Machine name";
      this.uomChart = "%.";
    } else if (option.ChartMode === 4) {
      this.xLabel = "Weight";
      this.yLabel = "Machine name";
      this.uomChart = "ton.";
    }
    // debug here
    let SubAction: string = this.chartMode.filter(item => {
      if (item.mode == option.ChartMode) {
        return item;
      } 
    })[0].sub;

    this.service.postTaskMachineChartData(option, SubAction)
      .subscribe(ChartData => {
        if (ChartData) {
          this.chartLabel = [...ChartData.Labels];
          this.chartData = new Array;
          ChartData.Datas.forEach((item: any,index:number) => {
            if (item) {
              console.log(index);

              let random: number = 20 * index;
              let color: string = `rgba(${this.getRandomInt(255 - random)}, ${this.getRandomInt(200 - random)}, ${this.getRandomInt(150 - random)}, 1)`;
              let chartData: DataChart =
              {
                data: item.DataChart,
                label: item.Label,
                backgroundColor: color,
                borderColor: color,
                lable1:this.uomChart,
              };
              this.chartData.push(chartData);
            }
          });
        }
        this.needReset = false;
      }, error => {
        this.needReset = false;
        this.setChartData();
      });
  }

  // get type machine array
  getTypeMachineArray(): void {
    this.serviceTypeMachine.getAll()
      .subscribe((result:Array<TypeMachine>) => {
        if (result) {
          this.typeMachines = new Array;
          this.typeMachines = result.slice();
        }
      }, error => console.error(error));
  }

  // reset
  resetFilter(): void {
    this.chartLabel = new Array;
    this.chartData = new Array;
    this.buildForm();
    // this.onGetChartData();
  }

  // set chart data
  setChartData(): void {
    // remove old label
    this.chartLabel = new Array;
    this.chartData = new Array;
  }

  getRandomInt(max):string {
    return Math.floor(Math.random() * Math.floor(max)).toString();
  }
}
