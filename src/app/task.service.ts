import { Injectable } from '@angular/core';
import { Task, Subtask, User } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[];
  private users: User[] = [];



  constructor() {
    const stored = localStorage.getItem('tasks');
    this.tasks = stored ? JSON.parse(stored) : [];


    const storedUsers = localStorage.getItem('users');
    this.users = storedUsers ? JSON.parse(storedUsers) : [];
  }


  private save() : void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('users', JSON.stringify(this.users));

  }

  addUser(name:string): void {
    const newUser: User = {
      id: Date.now(),
      name,
    };
    this.users.push(newUser);
    this.save();
  }


getUsers(): User[] {
  return this.users;
}

deleteUser(userId: number): void {
  this.users= this.users.filter(u => u.id !== userId);
this.save();

}


getTasks(): Task[] {
    return this.tasks;
  }


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


assignUserToSubtask(taskId: number, subtaskId: number, user: User): void {
  const task = this.tasks.find(t => t.id === taskId);
  if (!task || !task.subtasks) return;

  // ✅ Make sure user is assigned to the parent task
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


  removeUserFromSubtask(taskID: number, subtaskId: number, userId: number): void {
    const task = this.tasks.find(t => t.id === taskID);
    if (!task?.subtasks) return;

    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (!subtask || !subtask.assignedUsers) return;


    subtask.assignedUsers = subtask.assignedUsers.filter((u: User) => u.id !== userId);
    this.save();
  }
removeUserFromTask(taskId: number, userId: number): void {
  const task = this.tasks.find(t => t.id === taskId);
  if (!task?.assignedUsers) return;

  task.assignedUsers = task.assignedUsers.filter((u: User) => u.id !== userId);
  this.save();
}
updateTask(updatedTask: Task): void {
  const index = this.tasks.findIndex(t => t.id === updatedTask.id);
  if (index !== -1) {
    this.tasks[index] = updatedTask;
    this.save();
  }
}


}