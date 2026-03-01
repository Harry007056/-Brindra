# -Brindra

## 🌿 Soft Blue Nature Theme

This project uses a calming, modern workspace theme inspired by nature. Key characteristics:

- **Primary Color:** Soft Sky Blue (#4A90E2)
- **Secondary Color:** Light Teal / Mint Green (#A8E6CF)
- **Accent:** Leaf Green (#6B8E23)
- **Background:** Very light blue/white gradient with subtle leaf pattern
- **Typography:** Inter font
- **UI Elements:** Rounded buttons (12px radius), soft shadows, minimalistic cards with glass effect
- **Interactions:** Smooth hover animations, gentle transforms
- **Icons:** Feather or Heroicons style recommended

Use the CSS variables defined in `frontend/src/index.css` to maintain theme consistency. Feel free to extend with more nature-inspired assets such as wave shapes or leaf overlays.

### 🚀 Running the Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

The app uses React + Vite, Tailwind CSS for utility classes, React Router for navigation, Axios for API calls, and React Toastify for notifications.

### 🧱 Project Structure

- `src/pages/` – individual route components (Login, Dashboard, Projects, etc.)
- `src/components/` – shared UI pieces like `Layout`, `Spinner`
- `src/api.js` – axios instance with base URL and auth interceptor
- `src/index.css` – global styles with Tailwind directives and theme variables

### 🛠️ Features Implemented

- Authentication pages with API integration stubs
- Dashboard with animated stats and quick actions
- Projects page supporting kanban/list view, task cards with avatars and progress
- Teams page showing member cards with avatars, roles, status and actions
- Chat page with conversation list, message bubbles, file/emoji buttons, typing indicator
- Profile page with editable fields, photo, activity history, security section
- Settings page with account preferences, notifications, privacy, theme, and security toggles
- Sidebar navigation including Settings
- Toast notifications and loading states
- API config file (`api.js`)
- Tailwind configuration extended with theme colours

For additional UI enhancements (empty states, modals, glass morphism) look at the corresponding components. Feel free to customize further.

## Backend Setup (Phase 1)

1. Open a terminal in `backend`.
2. Copy env file: `copy .env.example .env`
3. Set `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` in `.env`.
4. Install packages: `npm install`
5. Start API: `npm run dev`

### Auth and Workspace API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/workspaces`
- `POST /api/workspaces`
- `GET /api/workspaces/:workspaceId/members`
- `POST /api/workspaces/:workspaceId/invites`
- `POST /api/workspaces/invites/:token/accept`
