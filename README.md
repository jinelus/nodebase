# Nodebase

Nodebase is a workflow automation platform built as a monorepo. It lets users create and manage workflows, credentials, and executions through a modern React application.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database](#database)
- [Production Build](#production-build)
- [Demo](#demo)

## Overview

This repository is organized with Turborepo + pnpm workspaces and currently contains:

- **apps/front-end**: Main web application (TanStack Start + React).
- **packages/typescript-config**: Shared TypeScript configuration package.

Core product areas include:

- Workflow management
- Credential management
- Execution history
- Authentication and protected routes
- Subscription and billing integration

## Tech Stack

### Monorepo & Tooling

- **Turborepo** for task orchestration
- **pnpm workspaces** for package management
- **TypeScript**
- **Biome** + **Prettier**

### Frontend

- **React 19**
- **TanStack Start** + **TanStack Router**
- **TanStack Query**
- **Tailwind CSS v4**
- **Radix UI** components

### Backend & Services

- **PostgreSQL**
- **Drizzle ORM** + **drizzle-kit**
- **Better Auth**
- **Pusher** (realtime)
- **Trigger.dev** (background jobs)
- **Sentry** (monitoring)
- **Polar** (subscriptions/billing)

### AI Integrations

Integrated through `ai` and provider SDKs:

- OpenAI
- Anthropic
- Google
- xAI
- DeepSeek

## Monorepo Structure

```text
.
├─ apps/
│  └─ front-end/              # Main app
│     ├─ src/
│     ├─ drizzle/
│     └─ package.json
├─ packages/
│  └─ typescript-config/      # Shared TS config
├─ docker-compose.yml         # Local PostgreSQL
├─ turbo.json                 # Turborepo pipeline
└─ pnpm-workspace.yaml        # Workspace packages
```

## Getting Started

### 1) Prerequisites

- **Node.js** `>= 18`
- **pnpm** `9.x`
- **Docker** (optional but recommended for local PostgreSQL)

### 2) Clone repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd nodebase-01
```

### 3) Install dependencies

```bash
pnpm install
```

### 4) Configure environment

Create a `.env` file in the repository root (same level as `turbo.json`).

At minimum, configure the required values used by the app:

```env
DATABASE_URL=
POLAR_PRODUCT_ID=
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
```

Optional values (depending on enabled features):

```env
BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
POLAR_ACCESS_TOKEN=
POLAR_SUCCESS_URL=
POLAR_SERVER=sandbox
NGROK_URL=
ENCRYPTION_KEY=

GOOGLE_GENERATIVE_AI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
XAI_API_KEY=
DEEPSEEK_API_KEY=

VITE_BETTER_AUTH_URL=
VITE_NGROK_URL=
VITE_PUSHER_KEY=
VITE_PUSHER_CLUSTER=
```

### 5) Start PostgreSQL (recommended)

```bash
docker compose up -d
```

### 6) Run database migrations

```bash
pnpm --filter front-end db:migrate
```

Optional (seed sample data):

```bash
pnpm --filter front-end db:seed
```

### 7) Start development server

From the monorepo root:

```bash
pnpm dev
```

The front-end app runs on:

- `http://localhost:3000`

## Environment Variables

The app loads environment variables from the root `.env` file using:

- `apps/front-end` script: `pnpm env:load ...`
- Internal env validation via `src/utils/env.ts`

If startup fails, verify all required keys above are present and valid.

## Available Scripts

### Root scripts

```bash
pnpm dev          # Run all dev tasks via Turbo
pnpm build        # Build all packages/apps
pnpm lint         # Lint/check via Turbo
pnpm check-types  # Type-check via Turbo
pnpm format       # Prettier formatting
```

### Front-end scripts

```bash
pnpm --filter front-end dev
pnpm --filter front-end build
pnpm --filter front-end test

pnpm --filter front-end db:generate
pnpm --filter front-end db:migrate
pnpm --filter front-end db:push
pnpm --filter front-end db:seed
pnpm --filter front-end db:studio
```

## Database

Local PostgreSQL service is defined in `docker-compose.yml`:

- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `docker`
- Database: `nodebase`

Use these values to compose your local `DATABASE_URL`, for example:

```env
DATABASE_URL=postgres://postgres:docker@localhost:5432/nodebase
```

## Production Build

Build the monorepo:

```bash
pnpm build
```

Build only front-end:

```bash
pnpm --filter front-end build
```

Preview the built app:

```bash
pnpm --filter front-end preview
```

## Demo

Add your demo assets here:

### Screenshots
<img width="1905" height="869" alt="Captura de tela 2026-02-20 233818" src="https://github.com/user-attachments/assets/5a0e2876-69c7-446d-820a-63c35618f6d9" />

<img width="1910" height="861" alt="Captura de tela 2026-02-20 235027" src="https://github.com/user-attachments/assets/b08c9dce-6aff-4cb6-bd9e-c95ad1739435" />

<img width="1897" height="867" alt="Captura de tela 2026-02-21 000130" src="https://github.com/user-attachments/assets/a8e129d2-01ac-4be2-9d71-2a8bb0f6e707" />

### Video

[Watch demo video](https://your-video-link-here)

