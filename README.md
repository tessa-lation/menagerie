# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Running the Site Locally

This project is built with **React + Vite**.

### 1. Install Node.js

Make sure you have Node.js installed:

```bash
node -v
npm -v
```

If those commands do not work, install Node.js from the official Node website.

### 2. Open the project folder

In Terminal, navigate into the project folder:

```bash
cd personal-site-high-art-collage
```

### 3. Install dependencies

Run:

```bash
npm install
```

This installs everything listed in `package.json`, including React, Vite, and GSAP.

### 4. Start the local development server

Run:

```bash
npm run dev
```

Vite will start the site locally and show a URL like:

```bash
http://localhost:5173/
```

Open that URL in your browser.

### 5. Stop the server

To stop the local server, go back to Terminal and press:

```bash
Control + C
```

## Useful Commands

```bash
npm run dev
```

Runs the site locally.

```bash
npm run build
```

Builds the production version of the site.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Checks the code for linting issues.
