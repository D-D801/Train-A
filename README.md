# TrainA

## General

This platform is designed to manage train trips efficiently. It provides the following pages:
#### User pages:
- Registration page;
- Login page;
- User Profile page;
- Search page includes trip details;
- Order page;
#### Manager pages:
- Stations management
- Carriages/Cars management
- Route management including Ride management

## Goals

The primary goal of this project is to develop a platform for managing train trips, utilizing the tools and features provided by Angular, RxJS, and Taiga UI for efficient, responsive, and user-friendly functionality.

# Technology stack

## Frontend

- [Angular](https://angular.dev) - The core framework for building the application
- [Taiga UI](https://taiga-ui.dev/) - A UI component library for Angular, offering a wide range of customizable components to build a user-friendly interface
- [RxJS](https://angular.dev) - Library for reactive programming
- [TypeScript](https://www.typescriptlang.org/) - a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale
- [Jest](https://jestjs.io/) - testing framework
- [SASS(SCSS)](https://sass-lang.com/) - CSS pre-processor with additional features

## Backend

```
@planess/train-a-backend
```
Npm package that simulates backend functionality

## External libraries

- [Leaflet](https://www.npmjs.com/package/@types/leaflet) - Library for mobile-friendly interactive maps
- [Nominatim](https://nominatim.org/release-docs/develop/) - A tool to search OSM (OpenStreetMap) data by name and address and to generate synthetic addresses of OSM points (reverse geocoding)

## Additional instruments and technologies

- [Prettier](https://prettier.io/) - automatic code formatting to a single style
- [ESLint](https://eslint.org/)- a linter that provides a consistent code style
- [Husky](https://typicode.github.io/husky/) - tool that automatically lint commit messages, code, and run tests upon committing or pushing
- [Git](https://git-scm.com/) - version control system and project repository management
- [GitHub](https://pages.github.com/) - the complete developer platform to build, scale, and deliver secure software
- [VS Code](https://code.visualstudio.com/) - code editor

# Available scripts

- **start**: Serves the Angular application locally using `ng serve` at `http://localhost:4200/`.

- **build**: Compiles the Angular application using `ng build` to create a production-ready bundle in the `dist` folder.

- **watch**: Runs `ng build --watch --configuration development` to build the project in development mode and watch for changes.

- **test**: Executes tests with `jest --verbose`, providing detailed output of test results.

- **test:ci**: Runs tests in continuous integration mode using `jest` without verbose output.

- **test:coverage**: Runs tests using `jest --coverage` and generates a code coverage report.

- **test:watch**: Runs `jest --watch` to continuously watch and re-run tests when files change.

- **stylelint**: Lints all CSS and SCSS files in the `src` folder using `stylelint './src/**/*.{css,scss}'`.

- **stylelint:fix**: Automatically fixes style issues in CSS and SCSS files by running `stylelint './src/**/*.{css,scss}' --fix`.

- **lint**: Lints TypeScript and HTML files in the `src` folder using `eslint "./src/**/*.{ts,html}"`.

- **lint:fix**: Automatically fixes linting issues in TypeScript and HTML files using `eslint "./src/**/*.{ts,html}" --fix`.

- **format**: Formats the project files in the `src` folder using `prettier --write ./src` to ensure consistent code style.

- **format:check**: Verifies if the files in the `src` folder conform to Prettier's formatting rules using `prettier --check ./src`.

- **prepare**: Installs Husky by running `husky install` to set up Git hooks for enforcing development standards.

# Setup and Running ⚠️

What do you need to do to run our project locally?

1. Use node `20.x` or higher.
2. Install `Git` on your computer.
3. Install Code Editor of your choice.
4. Clone this repository to your local computer.
5. Install all dependencies using `npm ci`.
6. Finally run a development server: `npm start`