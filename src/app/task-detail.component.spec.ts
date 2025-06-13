import { TestBed } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail.component';
import { TaskService } from './task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

// Tests for the TaskDetailComponent
describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let taskService: TaskService;

  // Set up the test environment before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskDetailComponent],
      providers: [
        TaskService,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    });
    taskService = TestBed.inject(TaskService);
    const fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    // Setup a fake task for testing
    component.task = {
      id: 1,
      title: 'Test Task',
      completed: false,
      subtasks: []
    };
  });

  // Test that the component is created
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test that a subtask can be added
  it('should add a subtask', () => {
    component.newSubtaskTitle = 'Subtask 1';
    component.addSubtask();
    expect(component.task?.subtasks?.some(st => st.title === 'Subtask 1')).toBeTrue();
  });
});