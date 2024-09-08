import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceCreateComponent } from './choice-create.component';

describe('ChoiceCreateComponent', () => {
  let component: ChoiceCreateComponent;
  let fixture: ComponentFixture<ChoiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiceCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
