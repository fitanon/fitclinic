# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm db:generate  # Generate Drizzle migrations after schema changes
pnpm deploy       # Deploy (uses bumpp for version bump)
```

## Architecture

This is a **Nuxt 4** habit tracking application using:
- **NuxtHub** for deployment and Cloudflare D1 database hosting
- **Drizzle ORM** with SQLite/D1 for data persistence
- **nuxt-auth-utils** for GitHub OAuth authentication
- **Pinia + @pinia/colada** for state management and async data fetching
- **Nuxt UI** for component library with dark/light mode support

### Directory Structure

- `app/` - Nuxt 4 app directory (components, pages, composables, layouts)
- `server/` - Server-side code (API routes, database schema, utilities)
- `assets/logos/` - Brand logo SVG assets

### Data Flow

1. **Authentication**: GitHub OAuth via `nuxt-auth-utils` (`server/api/auth/github.get.ts`)
2. **Database**: Drizzle ORM connects to NuxtHub's D1 via `hubDatabase()` in `server/utils/db.ts`
3. **API**: RESTful endpoints in `server/api/` for habits and users CRUD
4. **Client**: Composables in `app/composables/` manage state and business logic

### Database Schema

Two tables defined in `server/database/schema.ts`:
- `users` - GitHub user profiles (login, name, bio, avatarUrl)
- `habits` - Habit entries with `completeDays` JSON array tracking completion dates

### Key Composables

- `useHabits()` - Habit CRUD operations, streak tracking, completion rates
- `useHeatmap()` - Calendar heatmap visualization data
- `useConfetti()` - Celebration animations on habit completion
