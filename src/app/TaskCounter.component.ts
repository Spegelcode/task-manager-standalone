import { Component, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';
import { Task } from './task.model';

@Component({
  selector: 'app-task-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-counter">
      <span>📝 Tasks: {{ incompleteCount() }}</span>
    </div>
  `,
  styles: [`
    .task-counter {
      display: flex;
      gap: 1.5rem;
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #eebc7d;
      justify-content: center;
    }
  `]
})
export class TaskCounterComponent implements OnInit, OnDestroy {
  private tasksSignal = signal<Task[]>([]);
  private intervalId?: number;

  incompleteCount = computed(() => this.tasksSignal().filter(t => !t.completed).length);
  completedCount = computed(() => this.tasksSignal().filter(t => t.completed).length);

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    // Update every second (1000 ms)
    this.tasksSignal.set(this.taskService.getTasks());
    this.intervalId = window.setInterval(() => {
      this.tasksSignal.set(this.taskService.getTasks());
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}