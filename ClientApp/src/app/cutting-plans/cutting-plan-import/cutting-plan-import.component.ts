import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CuttingPlanImport } from '../shared/cutting-plan-import.model';
import { CuttingPlanService } from '../shared/cutting-plan.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { AuthService } from '../../core/auth/auth.service';
import { MessageService } from '../../shared/message.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-cutting-plan-import',
  templateUrl: './cutting-plan-import.component.html',
  styleUrls: ['./cutting-plan-import.component.scss']
})
export class CuttingPlanImportComponent implements OnInit {

  constructor(
    private service: CuttingPlanService,
    private serviceMessage: MessageService,
    private serviceAuth: AuthService,
    private serviceDialogs: DialogsService,
    private viewContainerRef:ViewContainerRef
  ) { }
  // Parameter
  @ViewChild("inputFile") inputFile: any;
  // textCsv: Array<any>;
  // Table
  displayedColumns: Array<string>;
  resultsLength: number;
  dataSource = new MatTableDataSource<CuttingPlanImport>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // Import
  textHeader: Array<string>;
  importDatas: Array<CuttingPlanImport>;
  checkCutting: any;
  isLoadingResults: boolean;
  isImport: boolean = false;
  // on init
  ngOnInit() {
    this.textHeader = new Array;
    this.importDatas = new Array;
    // Display Colmun
    this.displayedColumns = ["JobNo", "Level23", "CuttingPlan", "MaterialSize", "MaterialGrade", "Quantity"];
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.isLoadingResults = false;
  }
  // on file change
  onFileChange(event: any): void {
    this.isLoadingResults = true;
    let file: any = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    let pattern: any = /vnd.ms-excel/;
    if (!file.type.match(pattern)) {
      this.inputFile.nativeElement.value = "";
      this.serviceDialogs.error("ไม่เข้าเงื่อนไข", "ระบบบันทึกเฉพาะไฟล์ \"CSV.\" เท่านั้น !!!", this.viewContainerRef);
      return;
    } else {
      // fileReader
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = (e) => {
        this.extractData(reader.result);
      };
      // reader.onload = function (event_) {
      //    var csv = event_.target.result; // Content of CSV file
      //    this.extractData(csv); //Here you can call the above function.
      // };
    }
  }
  // extract Data
  // input csv data to the function
  extractData(data: any): void {
    let allTextLines: any = data.split(/\r\n|\n/);
    let headers: Array<string> = allTextLines[0].split(",");
    // trim
    headers.forEach((value) => {
      value = value.trim();
    });
    this.textHeader = headers.slice();
    // debug here
    // console.log("Header: ", this.textHeader);
    // all text line
    let lines: Array<CuttingPlanImport> = new Array;
    // for loop string
    // skip row 0 is header
    for (let i: number = 1; i < allTextLines.length; i++) {
      // split content based on comma
      let data: any = allTextLines[i].split(",");
      // console.log("Data: ", data);
      if (data.length === headers.length) {
        // let line = [];
        let row: CuttingPlanImport = {};
        for (let j: number = 0; j < headers.length; j++) {
          // line.push(data[j].trim());

          if (headers[j].toLowerCase().includes("jobnumber")) {
            row.JobNo = data[j].trim();
          } else if (headers[j].toLowerCase().includes("namelevel")) {
            row.Level23 = data[j].trim();
          } else if (headers[j].toLowerCase().includes("cuttingplan")) {
            row.CuttingPlan = data[j].trim();
          } else if (headers[j].toLowerCase().includes("materialsize")) {
            row.MaterialSize = data[j].trim();
          } else if (headers[j].toLowerCase().includes("materialgrade")) {
            row.MaterialGrade = data[j].trim();
          } else if (headers[j].toLowerCase().includes("quantity")) {
            row.Quantity = data[j].trim();
          }
        }
        lines.push(row);
      }
    }

    // this.textCsv = lines.slice(); //The data in the form of 2 dimensional array.
    if (lines.length) {
      this.importDatas = lines.slice();
    } else {
      this.serviceDialogs.error("ไม่พบข้อมูล",
        "ระบบตรวจไม่พบข้อมูลเพื่อนำเข้าระบบ โปรดตรวจสอบไฟล์แล้วทำการลองใหม่ !!!", this.viewContainerRef);
      this.importDatas = new Array;
    }
    this.resultsLength = this.importDatas.length || 0;
    this.dataSource.data = this.importDatas;
    //debug here
    // console.log(JSON.stringify(this.dataSource.data));
    this.isLoadingResults = false;
  }
  // on down load csvfile
  onOpenDownLoadFormatFile(link: string): void {
    if (link) {
      window.open(link, "_blank");
    }
  }
  // clear Data
  onClearData(): void {
    // this.textCsv = new Array;
    this.textHeader = new Array;
    this.importDatas = new Array;
    if (this.inputFile) {
      this.inputFile.nativeElement.value = "";
    }
    // Table Parameter
    this.dataSource.data = this.importDatas;
    this.resultsLength = 0;
  }
  // onSubmit
  onSubmit(): void {
    if (!this.serviceAuth.getAuth) {
      this.serviceDialogs.error("Error Message", "Please login to system.", this.viewContainerRef)
        .subscribe();
      return;
    }

    if (this.isImport) {
      return;
    }

    if (this.importDatas.length) {
      this.isImport = true;
      this.service.postImportCsv(this.importDatas, this.serviceAuth.getAuth.UserName)
        .subscribe(result => {
          // check cutting plan
          this.onCheckCuttingPlan();
          // clear data
          this.inputFile.nativeElement.value = "";
          this.onClearData();
        }, error => {
          this.serviceDialogs
            .error("Error Message", "ตรวจพบข้อผิดพลาด ในการนำเข้าข้อมูล โปรดตรวจสอบข้อมูล.", this.viewContainerRef);
          this.isImport = false;
        }, () => this.isImport = false);
    }
  }
  // on Check CuttingPlan
  onCheckCuttingPlan(): void {
    this.service.getCreateJobFromCuttingPlan()
      .subscribe(result => {
        // console.log(JSON.stringify(result));
        if (result.Message) {
          this.serviceMessage.add("Cutting-Plan Did not has Machine/Require.");
          result.Message.forEach(item => {
            this.serviceMessage.add(item);
          });
        }
      }, error => {
        this.serviceDialogs
          .context("Import Complate", "System import complate.", this.viewContainerRef);
      });
  }
}
