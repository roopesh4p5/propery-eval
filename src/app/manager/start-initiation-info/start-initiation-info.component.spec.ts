import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartInitiationInfoComponent } from './start-initiation-info.component';

describe('StartInitiationInfoComponent', () => {
  let component: StartInitiationInfoComponent;
  let fixture: ComponentFixture<StartInitiationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartInitiationInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartInitiationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
