# Task Manager Standalone

Task Manager Standalone is a simple and modern web application for managing tasks, subtasks, and users. It is built with Angular and uses local storage for persistence, so you can use it without any backend or signup.

## Features

- Create, edit, and delete tasks
- Add deadlines and priorities to tasks
- Organize tasks with subtasks
- Mark tasks and subtasks as complete or incomplete
- Assign users to tasks and subtasks
- Visualize your progress and priorities with charts
- Import example tasks from an external API
- All data is stored locally in your browser

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Spegelcode/task-manager-standalone.git
   cd task-manager-standalone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
ng serve
```
Open your browser and go to [http://localhost:4200/](http://localhost:4200/).

### Building for Production

To build the app for production:
```bash
ng build
```
The output will be in the `dist/` folder.

### Running Unit Tests

To run unit tests:
```bash
ng test
```

### Running End-to-End Tests

To run end-to-end tests:
```bash
ng e2e
```
Note: You may need to set up an e2e framework.

## Project Structure

- `src/app/` - Main application code (components, services, models, styles)
- `src/assets/` - Static assets
- `src/environments/` - Environment configuration

## Customization

You can easily extend this project by adding new features, changing styles, or connecting to a backend.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Built with [Angular](https://angular.io/)
- Charts powered by [ng2-charts](https://valor-software.com/ng2-charts/)
- External example tasks from [dummyjson.com](https://dummyjson.com/)

---

## Angular CLI Reference

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.11.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

### Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
