import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsStatusComponent } from './reports-status.component';

describe('ReportsStatusComponent', () => {
  let component: ReportsStatusComponent;
  let fixture: ComponentFixture<ReportsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
