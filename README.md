# TaskFlow

> A full-stack project & task management platform — built during my internship at Compu-Vision.

TaskFlow is a MERN-style application: a secure REST API built with **Express + MongoDB**, and a
**React** admin dashboard that consumes it. Users sign in with email and password, receive a JWT,
and manage their own projects and the tasks inside them. Every record is scoped to its owner — you
can only ever see and touch your own data.

<p align="left">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express_5-000000?style=flat&logo=express&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white">
  <img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black">
  <img alt="React Router" src="https://img.shields.io/badge/React_Router_7-CA4245?style=flat&logo=reactrouter&logoColor=white">
  <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white">
</p>

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Database design](#database-design)
- [Authentication flow](#authentication-flow)
- [Authorization model](#authorization-model)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Development log](#development-log)
- [Roadmap](#roadmap)

---

## Features

**Backend API**
- 🔐 Email + password registration and login, passwords hashed with **bcrypt**
- 🎟️ Stateless **JWT** sessions (`Bearer` tokens, configurable expiry)
- 🛡️ `protect` middleware guarding every project and task route
- 📁 Full **CRUD** for projects, scoped to the logged-in owner
- ✅ Full **CRUD** for tasks, with ownership derived from the parent project
- 🔗 Populated responses — tasks come back with their project name and assignee details
- 🚦 Server only starts listening **after** MongoDB connects, so there's no window where the API answers without a database

**Admin dashboard**
- 🔑 Login page that stores the JWT and redirects into the app
- 🧭 Persistent sidebar layout with active-link highlighting and logout
- 🚧 `ProtectedRoute` wrapper — no token, no dashboard
- 📊 Dashboard with live counts (projects, tasks, to-do / in-progress / done) and a recent-tasks list
- 📝 Projects and Tasks pages with inline create / edit / delete, loading and saving states, client-side validation, and empty-state guidance
- 🤝 Axios instance with a request interceptor that attaches the token to every call automatically

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js (CommonJS) |
| API framework | Express 5 |
| Database | MongoDB |
| ODM | Mongoose 9 |
| Auth | jsonwebtoken + bcryptjs |
| Config | dotenv |
| Cross-origin | cors |
| Frontend | React 19 (Create React App) |
| Routing | React Router 7 |
| HTTP client | Axios |
| Dev tooling | nodemon |

---

## Architecture

```mermaid
flowchart LR
    subgraph Client["🖥️ Admin Dashboard — React 19"]
        LP["Login"]
        PR["ProtectedRoute"]
        AL["AdminLayout + Sidebar"]
        DSH["Dashboard"]
        PRJ["Projects"]
        TSK["Tasks"]
        AX["axios instance<br/>request interceptor<br/>adds Bearer token"]

        LP --> PR --> AL
        AL --> DSH & PRJ & TSK
        DSH & PRJ & TSK --> AX
        LP --> AX
    end

    subgraph API["⚙️ REST API — Express 5"]
        SRV["server.js<br/>cors · json · routes"]
        AUTHR["/api/auth"]
        PROJR["/api/projects"]
        TASKR["/api/tasks"]
        MW["protect middleware<br/>verify JWT → req.user"]
        AC["authController"]
        PC["projectController"]
        TC["taskController"]

        SRV --> AUTHR & PROJR & TASKR
        AUTHR --> AC
        PROJR --> MW --> PC
        TASKR --> MW --> TC
        AUTHR -.->|"/me"| MW
    end

    subgraph DB["🍃 MongoDB — Mongoose"]
        U[("users")]
        P[("projects")]
        T[("tasks")]
    end

    AX -->|"HTTPS + JSON<br/>Authorization: Bearer &lt;jwt&gt;"| SRV
    AC --> U
    PC --> P
    TC --> T
    TC --> P
    MW --> U
```

---

## Database design

Three collections, related by `ObjectId` references. A **User** owns many **Projects**; a **Project**
holds many **Tasks**; a **Task** may be assigned to a **User**.

```mermaid
erDiagram
    USER ||--o{ PROJECT : "owns"
    PROJECT ||--o{ TASK : "contains"
    USER ||--o{ TASK : "is assigned"

    USER {
        ObjectId _id PK
        String   name        "required"
        String   email       "required, unique, lowercase"
        String   password    "bcrypt hash, select false"
        String   role        "enum admin or member, default member"
        Date     createdAt   "defaults to now"
    }

    PROJECT {
        ObjectId _id         PK
        String   name        "required"
        String   description "optional"
        ObjectId owner       FK "references User"
        Date     createdAt   "defaults to now"
    }

    TASK {
        ObjectId _id         PK
        String   title       "required"
        String   description "optional"
        String   status      "enum todo, in-progress or done, default todo"
        ObjectId project     FK "references Project"
        ObjectId assignee    FK "references User"
        Date     createdAt   "defaults to now"
    }
```

### Task lifecycle

`status` is constrained by the schema enum, and the dashboard counts each bucket:

```mermaid
stateDiagram-v2
    [*] --> todo: task created (default)
    todo --> in_progress: work starts
    in_progress --> done: work finishes
    done --> in_progress: reopened
    in_progress --> todo: pushed back
    done --> [*]
```

> **Note on cascades:** deletes are currently non-cascading — removing a project leaves its tasks in
> the collection. Cascading cleanup is on the [roadmap](#roadmap).

---

## Authentication flow

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant R as React admin
    participant LS as localStorage
    participant A as Express API
    participant M as protect middleware
    participant DB as MongoDB

    U->>R: submits email + password
    R->>A: POST /api/auth/login
    A->>DB: User.findOne(email).select("+password")
    DB-->>A: user document (with hash)
    A->>A: bcrypt.compare(password, hash)
    alt credentials valid
        A->>A: jwt.sign({ id }, JWT_SECRET, { expiresIn })
        A-->>R: 200 { _id, name, email, role, token }
        R->>LS: store token + user
        R-->>U: redirect to /
    else credentials invalid
        A-->>R: 401 "Invalid email or password"
        R-->>U: show error
    end

    Note over R,A: every later request

    R->>LS: read token (axios interceptor)
    R->>A: GET /api/projects — Authorization: Bearer <jwt>
    A->>M: protect
    M->>M: jwt.verify(token, JWT_SECRET)
    M->>DB: User.findById(decoded.id)
    DB-->>M: user
    M->>A: req.user = user → next()
    A->>DB: Project.find({ owner: req.user._id })
    DB-->>A: owned projects only
    A-->>R: 200 [ ...projects ]
```

---

## Authorization model

Authentication proves *who you are*; these checks decide *what you may touch*.

| Resource | Rule | On violation |
| --- | --- | --- |
| `GET /api/projects` | Query is filtered to `{ owner: req.user._id }` | Other users' projects are simply never returned |
| `GET/PUT/DELETE /api/projects/:id` | `project.owner` must equal `req.user._id` | `403 Forbidden` |
| `POST /api/tasks` | The target `project` must be owned by the caller | `403 Forbidden` |
| `GET /api/tasks` | Tasks are fetched only for projects the caller owns | Foreign tasks are never returned |
| `GET/PUT/DELETE /api/tasks/:id` | The task's parent project must be owned by the caller | `403 Forbidden` |
| Any protected route without a valid token | `protect` rejects before the controller runs | `401 Not authorized` |

Passwords are stored as bcrypt hashes (10 salt rounds) and the `password` field is marked
`select: false`, so it never leaks into a normal query result — the login handler opts in explicitly
with `.select("+password")`.

---

## Project structure

```
TaskFlow/
├── server.js                     # App entry — middleware, route mounting, DB-then-listen startup
├── .env.example                  # Backend environment template
├── package.json
│
├── src/                          # ── Backend ──────────────────────────────
│   ├── db.js                     # Mongoose connection (exits the process on failure)
│   ├── models/
│   │   ├── User.js               # Schema + pre-save bcrypt hook + matchPassword()
│   │   ├── Project.js            # Schema with owner → User
│   │   └── Task.js               # Schema with project → Project, assignee → User
│   ├── middleware/
│   │   └── auth.js               # protect: verifies the JWT and loads req.user
│   ├── controllers/
│   │   ├── authController.js     # register · login · getMe
│   │   ├── projectController.js  # CRUD + ownership checks
│   │   └── taskController.js     # CRUD + ownsProject() helper
│   └── routes/
│       ├── authRoutes.js         # /api/auth
│       ├── projectRoutes.js      # /api/projects  (all protected)
│       └── taskRoutes.js         # /api/tasks     (all protected)
│
└── admin/                        # ── Frontend (Create React App) ──────────
    ├── .env.example              # REACT_APP_API_URL
    ├── package.json
    └── src/
        ├── App.js                # Router, Sidebar, AdminLayout, route tree
        ├── api/
        │   └── axios.js          # Pre-configured client + auth interceptor
        ├── components/
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx     # Stat cards + recent tasks
            ├── Projects.jsx      # Table + create/edit/delete form
            └── Tasks.jsx         # Table + create/edit/delete form with project picker
```

---

## Getting started

### Prerequisites

- **Node.js** 18 or newer
- A **MongoDB** database — a local `mongod` instance or a free MongoDB Atlas cluster

### 1. Clone the repository

```bash
git clone https://github.com/MichaelAzar-C/TaskFlow.git
cd TaskFlow
```

### 2. Start the API

```bash
npm install
cp .env.example .env        # then fill in MONGO_URI and JWT_SECRET
npm run dev                 # nodemon — or `npm start` for plain node
```

The API comes up on `http://localhost:5000`. Hitting `/` should return `TaskFlow API is running`,
and the console prints `✅ MongoDB connected successfully` before the server begins listening.

### 3. Start the admin dashboard

In a second terminal:

```bash
cd admin
npm install
cp .env.example .env        # REACT_APP_API_URL=http://localhost:5000/api
npm start
```

The dashboard opens on `http://localhost:3000`.

### 4. Create your first account

There is no sign-up screen yet, so register through the API once:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Michael","email":"michael@example.com","password":"secret123"}'
```

Then log in at `http://localhost:3000/login`, create a project, and start adding tasks to it.

---

## Environment variables

**Backend** — `.env` in the repository root:

| Variable | Description | Example |
| --- | --- | --- |
| `PORT` | Port the API listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/taskflow` |
| `JWT_SECRET` | Secret used to sign and verify tokens | *a long random string* |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |

**Frontend** — `admin/.env`:

| Variable | Description | Example |
| --- | --- | --- |
| `REACT_APP_API_URL` | Base URL of the API, including `/api` | `http://localhost:5000/api` |

> `.env` files are git-ignored. Only the `.env.example` templates are committed.

---

## API reference

Base URL: `http://localhost:5000/api`
🔒 = requires `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | `name`, `email`, `password` | Creates an account, returns the user + token. `409` if the email is taken. |
| `POST` | `/auth/login` | `email`, `password` | Returns the user + token. `401` on bad credentials. |
| `GET` | 🔒 `/auth/me` | — | Returns the currently authenticated user. |

### Projects — all 🔒

| Method | Endpoint | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/projects` | `name`, `description` | Creates a project owned by the caller. |
| `GET` | `/projects` | — | Lists the caller's projects. |
| `GET` | `/projects/:id` | — | One project. `403` if not the owner, `404` if missing. |
| `PUT` | `/projects/:id` | `name?`, `description?` | Partial update of the owned project. |
| `DELETE` | `/projects/:id` | — | Deletes the owned project. |

### Tasks — all 🔒

| Method | Endpoint | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/tasks` | `title`, `description`, `status`, `project`, `assignee?` | Creates a task in a project the caller owns. |
| `GET` | `/tasks` | — | Lists every task across the caller's projects, with `project` and `assignee` populated. |
| `GET` | `/tasks/:id` | — | One task, populated. |
| `PUT` | `/tasks/:id` | `title?`, `description?`, `status?`, `assignee?` | Partial update. |
| `DELETE` | `/tasks/:id` | — | Deletes the task. |

<details>
<summary><strong>Example: create a task</strong></summary>

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Design the database schema",
    "description": "Users, projects and tasks with references",
    "status": "in-progress",
    "project": "68c0f3a1b2c3d4e5f6a7b8c9"
  }'
```

</details>

---

## Development log

How the project came together, commit by commit.

```mermaid
gitGraph
    commit id: "Initial commit"
    commit id: "Express + MongoDB setup"
    commit id: "Projects & Tasks CRUD"
    commit id: "JWT authentication"
    commit id: "Admin layout + routing"
    commit id: "Secure every route"
    commit id: "Login page + interceptor"
    commit id: "Projects CRUD in UI"
    commit id: "Tasks CRUD in UI"
    commit id: "Dashboard + validation"
```

### Week 1 — building the API

| Step | What was done |
| --- | --- |
| **Project scaffold** | Set up Express, `cors`, JSON body parsing and `dotenv`; created `src/db.js` for the Mongoose connection and laid out the `models / controllers / routes / middleware` folder structure. |
| **Data model** | Defined the `User`, `Project` and `Task` schemas with their `ObjectId` references, the `status` and `role` enums, and `createdAt` defaults. |
| **CRUD endpoints** | Built five endpoints each for projects and tasks, wired through dedicated controllers and routers mounted at `/api/projects` and `/api/tasks`. |
| **Authentication** | Added bcrypt hashing via a `pre("save")` hook, a `matchPassword` instance method, register/login/me handlers, JWT signing, and the `protect` middleware. |

### Week 2 — the admin dashboard

| Day | What was done |
| --- | --- |
| **Day 1–2** | Created the React admin app, added React Router, the sidebar layout and `ProtectedRoute`. |
| **Hardening** | Applied `protect` to *every* project and task route, added per-record ownership checks (`403 Forbidden` on mismatch) and the `ownsProject` helper, scoped all list queries to the caller, and changed startup so the server only listens after MongoDB connects. Committed `.env.example` templates for both apps. |
| **Day 3** | Built the login page: posts credentials, stores the token and user in `localStorage`, and redirects. Added the shared axios instance whose request interceptor attaches the `Bearer` token to every call. |
| **Day 4** | Wired Projects and Tasks CRUD into the UI — tables, inline create/edit forms, delete confirmations, per-request loading and saving states, and error surfacing from API responses. |
| **Day 5** | Added the dashboard with stat cards and a recent-tasks list, client-side validation (minimum title length, project required), active-link highlighting in the sidebar, and refactored the routes so `AdminLayout` is a real layout route wrapping the protected pages. |

---

## Roadmap

Things the schema already anticipates, or that would be the natural next steps:

- [ ] **Sign-up page** — the `/auth/register` endpoint exists but has no UI yet
- [ ] **Assignee picker** — `Task.assignee` is modelled but not yet settable from the dashboard
- [ ] **Role-based access** — `User.role` (`admin` / `member`) is stored but not yet enforced
- [ ] **Team membership** — share a project with other users instead of strict single ownership
- [ ] **Cascading deletes** — remove a project's tasks along with the project
- [ ] **Kanban board** — drag tasks between `todo` / `in-progress` / `done`
- [ ] **Due dates & priorities** on tasks
- [ ] **Server-side validation** with a schema validator, plus a centralised error handler
- [ ] **Automated tests** for the API and the React pages
- [ ] **Token refresh / expiry handling** — auto-logout on a `401` response interceptor

---

## Author

**Michael Azar** — built during an internship at **Compu-Vision**.

[![GitHub](https://img.shields.io/badge/GitHub-MichaelAzar--C-181717?style=flat&logo=github)](https://github.com/MichaelAzar-C)
