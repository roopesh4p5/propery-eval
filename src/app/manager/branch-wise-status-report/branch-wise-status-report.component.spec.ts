import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchWiseStatusReportComponent } from './branch-wise-status-report.component';

describe('BranchWiseStatusReportComponent', () => {
  let component: BranchWiseStatusReportComponent;
  let fixture: ComponentFixture<BranchWiseStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchWiseStatusReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchWiseStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
