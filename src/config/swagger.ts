import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Budget Tracking API",
      version: "1.0.0",
      description: `API documentation for Budget Tracking Application

## Health Endpoints

Health check endpoints are mounted at \`/health\` (not under \`/api/v1\`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Liveness probe |
| GET | /health/live | Liveness probe alias |
| GET | /health/ready | Readiness probe (checks DB + Redis) |
| GET | /health/admin | Full diagnostics (Admin only, requires auth) |`,
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "API v1",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
          description: "JWT access token stored in cookie",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT access token in Authorization header",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            status: {
              type: "string",
              enum: ["fail", "error"],
              example: "fail",
            },
            message: { type: "string", example: "Error message" },
            errors: { type: "array", items: { type: "string" }, example: [] },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            statusCode: { type: "integer", example: 200 },
            message: { type: "string", example: "Success message" },
            data: { type: "object" },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            total: { type: "integer", example: 100 },
            totalPages: { type: "integer", example: 10 },
            hasNextPage: { type: "boolean", example: true },
            hasPrevPage: { type: "boolean", example: false },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User profile management" },
      { name: "Categories", description: "Category management" },
      { name: "Transactions", description: "Transaction management" },
      { name: "Budgets", description: "Budget management" },
      { name: "Analytics", description: "Analytics and reports" },
      { name: "Payments", description: "Payment processing" },
      { name: "Subscriptions", description: "Subscription management" },
      { name: "Admin", description: "Admin operations" },
    ],
  },
  apis: ["./src/modules/**/*.route.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
