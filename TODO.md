# To‑Do List: Front‑End‑First Workflow

## Phase 1: Front‑End MVP (Days 1–3)
- [ ] **Repo & Monorepo Setup**
  - [ ] Create GitHub repo `build-holding`.
  - [x] Scaffold folders: `/api`, `/website`.
  - [x] Initialize `api` with `npm init -y`.
  - [ ] Initialize `website` with `npm init -y`.
- [ ] **Create React App**
  - [x] `cd website && npx create-react-app .`
  - [x] Install dependencies: React Router, Bootstrap, Sass, FontAwesome, react-slick, leaflet.
- [x] **Placeholder Data**
  - [x] Add `/src/data/placeholder.json` with 5 sample projects (multilingual text, placeholder images from `picsum.photos`).
- [ ] **Common Components**
  - [x] Build `Preloader`, `HeroSection`, `SideNavBar`, `Footer` in `/src/components/Common`.
  - [ ] Style with Bootstrap + custom Sass.
- [x] **Static Pages**
  - [x] Home: hero + featured carousel (react-slick) using placeholder JSON.
  - [x] Projects: grid layout, filter controls (category/status), fetch from placeholder JSON.
  - [x] Project Detail: static route, show carousel + gallery + static map image.
  - [x] Contact: embed placeholder Google Map iframe + static form.
  - [x] OurHolding: Tab navigation for eight sections (Our Mission, Who We Are, Our Team, Equipment, Quality Standards, Timeline, Partners, Clients); placeholder text/media.
- [x] **Admin Panel UI (Stubbed)**
  - [x] Routes: `/admin/login`, `/admin/dashboard`, `/admin/projects/new`, `/admin/projects/:id/edit`.
  - [x] Build forms for project fields (multilingual inputs, file inputs with preview) pointing to stubbed JS modules.
  - [x] Store JWT in memory; no real auth.
- [x] **UX & Animations**
  - [x] Preloader fade out.
  - [x] Hover effects on tiles & buttons.
  - [x] Scroll-triggered animations (AOS or CSS).
- [x] **Testing Static UI**
  - [x] Manual QA on desktop & mobile.
  - [x] Fix layout/responsiveness issues.

## Phase 2: Backend API (Days 4–5)
1. **Express Scaffold**
   - [x] `cd api && npm init -y`.
   - [x] Install: express, mongoose, dotenv, bcryptjs, jsonwebtoken, multer, cors, helmet.
2. **Environment Setup**
   - [x] Create `.env.example` with `MONGO_URI`, `JWT_SECRET`, `PORT`.
   - [x] Load via `dotenv` in `server.js`.
3. **Database Connection**
   - [x] `config/db.js`: connect mongoose to `process.env.MONGO_URI`.
4. **Models**
   - [x] `models/User.js`, `models/Project.js` (multilingual schema).
   - [x] Create additional models (Partner, Client, Timeline, Content, Media).
5. **Auth Routes**
   - [x] `/api/auth/register` & `/api/auth/login` in `routes/auth.js`.
   - [x] `controllers/authController.js`: hash, JWT with `expiresIn:1h`.
6. **Project Routes**
   - [x] `/api/projects` CRUD in `routes/projects.js`, `controllers/projectController.js`.
   - [x] Implement file upload via `multer`, cleanup logic.
7. **Additional Routes**
   - [x] Create routes for Partners, Clients, Timeline, Content, Media.
   - [x] Implement multilingual support across all endpoints.
8. **Middleware**
   - [x] `middleware/auth.js`: protect routes.
   - [x] `middleware/upload.js`: handle file uploads with error handling.
   - [x] Error handling + logging (morgan).
9. **Database Seeding**
   - [x] Create seed script for initial data.
   - [x] Setup uploads folder structure.

## Phase 3: Integration (Day 6)
1. **Replace Placeholder**
   - [ ] Remove `placeholder.json` imports.
   - [ ] Implement axios calls to real API endpoints.
2. **Admin Panel Integration**
   - [ ] Hook form submissions to backend.
   - [ ] Store JWT in `localStorage`, add interceptors for `Authorization` header.
3. **Error Handling**
   - [ ] Show toast/alerts on API errors.

## Phase 4: Internationalization & Optimization (Day 7)
1. **i18next Setup**
   - [ ] Create `/public/locales/{en,bg,ru}/translations.json`.
   - [ ] Wrap app in `I18nextProvider`, connect `useTranslation`.
2. **Language Selector**
   - [ ] Update `SideNavBar` to switch languages and persist choice.
3. **Performance**
   - [ ] Code splitting with `React.lazy` + `Suspense`.
   - [ ] Lazy-load images & map component.
   - [ ] Convert images to WebP, compress static assets.

## Phase 5: Testing & Deployment (Days 8–9)
1. **Frontend Tests**
   - [ ] Jest + React Testing Library for components & pages.
2. **Backend Tests**
   - [ ] Continue Supertest coverage ≥80%.
3. **E2E Tests**
   - [ ] Cypress for user flows: browse projects, admin CRUD.
4. **CI/CD**
   - [ ] GitHub Actions: lint, test, build, deploy.
5. **Deploy**
   - [ ] Frontend to Netlify/Vercel. Set `REACT_APP_API_URL`.
   - [ ] Backend to Heroku/AWS; configure env vars and health-check.
   - [ ] Monitor performance & errors (Sentry).
