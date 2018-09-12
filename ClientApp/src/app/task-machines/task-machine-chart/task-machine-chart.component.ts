import { Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
import * as Chart from 'chart.js'
// import { ChartData, Point } from "chart.js";

@Component({
  selector: 'app-task-machine-chart',
  templateUrl: './task-machine-chart.component.html',
  styleUrls: ['./task-machine-chart.component.scss']
})
export class TaskMachineChartComponent implements OnInit,AfterViewInit,OnChanges {

  constructor() { }

  @Input() newChartLabel: Array<string>;
  @Input() newChartData: Array<{ data: Array<any>, label: string, backgroundColor: string, borderColor: string, lable1: string;}>;
  //
  @Input() xAxesLabel: string = "LabelX";
  @Input() yAxesLabel: string = "LabelY";
  @Input() uomChart: string = "";

  ngOnInit() {
  
  }

  canvas: any;
  ctx: any;

  // on input change
  ngOnChanges(): void {
    // debug
    // console.log(JSON.stringify(this.newChartData), JSON.stringify(this.newChartLabel));
    // this.newChartLabel && this.newChartData
    /*
    if (false) {
      this.canvas = document.getElementById('myChart');
      this.ctx = this.canvas.getContext('2d');

      let plugin = {
        afterDatasetsDraw: function (chart) {
          const ctx = chart.ctx;
          chart.data.datasets.forEach(function (dataset, i) {
            var meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
              meta.data.forEach(function (element, index) {
                // Draw the text in black, with the specified font
                ctx.fillStyle = 'rgb(0, 0, 0)';
                let fontSize = 16;
                // let fontStyle = 'normal';
                // let fontFamily = 'Helvetica Neue';
                // ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                // Just naively convert to string for now
                let dataString = dataset.data[index].toString();
                // Make sure alignment settings are correct
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                let padding = 5;
                let position = element.tooltipPosition();
                ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
              });
            }
          });
        }
      };

      let myChart = new Chart(this.ctx, {
        type: 'horizontalBar',
        plugins: [plugin, plugin],
        data: {
          labels: ["Machine CM", "Machine GM", "Machine LM", "Machine SM"],
          datasets: [{
            label: '# of Require-Qc',
            data: [8, 4, 7, 5],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(147, 48, 123, 1)'
            ],
            
            borderWidth: 1
          }]
        },
        options: {
          responsive: false,
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          },
          scales: {
            yAxes: [{
              ticks: {
                max: 20
              }
            }]
          },
        }
      });
    }
    */
  }

  ngAfterViewInit() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    let test = "test";

    let plugin = {
      afterDatasetsDraw: function (chart) {
        const ctx = chart.ctx;
        chart.data.datasets.forEach(function (dataset, i) {
          var meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index) {
              if (dataset.data[index]) {
                // Draw the text in black, with the specified font
                ctx.fillStyle = 'rgb(0, 0, 0)';
                let fontSize = 12;
                let fontStyle = 'normal';
                // let fontFamily = 'Helvetica Neue';
                ctx.font = Chart.helpers.fontString(fontSize, fontStyle);
                // Just naively convert to string for now

                let dataString = dataset.data[index].toFixed(1) + ` ${dataset.lable1}`;
                // Make sure alignment settings are correct
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                let padding = 25;
                let position = element.tooltipPosition();
                //ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                ctx.fillText(dataString, position.x + (fontSize / 2) + padding, position.y);
              }
            });
          }
        });
      }
    };

    let myChart = new Chart(this.ctx, {
      type: 'horizontalBar',
      plugins: [plugin, plugin],
      data: {
        labels: this.newChartLabel.slice(),
        datasets: this.newChartData.slice(),
      },
      options: {
        responsive: false,
        legend: {
          display: true,
          position: "right"
        },
        tooltips: {
          enabled:false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              labelString: this.xAxesLabel,
              display: true,
            }
          }],
          yAxes: [{
            scaleLabel: {
              labelString: this.yAxesLabel,
              display: true
            },
            ticks: {
              max: 20
            }
          }]
        },
      }
    });
  }
}
