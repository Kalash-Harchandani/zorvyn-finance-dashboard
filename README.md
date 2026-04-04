# Finance Data Processing and Access Control Dashboard

A robust backend architecture for managing financial records securely using Role-Based Access Control (RBAC). A lightweight React frontend is included purely for testing API consumption and verifying RBAC responses.

## Architecture Highlights
- **Layered Clean Architecture**: Strict separation of concerns (Routes -> Controllers -> Validation Middleware -> DB interaction).
- **Core Stack**: Data management with raw nested **MySQL** queries. Server with **Express.js** and **Node.js**. Built natively as ES modules.
- **Extensible RBAC**: Role-Permission mapping resides in the database, allowing granular control without massive hardcoded rule branches.
- **Micro-testing Frontend**: Uses default Create React App specifically designed to mirror the login state and showcase access errors correctly. 

## Requirements
- Node.js (v18+)
- MySQL (v8.0+)

## Quick Setup Guide

### 1. Database Setup
Create your local MySQL database space.
Create a `.env` file in the `server/` directory:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=zorvyn_finance
JWT_SECRET=supersecretjwtkey_12345
NODE_ENV=development
```

Run the initialization script from the `/server` folder to structurally seed tables, default permissions, and a test superadmin user:
```bash
cd server
npm run init-db
```
*(You may need to add `"init-db": "node scripts/initDb.js"` to your `server/package.json` scripts if not automatically set up).*

### 2. Run the Backend
```bash
cd server
npm start
```
By default, the backend hums optimally at `http://localhost:5000`.

### 3. Run the Frontend (UI Tester)
```bash
cd client
npm start
```
Head to `http://localhost:3000` to interact visually with the roles logic. Login with:
**Email**: `superadmin@zorvyn.com`
**Pass**: `superadmin123`

## Assumptions & Tradeoffs
1. **Lightweight Frontend**: The frontend deliberately lacks polish (e.g., specific creation modals, intricate routing) as its only responsibility is proving the robust backend endpoints process permissions accurately.
2. **Framework Abstinence**: Explicitly used raw SQL rather than high-level ORMs (Prisma, Sequelize) to demonstrate optimal DB query joining for dashboard aggregations and raw role-permission indexing.
