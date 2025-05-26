export interface Subtask {
  id: number;
  title: string;
  description?: string; 
  completed: boolean;
  showDescription?: boolean; // toggle property for description visibility
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  deadline?: string; // e.g. '2024-05-23'
  subtasks?: Subtask[];
}