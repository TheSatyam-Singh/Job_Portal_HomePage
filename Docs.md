# Job Portal Homepage (Frontend Prototype)

A multi-page Job Portal built with HTML, CSS, and Vanilla JavaScript.  
It includes job listing management, search, apply flow, and Firebase email/password authentication pages.

---

## 1) Project Overview

This project demonstrates:
- Landing page with search UI
- Job CRUD (Create, Read, Update, Delete) using browser storage
- Search results page with filtering from query parameters
- Apply flow with dynamic job/company information
- Authentication pages connected to Firebase Auth
- Responsive UI with custom styling

Primary objective: build a beginner-friendly, no-framework frontend application using DOM manipulation and event handling.

---

## 2) Tech Stack

- HTML5 (multi-page structure)
- CSS3 (layout, card UI, responsive breakpoints, animations)
- Vanilla JavaScript (ES6+)
- Browser APIs
  - `localStorage`
  - `URLSearchParams`
  - `FileReader`
  - DOM events (`click`, `submit`, `DOMContentLoaded`)
- Firebase (Modular SDK v9)
  - Authentication (Email/Password)
  - Firestore (basic user profile write)

---

## 3) Folder & File Structure

```text
Job_Portal_HomePage/
├─ index.html                 # Landing page
├─ style.css                  # Global styles
├─ script.js                  # Home search logic
├─ auth.js                    # Firebase auth logic
├─ firebase-config.json       # Firebase configuration
├─ login.html                 # Legacy login page
├─ register.html              # Legacy register page
├─ login/
│  └─ index.html              # Main login page
├─ register/
│  └─ index.html              # Main register page
├─ jobs/
│  ├─ index.html              # Job posting + listing
│  ├─ script.js               # Job CRUD logic
│  ├─ style.css               # Jobs styling
│  ├─ search/
│  │  ├─ index.html           # Search results UI
│  │  └─ script.js            # Search filtering logic
│  └─ apply/
│     ├─ index.html           # Apply page (module)
│     ├─ apply.js             # Apply logic
│     └─ apply.css            # Apply styles
└─ apply/
   ├─ index.html              # Apply page (root)
   ├─ apply.js                # Apply logic (prototype)
   └─ apply.css               # Apply styles
```

Note: both `apply/` and `jobs/apply/` exist and contain slightly different logic.

---

## 4) Feature Breakdown

### 4.1 Landing Page (`index.html` + `script.js`)

- User enters keyword, location, and experience.
- On search click:
  - query params (`kw`, `loc`, `exp`) are created
  - redirects to `/jobs/search/index.html?...`
- Navigation includes Jobs, Login, and Register.

### 4.2 Job Management (`jobs/index.html` + `jobs/script.js`)

Form fields:
- title
- company
- location
- experience
- role/description

Add/update flow:
- not editing -> add new job
- editing -> update existing job using `editingIndex`

Storage:

```js
localStorage.setItem('jobs', JSON.stringify(jobsArray));
```

Each job card includes:
- Edit button
- Delete button
- Apply button

Company logos are generated dynamically using Logo.dev with a slugified company name.

### 4.3 Search Results (`jobs/search/`)

- Reads query parameters using `URLSearchParams`
- Loads all jobs from `localStorage`
- Filters by:
  - keyword (title/company/location/role)
  - location
- Dynamically renders matching job cards

### 4.4 Apply Flow (`apply/` and `jobs/apply/`)

- Receives job details via query string
- Displays job/company panel
- Resume file handled using `FileReader`
- Shows loading spinner, success animation, confirmation card, and Back to Jobs button
- Confetti animation is triggered after submission

Two variants:
- Prototype mode: confirmation UI only, no persistent storage
- Stored mode: saves application in `localStorage.applications`

### 4.5 Authentication (`login/`, `register/`, `auth.js`)

Uses Firebase Modular SDK (v9).

Register flow:
- validates password
- `createUserWithEmailAndPassword`
- `updateProfile`
- optional Firestore document creation
- optional email verification

Login flow:
- sign in using email/password
- redirect on success

Firebase configuration is loaded dynamically from `firebase-config.json`.

---

## 5) Data Model

Job object (`localStorage.jobs`):

```js
{
  title,
  company,
  location,
  role
}
```

Application object (`localStorage.applications`):

```js
{
  job: { title, company, location, role },
  name,
  email,
  resumeName,
  resumeType,
  resumeDataUrl,
  submittedAt
}
```

---

## 6) Routing & Navigation

Main routes:
- `/index.html` -> Landing page
- `/jobs/index.html` -> Job listing page
- `/jobs/search/index.html` -> Search page
- `/apply/index.html` -> Apply page (root)
- `/jobs/apply/index.html` -> Apply page (module)
- `/login/index.html`
- `/register/index.html`

Query parameters used:
- Search: `kw`, `loc`, `exp`
- Apply: `title`, `company`, `location`, `role`

---

## 7) How to Run the Project

Because absolute paths (`/`) are used, run via a local server.

Option 1: VS Code Live Server  
Install the extension and run from project root.

Option 2: Python server:

```bash
python3 -m http.server 5500
```

Open in browser: `http://localhost:5500`

---

## 8) Important Implementation Concepts (Viva-Friendly)

- DOM selection and manipulation
- Event handling (`click`, `submit`)
- State management with arrays + `localStorage`
- Client-side persistence
- Query string communication (`URLSearchParams`)
- Input validation
- XSS prevention using `escapeHtml()`
- File handling with `FileReader`
- Async/await with Firebase
- Responsive UI with media queries
- UX micro-interactions and feedback states

---

## 9) High-Probability Viva Questions (With Answers)

### 1. Why did you use `localStorage` for jobs?
Because this is a frontend-only prototype. `localStorage` provides persistent browser-based storage without needing a backend.

### 2. How does your edit/update flow work?
When Edit is clicked:
- the job index is stored in `editingIndex`
- form is pre-filled with selected job data
- on submit, that index is updated instead of adding a new job

### 3. How do you pass job details to the apply page?
Using `URLSearchParams`, for example:

```js
window.location.href = `/apply/index.html?title=${title}&company=${company}`;
```

The apply page reads the parameters and renders job details dynamically.

### 4. Why sanitize dynamic text before injecting into HTML?
To prevent Cross-Site Scripting (XSS) attacks when using `innerHTML`.

### 5. What is the role of `URLSearchParams` in your app?
- read query parameters
- build dynamic query strings
- enable page-to-page communication

### 6. How does data flow through the application?
- job created -> stored in `localStorage.jobs`
- search page -> filters jobs using query params
- apply button -> passes selected job via URL
- apply page -> renders job details
- submission -> either shows confirmation (prototype mode) or stores in `localStorage.applications`

This demonstrates client-side state management, inter-page communication, and storage-based persistence.

### 7. What are the limitations of this frontend-only architecture?
- no real backend database
- not multi-user
- data stored per browser only
- no secure backend validation
- Firebase config exposed in frontend
- no role-based authorization

---

## 10) CSS Viva Q&A (Based on Your Project CSS)

### 1. Why did you use `* { box-sizing: border-box; }`?
It makes width and height calculations predictable by including padding and border inside the total element size, which simplifies responsive layouts.

### 2. Where did you use Flexbox, and why?
You used Flexbox in places like `.auth-page`, `.card-inner`, and action/button containers to align items easily in rows/columns and center content both vertically and horizontally.

### 3. Where did you use CSS Grid in this project?
Grid is used in layouts such as `.apply-grid` and footer content sections to create clean multi-column structures that adapt well on different screen sizes.

### 4. How is responsive design implemented?
Through media queries (for example around `max-width: 900px` and `max-width: 720px`) to switch multi-column layouts into single-column layouts and adjust spacing/sizing for smaller screens.

### 5. Why did you define CSS variables in `:root`?
Variables like `--accent`, `--muted`, and `--card-bg` keep colors consistent and make theme updates easier by changing values in one place.

### 6. What is the purpose of `transition` and `transform` in your UI?
`transition` creates smooth hover/interaction effects, while `transform` (like `translateY` and `scale`) is used for micro-interactions such as card hover lift and success/check animations.

### 7. How did you implement button states?
Using class/state combinations such as `.btn`, `.btn:hover`, `.btn:active`, `.btn.loading`, and `.btn.success` to show normal, interactive, loading, and success states.

### 8. How are animations handled in this project?
Using `@keyframes` animations (like `pop` and `fall`) with class toggles from JavaScript to trigger visual feedback during submission and celebration effects.

### 9. Why did you use `object-fit: contain` for company logos?
It preserves logo aspect ratio and ensures logos fit inside fixed containers without distortion.

### 10. Explain specificity using your CSS.
Selectors like `.apply-right .btn` are more specific than `.btn`, so they override shared button styles only in the apply form area without changing every button globally.

### 11. Why are `rem`, `px`, `%`, and `vh` all used together?
Each unit has a purpose: `rem` for scalable typography, `px` for precise UI controls, `%` for fluid widths, and `vh`/`calc()` for viewport-based layout sizing.

### 12. Why use shadows and border-radius repeatedly?
`box-shadow` and `border-radius` create a modern card-based visual hierarchy, improving readability and user focus on forms, job cards, and confirmation panels.

---

## 11) Current Limitations

- Duplicate apply modules
- Legacy authentication pages
- No pagination or sorting
- No recruiter dashboard
- No production-grade security

---

## 12) Suggested Improvements (Production Upgrade)

- Add backend API (Node.js/Express or Firebase Functions)
- Store jobs and applications in Firestore only
- Add authentication guards
- Add role-based access control
- Add pagination and advanced filters
- Add recruiter dashboard
- Secure environment variable handling

---

## 13) Credits

Project by Satyam Singh.  
Educational frontend assignment focused on JavaScript DOM manipulation and event handling.