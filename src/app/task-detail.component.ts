// src/app/task-detail.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, Subtask } from './task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
    styleUrls: ['./task-detail.component.scss'], // ← add this line
  template: `
    <div class="container">
      <h2>Task Details</h2>
      <div *ngIf="task">
        <p><strong>Title:</strong> {{ task.title }}</p>


        <h3>Subtasks</h3>
        <ul>
          <li *ngFor="let subtask of task.subtasks" style="margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <input type="checkbox" [(ngModel)]="subtask.completed" (change)="save()" />
              <span [style.text-decoration]="subtask.completed ? 'line-through' : 'none'">{{ subtask.title }}</span>
              <button (click)="deleteSubtask(subtask)">❌</button>
              <!-- Toggle description button -->
              <button (click)="subtask.showDescription = !subtask.showDescription" style="margin-left: auto;">
                {{ subtask.showDescription ? 'Hide' : 'Show' }} Description
              </button>
            </div>

            <small style="margin-left: 2rem; color: gray;">
  Added on: {{ subtask.createdAt | date:'short' }}
</small>



            <!-- Description, toggled -->
            <div *ngIf="subtask.showDescription" style="margin-left: 2rem; font-style: italic; color: #555;">
              {{ subtask.description || 'No description' }}
            </div>
          </li>
        </ul>

        <form (submit)="addSubtask(); $event.preventDefault()" style="margin-top: 1rem;">
          <input
            type="text"
            [(ngModel)]="newSubtaskTitle"
            name="newSubtaskTitle"
            placeholder="Subtask title"
            required
          />
          <textarea
            [(ngModel)]="newSubtaskDescription"
            name="newSubtaskDescription"
            placeholder="Subtask description"
          ></textarea>
          <button type="submit">Add Subtask</button>
        </form>
      </div>
      <button (click)="goBack()">Back</button>
    </div>
  `
})
export class TaskDetailComponent {
  task: Task | undefined;
  newSubtaskTitle = '';
  newSubtaskDescription = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const storedTasks = localStorage.getItem('tasks');
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
    this.task = tasks.find(t => t.id === id);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  save() {
    const storedTasks = localStorage.getItem('tasks');
    let tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
    const index = tasks.findIndex(t => t.id === this.task?.id);
    if (index !== -1 && this.task) {
      tasks[index] = this.task;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  addSubtask() {
    if (!this.task || !this.newSubtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: Date.now(),
      title: this.newSubtaskTitle.trim(),
      description: this.newSubtaskDescription.trim(),
      completed: false,
      showDescription: false,
      createdAt: new Date().toISOString(), 
    };

    this.task.subtasks = this.task.subtasks || [];
    this.task.subtasks.push(newSubtask);
    this.save();

    this.newSubtaskTitle = '';
    this.newSubtaskDescription = '';
  }

  deleteSubtask(subtask: Subtask) {
    if (!this.task) return;
    this.task.subtasks = this.task.subtasks?.filter(s => s.id !== subtask.id);
    this.save();
  }

  
}
