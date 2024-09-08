import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressEditComponent } from './progress-edit.component';

describe('ProgressEditComponent', () => {
  let component: ProgressEditComponent;
  let fixture: ComponentFixture<ProgressEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
