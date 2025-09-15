import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankWiseStatusCountComponent } from './bank-wise-status-count.component';

describe('BankWiseStatusCountComponent', () => {
  let component: BankWiseStatusCountComponent;
  let fixture: ComponentFixture<BankWiseStatusCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankWiseStatusCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankWiseStatusCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
