# Flowwave Backend (Node + Express + Prisma + MongoDB)

This repository contains a secure backend scaffold for Flowwave.

Features:
- Node.js + Express API
- Prisma ORM with MongoDB connector
- JWT access tokens (short-lived) + rotating refresh tokens in httpOnly cookies
- Password hashing with bcrypt
- Account lockout logic, MFA (TOTP) helpers
- Rate limiting, Helmet, CSRF protection
- Mastercard client placeholder with mTLS support
- Docker + docker-compose for local development
- GitHub Actions CI workflow (lint, tests, audit)

Getting started:
1. Copy `.env.example` to `.env` and fill values (do not commit secrets).
2. Install dependencies: `npm ci`.
3. Generate Prisma client: `npx prisma generate`.
4. Push Prisma schema to DB: `npm run migrate` (uses `prisma db push`).
5. Seed: `npm run seed`.
6. Run: `npm run dev` or use `docker-compose up --build`.

Important security notes:
- Do NOT commit your Mastercard credentials. Use environment variables or a secrets manager.
- For production, use secure cookies, HTTPS, rotate keys, and connect to a managed secrets store.

Next steps I can implement on request:
- Full Mastercard virtual account/transaction integration implementation (requires sandbox creds and certs)
- Webhook handlers and reconciliation jobs
- Background worker (BullMQ/Redis) for retries and settlement
- Additional endpoints (wallet management, transactions list, admin reconciliation)

