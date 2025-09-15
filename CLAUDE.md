# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 19 property evaluation and advisory consultancy application using a modular architecture with standalone components. The app uses Angular CLI, Tailwind CSS for styling, and follows Angular's latest patterns with signal-based components and standalone architecture.

## Essential Commands

### Development
- `ng serve` - Start development server (runs on http://localhost:4200)
- `ng build` - Build for production (outputs to dist/propery-eval)
- `ng build --watch --configuration development` - Build in watch mode for development
- `ng test` - Run unit tests with Karma

### Code Generation
- `ng generate component component-name` - Generate new component
- `ng generate service service-name` - Generate new service
- `ng generate module module-name` - Generate new module
- `ng generate guard guard-name` - Generate new guard

## Architecture

### Module Structure
The application follows a feature-based module architecture:

- **Core Module** (`src/app/core/`) - Contains singleton services, guards, and interceptors
  - Services: API, Auth, Dashboard, Engineer, Report services
  - Guards: Auth and Admin guards
  - Interceptors: Auth and Error interceptors

- **Feature Modules**:
  - `auth/` - Authentication module with login/logout functionality
  - `dashboard/` - Main dashboard functionality
  - `admin/` - Administrative features
  - `layout/` - Layout components including MainLayoutComponent
  - `shared/` - Shared components and utilities
  - `profile/` - User profile management

### Routing
- Root route redirects to `/dashboard`
- Uses lazy loading for feature modules
- MainLayoutComponent wraps authenticated routes
- Separate auth routes outside main layout

### Styling
- **Tailwind CSS** for utility-first styling
- **SCSS** for component-specific styles
- Global styles in `src/styles.scss`
- Component styles use `.scss` extension as configured in angular.json

### Key Files
- `src/main.ts` - Application bootstrap with standalone components
- `src/app/app.config.ts` - Application configuration
- `src/app/app.routes.ts` - Main routing configuration
- `angular.json` - Angular CLI configuration with build/test settings
- `tailwind.config.js` - Tailwind CSS configuration

## Development Notes

### Authentication Flow
The application has both authentication and authorization:
- Auth guard protects authenticated routes
- Admin guard provides role-based access control
- Auth interceptor handles token management
- Error interceptor manages API error responses

### API Integration
- Centralized API service in core module
- Multiple specialized services for different domains (engineers, reports, banks, etc.)
- HTTP interceptors handle cross-cutting concerns

### Testing
- Unit tests use Jasmine and Karma
- Test configuration in `tsconfig.spec.json`
- Tests located alongside components following Angular conventions