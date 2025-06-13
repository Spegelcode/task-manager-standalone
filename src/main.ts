// This is the main entry point for the app
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppShellComponent } from './app/app-shell.component';
import { AppComponent } from './app/app.component';
import { TaskDetailComponent } from './app/task-detail.component';

// Define the routes for the app
const routes = [
  { path: '', component: AppComponent }, // Main page
  { path: 'task/:id', component: TaskDetailComponent } // Task detail page
];

// Start the Angular app with the shell component and routes
bootstrapApplication(AppShellComponent, {
  providers: [provideRouter(routes)]
});
