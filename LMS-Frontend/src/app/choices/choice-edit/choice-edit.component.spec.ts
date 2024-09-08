import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceEditComponent } from './choice-edit.component';

describe('ChoiceEditComponent', () => {
  let component: ChoiceEditComponent;
  let fixture: ComponentFixture<ChoiceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiceEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
