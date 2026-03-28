# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FitClinic is a fitness and wellness management platform built with Node.js and Express. It is early-stage (v0.1.0) — currently a static landing page served by Express, with planned features for client management, workout planning, progress tracking, nutrition, scheduling, and analytics.

## Commands

- `npm install` — install dependencies
- `npm start` — run the server (`node server.js`), listens on `PORT` env var or 3000
- `npm run dev` — run with auto-restart on file changes (`node --watch server.js`)

No test framework, linter, or build step is configured yet.

## Architecture

- **server.js** — Express entry point. Serves static files from `public/` and defines routes.
- **public/** — Static assets. Currently contains `index.html` (landing page with inline CSS/JS).
- Single dependency: Express 4.x. No database, no auth, no build tooling.
