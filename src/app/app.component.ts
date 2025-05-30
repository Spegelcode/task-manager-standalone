import { Component } from '@angular/core';
import { Task } from './task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgChartsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tasks: Task[] = [];
  newTaskTitle = '';

  // Filters
  searchText: string = '';
  statusFilter: string = 'all';

  // External todos
  externalTodos: any[] = [];

  newTaskDeadline: string = '';
  newTaskPriority: 'Low' | 'Medium' | 'High' = 'Medium';

  constructor(private router: Router, private http: HttpClient) {
    const saved = localStorage.getItem('tasks');
    this.tasks = saved ? JSON.parse(saved) : [];

    // Fetch external todos
    this.http.get<any>('https://dummyjson.com/todos').subscribe(data => {
      this.externalTodos = data.todos;
    });
  }

  get filteredTasks(): Task[] {
    return this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'completed' && task.completed) ||
        (this.statusFilter === 'incomplete' && !task.completed);
      return matchesSearch && matchesStatus;
    });
  }

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

  importTodo(todo: any) {
    const newTask: Task = {
      id: Date.now(),
      title: todo.todo,
      completed: todo.completed,
      priority: 'Medium' // default priority for imported tasks
    };
    this.tasks.push(newTask);
    this.saveTasks();
    this.updateChartData();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
    this.updateChartData();
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
    this.saveTasks();
    this.updateChartData();
  }

  goToTask(id: number) {
    this.router.navigate(['/task', id]);
  }

  getSubtaskProgress(task: Task): string {
    const subtasks = task.subtasks;
    if (!subtasks || subtasks.length === 0) return '';
    const done = subtasks.filter(st => st.completed).length;
    return `${done} of ${subtasks.length} done`;
  }

  isTaskCompleted(task: Task) {
    const subtasks = task.subtasks;
    return subtasks && subtasks.length > 0 && subtasks.every(st => st.completed);
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(
      task => this.isTaskCompleted(task) &&
              task.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get incompleteTasks(): Task[] {
    return this.tasks.filter(
      task => !this.isTaskCompleted(task) &&
              task.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onImportTodo(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const index = Number(target.value);
    const selectedTodo = this.externalTodos[index];
    if (selectedTodo) {
      this.importTodo(selectedTodo);
    }
  }

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

  ngOnInit() {
    this.updateChartData();
  }

  updateChartData() {
    // Update pie chart
    this.pieChartData.datasets[0].data = [
      this.completedTasks.length,
      this.incompleteTasks.length
    ];

    // Update bar chart
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

  startEditingTask(task: Task) {
    task.editing = true;
  }

  saveEditingTask(task: Task, newTitle: string, newDeadline?: string) {
    task.title = newTitle.trim();
    if (newDeadline) {
      task.deadline = newDeadline;
    }
    task.editing = false;
    this.saveTasks();
    this.updateChartData();
  }

  cancelTaskEdit(task: Task) {
    task.editing = false;
  }
}
