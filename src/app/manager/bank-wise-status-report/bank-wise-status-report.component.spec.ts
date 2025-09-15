import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankWiseStatusReportComponent } from './bank-wise-status-report.component';

describe('BankWiseStatusReportComponent', () => {
  let component: BankWiseStatusReportComponent;
  let fixture: ComponentFixture<BankWiseStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankWiseStatusReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankWiseStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
