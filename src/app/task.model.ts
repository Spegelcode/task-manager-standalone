// This interface describes a subtask
export interface Subtask {
  id: number; // Unique id for the subtask
  title: string; // Title of the subtask
  description?: string; // Description of the subtask
  completed: boolean; // If the subtask is done
  showDescription?: boolean; // If the description should be shown
  createdAt: string; // When the subtask was created
  editing?: boolean; // If the subtask is being edited
  priority: 'high' | 'medium' | 'low'; // Priority of the subtask
  deadline?: string; // Deadline for the subtask
  assignedUsers?: User[]; // Users assigned to the subtask
}

// This interface describes a task
export interface Task {
  id: number; // Unique id for the task
  title: string; // Title of the task
  completed: boolean; // If the task is done
  deadline?: string; // Deadline for the task
  subtasks?: Subtask[]; // List of subtasks
  editing?: boolean; // If the task is being edited
  createdAt?: string; // When the task was created
  priority?: 'Low' | 'Medium' | 'High'; // Priority of the task
  assignedUsers?: User[]; // Users assigned to the task
}

// This interface describes a user
export interface User {
  id: number; // Unique id for the user
  name: string; // Name of the user
}