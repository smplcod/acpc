# ACP+Charts now
Current version: 0.0.89

- Minimal React + Vite app with basic routing
- Public pages: home and English release notes
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
