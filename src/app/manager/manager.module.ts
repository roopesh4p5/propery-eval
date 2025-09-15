    import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartInitiationInfoComponent } from './start-initiation-info/start-initiation-info.component';

const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('./manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent) },

//   StartInitiationInfoComponent

  { path: 'bank-wise-status-count', loadComponent: () => import('./bank-wise-status-count/bank-wise-status-count.component').then(m => m.BankWiseStatusCountComponent) },
  { path: 'bank-wise-status-report', loadComponent: () => import('./bank-wise-status-report/bank-wise-status-report.component').then(m => m.BankWiseStatusReportComponent) },
  { path: 'branch-wise-status-report', loadComponent: () => import('./branch-wise-status-report/branch-wise-status-report.component').then(m => m.BranchWiseStatusReportComponent) },
  { path: 'monthly-reports', loadComponent: () => import('./monthly-reports/monthly-reports.component').then(m => m.MonthlyReportsComponent) },
  { path: 'report-status', loadComponent: () => import('./report-status/report-status.component').then(m => m.ReportStatusComponent) },
  { path: 'start-initiation-info', loadComponent: () => import('./start-initiation-info/start-initiation-info.component').then(m => m.StartInitiationInfoComponent) },
  { path: 'update-report-info', loadComponent: () => import('./update-report-info/update-report-info.component').then(m => m.UpdateReportInfoComponent) },
  { path: 'update-transaction-info', loadComponent: () => import('./update-transaction-info/update-transaction-info.component').then(m => m.UpdateTransactionInfoComponent) },
  { path: 'update-visit-info', loadComponent: () => import('./update-visit-info/update-visit-info.component').then(m => m.UpdateVisitInfoComponent) },
  { path: 'view-attachments', loadComponent: () => import('./view-attachments/view-attachments.component').then(m => m.ViewAttachmentsComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerModule {}
