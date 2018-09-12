import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseTableComponent } from '../../shared/base-table.component';
import { StandardTime } from '../shared/standard-time.model';
import { StandardTimeService } from '../shared/standard-time.service';
import { AuthService } from '../../core/auth/auth.service';
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
import { TypeStandardTimeService } from '../shared/type-standard-time.service';
import { MatSelect } from '@angular/material';
import { TypeStandardTime } from '../shared/type-standard-time.model';

@Component({
  selector: 'app-standard-time-table',
  templateUrl: './standard-time-table.component.html',
  styleUrls: ['./standard-time-table.component.scss']
})
export class StandardTimeTableComponent extends BaseTableComponent<StandardTime,StandardTimeService>  {
  constructor(
    service: StandardTimeService,
    serviceAuth: AuthService,
    private serviceTypeStandard: TypeStandardTimeService
  ) {
    super(service, serviceAuth);
    this.displayedColumns = ["select", "StandardTimeCode", "Description", "StandardTimeValue"];
  }
  @ViewChild(MatSelect) select: MatSelect;
  standardTimeTypes: Array<TypeStandardTime>;

  ngOnInit(): void {
    if (!this.standardTimeTypes) {
      this.standardTimeTypes = new Array;
      this.serviceTypeStandard.getAll()
        .subscribe(dbData => {
          if (dbData) {
            this.standardTimeTypes = dbData.slice();
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
    this.select.selectionChange.subscribe(() => { this.paginator.pageIndex = 0 });
    // Merge
    //, this.searchBox.search, this.searchBox.onlyCreate

    this.subscribe = merge(
      this.sort.sortChange, this.paginator.page,
      this.searchBox.search, this.searchBox.onlyCreate,
      this.select.selectionChange
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
          WhereId: this.select.value
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
    this.selection = new SelectionModel<StandardTime>(this.isMultiple, [], true)
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
