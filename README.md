# CoachUp

This repository contains a basic setup for a Next.js frontend and a NestJS backend.

## Development

### Requirements
- Node.js 20+
- npm

### Install dependencies

Run `npm install` in the project root. NPM workspaces will install
the dependencies for both the backend and frontend.

### Start the development servers

To run both applications in parallel execute:

```bash
npm run dev
```

## Environment variables
Copy `.env.example` to `.env` in the project root and provide the required
variables for Clerk and any other services.
