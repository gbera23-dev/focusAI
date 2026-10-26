# Development Guidelines

These guidelines apply to all development work in this repository.

## Architecture

- Use a feature-based project structure.
- Treat each feature as an independent package.
- Each feature package should contain separate `hooks`, `pages`, and `components` subpackages as needed.
- Use hooks, modals, overlays, pages, and other components according to the single responsibility principle.
- Prefer segregation of responsibilities and decomposition over making a feature work at the cost of spaghetti code.
- Keep `main.jsx` and `App.jsx` neat and focused on application composition. Feature-specific logic belongs in its feature package.

## Styling

- Every JSX file that needs styles must have a corresponding CSS file with the same base name.
- JSX files must import and use their corresponding CSS files.
- Keep all styling data in CSS files; do not leak styling definitions into JSX.

## Application Context

This repository contains a single-page focusing application that wraps Gemini through an API key. The API key will be provided during development.

The application supports two interaction modes:

- **Learn/Study mode**: AI should act primarily as a lecturer or programming companion, minimizing directly written solutions and code to preserve the user's learning experience.
- **Work mode**: AI can be used intensively for problem solving, debugging, debate, bug investigation, and implementation support.

The exact user-facing naming between “Learn” and “Study” mode can be finalized during implementation, but they represent the same learning-oriented mode.

Each mode will apply a prompt prefix that instructs the LLM how to respond. Mode-specific prompt definitions belong in `src/resources/prompts` and will be provided during development.

## LLM Request Architecture

- Keep the application as a single-page application.
- Route Gemini HTTP requests through the shared Axios wrapper at `src/shared/api/geminiApi.js`.
- The Axios wrapper should expose an asynchronous request that accepts a prompt, attaches it to the Gemini request, sends it, and returns the LLM response.
- Implement agentic session behavior in `src/shared/services/geminiService.js`.
- `geminiService.js` should call the LLM in a loop when needed and keep the current session context in RAM using a simple in-memory variable.
- The service must support clearing the current session context.
- The service must support changing or prefixing the active mode prompt when the user toggles between Learn/Study mode and Work mode.
- Keep API transport concerns in `geminiApi.js` and session, looping, context, and mode behavior in `geminiService.js`.
