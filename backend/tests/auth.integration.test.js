const request = require("supertest");
const app = require("../server");
const chai = require("chai");
const expect = chai.expect;

describe("Authentication and Authorization API", () => {
  let token;

  describe("POST /auth/register", () => {
    it("should register a new user", (done) => {
      request(app)
        .post("/auth/register")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "password",
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body)
            .to.have.property("message")
            .equal("User registered successfully");
          done();
        });
    });
  });

  describe("POST /auth/login", () => {
    it("should login an existing user and return a JWT token", (done) => {
      request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password" })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body)
            .to.have.property("message")
            .equal("Login successful");
          expect(res.body).to.have.property("token");
          token = res.body.token; // Save token for future requests
          done();
        });
    });
  });

  describe("Protected Routes", () => {
    it("should return 401 Unauthorized without JWT token", (done) => {
      request(app).get("/courses").expect(401, done);
    });

    it("should return 403 Forbidden with invalid JWT token", (done) => {
      request(app)
        .get("/courses")
        .set("Authorization", "Bearer invalid_token")
        .expect(403, done);
    });

    it("should return data with valid JWT token", (done) => {
      request(app)
        .get("/courses")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          // Add assertions for the expected data
          done();
        });
    });
  });
});
