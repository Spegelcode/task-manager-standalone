import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TaskService } from './task.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Tests for the AppComponent
describe('AppComponent', () => {
  let component: AppComponent;
  let taskService: TaskService;

  // Set up the test environment before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [TaskService]
    }).compileComponents();
    taskService = TestBed.inject(TaskService);
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  // Test that the app is created
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Test that a user can be added
  it('should add a user', () => {
    component.newUserName = 'TestUser';
    component.addUser();
    expect(component.users.some(u => u.name === 'TestUser')).toBeTrue();
  });

  // Test that a task can be added
  it('should add a task', () => {
    component.newTaskTitle = 'Test Task';
    component.addTask();
    expect(component.tasks.some(t => t.title === 'Test Task')).toBeTrue();
  });
});