// This is the main component for the app
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
  // List of all tasks
  tasks: Task[] = [];
  // List of all users
  users: User[] = [];

  // Fields for adding a new task
  newTaskTitle = '';
  newTaskDeadline: string = '';
  newTaskPriority: 'Low' | 'Medium' | 'High' = 'Medium';
  newUserName: string = '';

  // Fields for filtering tasks
  searchText: string = '';
  statusFilter: string = 'all';

  // List of tasks from an external API
  externalTodos: any[] = [];

  // Data for the bar chart
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

  // Data for the pie chart
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

  // The constructor sets up the component and loads data
  constructor(
    private router: Router,
    private http: HttpClient,
    private taskService: TaskService
  ) {
    // Get tasks from an external API
    this.http.get<any>('https://dummyjson.com/todos').pipe(
      catchError(error => {
        // If there is an error, log it and use an empty list
        console.error('Failed to fetch external todos:', error);
        return of({ todos: [] });
      })
    ).subscribe(data => {
      this.externalTodos = data.todos;
    });

    // Update tasks and users when the route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.tasks = this.taskService.getTasks();
      this.users = this.taskService.getUsers();
      this.updateChartData();
    });
  }

  // This runs when the component is first loaded
  ngOnInit() {
    // Load tasks and users from storage
    this.tasks = this.taskService.getTasks();
    this.users = this.taskService.getUsers();
    this.updateChartData();
  }

  // Get all completed tasks
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

  // Get all incomplete tasks
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

  // Add a new task to the list
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

  // Add a task from the external API
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

  // Save the list of tasks to local storage
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Remove a task from the list
  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
    this.updateChartData();
  }

  // Mark a task as done or not done
  toggleTask(task: Task) {
    task.completed = !task.completed;
    this.saveTasks();
    this.updateChartData();
  }

  // Go to the detail page for a task
  goToTask(id: number) {
    this.router.navigate(['/task', id]);
  }

  // Show how many subtasks are done for a task
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

  // Save changes to a task after editing
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

  // Add a user to a task by name
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

  // Assign a user to a task by user id
  assignUserToTask(task: Task, userId: string) {
    const user = this.users.find(u => u.id === +userId);
    if (!user) return;
    this.taskService.assignUserToTask(task.id, user);
    this.tasks = this.taskService.getTasks();
  }

  // Remove a user from the user list
  deleteUser(userId: number) {
    this.taskService.deleteUser(userId);
    this.users = this.taskService.getUsers();
  }

  // Remove a user from a task
  removeUserFromTask(task: Task, userId: number) {
    this.taskService.removeUserFromTask(task.id, userId);
    this.tasks = this.taskService.getTasks();
  }

  // Update the data for the charts
  updateChartData() {
    // Update the pie chart for completed and incomplete tasks
    this.pieChartData.datasets[0].data = [
      this.completedTasks.length,
      this.incompleteTasks.length
    ];

    // Update the bar chart for task priorities
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

  // Import a todo from the dropdown menu
  onImportTodo(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const index = Number(target.value);
    const selectedTodo = this.externalTodos[index];
    if (selectedTodo) {
      this.importTodo(selectedTodo);
    }
  }
}