# Development Setup Guide

This guide will help you set up the Budget Tracking API for local development. Choose either the **Local Setup** (without Docker for the app) or **Docker Setup** (recommended for consistency).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Local Setup (Without Docker)](#local-setup-without-docker)
4. [Docker Setup (Recommended)](#docker-setup-recommended)
5. [Third-Party Services Configuration](#third-party-services-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have the following installed:

| Tool           | Version | Required For |
| -------------- | ------- | ------------ |
| Node.js        | 22+     | Local setup  |
| npm            | 10+     | Local setup  |
| Docker         | 24+     | Docker setup |
| Docker Compose | 2.20+   | Docker setup |
| Git            | 2.40+   | Both         |

---

## Environment Configuration

### 1. Clone the Repository

```bash
git clone https://github.com/anuragsahu-dev/budget-tracking.git
cd budget-tracking
```

### 2. Create Environment File

```bash
cp .env.example .env
```

### 3. Configure Required Variables

Open `.env` and configure the following:

#### Minimum Required for Development

```env
# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
APP_URL=http://localhost:3000

# Database (Local Docker)
DATABASE_URL=postgresql://postgres:password@localhost:5432/budgetdb

# Redis (Local Docker)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT (Generate secure random strings for production)
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
SALT_ROUNDS=10

# Email (Required for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

> **Note:** See [Third-Party Services Configuration](#third-party-services-configuration) for Razorpay and AWS S3 setup.

---

## Local Setup (Without Docker)

Use this approach if you want to run the Node.js app locally while using Docker only for PostgreSQL and Redis.

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Database and Redis (via Docker)

```bash
docker compose -f compose.dev.yaml up postgres redis -d
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Seed the Database

```bash
npm run seed
```

### 6. Start the Development Server

```bash
npm run dev
```

### 7. Access the Application

| Service      | URL                            |
| ------------ | ------------------------------ |
| API          | http://localhost:3000/api/v1   |
| Swagger Docs | http://localhost:3000/api-docs |
| Health Check | http://localhost:3000/health   |

---

## Docker Setup (Recommended)

Use this approach to run the entire stack (PostgreSQL, Redis, and the app) inside Docker containers. This ensures consistency across different development environments.

### First Time Setup

Run these commands in order to build and initialize the project from scratch:

```bash
# 1. Build the images (clean build with no cache)
docker compose -f compose.dev.yaml build --no-cache

# 2. Start all services in detached mode (background)
docker compose -f compose.dev.yaml up -d

# 3. Apply database migrations
docker compose -f compose.dev.yaml exec server npx prisma migrate dev

# 4. Seed database with initial data
docker compose -f compose.dev.yaml exec server npm run seed
```

### Access the Application

| Service      | URL                            |
| ------------ | ------------------------------ |
| API          | http://localhost:3000/api/v1   |
| Swagger Docs | http://localhost:3000/api-docs |
| Health Check | http://localhost:3000/health   |

---

### Daily Workflow

#### Start the App

Starts all services in the background:

```bash
docker compose -f compose.dev.yaml up -d
```

#### View Logs

Stream logs to your terminal:

```bash
docker compose -f compose.dev.yaml logs server
```

#### Stop the App

Stops and removes the containers (data is preserved):

```bash
docker compose -f compose.dev.yaml down
```

#### Full Reset (Delete Database Data)

Stops containers and removes volumes. Use this to start fresh:

```bash
docker compose -f compose.dev.yaml down -v
```

> **Warning:** This deletes all database data. You'll need to run migrations and seed again.

---

### Common Scenarios

#### What if I change the code?

**Action:** Just save the file. The app will auto-reload instantly via nodemon. No restart needed.

#### What if I update `package.json`?

**Action:** Rebuild to install new dependencies:

```bash
docker compose -f compose.dev.yaml up --build -d
```

#### What if I change `prisma/schema.prisma`?

**Action:** Create a new migration:

```bash
docker compose -f compose.dev.yaml exec server npx prisma migrate dev --name "your_migration_name"
```

#### What if I want to access the database directly?

**Action:** Use Prisma Studio:

```bash
# Local setup
npx prisma studio

# Docker setup
docker compose -f compose.dev.yaml exec server npx prisma studio
```

---

### Useful Docker Commands

| Command                                             | Description              |
| --------------------------------------------------- | ------------------------ |
| `docker compose -f compose.dev.yaml ps`             | List running containers  |
| `docker compose -f compose.dev.yaml logs -f`        | Stream all logs          |
| `docker compose -f compose.dev.yaml logs -f server` | Stream only app logs     |
| `docker compose -f compose.dev.yaml exec server sh` | Shell into app container |
| `docker compose -f compose.dev.yaml restart server` | Restart only the app     |
| `docker compose -f compose.dev.yaml down`           | Stop all containers      |
| `docker compose -f compose.dev.yaml down -v`        | Stop and remove volumes  |

---

## Third-Party Services Configuration

### Razorpay (Payments)

Razorpay is required for the payment and subscription features.

#### 1. Get Test Credentials

1. Create an account at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings → API Keys**
3. Click **Generate Test Key**
4. Copy the **Key ID** and **Key Secret**

#### 2. Configure Webhook (For Local Testing)

1. Install ngrok: `npm install -g ngrok`
2. Start your server: `npm run dev` or `docker compose up -d`
3. Expose your server: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. In Razorpay Dashboard → **Settings → Webhooks**:
   - URL: `https://abc123.ngrok.io/api/v1/payments/webhook`
   - Events: `payment.captured`, `payment.failed`
6. Copy the **Webhook Secret**

#### 3. Update `.env`

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

> **Learn More:** See [docs/PAYMENT_SYSTEM.md](PAYMENT_SYSTEM.md) for complete payment flow documentation.

---

### AWS S3 (Avatar Uploads)

AWS S3 is required for avatar uploads using pre-signed URLs.

#### 1. Create S3 Bucket

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click **Create bucket**
3. Choose a unique bucket name (e.g., `budget-tracker-avatars`)
4. Select your preferred region
5. Uncheck **Block all public access** (for avatar URLs to be accessible)
6. Create the bucket

#### 2. Configure CORS

In your bucket settings, add this CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://your-frontend-domain.com"
    ],
    "ExposeHeaders": ["ETag"]
  }
]
```

#### 3. Create IAM User

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create a new user with **Programmatic access**
3. Attach the `AmazonS3FullAccess` policy (or create a custom policy for your bucket)
4. Save the **Access Key ID** and **Secret Access Key**

#### 4. Update `.env`

```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_S3_BUCKET_NAME=your-bucket-name
```

---

### Google OAuth (Optional)

Required for "Login with Google" feature.

#### 1. Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Add authorized redirect URI: `http://localhost:3000/api/v1/auth/google/callback`

#### 2. Update `.env`

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000
# or on Windows
netstat -ano | findstr :3000

# Kill the process
kill -9 <PID>
```

### Database Connection Failed

1. Ensure PostgreSQL is running:
   ```bash
   docker compose -f compose.dev.yaml ps
   ```
2. Check if the `DATABASE_URL` in `.env` is correct
3. Wait a few seconds for the database to be ready after starting

### Redis Connection Failed

1. Ensure Redis is running:
   ```bash
   docker compose -f compose.dev.yaml ps
   ```
2. Check `REDIS_HOST` and `REDIS_PORT` in `.env`

### Prisma Migration Issues

```bash
# Reset the database (WARNING: Deletes all data)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

### Docker Build Issues

```bash
# Remove all containers and rebuild
docker compose -f compose.dev.yaml down -v
docker compose -f compose.dev.yaml build --no-cache
docker compose -f compose.dev.yaml up -d
```

---

## Next Steps

1. Access Swagger documentation at `http://localhost:3000/api-docs`
2. Test the authentication flow with OTP
3. Set up Razorpay for payment testing (see [docs/PAYMENT_SYSTEM.md](PAYMENT_SYSTEM.md))
4. Explore the API endpoints
