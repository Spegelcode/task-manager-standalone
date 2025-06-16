import { Injectable } from '@angular/core';
import { Task, User } from './task.model';

// This service manages tasks and users
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // List of all tasks
  private tasks: Task[];
  // List of all users
  private users: User[] = [];



  // Load tasks and users from local storage when the service is created
  constructor() {
    const stored = localStorage.getItem('tasks');
    this.tasks = stored ? JSON.parse(stored) : [];


    const storedUsers = localStorage.getItem('users');
    this.users = storedUsers ? JSON.parse(storedUsers) : [];
  }


  // Save tasks and users to local storage
  private save() : void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('users', JSON.stringify(this.users));

  }

  // Add a new user to the user list
  addUser(name:string): void {
    const newUser: User = {
      id: Date.now(),
      name,
    };
    this.users.push(newUser);
    this.save();
  }


  // Get all users
  getUsers(): User[] {
    return this.users;
  }

  // Remove a user from the user list
  deleteUser(userId: number): void {
    this.users= this.users.filter(u => u.id !== userId);
    this.save();

  }


  // Get all tasks
  getTasks(): Task[] {
    // Always fetch the latest from localStorage to avoid stale data
    const stored = localStorage.getItem('tasks');
    this.tasks = stored ? JSON.parse(stored) : [];
    return this.tasks;
  }


  // Assign a user to a task
  assignUserToTask(taskId: number, user: User): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.assignedUsers = task.assignedUsers || [];

    const alreadyAssigned = task.assignedUsers.find(u => u.id === user.id);
    if (!alreadyAssigned) {
      task.assignedUsers.push(user);
      this.save();
    }
  }


  // Assign a user to a subtask (only if user is assigned to the parent task)
  assignUserToSubtask(taskId: number, subtaskId: number, user: User): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    // Only allow if user is assigned to the parent task
    const allowed = task.assignedUsers?.some(u => u.id === user.id);
    if (!allowed) return;

    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (!subtask) return;

    subtask.assignedUsers = subtask.assignedUsers || [];

    const alreadyAssigned = subtask.assignedUsers.find(u => u.id === user.id);
    if (!alreadyAssigned) {
      subtask.assignedUsers.push(user);
      this.save();
    }
  }


  // Remove a user from a subtask
  removeUserFromSubtask(taskID: number, subtaskId: number, userId: number): void {
    const task = this.tasks.find(t => t.id === taskID);
    if (!task?.subtasks) return;

    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (!subtask || !subtask.assignedUsers) return;


    subtask.assignedUsers = subtask.assignedUsers.filter((u: User) => u.id !== userId);
    this.save();
  }

  // Remove a user from a task
  removeUserFromTask(taskId: number, userId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task?.assignedUsers) return;

    task.assignedUsers = task.assignedUsers.filter((u: User) => u.id !== userId);
    this.save();
  }

  // Update a task in the list
  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.save();
    }
  }
}