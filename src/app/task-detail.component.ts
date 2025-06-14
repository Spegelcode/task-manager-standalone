// This component shows the details for a single task
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, Subtask } from './task.model';
import { FormsModule } from '@angular/forms';
import { TaskService } from './task.service';
import { User } from './task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./task-detail.component.scss'],
  template: `
    <!-- The template shows the details for the selected task -->
    <div class="container">
      <h2>Task Details</h2>
      <div *ngIf="task">
        <p><strong>Title:</strong> {{ task.title }}</p>

        <h3>Subtasks</h3>
        <ul>
          <li *ngFor="let subtask of task.subtasks" style="margin-bottom: 1rem;">
            <!-- Assign user to subtask -->
            <div>
              <select #userSelect (change)="assignUserToSubtask(subtask, userSelect.value)">
                <option value="" disabled selected>Assign user</option>
                <option *ngFor="let user of users" [value]="user.id">{{ user.name }}</option>
              </select>
              <span *ngIf="subtask.assignedUsers?.length">
                Assigned:
                <span *ngFor="let user of subtask.assignedUsers; let last = last">
                  {{ user.name }}
                  <button (click)="removeUserFromSubtask(subtask, user.id)">❌</button>
                  <span *ngIf="!last">, </span>
                  
                </span>
              </span>
            </div>
            <!-- Edit subtask mode -->
            <div *ngIf="subtask.editing; else viewMode">
              <input [(ngModel)]="subtask.title" placeholder="Edit title" />
              <textarea [(ngModel)]="subtask.description" placeholder="Edit description"></textarea>
              <button (click)="saveSubtaskEdit(subtask, subtask.title, subtask.description)">💾 Save</button>
              <button (click)="cancelSubtaskEdit(subtask)">❌ Cancel</button>
            </div>
            <!-- View subtask mode -->
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

        <!-- Form to add a new subtask -->
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
  // The current task being shown
  task: Task | undefined;
  // Fields for adding a new subtask
  newSubtaskTitle = '';
  newSubtaskDescription = '';
  newSubtaskPriority: 'low' | 'medium' | 'high' = 'medium'; // ✅ New property
  newSubtaskDeadline: string = ''; // Optional: If you want to add deadlines to subtasks
  // List of users
  users: User[] = [];

  // Get the task and users when the component loads
  constructor(private route: ActivatedRoute, private router: Router , private taskService: TaskService) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const storedTasks = localStorage.getItem('tasks');
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
    this.task = tasks.find(t => t.id === id);
    this.users = this.taskService.getUsers();
  } 

  // Go back to the main page
  goBack() {
    this.router.navigate(['/']);
  }

  // Save changes to the task
  save() {
    if (this.task) {
      this.taskService.updateTask(this.task);
    }
  }
  // Add a new subtask to the task
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

  // Delete a subtask from the task
  deleteSubtask(subtask: Subtask) {
    if (!this.task) return;
    this.task.subtasks = this.task.subtasks?.filter(s => s.id !== subtask.id);
    this.save();
  }

  // Start editing a subtask
  startEditingSubtask(subtask: Subtask) {
    subtask.editing = true;
  }

  // Save changes to a subtask after editing
  saveSubtaskEdit(subtask: Subtask, newTitle: string, newDescription?: string) {
    subtask.title = newTitle.trim();
    if (newDescription !== undefined) {
      subtask.description = newDescription;
    }
    subtask.editing = false;
    this.save();
  }

  // Cancel editing a subtask
  cancelSubtaskEdit(subtask: Subtask) {
    subtask.editing = false;
  }

  // Sort subtasks by priority
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

  // Assign a user to a subtask
  assignUserToSubtask(subtask: Subtask, userId: string) {
    if (!this.task) return;
    const user = this.users.find(u => u.id === +userId);
    if (!user) return;
    this.taskService.assignUserToSubtask(this.task.id, subtask.id, user);
    const storedTasks = localStorage.getItem('tasks');
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
    this.task = tasks.find(t => t.id === this.task?.id);

  }

  removeUserFromSubtask(subtask: Subtask, userId: number) {
    if (!this.task) return;
    this.taskService.removeUserFromSubtask(this.task.id, subtask.id, userId);
    const storedTasks = localStorage.getItem('tasks');
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
    this.task = tasks.find(t => t.id === this.task?.id);
  }
}
