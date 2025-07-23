# T-Finder Project Status Tracker

> A high-level checklist of what’s *Done* and what’s *Next* for Group-1’s hobby MERN stack project.  ✔️ = completed ❌ = pending / in-progress

---

## 1. Core Features
| Feature | Status | Notes |
|---------|:------:|-------|
| User registration & login (JWT) | ✔️ | Race-condition & token expiry bugs fixed |
| Logout & session persistence | ✔️ | Verified after fix |
| Search technicians (category, filters) | ✔️ | Functional |
| City auto-complete dropdown | ✔️ | Custom styled suggestions implemented |
| Technician detail page | ✔️ | Real reviews, booking modal, UI polish |
| Submit & paginate reviews | ✔️ | Working with star ratings |
| Book appointment flow | ✔️ | Success toast & dashboard refresh |
| User dashboard (appointments list) | ✔️ | Protected route |
| Technician availability & services listing | ✔️ | Shows skills, rates |
| Password reset (email) | ❌ | Needs backend email + UI form |
| Notifications (booking / review) | ❌ | Toasts exist, but push/email pending |

## 2. UI / UX
| Task | Status | Notes |
|------|:------:|-------|
| Glassmorphic theme components | ✔️ | Login, Modals, Dropdowns |
| Mobile responsiveness | ❌ | Audit with dev-tools & add media queries |
| Dark-mode toggle | ❌ | CSS variables & context |
| Loading / empty states everywhere | ✔️ | Spinners & messages added |

## 3. Backend APIs
| Endpoint | Status | Notes |
|----------|:------:|-------|
| `/api/users/register` | ✔️ |
| `/api/users/login` | ✔️ | 5-day JWT expiry |
| `/api/users/profile` (GET/PUT) | ✔️ |
| `/api/categories` | ✔️ |
| `/api/technicians` list & filters | ✔️ |
| `/api/technicians/:id` detail | ✔️ |
| `/api/technicians/:id/reviews` (GET/POST) | ✔️ |
| `/api/bookings` create | ✔️ |
| Rate-limiting / security headers | ❌ | Use `helmet`, `express-rate-limit` |
| Automated tests (Jest/Supertest) | ❌ | Add unit + integration tests |

## 4. DevOps & Tooling
| Task | Status | Free-tier Suggestion |
|------|:------:|----------------------|
| Version control (GitHub) | ✔️ | Private or public repo |
| ESLint + Prettier CI | ❌ | GitHub Actions |
| Unit / API test CI | ❌ | GitHub Actions (free) |
| Lint-staged pre-commit hook | ❌ | `husky` + `lint-staged` |
| Environment variables management | ✔️ | `.env` & dotenv |

## 5. Deployment (0$)
| Item | Status | Plan |
|------|:------:|------|
| Front-end (Vite React) | ❌ | Deploy to **Netlify** free tier (build command `npm run build`, publish `client/dist`) |
| Back-end (Node/Express) | ❌ | Deploy to **Render.com** free web service (auto-deploy from GitHub) |
| MongoDB Atlas cluster | ✔️ | Free tier cluster created |
| Custom domain (optional) | ❌ | Use free subdomain from Netlify / Render |
| CI/CD webhook | ❌ | Enable auto-deploy on push |

## 6. Documentation
| Task | Status |
|------|:------:|
| README with local setup & env vars | ✔️ |
| API docs (OpenAPI / Postman) | ❌ |
| Contribution guidelines | ❌ |

---

## Next Action Roadmap
1. **Deploy Front-end** to Netlify free tier.
2. **Deploy Back-end** to Render free web service, configure environment variables + CORS.
3. Add **password-reset email** flow (use Nodemailer + Mailgun/Sandbox).
4. Implement **rate-limiting & security headers**.
5. Ensure **mobile responsiveness** and optional dark-mode.
6. Set up **CI** (lint + tests) with GitHub Actions.
7. Write **API docs** & contribution guide.

Feel free to tick boxes as you progress! 🎯
