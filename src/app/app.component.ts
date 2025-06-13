import { Component, OnInit } from '@angular/core';
import { Task, User } from './task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { TaskService } from './task.service';
import { catchError, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { CapitalizePipe } from './capitalize.pipe';
import { ChartComponent } from './shared/chart/chart.component';
import { DifficultyColorDirective } from './difficulty-color.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule,
    CapitalizePipe,
    ChartComponent,
    DifficultyColorDirective
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Task and user data
  tasks: Task[] = [];
  users: User[] = [];

  // Form fields
  newTaskTitle = '';
  newTaskDeadline: string = '';
  newTaskPriority: 'Low' | 'Medium' | 'High' = 'Medium';
  newUserName: string = '';

  // Filters
  searchText: string = '';
  statusFilter: string = 'all';

  // External todos
  externalTodos: any[] = [];

  // Chart data
  public barChartLabels: string[] = ['Low', 'Medium', 'High'];
  public barChartData: ChartData<'bar', number[], string> = {
    labels: this.barChartLabels,
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [0, 0, 0],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336']
      }
    ]
  };
  public barChartType: ChartType = 'bar';

  public pieChartLabels: string[] = ['Completed', 'Incomplete'];
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [0, 0]
      }
    ]
  };
  public pieChartType: ChartType = 'pie';

  constructor(
    private router: Router,
    private http: HttpClient,
    private taskService: TaskService
  ) {
    // Fetch external todos with error handling
    this.http.get<any>('https://dummyjson.com/todos').pipe(
      catchError(error => {
        console.error('Failed to fetch external todos:', error);
        return of({ todos: [] });
      })
    ).subscribe(data => {
      this.externalTodos = data.todos;
    });

    // Refresh tasks/users/charts on every navigation event
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.tasks = this.taskService.getTasks();
      this.users = this.taskService.getUsers();
      this.updateChartData();
    });
  }

  ngOnInit() {
    // Initial load of tasks and users
    this.tasks = this.taskService.getTasks();
    this.users = this.taskService.getUsers();
    this.updateChartData();
  }

  // Filtered lists for template
  get completedTasks(): Task[] {
    return this.tasks.filter(
      task =>
        (
          (task.subtasks && task.subtasks.length > 0 && task.subtasks.every(st => st.completed)) ||
          ((!task.subtasks || task.subtasks.length === 0) && task.completed)
        ) &&
        task.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get incompleteTasks(): Task[] {
    return this.tasks.filter(
      task =>
        (
          (task.subtasks && task.subtasks.length > 0 && !task.subtasks.every(st => st.completed)) ||
          ((!task.subtasks || task.subtasks.length === 0) && !task.completed)
        ) &&
        task.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Add a new task
  addTask() {
    if (!this.newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      title: this.newTaskTitle.trim(),
      completed: false,
      deadline: this.newTaskDeadline || undefined,
      createdAt: new Date().toISOString(),
      priority: this.newTaskPriority || 'Medium'
    };
    this.tasks.push(newTask);
    this.newTaskTitle = '';
    this.newTaskDeadline = '';
    this.newTaskPriority = 'Medium';
    this.saveTasks();
    this.updateChartData();
  }

  // Import a todo from external API
  importTodo(todo: any) {
    const newTask: Task = {
      id: Date.now(),
      title: todo.todo,
      completed: todo.completed,
      priority: 'Medium'
    };
    this.tasks.push(newTask);
    this.saveTasks();
    this.updateChartData();
  }

  // Save tasks to localStorage
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Delete a task
  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
    this.updateChartData();
  }

  // Toggle task completion
  toggleTask(task: Task) {
    task.completed = !task.completed;
    this.saveTasks();
    this.updateChartData();
  }

  // Go to task detail view
  goToTask(id: number) {
    this.router.navigate(['/task', id]);
  }

  // Subtask progress string
  getSubtaskProgress(task: Task): string {
    const subtasks = task.subtasks;
    if (!subtasks || subtasks.length === 0) return '';
    const done = subtasks.filter(st => st.completed).length;
    return `${done} of ${subtasks.length} done`;
  }

  // Start editing a task
  startEditingTask(task: Task) {
    task.editing = true;
  }

  // Save edited task
  saveEditingTask(task: Task, newTitle: string, newDeadline?: string) {
    task.title = newTitle.trim();
    if (newDeadline) {
      task.deadline = newDeadline;
    }
    task.editing = false;
    this.saveTasks();
    this.updateChartData();
  }

  // Cancel editing a task
  cancelTaskEdit(task: Task) {
    task.editing = false;
  }

  // Add a user to a task (by name)
  addUserToTask(task: Task, userName: string) {
    if (!userName.trim()) return;
    const newUser: User = {
      id: Date.now(),
      name: userName.trim()
    };
    if (!task.assignedUsers) {
      task.assignedUsers = [];
    }
    const alreadyExists = task.assignedUsers.some(u => u.name === newUser.name);
    if (!alreadyExists) {
      task.assignedUsers.push(newUser);
      this.saveTasks();
    }
    this.newUserName = '';
  }

  // Add a user to the user list
  addUser() {
    if (!this.newUserName.trim()) return;
    this.taskService.addUser(this.newUserName.trim());
    this.users = this.taskService.getUsers();
    this.newUserName = '';
  }

  // Assign a user to a task by userId
  assignUserToTask(task: Task, userId: string) {
    const user = this.users.find(u => u.id === +userId);
    if (!user) return;
    this.taskService.assignUserToTask(task.id, user);
    this.tasks = this.taskService.getTasks();
  }

  // Delete a user from the user list
  deleteUser(userId: number) {
    this.taskService.deleteUser(userId);
    this.users = this.taskService.getUsers();
  }

  // Update chart data for both charts
  updateChartData() {
    // Pie chart: completed vs incomplete
    this.pieChartData.datasets[0].data = [
      this.completedTasks.length,
      this.incompleteTasks.length
    ];

    // Bar chart: tasks by priority
    const priorityCount = { Low: 0, Medium: 0, High: 0 };
    for (const task of this.tasks) {
      if (task.priority && priorityCount.hasOwnProperty(task.priority)) {
        priorityCount[task.priority]++;
      }
    }
    this.barChartData.datasets[0].data = [
      priorityCount.Low,
      priorityCount.Medium,
      priorityCount.High
    ];
  }

  // Handle importing a todo from the dropdown
  onImportTodo(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const index = Number(target.value);
    const selectedTodo = this.externalTodos[index];
    if (selectedTodo) {
      this.importTodo(selectedTodo);
    }
  }
}