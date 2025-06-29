# CoachUp

This repository contains a basic setup for a Next.js frontend and a NestJS backend.

## Development

### Requirements
The project targets the current Node.js LTS release. Make sure you have
Node.js **20** or newer installed together with `npm`.

### Install dependencies

Run `npm install` in the project root. NPM workspaces install the dependencies
for both the backend and frontend in a single step.

### Start the development servers

To run both applications in parallel execute:

```bash
npm run dev
```

This starts the NestJS backend in watch mode and the Next.js frontend with hot
reload enabled.

### Running only the backend

If you want to work on the server alone use:

```bash
npm --prefix backend run start:dev
```

For a production build run:

```bash
npm --prefix backend run build
npm --prefix backend run start:prod
```

## Environment variables
Copy `.env.example` to `.env` in the project root and provide the required
variables for Clerk and any other services.
