import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MainLayoutComponent
  ],
  exports: [
    MainLayoutComponent
  ]
})
export class LayoutModule { }
