import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressCreateComponent } from './progress-create.component';

describe('ProgressCreateComponent', () => {
  let component: ProgressCreateComponent;
  let fixture: ComponentFixture<ProgressCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
