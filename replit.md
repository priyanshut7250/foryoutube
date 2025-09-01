# YouTube Video Downloader

## Overview

This is a full-stack YouTube video downloader application built with React/TypeScript frontend and Node.js/Express backend. The application allows users to input YouTube URLs, preview video information, and download videos in various resolutions up to 720p.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query for server state, React Hook Form for form handling
- **Routing**: Wouter for client-side routing
- **Design System**: New York style Shadcn components with neutral base color scheme

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: Hot reloading with Vite integration in development mode
- **Build Process**: esbuild for production bundling
- **API Design**: RESTful endpoints with JSON responses

### Database & Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Migration Strategy**: Drizzle Kit for schema migrations stored in `/migrations`
- **Connection**: Neon Database serverless connection (@neondatabase/serverless)
- **In-Memory Fallback**: MemStorage class for development/testing without database

### Data Models
- **Users**: Basic user authentication with username/password
- **Download Requests**: Track video download requests with status tracking (pending, processing, completed, failed)
- **Video Information**: Structured data for YouTube video metadata (title, duration, views, thumbnail)

### External Dependencies

#### Core Video Processing
- **ytdl-core**: YouTube video information extraction and download functionality

#### UI and Styling
- **Shadcn/ui**: Complete UI component system built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography

#### Data and State Management
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definition
- **Drizzle Zod**: Integration between Drizzle ORM and Zod schemas

#### Development Tools
- **Vite**: Fast development server and build tool with HMR
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking across the entire application
- **Replit Integration**: Development environment integration with error overlay and cartographer

The application follows a traditional client-server architecture with clear separation of concerns, using modern web development practices including type safety, component composition, and reactive data management.