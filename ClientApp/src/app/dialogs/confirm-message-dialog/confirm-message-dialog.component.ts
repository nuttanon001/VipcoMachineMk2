import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-message-dialog',
  template: `
    <div>
        <h4 class="text-info">
        <i class="fa fa-x2 fa-meh-o" aria-hidden="true"></i>
            {{ title }}
        </h4>
    </div>
    <p>{{ message }}</p>
    <hr/>
    <mat-form-field>
      <input  [(ngModel)]="messageReturn" matInput
              placeholder="Specify message here.">
    </mat-form-field>
    <button type="button" mat-raised-button (click)="summitClick(true)" color="accent">Yes</button>
    <button type="button" mat-button (click)="dialogRef.close()" color="warn">No</button>
  `,
  styles: [`
      mat-form-field {
        width: 95%;
        min-height: 70px;
        margin: 5px;
      }
  `]
})

export class ConfirmMessageDialogComponent implements OnInit {

  public title: string;
  public message: string;
  public messageReturn: string;

  constructor(public dialogRef: MatDialogRef<ConfirmMessageDialogComponent>) {
  }

  summitClick(result: boolean): void {
    this.dialogRef.close({ result: result, message: this.messageReturn });
  }

  ngOnInit(): void { }
}
