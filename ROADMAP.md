# T-Finder Project Roadmap

This document outlines the plan for building the T-Finder application, a MERN stack project to help users find local technicians.

## Phase 1: Project Setup & Planning

- [x] **1.1. Initialize Project Directory:** Create the main project directory `t-finder`.
- [x] **1.2. Create Planning Documents:** Create `ROADMAP.md`, `README.md`, and `.gitignore`.
- [ ] **1.3. Backend Setup:**
    - [ ] Create a `server` directory.
    - [ ] Initialize a Node.js project (`npm init -y`).
    - [ ] Install initial dependencies: `express`, `mongoose`, `cors`, `dotenv`.
- [ ] **1.4. Frontend Setup:**
    - [ ] Create a `client` directory using Vite (`npm create vite@latest client -- --template react`).
    - [ ] Install initial frontend dependencies: `axios`, `react-router-dom`.

## Phase 2: Backend Development

- [ ] **2.1. Database Connection:**
    - [ ] Create a `config` directory.
    - [ ] Implement MongoDB connection logic using Mongoose.
    - [ ] Use the provided MongoDB URI and store it in a `.env` file.
- [ ] **2.2. Database Schema:**
    - [ ] Create a `models` directory.
    - [ ] Define Mongoose schemas for `Technician`, `Review`, and `Category`.
- [ ] **2.3. Dummy Data Generation:**
    - [ ] Create a `scripts` directory.
    - [ ] Write a script to generate 2k-3k dummy technicians with reviews.
    - [ ] The script will use a list of Indian cities and predefined categories.
    - [ ] Data will be inserted in chunks of 500 to avoid database timeouts.
- [ ] **2.4. API Endpoints (Routes & Controllers):**
    - [ ] Create `routes` and `controllers` directories.
    - [ ] Implement API endpoints for:
        - `GET /api/technicians`: Get technicians by category and city.
        - `GET /api/technicians/:id`: Get details for a single technician.
        - `POST /api/technicians/:id/reviews`: Add a review for a technician.
        - `GET /api/categories`: Get all service categories.

## Phase 3: Frontend Development

- [ ] **3.1. Project Structure:**
    - [ ] Organize files into `components`, `pages`, `services`, and `assets` directories.
- [ ] **3.2. Styling:**
    - [ ] Set up global styles with a modern design palette.
    - [ ] Implement a glassmorphism theme using CSS/Styled-Components.
- [ ] **3.3. UI Components:**
    - [ ] Create reusable components:
        - `Navbar`
        - `Footer`
        - `SearchBar`
        - `TechnicianCard`
        - `ReviewCard`
        - `CategoryButton`
        - `Loader`
- [ ] **3.4. Pages:**
    - [ ] Create main pages for the application:
        - `HomePage`: Featuring search and categories.
        - `SearchResultsPage`: Displaying a list of technicians.
        - `TechnicianDetailPage`: Showing detailed information about a technician.
- [ ] **3.5. State Management & API Integration:**
    - [ ] Use React hooks (`useState`, `useEffect`, `useContext`) for state management.
    - [ ] Use `axios` to connect the frontend with the backend APIs.

## Phase 4: Final Touches & Deployment

- [ ] **4.1. Refinement:**
    - [ ] Add error handling and loading states for a better user experience.
    - [ ] Ensure the application is responsive across different screen sizes.
- [ ] **4.2. Documentation:**
    - [ ] Update `README.md` with final setup and deployment instructions.
- [ ] **4.3. Deployment:**
    - [ ] Prepare the application for production.
    - [ ] Provide instructions for deploying the backend (e.g., on Render/Heroku) and frontend (e.g., on Netlify/Vercel).
