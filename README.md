# Placement Tracker - Frontend (React + Vite)

Frontend portal for placement cell team members to track enrolled students, eligibility, and placement outcomes.

## Getting Started

From this directory (`frontend/`):

```bash
# 1. Install dependencies (already pre-installed)
npm install

# 2. Run the development server
npm run dev
```

Visit the local development server (usually at `http://localhost:5173`).

---

## Authentication Specifications Implemented

### 1. Register Page (`/register`)

- **Requirements**:
  - Registers with Full Name, Email, Password, and Placement Invite Code.
  - **Email**: Validated for correct format and uniqueness.
  - **Password Rules**: Minimum 8 characters, non-numeric (cannot be numbers only), and checked against common passwords.
  - **Security**: Passwords are cryptographically hashed and never returned or exposed in client objects.

### 2. Login Page (`/login`)

- **Requirements**:
  - Sign in with Email and Password.
  - Persistent auth session stored in `localStorage`.

### 3. Session & Protected Routes (`/dashboard`, `/students`, etc.)

- **Requirements**:
  - `ProtectedRoute` protects all internal pages.
  - Non-logged-in users are redirected to `/login`.
  - Top navigation bar displays the current logged-in member's profile and Logout button.
  - Logging out ends the session and returns to the sign-in screen.
