# planr2.0

A structured personal execution platform designed to translate long-term goals into actionable sprints, track measurable progress, and manage priorities using dependency-aware task planning.

## Firebase Integration (Auth + Firestore CRUD)

This project now supports:

- Email/password sign up
- Email/password sign in
- Google single sign-on
- Sign out
- User-scoped Firestore task CRUD:
	- Create tasks
	- Read tasks in real-time
	- Update task status (Done / Upcoming)
	- Delete tasks

Each user only works with their own tasks under the Firestore path:

- `users/{uid}/tasks/{taskId}`

## 1) Install dependencies

```bash
npm install
```

## 2) Configure Firebase

1. Create a Firebase project.
2. Enable Authentication -> Sign-in method -> Email/Password and Google.
3. Create a Firestore database.
4. Copy `.env.example` to `.env.local` and fill all values from your Firebase web app config:

```bash
cp .env.example .env.local
```

Required env keys:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 3) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Firestore Security Rules (recommended)

Use rules like these so users can only access their own documents:

```txt
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		match /users/{userId}/tasks/{taskId} {
			allow read, write: if request.auth != null && request.auth.uid == userId;
		}
	}
}
```

For production, use the hardened rules in `firestore.rules` and publish them from
Firebase Console or Firebase CLI.

## Route Protection

- Authenticated users visiting `/auth` are automatically redirected to `/dashboard`.
- Unauthenticated users visiting `/dashboard` are automatically redirected to `/auth`.

## Shared Validation

- Runtime input validation is centralized with Zod in `lib/validation.ts`.
- Auth and task write paths use shared schemas to keep client and service checks aligned.

## Toast Feedback

- Global toast notifications are provided by `components/providers/toast-provider.tsx`.
- Auth and dashboard actions use consistent success/error notifications.

## CI Checks

GitHub Actions workflow is available at `.github/workflows/ci.yml` and runs:

- `npm ci`
- `npm run lint`
- `npm run build`

## Deployment (Vercel)

### 1) Push repository

Push your project to GitHub (or GitLab/Bitbucket).

### 2) Create a Vercel project

1. Open Vercel dashboard and click **Add New Project**.
2. Import your repository.
3. Framework preset should be detected as **Next.js**.

### 3) Add production environment variables

In Vercel project settings -> Environment Variables, add all keys from `.env.example`
or `.env.production.example`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 4) Deploy

Trigger deployment from Vercel UI or with CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```

### 5) Firebase post-deploy settings (required for Google sign-in)

After first deploy, copy your production domain and add it in Firebase:

1. Firebase Console -> Authentication -> Settings -> Authorized domains.
2. Add your Vercel domain (for example `your-app.vercel.app`).

If custom domain is used, add that domain too.

### 6) Verify in production

- Sign up with email/password
- Sign in with Google
- Create, update, delete tasks
- Confirm Firestore writes under `users/{uid}/tasks`
