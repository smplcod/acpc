# ACP+Charts now
Current version: 0.0.88

- Minimal React + Vite app with basic routing
- Public pages: home and English release notes
- 404 page for non-existent routes
- Admin login at `/admin/login` using env credentials
- Authenticated admins visiting `/admin/login` are redirected back to the previous page
- Admin access to dashboard and analytics graphs
- Logout at `/admin/logout` with redirect for unauthenticated routes
- Return to originally requested admin page after login
- Public pages use a collapsible sidebar with icon tooltips and home link
- Admin pages have a separate collapsible menu
- Admin sidebar includes dashboard link and metric shortcut icons
- Code split between `src/user` and `src/admin`
- Admin pages (except the dashboard) display "Subpages" with a full URL tree when subpages exist
- Navigation sidebars derive from the same tree; admin lists all URLs flat (no nested lists), public lists non-admin URLs
- User and admin sidebars highlight the active link
- Sidebars always display page names
- Dashboard at `/admin` with mini charts for growth, engagement, reliability, and revenue
- Detailed analytics pages at `/admin/*` for growth, engagement, reliability, and revenue
- Analytics charts use collapsible h2 headings for easier browsing

# Project details

## Tech and infrastructure
- React + Vite (fast HMR).
- Railway is our hosting.

## Local development
1. Ensure you have Node.js version 20.19.0 or newer.
2. Copy `.env.example` to `.env` and set `VITE_ADMIN_LOGIN` and `VITE_ADMIN_PASSWORD`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Admin credentials
To access the admin panel at ‎`/admin/login`, use the following credentials:
 • Username: admin
 • Password: 123456

## Libraries

**Dependencies**

- react 19.1.1
- react-dom 19.1.1
- react-feather 2.0.10
- react-router-dom 7.8.2
- recharts 2.15.4
- chart.js 4.5.0
- react-chartjs-2 5.3.0
- chartjs-plugin-zoom 2.2.0
- chartjs-chart-treemap 3.1.0

**Dev dependencies**

- @eslint/js 9.33.0
- @types/react 19.1.10
- @types/react-dom 19.1.7
- @vitejs/plugin-react 5.0.0
- eslint 9.33.0
- eslint-plugin-react-hooks 5.2.0
- eslint-plugin-react-refresh 0.4.20
- globals 16.3.0
- vite 7.1.2

## Code duplication log (because admin is an "another site")
- `src/user/app/layout.jsx` duplicated in `src/admin/app/layout.jsx`
- `src/user/app/layout.css` duplicated in `src/admin/app/layout.css`
- `src/user/app/barLeftUser.jsx` duplicated in `src/admin/app/barLeftAdmin.jsx`
- `src/user/app/barLeftUser.css` duplicated in `src/admin/app/barLeftAdmin.css`
