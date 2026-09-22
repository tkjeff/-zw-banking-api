# ZW Banking API

A secure RESTful banking API built with **Node.js, Express.js, PostgreSQL, and Prisma**.

## Features

* Customer management
* Bank account management
* Account deposits
* Account withdrawals
* Account-to-account transfers
* Transaction history
* JWT authentication
* Role-based access control
* Password hashing with bcrypt
* Zod request validation
* Atomic database transactions
* Audit logging
* PostgreSQL database with Prisma ORM

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* JWT
* bcryptjs
* Zod
* REST API

## Roles

The API supports:

* **TELLER**
* **MANAGER**
* **ADMIN**

Protected banking endpoints require authentication, while administrative endpoints require the appropriate role.

## API Structure

```text
src/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── app.js
└── server.js

prisma/
└── schema.prisma
```

## Main Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Customers

```text
POST /api/customers
GET /api/customers
GET /api/customers/:id
```

### Accounts

```text
POST /api/accounts
GET /api/accounts
GET /api/accounts/:id
```

### Transactions

```text
POST /api/transactions/deposit
POST /api/transactions/withdraw
POST /api/transactions/transfer
GET /api/transactions/account/:accountId
```

### Administration

```text
GET /api/admin/dashboard
```

## Security

* JWT-based authentication
* Role-based authorization
* bcrypt password hashing
* Environment-based secrets
* Protected banking routes
* Input validation with Zod
* Atomic financial transactions using Prisma
* Audit logging for financial operations

## Running Locally

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example` and configure the PostgreSQL connection and JWT secret.

Run the development server:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

## Important

Never commit `.env` or production secrets to GitHub.
