# Budget Tracking API

A production-ready RESTful API for personal budget and expense tracking built with Node.js, Express, TypeScript, and PostgreSQL.

---

## Features

### Core Features

- **Transaction Management** - Track income and expenses with categories
- **Budget Planning** - Set monthly budgets with category allocations
- **Category Management** - System and custom categories for organizing transactions
- **Analytics & Reports** - Spending insights, trends, and budget comparisons

### Authentication & Security

- **OTP-based Authentication** - Passwordless login via email OTP
- **Google OAuth 2.0** - Social login integration
- **JWT Tokens** - Secure access and refresh token system
- **Session Management** - Multi-device session tracking with logout-all capability
- **Rate Limiting** - Redis-backed rate limiting for API protection

### Payments & Subscriptions

- **Razorpay Integration** - Payment processing with webhook support
- **Subscription Plans** - Free and Pro tier subscription management
- **Payment History** - Complete payment and invoice tracking

### Infrastructure

- **Background Jobs** - BullMQ for email queues and scheduled tasks
- **File Storage** - AWS S3 for avatar uploads with pre-signed URLs
- **Docker Swarm** - Production deployment with health checks
- **CI/CD** - GitHub Actions for testing, building, and deployment

---

## Tech Stack

| Category           | Technology                     |
| ------------------ | ------------------------------ |
| **Runtime**        | Node.js 22, TypeScript         |
| **Framework**      | Express 5                      |
| **Database**       | PostgreSQL (Neon), Prisma ORM  |
| **Cache/Queue**    | Redis (Upstash), BullMQ        |
| **Authentication** | JWT, Passport.js, Google OAuth |
| **Payments**       | Razorpay                       |
| **Storage**        | AWS S3                         |
| **Email**          | Nodemailer, Mailgen            |
| **Validation**     | Zod                            |
| **Documentation**  | Swagger/OpenAPI                |
| **Testing**        | Vitest, Supertest              |
| **Deployment**     | Docker, Docker Swarm, Caddy    |
| **CI/CD**          | GitHub Actions                 |

---

## Quick Start

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/anuragsahu-dev/budget-tracking.git
   cd budget-tracking
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start local services (PostgreSQL & Redis)**

   ```bash
   docker compose -f compose.dev.yaml up -d
   ```

5. **Run database migrations**

   ```bash
   npx prisma migrate dev
   npm run seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Access the API**
   - API: `http://localhost:3000/api/v1`
   - Swagger Docs: `http://localhost:3000/api-docs`
   - Health Check: `http://localhost:3000/health`

---

## Environment Variables

| Variable                  | Description                          | Required    |
| ------------------------- | ------------------------------------ | ----------- |
| `PORT`                    | Server port                          | Yes         |
| `NODE_ENV`                | Environment (development/production) | Yes         |
| `DATABASE_URL`            | PostgreSQL connection string         | Yes         |
| `REDIS_URL`               | Redis connection string (Upstash)    | Production  |
| `REDIS_HOST`              | Redis host (local development)       | Development |
| `REDIS_PORT`              | Redis port (local development)       | Development |
| `ACCESS_TOKEN_SECRET`     | JWT access token secret              | Yes         |
| `REFRESH_TOKEN_SECRET`    | JWT refresh token secret             | Yes         |
| `ACCESS_TOKEN_EXPIRY`     | Access token expiry (e.g., 15m)      | Yes         |
| `REFRESH_TOKEN_EXPIRY`    | Refresh token expiry (e.g., 7d)      | Yes         |
| `SALT_ROUNDS`             | Bcrypt salt rounds                   | Yes         |
| `CLIENT_URL`              | Frontend application URL             | Yes         |
| `APP_URL`                 | Backend API URL                      | Yes         |
| `SMTP_HOST`               | SMTP server host                     | Yes         |
| `SMTP_PORT`               | SMTP server port                     | Yes         |
| `SMTP_USER`               | SMTP username                        | Yes         |
| `SMTP_PASS`               | SMTP password                        | Yes         |
| `GOOGLE_CLIENT_ID`        | Google OAuth client ID               | Yes         |
| `GOOGLE_CLIENT_SECRET`    | Google OAuth client secret           | Yes         |
| `GOOGLE_CALLBACK_URL`     | Google OAuth callback URL            | Yes         |
| `RAZORPAY_KEY_ID`         | Razorpay key ID                      | Yes         |
| `RAZORPAY_KEY_SECRET`     | Razorpay key secret                  | Yes         |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret              | Yes         |
| `AWS_REGION`              | AWS region                           | Yes         |
| `AWS_ACCESS_KEY_ID`       | AWS access key                       | Yes         |
| `AWS_SECRET_ACCESS_KEY`   | AWS secret key                       | Yes         |
| `AWS_S3_BUCKET_NAME`      | S3 bucket name                       | Yes         |

---

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

### API Modules

| Module            | Endpoints                 | Description                       |
| ----------------- | ------------------------- | --------------------------------- |
| **Auth**          | `/api/v1/auth/*`          | Authentication, OTP, Google OAuth |
| **Users**         | `/api/v1/users/*`         | User profile, avatar management   |
| **Categories**    | `/api/v1/categories/*`    | Category CRUD operations          |
| **Transactions**  | `/api/v1/transactions/*`  | Transaction management            |
| **Budgets**       | `/api/v1/budgets/*`       | Budget planning and tracking      |
| **Analytics**     | `/api/v1/analytics/*`     | Reports and insights              |
| **Payments**      | `/api/v1/payments/*`      | Razorpay payments                 |
| **Subscriptions** | `/api/v1/subscriptions/*` | Subscription management           |
| **Admin**         | `/api/v1/admin/*`         | Admin operations                  |
| **Health**        | `/health/*`               | Health checks                     |

---

## Scripts

```bash
# Development
npm run dev           # Start development server with hot reload

# Build
npm run build         # Compile TypeScript to JavaScript

# Testing
npm test              # Run all tests
npm run test:unit     # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:coverage # Run tests with coverage report

# Linting
npm run lint          # Run ESLint

# Database
npm run seed          # Seed the database
npx prisma migrate dev    # Run migrations (development)
npx prisma migrate deploy # Run migrations (production)
npx prisma studio     # Open Prisma Studio
```

---

## Project Structure

```
src/
├── config/           # Configuration (database, redis, swagger, etc.)
├── generated/        # Prisma generated client
├── infrastructure/   # External services (S3, payments, etc.)
├── jobs/             # Background jobs (BullMQ queues & workers)
├── middlewares/      # Express middlewares
├── modules/          # Feature modules
│   ├── admin/        # Admin operations
│   ├── analytics/    # Analytics & reports
│   ├── auth/         # Authentication
│   ├── budget/       # Budget management
│   ├── category/     # Categories
│   ├── health/       # Health checks
│   ├── otp/          # OTP service
│   ├── payment/      # Payment processing
│   ├── session/      # Session management
│   ├── subscription/ # Subscriptions
│   ├── transaction/  # Transactions
│   └── user/         # User management
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── app.ts            # Express app setup
└── index.ts          # Server entry point

prisma/
├── schema.prisma     # Database schema
├── migrations/       # Database migrations
└── seed.ts           # Database seeding

test/
├── unit/             # Unit tests
└── integration/      # Integration tests

.github/
└── workflows/        # GitHub Actions workflows
    ├── ci.yaml       # Continuous Integration
    ├── build.yaml    # Docker image build
    ├── deploy.yaml   # Deployment to server
    └── migrate.yaml  # Database migrations
```

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.ts
```

---

## License

This project is licensed under the ISC License.

---

## Author

**Anurag Sahu**

- GitHub: [@anuragsahu-dev](https://github.com/anuragsahu-dev)

---

## Documentation

| Document                                 | Description                                              |
| ---------------------------------------- | -------------------------------------------------------- |
| [Setup Guide](docs/SETUP.md)             | Complete development setup with Docker and local options |
| [Payment System](docs/PAYMENT_SYSTEM.md) | Razorpay integration, payment flow, and webhook handling |
| [Architecture](docs/ARCHITECTURE.md)     | System design, tech choices, and module structure        |
