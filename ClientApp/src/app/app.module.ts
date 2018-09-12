// Angular Core
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Component
import { AppComponent } from './core/app/app.component';
import { HomeComponent } from "./core/home/home.component";
import { NavMenuComponent } from "./core/nav-menu/nav-menu.component";
import { DialogsModule } from "./dialogs/dialog.module";
import { CustomMaterialModule } from "./shared/customer-material.module";
import { LoginComponent } from "./users/login/login.component";
import { RegisterComponent } from "./users/register/register.component";
import { AuthGuard } from "./core/auth/auth-guard.service";
import { AuthService } from "./core/auth/auth.service";
import { MessageService } from "./shared/message.service";
import { HttpErrorHandler } from "./shared/http-error-handler.service";
import { MyDataTableComponent } from './resueable/my-data-table.component';
import { ShareService } from "./shared/share.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavMenuComponent,
    LoginComponent,
    RegisterComponent,
    MyDataTableComponent
  ],
  imports: [
    // Angular Core
    HttpModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    // Modules
    DialogsModule,
    CustomMaterialModule,
    // Router
    RouterModule.forRoot([
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomeComponent },
      { path: "login", component: LoginComponent },
      { path: "register/:condition", component: RegisterComponent },
      { path: "register", component: RegisterComponent },
      {
        path: "employee",
        loadChildren: "./employees/employee.module#EmployeeModule",
        canActivate: [AuthGuard]
      },
      {
        path: "project",
        loadChildren: "./projects/project.module#ProjectModule",
        canActivate: [AuthGuard]
      },
      {
        path: "machine",
        loadChildren: "./machines/machine.module#MachineModule",
        canActivate: [AuthGuard]
      },
      {
        path: "jobcard",
        loadChildren: "./jobcard-masters/jobcard-master.module#JobcardMasterModule",
        canActivate: [AuthGuard]
      },
      {
        path: "cutting-plan",
        loadChildren: "./cutting-plans/cutting-plan.module#CuttingPlanModule",
        canActivate: [AuthGuard]
      },
      {
        path: "standard-time",
        loadChildren: "./standard-times/standard-time.module#StandardTimeModule",
        canActivate: [AuthGuard]
      },
      {
        path: "task-machine",
        loadChildren: "./task-machines/task-machine.module#TaskMachineModule",
      },
      {
        path: "notask-machine",
        loadChildren: "./no-task-machines/no-task-machine.module#NoTaskMachineModule",
        canActivate: [AuthGuard]
      },
      { path: "**", redirectTo: "home" },
    ]),
  ],
  providers: [
    AuthGuard,
    AuthService,
    ShareService,
    MessageService,
    HttpErrorHandler
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
