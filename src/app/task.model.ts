export interface Subtask {
  id: number;
  title: string;
  description?: string; 
  completed: boolean;
  showDescription?: boolean; // toggle property for description visibility
  createdAt: string;
  editing?: boolean;
  priority: 'high' | 'medium' | 'low';
    deadline?: string; //

}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  deadline?: string; //
  subtasks?: Subtask[];
  editing?: boolean;
  createdAt?: string; // ISO date string
priority?: 'Low' | 'Medium' | 'High'; // Optional priority for tasks
}