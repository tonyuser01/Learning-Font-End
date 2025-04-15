# Learning-Font-End- Online Learning Platform - Capstone Project

## Overview
This repository contains the Capstone project , focused on **learning and practicing front-end web development**. The goal is to build a modern online learning platform built with HTML, SCSS/CSS, and TypeScript/JavaScript. This project demonstrates front-end development skills without relying on external frameworks.

## Prerequisites

*   Node.js and npm (Node Package Manager) installed.
*   Git installed (optional, for version control).

## Setup and Installation

1.  Clone the repository (if you haven't already):
    ```bash
    git clone https://github.com/tonyuser01/Learning-Font-End.git
    cd capstone-project-template
    ```
2.  Install project dependencies:
    ```bash
    npm install
    ```
    (This command reads `package.json` and installs all dependencies listed, including Sass).

## Running the Project

1.  **Compile SCSS to CSS:**
    *   To compile once:
        ```bash
        npm run compile:sass
        ```
    *   To automatically recompile when SCSS files change during development:
        ```bash
        npm run watch:sass
        ```
    This will generate the necessary CSS files in the `src/css` folder based on the styles written in `src/scss`.

2.  **Open the HTML file:**
    Open the `html/index.html` file in your web browser to view the application.

## Project Structure
```
/
├── src/                   # Source files
│   ├── html/             # All HTML files
│   │   ├── index.html
│   │   ├── gallery.html
│   │   ├── web-development.html
│   │   ├── data-science.html
│   │   ├── design.html
│   │   ├── marketing.html
│   │   └── contacts.html
│   ├── scss/             # SCSS source files
│   │   └── style.scss
│   ├── css/              # Compiled CSS
│   │   └── style.css
│   ├── ts/               # TypeScript source files
│   │   ├── script.ts
│   │   ├── gallery.ts
│   │   ├── contacts.ts
│   │   ├── profile.ts
│   │   ├── web-development.ts
│   │   ├── data-science.ts
│   │   ├── design.ts
│   │   └── marketing.ts
│   ├── js/               # Compiled JavaScript
│   ├── data/             # JSON data files
│   │   └── courses.json
│   └── images/           # Image assets
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Additional Scripts
- TypeScript compilation: `npm run compile:ts`
- Watch TypeScript: `npm run watch:ts`
- Build project: `npm run build`
- Linting: `npm run lint`

## Author
Davidescu Andrei Cristian