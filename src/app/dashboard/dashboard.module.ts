import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { DashboardRedirectGuard } from './dashboard-redirect.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [DashboardRedirectGuard],
    component: DashboardComponent // fallback, will redirect
  },
  {
    path: 'manager-dashboard',
    loadComponent: () => import('./manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent)
  },
  {
    path: 'manager/dashboard',
    loadComponent: () => import('./manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    DashboardComponent,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
