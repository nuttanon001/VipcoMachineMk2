import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseTableComponent } from '../../shared/base-table.component';
import { MachineService } from '../shared/machine.service';
import { Machine } from '../shared/machine.model';
import { AuthService } from '../../core/auth/auth.service';
import { MatSelect } from '@angular/material';
import { TypeMachine } from '../shared/type-machine.model';
import { TypeMachineService } from '../shared/type-machine.service';
import {
  map, startWith,
  switchMap, catchError,
  debounceTime, debounce,
} from "rxjs/operators";
import { Subscription } from "rxjs";
import { Observable } from 'rxjs';
import { merge } from "rxjs/observable/merge";
import { of as observableOf } from "rxjs/observable/of";
import { Scroll } from '../../shared/scroll.model';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-machine-table',
  templateUrl: './machine-table.component.html',
  styleUrls: ['./machine-table.component.scss']
})
export class MachineTableComponent extends BaseTableComponent<Machine,MachineService> {
  constructor(
    service: MachineService,
    serviceAuth: AuthService,
    protected serviceTypeMachine:TypeMachineService
  ) {
    super(service, serviceAuth);
    this.displayedColumns = ["select", "MachineCode", "MachineName", "TypeMachineString","MachineStatus"];
  }

  @ViewChild(MatSelect) selectMachineType: MatSelect;
  machineTypes: Array<TypeMachine>;
  selected: number;

  ngOnInit(): void {
    if (!this.machineTypes) {
      this.machineTypes = new Array;
      this.serviceTypeMachine.getAll()
        .subscribe(dbData => {
          if (dbData) {
            this.machineTypes = dbData.slice();
          }
        });
    }

    if (!this.isDialog) {
      if (this.displayedColumns.indexOf("Command") === -1) {
        this.displayedColumns.push("Command");
      }
    }

    this.searchBox.onlyCreate2 = this.isOnlyCreate;
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.searchBox.search.subscribe(() => this.paginator.pageIndex = 0);
    this.selectMachineType.selectionChange.subscribe(() => { this.paginator.pageIndex = 0});
    // Merge
    //, this.searchBox.search, this.searchBox.onlyCreate

    this.subscribe = merge(
      this.sort.sortChange, this.paginator.page,
      this.searchBox.search, this.searchBox.onlyCreate,
      this.selectMachineType.selectionChange
    );

    this.subscribe.pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        let scroll: Scroll = {
          Skip: this.paginator.pageIndex * this.paginator.pageSize,
          Take: this.paginator.pageSize || 10,
          Filter: this.searchBox.search2,
          SortField: this.sort.active,
          SortOrder: this.sort.direction === "desc" ? 1 : -1,
          Where: this.searchBox.onlyCreate2 ? this.authService.getAuth.UserName || "" : "",
          WhereId: this.selected
        };
        return this.service.getAllWithScroll(scroll, this.isSubAction);
      }),
      map(data => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.resultsLength = data.Scroll.TotalRow;
        return data.Data;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        // Catch if the GitHub API has reached its rate limit. Return empty data.
        return observableOf([]);
      })
    ).subscribe(data => this.dataSource.data = data);

    // Selection
    this.selection = new SelectionModel<Machine>(this.isMultiple, [], true)
    this.selection.onChange.subscribe(selected => {
      if (this.isMultiple) {
        if (selected.source) {
          // this.selectedRow = selected.source.selected[0];
          this.returnSelectesd.emit(selected.source.selected);
        }
      } else {
        if (selected.source.selected[0]) {
          this.selectedRow = selected.source.selected[0];
          this.returnSelected.emit(selected.source.selected[0]);
        }
      }
    });
  }
}
