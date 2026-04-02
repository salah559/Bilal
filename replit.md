# Quincaillerie Bilel - E-commerce Platform

## Overview

This is a full-stack e-commerce web application for "Quincaillerie Bilel," a hardware store specializing in tools, safety equipment, paint, and electrical supplies. The application features a modern dark industrial theme with a product catalog, category filtering, search functionality, and contact page. Built with React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **UI Components**: Shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for complex transitions and interactions
- **Build Tool**: Vite with React plugin

The frontend follows a pages-based structure with reusable components. Key pages include Home, Products (with filtering), ProductDetail, and Contact. Custom hooks abstract API interactions (`use-products.ts`).

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development Server**: Vite dev server integrated with Express for HMR support

The server handles API routes under `/api/*` and serves the static frontend in production. Database seeding occurs automatically when no products exist.

### Data Storage
- **Database**: PostgreSQL (connection via `DATABASE_URL` environment variable)
- **Schema**: Defined in `shared/schema.ts` using Drizzle's table definitions
  - `products`: id, name, description, price (cents), imageUrl, category, stock, isFeatured, specifications (JSONB)
  - `categories`: id, name, slug, imageUrl
- **Migrations**: Managed via Drizzle Kit (`drizzle-kit push`)

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database table definitions and Zod insert schemas
- `routes.ts`: API route definitions with input/output schemas for type safety

### Build Process
Custom build script (`script/build.ts`) that:
1. Builds frontend with Vite to `dist/public`
2. Bundles server with esbuild, inlining common dependencies to reduce cold start times
3. Outputs production server to `dist/index.cjs`

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, required via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage for PostgreSQL (available but sessions not currently implemented)

### UI/Frontend Libraries
- **Radix UI**: Full suite of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **Framer Motion**: Animation library for page transitions and micro-interactions
- **Embla Carousel**: Carousel/slider functionality
- **Lucide React**: Icon library
- **date-fns**: Date formatting utilities

### Form Handling
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Zod integration for form validation
- **Zod**: Schema validation throughout the application

### Development Tools
- **Vite**: Frontend build tool with HMR
- **Drizzle Kit**: Database migration and schema management
- **TypeScript**: Full type safety across the stack
- **Replit Plugins**: Development banner and cartographer for Replit environment