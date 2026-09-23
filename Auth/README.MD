# Auth System

A reusable authentication module for Next.js applications using **Firebase Authentication**, **React Hook Form**, and **Google Authentication**.

The entire authentication system is contained inside the `Auth` folder so it can be copied into another project without spreading authentication-related files throughout the application.

---

## 1. Folder Structure

```text
Auth/
│
├── components/
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   └── ForgotPasswordForm.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── AuthGuard.jsx
│
├── hooks/
│   └── useAuth.js
│
├── lib/
│   └── firebase.js
│
└── services/
    └── authService.js
```

---

# 2. What The Auth Folder Does

The `Auth` folder contains everything required for:

* Email/password login
* Email/password registration
* Google authentication
* Logout
* Password reset
* Firebase authentication state
* Protected pages
* Accessing the current authenticated user
* React Hook Form-based authentication forms

The application outside this folder only needs to:

1. Install the required packages.
2. Add Firebase environment variables.
3. Wrap the application with `AuthProvider`.
4. Place the authentication components/pages where required.
5. Configure the Firebase project.

---

# 3. `lib/firebase.js`

Auth/lib/firebase.js

This file initializes Firebase.

It contains:

* Firebase application initialization
* Firebase Authentication initialization
* Google authentication provider

Example:

```js
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export {
  app,
  auth,
  googleProvider,
};
```

This is the only file responsible for initializing Firebase.

---

# 4. `services/authService.js`

```text
Auth/services/authService.js
```

This is the main authentication service.

It communicates with Firebase Authentication.

Typical functions include:

```text
login()
register()
loginWithGoogle()
logout()
resetPassword()
```

The rest of the application should not need to directly call Firebase authentication functions.

For example:

```js
await login(email, password);
```

instead of:

```js
signInWithEmailAndPassword(auth, email, password);
```

This keeps Firebase-specific authentication logic inside the Auth module.

---

# 5. `context/AuthContext.jsx`

```text
Auth/context/AuthContext.jsx
```

This is the central authentication state manager.

It:

* Watches Firebase authentication state.
* Stores the current Firebase user.
* Provides loading state.
* Provides login.
* Provides registration.
* Provides Google login.
* Provides logout.
* Provides password reset.
* Provides Firebase ID token access when needed.

It exposes values such as:

```js
const {
  user,
  loading,
  isAuthenticated,
  login,
  register,
  loginWithGoogle,
  logout,
  resetPassword,
  getIdToken,
} = useAuth();
```

### `user`

Contains the current Firebase user.

Example:

```js
user?.uid
user?.email
user?.displayName
user?.photoURL
```

If nobody is logged in:

```js
user === null
```

### `loading`

Used while Firebase is determining whether an existing authentication session exists.

Example:

```js
if (loading) {
  return <p>Loading...</p>;
}
```

### `isAuthenticated`

A simple boolean:

```js
true
```

when a user is authenticated.

Otherwise:

```js
false
```

---

# 6. `hooks/useAuth.js`

```text
Auth/hooks/useAuth.js
```

This is a convenience hook for accessing `AuthContext`.

Instead of doing:

```js
useContext(AuthContext);
```

everywhere, components can simply use:

```js
const {
  user,
  login,
  logout,
} = useAuth();
```

Example:

```js
"use client";

import useAuth from "@/Auth/hooks/useAuth";

const Example = () => {
  const { user } = useAuth();

  return (
    <div>
      Welcome {user?.displayName}
    </div>
  );
};
```

`useAuth()` must be used inside an `AuthProvider`.

---

# 7. `context/AuthGuard.jsx`

```text
Auth/context/AuthGuard.jsx
```

`AuthGuard` protects pages that require authentication.

For example:

```jsx
<AuthGuard>
  <Dashboard />
</AuthGuard>
```

If the user is authenticated:

```text
Dashboard
```

is displayed.

If the user is not authenticated:

```text
/login
```

is used instead.

This allows protected pages to remain simple.

---

# 8. `components/LoginForm.jsx`

```text
Auth/components/LoginForm.jsx
```

Contains the reusable login form.

It handles:

* Email
* Password
* React Hook Form validation
* Email/password login
* Google login
* Firebase authentication errors
* Redirecting after successful login

The page itself doesn't need to contain all of the form logic.

Example:

```jsx
import LoginForm from "@/Auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
```

---

# 9. `components/RegisterForm.jsx`

```text
Auth/components/RegisterForm.jsx
```

Contains the registration form.

It handles:

* Name
* Email
* Password
* Confirm password
* Password validation
* Email/password registration
* Google registration/login
* Firebase errors
* Redirect after registration

Example:

```jsx
import RegisterForm from "@/Auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main>
      <RegisterForm />
    </main>
  );
}
```

---

# 10. `components/ForgotPasswordForm.jsx`

```text
Auth/components/ForgotPasswordForm.jsx
```

Contains the password reset form.

The user enters their email and Firebase sends the password reset email.

Example:

```jsx
import ForgotPasswordForm from "@/Auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main>
      <ForgotPasswordForm />
    </main>
  );
}
```

---

# 11. Authentication Flow

The basic flow looks like this:

```text
User
 │
 ▼
LoginForm / RegisterForm
 │
 ▼
useAuth()
 │
 ▼
AuthContext
 │
 ▼
authService.js
 │
 ▼
Firebase Authentication
 │
 ▼
Firebase User
 │
 ▼
AuthContext
 │
 ▼
Application
```

The application doesn't need to directly manage passwords or Firebase authentication state.

Firebase handles the authentication credentials.

---

# 12. Firebase Authentication Providers

Currently supported:

```text
Email / Password
Google
```

The system is structured so additional Firebase providers can be added later.

For example:

```text
Email / Password
Google
GitHub
Apple
Microsoft
etc.
```

The provider-specific logic should remain inside:

```text
Auth/services/authService.js
```

and the Firebase configuration should remain inside:

```text
Auth/lib/firebase.js
```

---

# 13. React Hook Form

The authentication forms use:

```text
react-hook-form
```

This keeps form state and validation inside the individual form components.

For example:

```js
const {
  register,
  handleSubmit,
  formState: {
    errors,
    isSubmitting,
  },
} = useForm();
```

The forms can therefore be modified independently without changing the authentication system itself.

---

# 14. Required Packages

The host project needs these packages:

```bash
npm install firebase react-hook-form lucide-react
```

If the project already has these packages installed, nothing else is required.

---

# 15. Firebase Environment Variables

Create:

```text
.env.local
```

in the root of the Next.js application.

Add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

These values come from the Firebase project configuration.

---

# 16. Firebase Setup

In Firebase Console:

1. Create a Firebase project.
2. Add a Web App.
3. Copy the Firebase configuration.
4. Add the values to `.env.local`.
5. Open **Authentication**.
6. Enable **Email/Password**.
7. Enable **Google**.
8. Configure the authorized domains if necessary.

The Auth folder then handles the client-side authentication.

---

# 17. Add AuthProvider

The application must wrap its content with:

```jsx
<AuthProvider>
  {children}
</AuthProvider>
```

For an App Router project, this is normally done in:

```text
app/layout.jsx
```

Example:

```jsx
import { AuthProvider } from "@/Auth/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

This makes authentication state available throughout the application.

---

# 18. Creating Authentication Pages

The Auth folder intentionally contains **components**, not application routes.

The host application decides where the pages live.

For example:

```text
app/
│
├── login/
│   └── page.jsx
│
├── register/
│   └── page.jsx
│
└── forgot-password/
    └── page.jsx
```

### Login

```jsx
import LoginForm from "@/Auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
```

### Register

```jsx
import RegisterForm from "@/Auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main>
      <RegisterForm />
    </main>
  );
}
```

### Forgot Password

```jsx
import ForgotPasswordForm from "@/Auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main>
      <ForgotPasswordForm />
    </main>
  );
}
```

This is intentional.

The Auth folder provides authentication functionality.

The application decides how that functionality is routed and displayed.

---

# 19. Protecting a Page

For a protected page:

```jsx
"use client";

import AuthGuard from "@/Auth/context/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>
        Dashboard
      </div>
    </AuthGuard>
  );
}
```

A common pattern is to place `AuthGuard` inside a dashboard layout instead, so every page underneath the layout is protected.

---

# 20. Getting the Current User

Any client component can access the current user:

```jsx
"use client";

import useAuth from "@/Auth/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h1>{user?.displayName}</h1>

      <p>{user?.email}</p>
    </div>
  );
}
```

Firebase provides information such as:

```js
user.uid
user.email
user.displayName
user.photoURL
user.emailVerified
user.providerData
```

---

# 21. Logging Out

Logout is available through `useAuth()`:

```jsx
"use client";

import useAuth from "@/Auth/hooks/useAuth";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button onClick={handleLogout}>
      Sign out
    </button>
  );
}
```

The authentication state automatically updates after Firebase signs the user out.

---

# 22. Getting the Firebase ID Token

The AuthContext provides:

```js
getIdToken()
```

Example:

```js
const { getIdToken } = useAuth();

const token = await getIdToken();
```

The token is a Firebase authentication token associated with the current user.

If an application later needs to communicate with its own backend, this token can be used as part of that integration.

The Auth module itself does **not** require a backend.

---

# 23. Important: Firebase vs Application User Data

Firebase manages authentication.

For example:

```text
Email
Password
Google account
UID
Authentication session
```

The application can separately maintain its own user information if required.

For example:

```text
name
role
subscription
organization
preferences
profile information
etc.
```

The Auth folder should not become responsible for the application's entire user-management system.

Its primary responsibility is:

```text
Who is authenticated?
```

---

# 24. What The Host Application Must Do

After copying the `Auth` folder into a project:

### Step 1 — Install packages

```bash
npm install firebase react-hook-form lucide-react
```

### Step 2 — Add Firebase environment variables

```text
.env.local
```

### Step 3 — Add `AuthProvider`

```jsx
<AuthProvider>
  {children}
</AuthProvider>
```

### Step 4 — Create application routes

For example:

```text
app/login/page.jsx
app/register/page.jsx
app/forgot-password/page.jsx
```

### Step 5 — Import the components

```jsx
import LoginForm from "@/Auth/components/LoginForm";
```

### Step 6 — Protect private areas

Use:

```jsx
<AuthGuard>
  ...
</AuthGuard>
```

That's it.

---

# 25. Philosophy of the Auth Folder

The Auth folder is designed to be **portable**.

Instead of having authentication files scattered around a project:

```text
context/
hooks/
services/
lib/
components/
```

authentication-related files stay together:

```text
Auth/
```

The application can therefore treat the entire folder as a reusable module.

```text
Copy Auth/
       │
       ▼
Paste into another Next.js project
       │
       ▼
Configure Firebase
       │
       ▼
Wrap app with AuthProvider
       │
       ▼
Create routes
       │
       ▼
Authentication is ready
```

---

# 26. Quick Reference

| File                                | Purpose                            |
| ----------------------------------- | ---------------------------------- |
| `lib/firebase.js`                   | Initializes Firebase               |
| `services/authService.js`           | Firebase authentication operations |
| `context/AuthContext.jsx`           | Global authentication state        |
| `context/AuthGuard.jsx`             | Protects authenticated pages       |
| `hooks/useAuth.js`                  | Accesses authentication state      |
| `components/LoginForm.jsx`          | Login UI                           |
| `components/RegisterForm.jsx`       | Registration UI                    |
| `components/ForgotPasswordForm.jsx` | Password reset UI                  |

---

# 27. The Simplest Mental Model

If you forget everything else, remember:

```text
firebase.js
    ↓
authService.js
    ↓
AuthContext
    ↓
useAuth()
    ↓
Components / App
```

And for protected pages:

```text
AuthGuard
    ↓
Firebase authentication state
    ↓
Authenticated → show page
Not authenticated → /login
```

The `Auth` folder owns authentication.

The main application owns the rest.
