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
  styleUrls: ['./task-detail.component.scss'],
  template: `
    <div class="container">
      <h2>Task Details</h2>
      <div *ngIf="task">
        <p><strong>Title:</strong> {{ task.title }}</p>

        <h3>Subtasks</h3>
        <ul>
          <li *ngFor="let subtask of task.subtasks" style="margin-bottom: 1rem;">
            <!-- Editing mode -->
            <div *ngIf="subtask.editing; else viewMode">
              <input [(ngModel)]="subtask.title" placeholder="Edit title" />
              <textarea [(ngModel)]="subtask.description" placeholder="Edit description"></textarea>
              <button (click)="saveSubtaskEdit(subtask, subtask.title, subtask.description)">💾 Save</button>
              <button (click)="cancelSubtaskEdit(subtask)">❌ Cancel</button>
            </div>

            <!-- View mode -->
            <ng-template #viewMode>
              <div style="display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" [(ngModel)]="subtask.completed" (change)="save()" />
                <span [style.text-decoration]="subtask.completed ? 'line-through' : 'none'">
                  {{ subtask.title }} ({{ subtask.priority }})
                </span>
                <button (click)="startEditingSubtask(subtask)">✏️ Edit</button>
                <button (click)="deleteSubtask(subtask)">❌</button>
                <button (click)="subtask.showDescription = !subtask.showDescription" style="margin-left: auto;">
                  {{ subtask.showDescription ? 'Hide' : 'Show' }} Description
                </button>
              </div>
              <small style="margin-left: 2rem; color: gray;">
                Added on: {{ subtask.createdAt | date:'short' }}
              </small>
              <div *ngIf="subtask.showDescription" style="margin-left: 2rem; font-style: italic; color: #555;">
                {{ subtask.description || 'No description' }}
              </div>
            </ng-template>
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
          <input type="date" [(ngModel)]="newSubtaskDeadline" name="taskDeadline" />

          <label for="priority">Priority:</label>
          <select id="priority" [(ngModel)]="newSubtaskPriority" name="newSubtaskPriority" required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
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
  newSubtaskPriority: 'low' | 'medium' | 'high' = 'medium'; // ✅ New property
  newSubtaskDeadline: string = ''; // Optional: If you want to add deadlines to subtasks

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
      priority: this.newSubtaskPriority,  // ✅ Correct assignment
      deadline: this.newSubtaskDeadline || undefined, // Optional: Use task's deadline if needed
    };

    this.task.subtasks = this.task.subtasks || [];
    this.task.subtasks.push(newSubtask);
    this.giveSubTaskPriority(); // ✅ Optional: Sort after adding
    this.newSubtaskDeadline = ''; // Reset if you have a deadline input
    this.save();

    this.newSubtaskTitle = '';
    this.newSubtaskDescription = '';
    this.newSubtaskPriority = 'medium'; // Reset
  }

  deleteSubtask(subtask: Subtask) {
    if (!this.task) return;
    this.task.subtasks = this.task.subtasks?.filter(s => s.id !== subtask.id);
    this.save();
  }

  startEditingSubtask(subtask: Subtask) {
    subtask.editing = true;
  }

  saveSubtaskEdit(subtask: Subtask, newTitle: string, newDescription?: string) {
    subtask.title = newTitle.trim();
    if (newDescription !== undefined) {
      subtask.description = newDescription;
    }
    subtask.editing = false;
    this.save();
  }

  cancelSubtaskEdit(subtask: Subtask) {
    subtask.editing = false;
  }

  giveSubTaskPriority() {
    if (!this.task?.subtasks) return;

    const order: Record<'high' | 'medium' | 'low', number> = {
      high: 1,
      medium: 2,
      low: 3
    };

    this.task.subtasks.sort((a, b) => {
      return order[a.priority as 'high' | 'medium' | 'low'] - order[b.priority as 'high' | 'medium' | 'low'];
    });
  }
}
