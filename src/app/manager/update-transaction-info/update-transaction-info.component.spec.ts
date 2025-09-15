import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransactionInfoComponent } from './update-transaction-info.component';

describe('UpdateTransactionInfoComponent', () => {
  let component: UpdateTransactionInfoComponent;
  let fixture: ComponentFixture<UpdateTransactionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTransactionInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTransactionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
