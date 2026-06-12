---
name: vite-optimization
description: Vite bundler best practices, dev server configuration, and build optimization.
---

# Vite Optimization

## 1. Principles
- **Fast Dev Server**: Leverage Vite's native ES modules for instant server start and fast HMR (Hot Module Replacement).
- **Optimized Builds**: Use Rollup under the hood for highly optimized production builds.

## 2. Configuration
- Keep `vite.config.js` clean and organized.
- Use plugins like `@vitejs/plugin-react` for React support.
- Configure path aliases (e.g., `@/` to `src/`) for cleaner imports.

## 3. Performance
- Code split by routes or large dependencies using dynamic `import()`.
- Optimize assets (images, fonts) by placing them in the `public/` directory or importing them properly to leverage Vite's asset handling.
- Use environment variables (`.env`) for different environments (development, production).
