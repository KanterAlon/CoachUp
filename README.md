# CoachUp

This repository contains a basic setup for a Next.js frontend and a NestJS backend.

## Development

### Requirements
- Node.js 20+
- npm

### Install dependencies

Run `npm install` in both `frontend` and `backend` directories.

### Start the development servers

- **Backend**
  ```bash
  cd backend
  npm run start:dev
  ```
- **Frontend**
  ```bash
  cd frontend
  npm run dev
  ```

Both applications are independent but can be run in parallel.

## Environment variables
Create `.env` files in `backend` and `frontend` with the variables required by Prisma, Clerk, and other services.
