import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(c => c.UsersComponent),
    canActivate: [AdminGuard]
  },

  {
    path: 'initiation-info',
    loadComponent: () => import('./initiation-info/initiation-info.component').then(c => c.InitiationInfoComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'manage-bank',
    loadComponent: () => import('./manage-bank/manage-bank.component').then(c => c.ManageBankComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'manage-branch',
    loadComponent: () => import('./manage-branch/manage-branch.component').then(c => c.ManageBranchComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'manage-bank-branch',
    loadComponent: () => import('./manage-bank-branch/manage-bank-branch.component').then(c => c.ManageBankBranchComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'branch-report',
    loadComponent: () => import('./branch-report/branch-report.component').then(c => c.BranchReportComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'monthly-reports',
    loadComponent: () => import('./monthly-reports/monthly-reports.component').then(c => c.MonthlyReportsComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'engineers',
    loadComponent: () => import('./engineers/engineers.component').then(c => c.EngineersComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'initiation-engineers',
    loadComponent: () => import('./initiation-engineers/initiation-engineers.component').then(c => c.InitiationEngineersComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'report-engineers',
    loadComponent: () => import('./report-engineers/report-engineers.component').then(c => c.ReportEngineersComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'attachments',
    loadComponent: () => import('./attachments/attachments.component').then(c => c.AttachmentsComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'branch-status-report',
    loadComponent: () => import('./branch-status-report/branch-status-report.component').then(c => c.BranchStatusReportComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'all-branch-report',
    loadComponent: () => import('./all-branch-report/all-branch-report.component').then(c => c.AllBranchReportComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'bank-wise-report',
    loadComponent: () => import('./bank-wise-report/bank-wise-report.component').then(c => c.BankWiseReportComponent),
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
