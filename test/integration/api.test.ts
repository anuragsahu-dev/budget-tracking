/**
 * Integration Tests - API Routes
 */

import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("GET /health", () => {
  it("returns 200 with healthy status", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
  });
});

describe("POST /api/v1/auth/start", () => {
  it("returns 400 for invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/start")
      .send({ email: "invalid" });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/users/profile", () => {
  it("returns 401 without auth token", async () => {
    const res = await request(app).get("/api/v1/users/profile");

    expect(res.status).toBe(401);
  });
});

describe("GET /api/v1/unknown", () => {
  it("returns 404 for unknown route", async () => {
    const res = await request(app).get("/api/v1/unknown");

    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/categories", () => {
  it("returns 401 without auth token", async () => {
    const res = await request(app).get("/api/v1/categories");

    expect(res.status).toBe(401);
  });
});
