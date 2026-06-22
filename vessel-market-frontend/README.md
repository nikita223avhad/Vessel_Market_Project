# Vessel Market Performance Frontend

React frontend for the FastAPI Vessel Market API.

## Tech stack

- Vite, React, TypeScript
- React Router for navigation and protected routes
- TanStack Query for API caching and loading/error states
- Axios for the FastAPI client
- React Hook Form and Zod for forms and validation
- CSS variables with responsive layouts

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` if the backend runs somewhere other than `http://localhost:8000/api/v1`.

## Backend assumptions

- Login uses FastAPI OAuth2 form data at `POST /auth/login`, with `username` carrying the user's email.
- Register accepts `{ username, email, password, role }`.
- Users with role `admin` can create market data and reports and can view users.
- Logged-in users can create vessels and view reports.
- Vessels and market data lists are public in the provided backend.
