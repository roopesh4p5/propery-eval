import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReportInfoComponent } from './update-report-info.component';

describe('UpdateReportInfoComponent', () => {
  let component: UpdateReportInfoComponent;
  let fixture: ComponentFixture<UpdateReportInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateReportInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateReportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
