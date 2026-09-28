# AI Video Studio

Initial monorepo foundation for AI Video Studio. It contains a standalone Angular frontend and a NestJS API. The UI is intentionally limited to a prompt field, a non-functional **Generate Video** button, and a live backend health indicator.

## Prerequisites

- Node.js 20.19 or newer (Node.js 22 LTS recommended)
- npm 10 or newer

## Install dependencies

From the repository root:

```bash
npm install
```

## Run the backend

In one terminal, from the repository root:

```bash
npm run start:backend
```

The NestJS API listens on `http://localhost:3000`. Confirm it is running with:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{ "status": "ok" }
```

## Run the frontend

In a second terminal, from the repository root:

```bash
npm run start:frontend
```

Open `http://localhost:4200`. The home page calls `/api/health`; Angular's development server proxies that path to the local NestJS server.

## Build

Build both workspaces:

```bash
npm run build
```

Or build a workspace independently:

```bash
npm run build --workspace=frontend
npm run build --workspace=backend
```

## Structure

```text
frontend/  Angular application and presentation layer
backend/   NestJS HTTP API, organized by feature modules
```

The backend starts with a dedicated health feature module so future capabilities—authentication, provider orchestration, jobs, data, storage, media processing, and billing—can be added as isolated modules without coupling them to the HTTP bootstrap.
