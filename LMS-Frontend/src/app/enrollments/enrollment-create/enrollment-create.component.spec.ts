import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentCreateComponent } from './enrollment-create.component';

describe('EnrollmentCreateComponent', () => {
  let component: EnrollmentCreateComponent;
  let fixture: ComponentFixture<EnrollmentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
