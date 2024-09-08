import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonListComponent } from './lesson-list.component';

describe('LessonListComponent', () => {
  let component: LessonListComponent;
  let fixture: ComponentFixture<LessonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
