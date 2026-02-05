# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Docker Compose (Monorepo)

Run everything (Postgres + backend + frontend):

```bash
docker compose up --build
```

Services:
- Postgres on `localhost:5432`
- Backend on `http://localhost:8080`
- Frontend on `http://localhost:5173`

Database migrations and seed:
- The backend container runs `prisma migrate deploy` and `prisma db seed` on startup.
- Re-run seed manually if needed:

```bash
docker compose exec backend npm run prisma:seed
```

API base URL in the frontend:
- Vite reads `VITE_API_URL`. Default is `http://localhost:8080`.
- Update via `docker-compose.yml` or your shell env if needed.

## Development compose

Use the dedicated `docker-compose.dev.yml` file for development with hot reloading and bind mounts (it reuses the same `.env` defaults):

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Backend runs `npm run dev` with `./backend` mounted into `/app`.
- Frontend runs `npm run dev` with Vite’s dev server and watched source files mounted.
- Anonymous volumes (`backend_node_modules`, `frontend_node_modules`) keep the container-installed dependencies available alongside the host mounts.

Before your first development run (or after clearing the volumes) install dependencies inside the containers:

```bash
docker compose -f docker-compose.dev.yml run --rm backend npm install
docker compose -f docker-compose.dev.yml run --rm frontend npm install
```

If those volumes become stale, reset them:

```bash
docker compose -f docker-compose.dev.yml down
docker volume rm website-job4-you_frontend_node_modules website-job4-you_backend_node_modules
```

Then rerun the dev compose command above.

If you later need a clean production image without mounts, use the base compose file explicitly:

```bash
docker compose -f docker-compose.yml up --build
```

## Auth Flow

Endpoints:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

Flow:
- Register/login returns `{ user, accessToken }` and sets an httpOnly `refreshToken` cookie.
- Access token is sent in `Authorization: Bearer <token>`.
- Refresh rotates the refresh token and returns a new access token.

Cookie settings (local defaults):
- `COOKIE_SECURE=false`
- `COOKIE_SAMESITE=lax`
- `FRONTEND_ORIGIN=http://localhost:5173`

Examples are in `backend/requests.http`.
