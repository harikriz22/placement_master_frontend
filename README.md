# Placement Tracker - Frontend (React + Vite)

Frontend portal for placement cell team members to track enrolled students, eligibility, and placement outcomes.

## 🚀 Getting Started

From this directory (`frontend/`):

```bash
# 1. Install dependencies (already pre-installed)
npm install

# 2. Run the development server
npm run dev
```

Visit the local development server (usually at `http://localhost:5173`).

---

## 🔑 Authentication Specifications Implemented

### 1. Register Page (`/register`)
- **Requirements (A1, A2, A4)**:
  - Registers with Full Name, Email, Password, and Placement Invite Code.
  - **Invite Code**: `PLACEMENT2026` (Stops unauthorized public signups since there is no single admin to approve accounts).
  - **Email**: Validated for correct format and uniqueness.
  - **Password Rules**: Minimum 8 characters, non-numeric (cannot be numbers only), and checked against common passwords.
  - **Security**: Passwords are cryptographically hashed and never returned or exposed in client objects.

### 2. Login Page (`/login`)
- **Requirements (A3, A4)**:
  - Sign in with Email and Password.
  - Demo pre-fill button available for instant testing:
    - **Email**: `sarah.connor@placement.cell`
    - **Password**: `CellAdmin2026!`
  - Persistent auth session stored in `localStorage`.

### 3. Session & Protected Routes (`/dashboard`, `/students`, etc.)
- **Requirements (A5, A6)**:
  - `ProtectedRoute` protects all internal pages.
  - Non-logged-in users are redirected to `/login`.
  - Top navigation bar displays the current logged-in member's profile and Logout button.
  - Logging out ends the session and returns to the sign-in screen.
