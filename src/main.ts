// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppShellComponent } from './app/app-shell.component';
import { AppComponent } from './app/app.component';
import { TaskDetailComponent } from './app/task-detail.component';

const routes = [
  { path: '', component: AppComponent },
  { path: 'task/:id', component: TaskDetailComponent }
];

bootstrapApplication(AppShellComponent, {
  providers: [provideRouter(routes)]
});
