# ✨ AI Video Studio

### From creative prompts to cinematic possibilities.

AI Video Studio is a monorepo foundation for exploring **AI-powered video creation**. It includes an Angular frontend and a NestJS API, ready to grow into a creative space for transforming ideas into visual stories.

> **Imagine it. Prompt it. Create with AI.**

## 🎬 The experience today

The frontend currently includes:

- A prompt field for entering a video idea
- A **Generate Video** button
- A live indicator for backend health

The backend currently provides a health-check endpoint. Video generation and other AI capabilities are future possibilities—not implemented features.

## 🧠 AI concepts & skills

The project is designed to grow around ideas such as:

- **Generative AI** and **text-to-video**
- **Prompt engineering** and creative direction
- **Multimodal AI** for combining text, images, and motion
- **AI workflow orchestration** and asynchronous jobs
- **Media processing** and video asset management

## 🛠️ Tech stack

- **Angular** — frontend application
- **NestJS** — backend API
- **TypeScript** — across the application
- **npm workspaces** — monorepo dependency and script management

## ✅ Prerequisites

- Node.js 20.19 or newer (Node.js 22 LTS recommended)
- npm 10 or newer

## 🚀 Get started

Install dependencies from the repository root:

```bash
npm install
```

Start the backend in one terminal:

```bash
npm run start:backend
```

The API listens on `http://localhost:3000`. Check its health:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{ "status": "ok" }
```

Start the frontend in a second terminal:

```bash
npm run start:frontend
```

Open `http://localhost:4200`. During development, Angular proxies `/api` requests to the local NestJS server.

## 🏗️ Build

Build both workspaces:

```bash
npm run build
```

Or build each workspace independently:

```bash
npm run build --workspace=frontend
npm run build --workspace=backend
```

## 📁 Project structure

```text
frontend/  Angular application and presentation layer
backend/   NestJS HTTP API, organized by feature modules
```

The backend begins with a dedicated health feature module. Future features—such as authentication, AI provider orchestration, jobs, storage, media processing, and billing—can be added as isolated modules.

---

**Big ideas deserve a great first frame.** 🎥