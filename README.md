# CotoGate Admin Portal (Vite + React)

A premium, state-of-the-art web workspace for the **CotoGate** gated community ecosystem. It integrates marketing assets, administrative dashboards, guard tower controllers, and internationalization utilities.

## Main Application Views (Routes)

1.  **Product Landing Page (`landing`)**:
    *   Public conversion-focused product showcase tailored for HOA boards and condominium complexes.
    *   Detailing transparency values, dynamic SPEI billing systems, and IoT access grids.
2.  **Unified Authentication Console (`login`)**:
    *   Dual-role checking inputs. Routes users automatically to their designated panels based on credentials.
3.  **External Agency Admin Dashboard (`admin_dashboard`)**:
    *   Active balance sheets, monthly payment ledgers, RFID access cards synchronizers, and automated delinquency block triggers.
4.  **Security Guard Control Tower (`guard_dashboard`)**:
    *   Gate check verifiers, vehicle loggers, and real-time push alerts.

---

## Technical Stack & Custom i18n Engine

*   **Tailwind CSS v3**: Installed and integrated with CSS directives in `src/index.css`.
*   **Radix Icons & Lucide Primitives**: Custom vector icon sheets.
*   **Dependency-Free i18n**: A high-performance, lightweight context provider inside `src/i18n/i18nContext.jsx` that loads static `en.json` and `es.json` files dynamically. Restores selections instantly from browser storage.

---

## Default Testing Accounts

| Profile Role | Email Address | Password | Redirect Target |
| :--- | :--- | :--- | :--- |
| **Coto Administrator** | `admin@cotogate.com` | `admin123` | **Admin Dashboard** |
| **Security Guard** | `guard@cotogate.com` | `guard123` | **Guard Console** |

---

## Local Development & Installation

### 1. Install Packages
```bash
npm install
```

### 2. Launch Client
```bash
npm run dev
```
Launches at `http://localhost:5173`. Toggle the language switch (`ES` / `EN`) in the top bar to inspect instant translation switches.

---

## Implementation Roadmap

| Phase | Status | Description |
|---|---|---|
| Phase 1 | ✅ Complete | Test environment configuration, Vitest + React Testing Library setup |
| Phase 2 | ✅ Complete | Design tokens, light/dark theme switcher, i18n localization keys |
| Phase 3 | 🔲 Pending | Screen W1: Sleek login + first-time force password reset modal |
| Phase 4 | 🔲 Pending | Screens W2, W3, W5: Super Admin, Coto Admin, and Resident portals |
| Phase 5 | 🔲 Pending | Screen W4: 3-column security guard console with Touch PIN pad & live WebSocket feed |
| Phase 6 | 🔲 Pending | Code cleanup, deleting marketing LandingPage.jsx, and README updates |
| Phase 7 | 🔲 Pending | Verification, unit testing coverage, manual browser checks |

