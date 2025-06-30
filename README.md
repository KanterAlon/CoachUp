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
variables for Clerk and any other services. The Next.js configuration loads this
file automatically so you only need to maintain a single set of variables for
both the frontend and backend.

## Deployment on Vercel
Ensure all Clerk-related environment variables are configured in the Vercel dashboard. At minimum set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` along with the sign-in and sign-up URLs. Missing variables cause the middleware from `@clerk/nextjs` to fail with `MIDDLEWARE_INVOCATION_FAILED` errors.
