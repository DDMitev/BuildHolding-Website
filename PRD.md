# Product Requirements Document (PRD)

## 1. Executive Summary
BuildHolding is a corporate construction website with a visitor-facing front end and a secure admin panel. To accelerate delivery, we will first develop a front‑end MVP using placeholder content before building the backend API to supply real data.

## 2. Objectives & Metrics
- Deliver front‑end MVP with placeholder text/images within 5 days.
- Admin to add a new project in ≤2 minutes once backend is in place.
- Performance: LCP <2.5s, TTI <3s, CLS <0.1.
- Accessibility: WCAG 2.1 AA compliance.

## 3. Personas
- **Visitor**: Browses projects, views details, contacts company.
- **Admin**: Manages users and projects via admin panel.

## 4. Functional Requirements
- **Front‑end MVP**: Static React pages loading from `/src/data/placeholder.json`.
- **Admin Panel**: UI for CRUD operations; initially submits to stubbed endpoints.
- **Multilingual Support**: EN/BG/RU text stored in JSON files.
- **Animations & UX**: Preloader, hover/scroll transitions.
- **Responsive & Accessible**: Mobile‑first, ARIA roles, keyboard nav.
- **OurHolding Page**: Tabbed sections for eight subsections (Our Mission, Who We Are, Our Team, Equipment, Quality Standards, Timeline, Partners, Clients) with placeholder text/media.

## 5. Non‑Functional Requirements
- **Performance**: Code splitting, lazy loading, optimized images.
- **Security**: Later add JWT auth, helmet, rate limiting.
- **Testing**: ≥80% coverage (unit, integration, E2E).

## 6. Data Model (Placeholder & Real)
```js
const projectSchema = new Schema({
  title: { en: String, bg: String, ru: String },
  description: { en: String, bg: String, ru: String },
  category: { en: String, bg: String, ru: String },
  status: { type: String, enum: ['planned','in-progress','complete'] },
  featured: { type: Boolean, default: false },
  mainImageUrl: String,
  galleryImages: [String],
  location: { lat: Number, lng: Number },
}, { timestamps: true });
```

## 7. Implementation Strategy
1. **Phase 1: Front‑end MVP**
   - Scaffold CRA app.
   - Create `/src/data/placeholder.json` with sample projects.
   - Build common components: Preloader, Hero, NavBar, Footer.
   - Static pages: Home, Projects Grid, Project Detail, Contact.
   - Use placeholder images/text; no API calls.
2. **Phase 2: Backend API**
   - Scaffold Express + MongoDB.
   - Implement auth (JWT) and project CRUD routes.
   - File upload & cleanup.
3. **Phase 3: Integration**
   - Replace placeholder JSON with real axios calls.
   - Wire admin panel to live endpoints.
4. **Phase 4: Internationalization & Optimization**
   - Integrate i18next, translate static copy.
   - Add lazy loading, code splitting, image optimization.

## 8. Tech Stack & Deployment
- **Front‑end**: React 18, React Router, React Bootstrap, Sass, Axios.
- **Back‑end**: Node.js, Express, MongoDB, Mongoose, JWT, Multer.
- **CI/CD**: GitHub Actions, Netlify/Vercel (front‑end), Heroku/AWS (back‑end).
