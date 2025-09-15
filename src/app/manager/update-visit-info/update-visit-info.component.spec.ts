import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVisitInfoComponent } from './update-visit-info.component';

describe('UpdateVisitInfoComponent', () => {
  let component: UpdateVisitInfoComponent;
  let fixture: ComponentFixture<UpdateVisitInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateVisitInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateVisitInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
