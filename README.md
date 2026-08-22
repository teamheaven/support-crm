# SupportCRM

## Overview

SupportCRM is a focused customer-support ticketing application. It lets an agent create, find, update, and annotate customer tickets without introducing authentication, extra collections, or complex state management.

## Features

- Create tickets with client and server validation
- Automatically generated human-readable IDs (`TKT-001`)
- Ticket search, status filtering, details, status updates, and internal notes
- Live dashboard counts based on returned ticket data
- Responsive React interface with loading, empty, and error states

## Tech Stack

React, Vite, Tailwind CSS, React Router, Axios, Node.js, Express, Mongoose, and MongoDB.

## Architecture

The React client calls a small REST API through `client/src/services/ticketApi.js`. Express routes delegate to one ticket controller, which reads and writes the `Ticket` and `Note` Mongoose models. Keeping the API layer centralized makes UI components concerned only with display and form state.

## Project Structure

`client/` contains the UI; `server/` contains configuration, models, routes, controller, middleware, and server entry point.

## Environment Variables

Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, `PORT`, and `CLIENT_URL`. Create `client/.env` with `VITE_API_URL=http://localhost:5000/api` when the API is not running on the default local URL.

MongoDB has collections rather than tables. You only need to create a MongoDB deployment or run MongoDB locally: Mongoose creates the `tickets` and `notes` collections automatically when the first ticket or note is saved.

## Local Setup

Install Node.js 20+ and run MongoDB locally, or create a MongoDB Atlas database. From the project root run:

```bash
npm run install:all
```

## Running the Backend

```bash
cd server
npm run dev
```

The API will be at `http://localhost:5000`.

## Running the Frontend

In a second terminal:

```bash
cd client
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`).

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets?search=&status=` | List/search tickets |
| GET | `/api/tickets/:ticket_id` | Ticket and notes |
| PUT | `/api/tickets/:ticket_id` | Update status and/or add note |

## Database Design

`Ticket` holds customer and ticket details. `Note` stores internal notes connected by the human-readable `ticket_id`. Ticket IDs are indexed and MongoDB’s `_id` remains the primary document identity.

## Deployment

Deploy `client` to Vercel and `server` to Render. Configure `VITE_API_URL` with the deployed API URL, then set `CLIENT_URL` on Render to the Vercel URL and use a MongoDB Atlas `MONGODB_URI`.

## Future Improvements

Add agent identity/authentication and server-side pagination if the support queue grows.
