# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AngularSoftBet** is an Angular 21 application using **standalone components** and **Server-Side Rendering (SSR)**. The project uses TypeScript 5.9, Vitest for testing, and Express.js for server-side rendering.

### Key Technologies
- Angular 21.0.0 (standalone component architecture)
- TypeScript 5.9.2
- Vitest 4.0.8 (test runner with jsdom)
- Express 5.1.0 (SSR server)
- SCSS (styling)
- Angular SSR with prerendering

## Common Development Commands

```bash
# Development
npm start                              # Start dev server (http://localhost:4200)
npm run watch                          # Build with watch mode

# Production
npm run build                          # Build for production (output: dist/)
npm run serve:ssr:AngularSoftBet      # Start SSR server (http://localhost:4000)

# Testing
npm test                               # Run unit tests with Vitest

# Code Quality
npm run lint                           # Run linter (if configured)
npx prettier --write .                 # Format code with Prettier
```

## Architecture & Structure

### Component Architecture: Standalone Components
- **No NgModules** - Uses standalone components exclusively
- All components must include `standalone: true` in their `@Component` decorator
- Dependencies are declared via `imports` array in component decorator
- Root bootstrap via `bootstrapApplication()` in `src/main.ts`

### Project Structure
```
src/
├── main.ts                 # Bootstrap entry point (client)
├── main.server.ts          # Bootstrap entry point (server)
├── server.ts               # Express server setup
├── index.html              # HTML template with <app-root> selector
├── styles.scss             # Global styles
└── app/
    ├── app.ts              # Root component (standalone)
    ├── app.html            # Root template
    ├── app.scss            # Root styles
    ├── app.config.ts       # Angular configuration (providers)
    ├── app.config.server.ts # Server-specific configuration
    ├── app.routes.ts       # Routing (currently empty)
    ├── app.routes.server.ts # SSR routes (all prerendered)
    └── components/         # Reusable components
        └── flag-card/      # Example component
            ├── flag-card.ts
            ├── flag-card.html
            ├── flag-card.scss
            └── flag-card.spec.ts
```

### Application Configuration
- **app.config.ts**: Provides core Angular providers (routing, hydration, error handling)
- **app.config.server.ts**: Extends app config with server-side providers
- **app.routes.ts**: Defines application routes (empty - router initialized but no routes defined)
- **app.routes.server.ts**: Configures SSR route rendering mode (all routes use prerender mode)

### Server-Side Rendering (SSR)
- **Strategy**: Prerendering - static HTML generation at build time
- **Server**: Express.js on port 4000
- **Entry**: `src/server.ts` (Express configuration)
- **Static Files**: Served from `dist/AngularSoftBet/browser/`
- **Client Hydration**: Event replay enabled for interactive features

## Component Development Guidelines

### Creating a New Standalone Component
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-component',
  standalone: true,           // REQUIRED for standalone architecture
  imports: [],                // Import dependencies here
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss',
})
export class MyComponent {}
```

### Naming Conventions
- **Selector prefix**: `app-` (e.g., `app-flag-card`)
- **File structure**: `component-name.ts`, `component-name.html`, `component-name.scss`, `component-name.spec.ts`
- **Class names**: PascalCase (e.g., `FlagCard`)
- **File names**: kebab-case (e.g., `flag-card.ts`)

### Importing Child Components
To use a child component, add it to the parent's `imports` array:
```typescript
import { MyComponent } from './my-component/my-component';

@Component({
  // ...
  imports: [MyComponent],  // Add child component here
})
export class ParentComponent {}
```

## Testing

### Framework
- **Test Runner**: Vitest with jsdom environment
- **Angular Testing Utilities**: TestBed from @angular/core/testing
- **Test Files**: Colocated with source files using `*.spec.ts` pattern

### Running Tests
```bash
npm test              # Run all tests
```

### Test Structure Example
```typescript
import { TestBed } from '@angular/core/testing';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MyComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
```

## Build Configuration

### TypeScript Settings (tsconfig.json)
- **Strict Mode**: Enabled (all strict checks)
- **Target**: ES2022
- **Module**: preserve (ESM)
- **Template Validation**: Enabled (strictTemplates: true)
- **Angular Compiler**: Strict checking enabled

### Angular Build (angular.json)
- **Default Style Format**: SCSS
- **Production Budget**: Initial bundle 500kB (warn) / 1MB (error)
- **Build Output**: `dist/AngularSoftBet/`
- **SSR Output**: `dist/AngularSoftBet/server/` (Node.js module)
- **Static Files**: From `public/` directory

### Prettier Formatting
- **Print Width**: 100 characters
- **Quotes**: Single quotes
- **HTML Parser**: Angular (for template files)

## Important Implementation Details

### Bootstrap Process
1. `main.ts` calls `bootstrapApplication(App, appConfig)`
2. `App` component is the root standalone component
3. `appConfig` provides all necessary providers (router, hydration, error handling)
4. No NgModule necessary - everything is standalone

### Rendering Strategy
- **Client**: Single Page Application (SPA) with client hydration
- **Server**: Prerender mode generates static HTML at build time
- **Route Handling**: All routes (/**) configured for prerendering
- **Hydration**: Event replay enabled to preserve user interactions during hydration

### Global Configuration
- **Global Styles**: `src/styles.scss` (included in all components)
- **Error Handlers**: `provideBrowserGlobalErrorListeners()` in appConfig
- **Router**: Lazy loading compatible via `loadComponent` and `loadChildren`
- **State Management**: No global state library configured (can add signals, RxJS, or NgRx if needed)

## Asset Handling

### Static Assets
- Located in `public/` directory
- Served at root level (e.g., `public/favicon.ico` → `/favicon.ico`)
- Build output: `dist/AngularSoftBet/browser/`

### Styling
- Use SCSS for component styles
- Import global styles in component if needed: `@import '../../styles.scss';`
- CSS-in-JS not used (relies on SCSS files)

## Common Issues & Solutions

### Component Not Recognized
**Error**: `'component-name' is not a known element`
**Solution**:
1. Ensure component has `standalone: true`
2. Add component to parent's `imports` array
3. Verify component is properly exported

### Module Not Found
- This is Angular 21 with standalone components - **no NgModules needed**
- All dependencies should be in `imports` array of the component decorator

### TypeScript Errors
- Enable strict mode errors in IDE
- Check `tsconfig.json` for strict compiler options
- Run build to catch compilation errors: `npm run build`

## Development Workflow

1. **Start Dev Server**: `npm start` (auto-reload on file changes)
2. **Create Components**: Use `app-` selector prefix, standalone architecture
3. **Add Styles**: Colocated SCSS files per component
4. **Write Tests**: Create `.spec.ts` files alongside components
5. **Run Tests**: `npm test` (watch mode)
6. **Build**: `npm run build` (production optimized)
7. **Test SSR**: `npm run serve:ssr:AngularSoftBet` (local server testing)

## VS Code Integration

### Recommended Extensions
- `angular.ng-template` - Angular template language support

### Debug Configurations
- **Debug ng serve**: Chrome debugging on http://localhost:4200/
- **Debug ng test**: Chrome debugging on http://localhost:9876/debug.html

## Related Files to Check
- `package.json` - Dependencies and scripts
- `angular.json` - Build and development configuration
- `tsconfig.json` - TypeScript compiler settings
- `.vscode/launch.json` - Debug configurations
- `.vscode/tasks.json` - Build tasks
