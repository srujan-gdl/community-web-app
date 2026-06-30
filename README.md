# CotoGate Community Web App

> **Premium administration portal** for CotoGate — a SaaS platform for gated community management in Mexico. Handles multi-role authentication, HOA billing, RFID access control, and security guard operations.

---

## Live Roles & Test Accounts

| Role | Email | Password | Lands On |
|---|---|---|---|
| **Super Admin** | `superadmin@cotogate.com` | `admin123` | Enterprise dashboard |
| **Coto Admin** | `admin@cotogate.com` | `admin123` | Community operations dashboard |
| **Resident** | `resident@cotogate.com` | `resident123` | Resident self-service portal |
| **Guard** | `guard@cotogate.com` | `permanent123` | Guard gatehouse console |

> First login for Super Admin and Coto Admin triggers a **forced password reset** modal. This is by design.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Run all unit tests
npm run test:run

# Watch mode tests
npm test

# Production build
npm run build
```

### Backend API

The app connects to a local backend at `http://localhost:4000` by default.  
Override with an environment variable:

```bash
# .env
VITE_API_URL=https://your-backend-api.com
```

See the [community-services README](../community-services/README.md) for backend setup.

---

## Folder Structure

```
community-web-app/
├── index.html                    # HTML entry point
├── vite.config.js                # Vite + Vitest configuration
├── package.json
├── tailwind.config.js            # Tailwind + CSS variable aliases
├── postcss.config.js
│
└── src/
    ├── App.jsx                   # Root — provider tree + role-based router
    ├── main.jsx                  # React DOM mount point
    ├── index.css                 # Global styles, CSS design tokens, dark mode
    │
    ├── context/                  # React Context providers
    │   ├── SessionContext.jsx    # Auth session: currentUser, authToken, setSession, clearSession
    │   ├── ThemeContext.jsx      # Theme: light | dark | system + .dark class on <html>
    │   └── i18nContext.jsx       # Localization: t(), language, setLanguage
    │
    ├── i18n/                     # Translation dictionaries (JSON only)
    │   ├── en.json               # English strings
    │   └── es.json               # Spanish strings (default language)
    │
    ├── lib/                      # Pure utility / service layer
    │   ├── api.js                # Central apiFetch + typed API endpoint functions
    │   ├── auth.js               # loginWithApi, simulateLogin (mock), getPasswordStrength
    │   ├── validators.js         # Composable form validators (email, phone, password, etc.)
    │   └── utils.js              # Shared helpers (cn class merger, etc.)
    │
    ├── components/
    │   ├── Login.jsx             # Screen W1: Unified login + forced password reset modal
    │   │
    │   ├── dashboards/           # Role-specific full-page dashboard screens
    │   │   ├── SuperAdminDashboard.jsx   # Screen W2: Enterprise overview + community mgmt
    │   │   ├── CotoAdminDashboard.jsx    # Screen W3: Community ops, units, residents, guards
    │   │   ├── ResidentPortal.jsx        # Screen W5: Balance, RFID cards, payment history
    │   │   └── GuardConsole.jsx          # Screen W4: Gate console (passcode + visitor log)
    │   │
    │   ├── layout/               # Shared structural components
    │   │   └── AppShell.jsx      # Sidebar + header wrapper used by all role dashboards
    │   │
    │   └── ui/                   # shadcn/ui component copies (do not edit directly)
    │       ├── badge.jsx
    │       ├── button.jsx
    │       ├── card.jsx
    │       ├── dialog.jsx
    │       ├── input.jsx
    │       ├── label.jsx
    │       ├── select.jsx
    │       ├── table.jsx
    │       └── tabs.jsx
    │
    └── tests/                    # Vitest + React Testing Library test suite
        ├── setup.js              # Global test config (jest-dom, matchMedia mock)
        ├── sanity.test.jsx       # Basic environment sanity check
        ├── auth.test.js          # getPasswordStrength, simulateLogin helpers
        ├── api.test.js           # apiFetch + endpoint function tests
        ├── validators.test.js    # All form validator functions (23 cases)
        ├── ThemeContext.test.jsx # Theme switching and localStorage persistence
        ├── Login.test.jsx        # Login form, error states, password reset modal
        ├── SuperAdminDashboard.test.jsx
        ├── CotoAdminDashboard.test.jsx
        └── ResidentPortal.test.jsx
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Component Library | shadcn/ui (Radix UI primitives) |
| Icons | Lucide React |
| Typography | Geist Variable (body), Outfit (display/title) |
| State Management | React Context (no Redux — see architecture notes) |
| Testing | Vitest + React Testing Library + jest-dom |
| Localization | Custom lightweight i18n context (no external library) |

---

## Architecture Decisions

### State Management: React Context, No Redux
The app uses three context providers instead of Redux:
- **`SessionContext`** — authenticated user + JWT, persisted in `sessionStorage`
- **`ThemeContext`** — light/dark/system theme, persisted in `localStorage`
- **`I18nContext`** — active language + `t()` translator, persisted in `localStorage`

Each dashboard keeps its own local `useState` for tab selection, modal open/close, and form values. Redux would add boilerplate without benefit at this scale.

### API Layer
All HTTP calls go through `src/lib/api.js`:
- Reads `VITE_API_URL` (falls back to `http://localhost:4000`)
- Injects JWT from `sessionStorage` via `Authorization: Bearer` header
- Throws typed `ApiError` on non-2xx responses

### Theming
CSS design tokens are defined in `src/index.css` as `:root` variables (light) and `.dark` overrides. Tailwind aliases (`bg-app`, `bg-sidebar`, `border-border`, `text-textPrimary`, etc.) map to these tokens in `tailwind.config.js`. No inline styles anywhere.

### Localization
All visible strings are looked up via `t('key')` from `src/i18n/en.json` or `src/i18n/es.json`. Spanish is the default language (CotoGate is Mexico-first).

### No Hardcoded Strings
Every user-visible string goes through the translation system — including validation error messages, which return i18n keys from `src/lib/validators.js`.

---

## Screens Overview

| Screen ID | Role | Description |
|---|---|---|
| **W1** | All roles | Login + forced password reset on first login |
| **W2** | `super_admin` | Enterprise overview, community management, coto admin onboarding |
| **W3** | `coto_admin` | Community operations: property units, resident directory, guard management |
| **W4** | `guard` | Gatehouse console: passcode validation, visitor log |
| **W5** | `resident_owner` / `resident_tenant` | HOA balance, RFID cards, payment history |

---

## Implementation Roadmap

| Phase | Status | Description |
|---|---|---|
| Phase 1 | ✅ Complete | Test environment: Vitest + React Testing Library + jsdom |
| Phase 2 | ✅ Complete | Design tokens, CSS variables, light/dark theme, i18n |
| Phase 3 | ✅ Complete | Screen W1: Login + forced password reset modal |
| Phase 4 | ✅ Complete | Screens W2, W3, W5: Super Admin, Coto Admin, Resident portals |
| Phase 5 | 🔲 Pending | Screen W4: 3-column Guard Console with live visitor feed |
| Phase 6 | 🔲 Pending | Final cleanup: LandingPage removal, documentation |
| Phase 7 | 🔲 Pending | Verification, full test coverage, manual browser testing |

---

## Test Coverage

```
✓ tests/validators.test.js          23 tests
✓ tests/api.test.js                  9 tests
✓ tests/ThemeContext.test.jsx         3 tests
✓ tests/auth.test.js                 8 tests
✓ tests/sanity.test.jsx              2 tests
✓ tests/Login.test.jsx               6 tests
✓ tests/SuperAdminDashboard.test.jsx 5 tests
✓ tests/CotoAdminDashboard.test.jsx  7 tests
✓ tests/ResidentPortal.test.jsx      6 tests
─────────────────────────────────────────
Total: 69 tests, 9 suites — all passing
```
