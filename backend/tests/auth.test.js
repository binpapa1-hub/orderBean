const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../routes/auth');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user for login tests
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer'
    });
    await testUser.save();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          phone: '010-1234-5678'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('newuser@example.com');
      expect(res.body.user.role).toBe('customer');
    });

    it('should return 400 if email already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test2@example.com',
          password: '12345'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should register with merchant role if specified', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Merchant User',
          email: 'merchant@example.com',
          password: 'password123',
          role: 'merchant'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.user.role).toBe('merchant');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if user does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should return 400 if password is incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      // First login to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe('test@example.com');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 401 if no token provided', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toBe(401);
    });

    it('should return 401 if token is invalid', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
    });
  });
});

