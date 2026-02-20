const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/support_desk_lite_test");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth API", () => {

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
        role: "customer"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should login with valid credentials and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

});

describe("Ticket API", () => {

  let customerToken;
  let customer2Token;
  let agentToken;
  let ticketId;

  beforeAll(async () => {
    // Register and login customer 1
    await request(app).post("/api/auth/register").send({
      name: "Customer One",
      email: "customer1@test.com",
      password: "password123",
      role: "customer"
    });
    const customer1Login = await request(app).post("/api/auth/login").send({
      email: "customer1@test.com",
      password: "password123"
    });
    customerToken = customer1Login.body.data.accessToken;

    // Register and login customer 2
    await request(app).post("/api/auth/register").send({
      name: "Customer Two",
      email: "customer2@test.com",
      password: "password123",
      role: "customer"
    });
    const customer2Login = await request(app).post("/api/auth/login").send({
      email: "customer2@test.com",
      password: "password123"
    });
    customer2Token = customer2Login.body.data.accessToken;

    // Register and login agent
    await request(app).post("/api/auth/register").send({
      name: "Agent One",
      email: "agent1@test.com",
      password: "password123",
      role: "agent"
    });
    const agentLogin = await request(app).post("/api/auth/login").send({
      email: "agent1@test.com",
      password: "password123"
    });
    agentToken = agentLogin.body.data.accessToken;

    // Create ticket as customer 1
    const ticketRes = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        title: "Test ticket for testing",
        description: "This is a test ticket description",
        priority: "medium"
      });
    ticketId = ticketRes.body.data._id;
  });

  // TEST 3 - Customer cannot read another customer's ticket
  it("should return 403 when customer accesses another customer ticket", async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set("Authorization", `Bearer ${customer2Token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  // TEST 4 - Invalid status transition returns 400
  it("should return 400 for invalid status transition", async () => {
    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set("Authorization", `Bearer ${agentToken}`)
      .send({ status: "resolved" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // TEST 5 - Agent can change ticket status through valid transition
  it("should allow agent to change status through valid transition", async () => {
    const res = await request(app)
      .patch(`/api/tickets/${ticketId}/status`)
      .set("Authorization", `Bearer ${agentToken}`)
      .send({ status: "in_progress" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("in_progress");
  });

  // TEST 6 - Pagination returns correct shape
  it("should return correct pagination shape", async () => {
    const res = await request(app)
      .get("/api/tickets?page=1&limit=10")
      .set("Authorization", `Bearer ${agentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("tickets");
    expect(res.body.data).toHaveProperty("page");
    expect(res.body.data).toHaveProperty("limit");
    expect(res.body.data).toHaveProperty("total");
    expect(res.body.data).toHaveProperty("pages");
  });

});