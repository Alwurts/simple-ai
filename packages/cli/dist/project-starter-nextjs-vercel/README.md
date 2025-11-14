# Simple Next.js + Hono + Better Auth Starter

A simple starter project demonstrating end-to-end type safety with Next.js, HonoJS RPC, query handling, and Better Auth integration.

## Features

- **End-to-End Type Safety**: Full TypeScript integration between frontend and backend
- **HonoJS RPC**: Efficient API routing with RPC pattern
- **Query Handling**: Integrated query management for data fetching
- **Better Auth**: Secure authentication system
- **Todo App**: Example CRUD operations with todos
- **Database**: Drizzle ORM with SQLite (easily configurable)

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: HonoJS with RPC
- **Auth**: Better Auth
- **Database**: Drizzle ORM, SQLite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and configure your variables.

3. **Run database migrations**:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

- Visit `/signup` to create an account
- Visit `/login` to sign in
- Access protected routes after authentication
- Manage todos in the protected area

## Project Structure

- `src/app/` - Next.js app router pages
- `src/hono/` - HonoJS backend routes
- `src/db/` - Database schema and services
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and configurations

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database schema
- `npm run db:migrate` - Run database migrations
- `npm run lint` - Run linter

## Contributing

This is a simple starter project. Feel free to fork and customize for your needs.
