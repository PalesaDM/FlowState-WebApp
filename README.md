# FlowState

FlowState is an AI-assisted urban daily planning web application designed to help users organise events, saved locations, routes, travel time, and personal planning preferences in one connected system.

The application combines calendar information, route data, profile preferences, travel buffers, and rule-based planning logic to generate contextual daily guidance such as suggested leave times, workload summaries, schedule-gap advice, and travel recommendations.

## Core Features

FlowState currently includes:

- User login and logout
- Protected application routes
- Saved locations
- Route creation and route memory
- Mapbox-based live routing where supported
- Estimated travel-time fallback where live routing is unavailable
- Live and estimated route labels
- Calendar with day, week, and month views
- Recurring events
- Event duration
- Daily schedule-gap detection
- Suggested leave times
- Personal travel buffer
- Preferred transport mode
- Productivity goal
- Personalised daily planning advice
- Dashboard daily timeline
- Weekly calendar snapshot
- Responsive layouts
- Local-date handling to avoid UTC date shifts

## Technology

FlowState was built using:

- React
- Vite
- React Router
- JavaScript
- CSS
- Local Storage
- Mapbox Geocoding API
- Mapbox Directions API
- Vitest

## Requirements

Before running the project, ensure that you have:

- Node.js
- npm
- A Mapbox access token

## Installation

Clone the repository:

```bash
git clone https://github.com/PalesaDM/FlowState-WebApp.git
```

Move into the project folder:

```bash
cd FlowState-WebApp
```

Install the dependencies:

```bash
npm install
```

## Environment Setup

FlowState uses Mapbox for location geocoding and live route calculations.

Create a `.env` file in the root of the project and add:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

A valid Mapbox token must be provided for live routing to work.

For assessment, the required Mapbox token will be supplied privately with the submission.

Do not commit the real `.env` file or private API key to the public repository.

An `.env.example` file should contain:

```env
VITE_MAPBOX_TOKEN=
```

## Running the Project

Start the development server:

```bash
npm run dev
```

The application will normally run at:

```text
http://localhost:5173/FlowState-WebApp/
```

If Vite selects another port, use the URL shown in the terminal.

## Production Build

To verify that the project builds successfully:

```bash
npm run build
```

The production files will be generated in the `dist` folder.

## Code Quality

Run ESLint with:

```bash
npm run lint
```

The final submitted build is expected to complete linting without errors.

## Automated Tests

FlowState uses Vitest for repeatable testing of important planning logic.

Run:

```bash
npm test
```

The current automated suite covers:

- leave-time calculation
- schedule-gap detection
- recurring-event expansion

These tests were introduced following Beta feedback to ensure that core planning logic can be re-checked after code changes.

## Mapbox Behaviour

For supported travel modes, FlowState attempts to use Mapbox routing data.

Routes indicate whether travel time is:

- **Live** — calculated using Mapbox routing data
- **Estimated** — calculated using FlowState's fallback logic

If an address cannot be successfully geocoded, the application falls back to estimated travel-time behaviour and communicates this to the user.

## Data Storage

FlowState is an MVP and currently uses browser `localStorage` for application data, including:

- account/session information
- user profile preferences
- saved locations
- saved routes
- calendar events

Because data is stored locally in the browser, clearing browser storage will remove the saved FlowState data for that browser.

## Project Structure

Key folders include:

```text
src/
├── components/
├── pages/
├── styles/
└── utils/
```

Important utility modules include:

- `aiLogic.js` — daily planning, advice, leave times, workload and gap logic
- `calendarLogic.js` — calendar and recurring-event logic
- `date.js` — shared local-date handling
- `profile.js` — shared profile defaults and profile retrieval
- `geocoding.js` — Mapbox geocoding
- `routing.js` — Mapbox route calculations
- `storage.js` — localStorage access

## Authentication

Protected pages are wrapped in a route guard.

If no active FlowState user exists, attempts to access pages such as Dashboard, Calendar, Locations, Routes, or Profile are redirected to the login screen.

## AI / Planning Logic

FlowState's current MVP does not use a trained machine-learning model.

Its planning assistant uses transparent, rule-based logic based on inputs such as:

- event times
- event duration
- schedule gaps
- travel time
- travel buffer
- workload
- preferred transport
- productivity goal

This approach was selected for the MVP because it provides predictable and explainable behaviour while still demonstrating context-aware planning.

## Contributors

FlowState was developed as a group project by:

- Palesa Masimene
- Nosipho Xulu

Detailed individual responsibilities and the full revision history are documented in the final project documentation.

## Repository

GitHub:

https://github.com/PalesaDM/FlowState-WebApp