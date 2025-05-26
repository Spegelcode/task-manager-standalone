import { Component } from '@angular/core';
import { Task } from './task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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
      completed: false
    };
    this.tasks.push(newTask);
    this.newTaskTitle = '';
    this.saveTasks();
  }

  importTodo(todo: any) {
    const newTask: Task = {
      id: Date.now(),
      title: todo.todo,
      completed: todo.completed
    };
    this.tasks.push(newTask);
    this.saveTasks();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
    this.saveTasks();
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
  get CompletedTasks(): Task[] {
    return this.tasks.filter(task => this.isTaskCompleted(task));
  }
  get IncompleteTasks(): Task[] {
  return this.tasks.filter(task => !this.isTaskCompleted(task));
}


  onImportTodo(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const index = Number(target.value);
    const selectedTodo = this.externalTodos[index];
    if (selectedTodo) {
      this.importTodo(selectedTodo);
    }
  }
}
