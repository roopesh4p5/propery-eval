import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouryaBranchReportComponent } from './mourya-branch-report.component';

describe('MouryaBranchReportComponent', () => {
  let component: MouryaBranchReportComponent;
  let fixture: ComponentFixture<MouryaBranchReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MouryaBranchReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MouryaBranchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
