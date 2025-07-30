# VideoGear Pro - Equipment Management System

## Overview

VideoGear Pro is a professional video equipment management system built with modern web technologies. The application provides real-time tracking, access control, and maintenance scheduling for video equipment in a professional environment. It features a React TypeScript frontend with shadcn/ui components and an Express.js backend with PostgreSQL database using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.
Language preference: Italian (interfaccia completamente tradotta in italiano)
Documentation: Richiesta guida completa per l'uso in italiano

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: express-session with PostgreSQL store
- **File Uploads**: Multer for handling equipment images

### Project Structure
The application follows a monorepo structure with clear separation:
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript schemas and types
- `migrations/` - Drizzle database migrations

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **Role-Based Access**: Admin and operator roles with different permissions
- **Security**: HTTP-only cookies, secure session handling

### Equipment Management
- **CRUD Operations**: Full equipment lifecycle management
- **Status Tracking**: Available, in-use, maintenance, damaged states
- **Search & Filter**: Category-based filtering and text search
- **Image Support**: Equipment photo uploads with validation

### Transaction System
- **Check-out/Check-in**: Equipment lending workflow
- **Digital Signatures**: Signature capture for equipment responsibility
- **Audit Trail**: Complete transaction history with user attribution
- **Real-time Updates**: Live status updates across the application

### Maintenance Scheduling
- **Preventive Maintenance**: Scheduled maintenance tracking
- **Status Management**: Scheduled, in-progress, completed, overdue states
- **Alert System**: Upcoming and overdue maintenance notifications
- **Equipment Integration**: Maintenance records linked to equipment

### Audit Logging
- **Comprehensive Tracking**: All system actions logged with user context
- **Data Integrity**: Before/after state capture for modifications
- **User Attribution**: Full user context for all logged actions

## Data Flow

### Database Schema
The system uses PostgreSQL with the following core entities:
- **Users**: Authentication and role management
- **Equipment**: Core asset tracking with status and metadata
- **Transactions**: Check-out/check-in records with signatures
- **Maintenance**: Scheduled and completed maintenance records
- **AuditLog**: Complete system activity tracking
- **Sessions**: Replit Auth session storage

### API Architecture
RESTful API design with the following patterns:
- `/api/auth/*` - Authentication endpoints
- `/api/equipment/*` - Equipment CRUD and search
- `/api/transactions/*` - Check-out/check-in operations
- `/api/maintenance/*` - Maintenance scheduling and tracking

### State Management
- **Server State**: TanStack Query for API data caching and synchronization
- **Client State**: React hooks for component-level state
- **Real-time Updates**: Periodic query refetching for live data

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection Pooling**: @neondatabase/serverless for efficient connections
- **WebSocket Support**: Real-time capabilities through Neon's WebSocket constructor

### UI Framework
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Consistent iconography throughout the application

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **ESBuild**: Production backend bundling
- **Drizzle Kit**: Database migration and introspection tools

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR for frontend
- **Backend Development**: tsx for TypeScript execution with file watching
- **Database Management**: Drizzle migrations for schema evolution

### Production Build
- **Frontend**: Static asset generation via Vite build
- **Backend**: ESBuild bundling for Node.js deployment
- **Asset Serving**: Express static file serving for production builds

### Environment Configuration
- **Database URL**: PostgreSQL connection string via environment variables
- **Session Security**: Cryptographic session secrets
- **Auth Configuration**: Replit OIDC integration settings
- **File Upload**: Configurable upload directories and size limits

The architecture prioritizes maintainability, security, and real-time capabilities while providing a professional-grade equipment management solution suitable for video production environments.