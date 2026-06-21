# CRM Pro — Lead Management Dashboard

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-x7rlt66y)

A modern, single-page CRM dashboard for managing sales leads — built with React, TypeScript, and Tailwind CSS. It includes authentication, role-based account management, a lead pipeline with full CRUD, and analytics charts, all running entirely in the browser with `localStorage` as the data layer.

## Features

- **Authentication** — Login and registration flow with a seeded default admin account, "remember me" support, and protected/public route guards.
- **Dashboard** — At-a-glance stats (total, new, contacted, converted leads), a recent-leads feed, and a visual pipeline breakdown by status.
- **Lead management** — Add, edit, view, and delete leads with fields for contact info, company, source, status, and notes; includes a dedicated "Add Lead" route and a sortable/filterable lead table.
- **Analytics** — Charts (via Recharts) summarizing leads by month, by source, and by conversion status.
- **Account management** — Admin-only page for creating and managing user accounts with role-based permissions (Administrator, Manager, Agent).
- **Settings** — User-level settings page.
- **Public lead capture form** — A standalone form component for capturing leads outside the authenticated app.
- **Polished UI** — Dark theme, glassmorphism panels, and Framer Motion animations throughout.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for tooling and dev server
- **React Router v7** for routing and route guards
- **Tailwind CSS** for styling
- **Framer Motion** for animation
- **Recharts** for analytics charts
- **Lucide React** / **react-icons** for icons
- **Supabase JS client** (included as a dependency for future backend integration; the app currently persists data to `localStorage`)

## Project Structure

```
src/
├── components/      # Reusable UI: forms, tables, modals, navbar, sidebar, stats cards, charts
├── data/             # Types and sample seed data for leads
├── hooks/            # useAuth and useLeads hooks (state + persistence logic)
├── layouts/          # AppLayout (sidebar + navbar shell for authenticated pages)
├── pages/            # Route-level pages: Login, Dashboard, Leads, Analytics, Accounts, Settings
├── routes/           # AppRouter and route guards (ProtectedRoute / PublicRoute)
└── utils/            # localStorage helpers and formatting/validation utilities
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite dev server with hot module reloading.

### Build

```bash
npm run build
```

Builds the production bundle.

### Other scripts

```bash
npm run preview     # Preview the production build locally
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking with no emit
```

## Default Login

On first run, the app seeds a default administrator account so you can sign in immediately:

- **Email:** `admin@crm.com`
- **Password:** `admin123`

New accounts can also be registered from the login screen (default role: Agent). All accounts and leads are stored in the browser's `localStorage`, so data is local to your browser and resets if storage is cleared.

## Data Model

- **Lead** — `fullName`, `email`, `phone`, `company`, `source` (Website, Facebook, Instagram, Google Ads, Referral, LinkedIn), `status` (New, Contacted, Qualified, Converted, Lost), `notes`, `createdAt`.
- **Account / User** — `name`, `email`, `role` (Administrator, Manager, Agent), `isAdmin`, `isActive`.

## Notes

- This is a front-end-only demo: there is no backend API, and all persistence happens via the browser's `localStorage`. The Supabase dependency is present but not yet wired up, leaving room for a real database/auth backend to be added later.
- Originally scaffolded with [Bolt](https://bolt.new) using the `bolt-vite-react-ts` template.
