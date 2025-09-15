import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitPendingEngineerWiseComponent } from './visit-pending-engineer-wise.component';

describe('VisitPendingEngineerWiseComponent', () => {
  let component: VisitPendingEngineerWiseComponent;
  let fixture: ComponentFixture<VisitPendingEngineerWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitPendingEngineerWiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitPendingEngineerWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
