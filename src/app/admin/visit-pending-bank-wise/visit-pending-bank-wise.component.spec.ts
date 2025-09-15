import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitPendingBankWiseComponent } from './visit-pending-bank-wise.component';

describe('VisitPendingBankWiseComponent', () => {
  let component: VisitPendingBankWiseComponent;
  let fixture: ComponentFixture<VisitPendingBankWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitPendingBankWiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitPendingBankWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
