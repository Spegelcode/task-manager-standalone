Projekthantering
Lista, skapa, redigera, ta bort projekt:
You have full CRUD for tasks (which act as "projects" in your app) in app.component.html and app.component.ts.
Sök och filtrering:
There is a search input for filtering tasks by title (searchText).
Uppgiftshantering
Visa uppgifter, markera som påbörjade/klara:
Tasks and their completion status are shown and can be toggled.
CRUD på uppgifter, prioritetsval, deadline:
You can add, edit, delete tasks, set priority and deadline.
Modeller & typsäkerhet
Interfaces/klasser för Task och User:
See task.model.ts.
Services & HTTP-anrop
TaskService med CRUD-metoder:
See task.service.ts.
You also fetch external todos via HTTP.
Routing & vyer
Routing till dashboard och tasks:
You use Angular routing (see goToTask() and router.navigate(['/task', id])).
Reactive Forms & validering
Formulär med validering:
Your forms use required and Angular's ngModel for validation.
Återanvändbara komponenter, direktiv & pipes
Generisk komponent:
You use a reusable chart component (chart.component.ts).
Custom direktiv:
difficulty-color.directive.ts for coloring by priority.
Custom pipe:
capitalize.pipe.ts for capitalizing text.