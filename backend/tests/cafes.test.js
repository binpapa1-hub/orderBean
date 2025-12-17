const request = require('supertest');
const express = require('express');
const cafeRoutes = require('../routes/cafes');
const Cafe = require('../models/Cafe');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api/cafes', cafeRoutes);

describe('Cafe Routes', () => {
  let merchant;
  let testCafe;

  beforeEach(async () => {
    // Create a merchant user
    merchant = new User({
      name: 'Merchant',
      email: 'merchant@example.com',
      password: 'password123',
      role: 'merchant'
    });
    await merchant.save();

    // Create a test cafe
    testCafe = new Cafe({
      name: 'Test Cafe',
      address: '123 Test Street',
      location: {
        latitude: 37.5665,
        longitude: 126.9780
      },
      phone: '02-1234-5678',
      merchantId: merchant._id,
      isOpen: true
    });
    await testCafe.save();
  });

  describe('GET /api/cafes', () => {
    it('should get all open cafes', async () => {
      // Create another cafe
      const cafe2 = new Cafe({
        name: 'Second Cafe',
        address: '456 Test Avenue',
        location: {
          latitude: 37.5650,
          longitude: 126.9790
        },
        merchantId: merchant._id,
        isOpen: true
      });
      await cafe2.save();

      const res = await request(app)
        .get('/api/cafes');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should not return closed cafes', async () => {
      const closedCafe = new Cafe({
        name: 'Closed Cafe',
        address: '789 Test Road',
        location: {
          latitude: 37.5640,
          longitude: 126.9800
        },
        merchantId: merchant._id,
        isOpen: false
      });
      await closedCafe.save();

      const res = await request(app)
        .get('/api/cafes');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Test Cafe');
    });

    it('should filter cafes by location and radius', async () => {
      const res = await request(app)
        .get('/api/cafes')
        .query({
          latitude: 37.5665,
          longitude: 126.9780,
          radius: 5
        });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return empty array if no cafes in radius', async () => {
      const res = await request(app)
        .get('/api/cafes')
        .query({
          latitude: 0,
          longitude: 0,
          radius: 1
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /api/cafes/:id', () => {
    it('should get a single cafe by id', async () => {
      const res = await request(app)
        .get(`/api/cafes/${testCafe._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Test Cafe');
      expect(res.body.address).toBe('123 Test Street');
    });

    it('should return 404 if cafe not found', async () => {
      const fakeId = new require('mongoose').Types.ObjectId();
      const res = await request(app)
        .get(`/api/cafes/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Cafe not found');
    });

    it('should return 500 if invalid id format', async () => {
      const res = await request(app)
        .get('/api/cafes/invalid-id');

      expect(res.statusCode).toBe(500);
    });
  });
});

