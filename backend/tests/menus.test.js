const request = require('supertest');
const express = require('express');
const menuRoutes = require('../routes/menus');
const Menu = require('../models/Menu');
const Cafe = require('../models/Cafe');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api/menus', menuRoutes);

describe('Menu Routes', () => {
  let merchant;
  let testCafe;
  let testMenu;

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
      merchantId: merchant._id,
      isOpen: true
    });
    await testCafe.save();

    // Create a test menu
    testMenu = new Menu({
      name: 'Americano',
      description: 'Hot Americano',
      category: 'coffee',
      price: 4000,
      cafeId: testCafe._id,
      isAvailable: true
    });
    await testMenu.save();
  });

  describe('GET /api/menus', () => {
    it('should get all available menus', async () => {
      // Create another menu
      const menu2 = new Menu({
        name: 'Latte',
        category: 'coffee',
        price: 5000,
        cafeId: testCafe._id,
        isAvailable: true
      });
      await menu2.save();

      const res = await request(app)
        .get('/api/menus');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should not return unavailable menus', async () => {
      const unavailableMenu = new Menu({
        name: 'Sold Out Item',
        category: 'coffee',
        price: 3000,
        cafeId: testCafe._id,
        isAvailable: false
      });
      await unavailableMenu.save();

      const res = await request(app)
        .get('/api/menus');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Americano');
    });

    it('should filter menus by cafeId', async () => {
      // Create another cafe and menu
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

      const menu2 = new Menu({
        name: 'Cafe2 Menu',
        category: 'coffee',
        price: 4500,
        cafeId: cafe2._id,
        isAvailable: true
      });
      await menu2.save();

      const res = await request(app)
        .get('/api/menus')
        .query({ cafeId: testCafe._id });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Americano');
    });

    it('should filter menus by category', async () => {
      const teaMenu = new Menu({
        name: 'Green Tea',
        category: 'tea',
        price: 3500,
        cafeId: testCafe._id,
        isAvailable: true
      });
      await teaMenu.save();

      const res = await request(app)
        .get('/api/menus')
        .query({ category: 'coffee' });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].category).toBe('coffee');
    });

    it('should filter menus by both cafeId and category', async () => {
      const teaMenu = new Menu({
        name: 'Green Tea',
        category: 'tea',
        price: 3500,
        cafeId: testCafe._id,
        isAvailable: true
      });
      await teaMenu.save();

      const res = await request(app)
        .get('/api/menus')
        .query({
          cafeId: testCafe._id,
          category: 'tea'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].category).toBe('tea');
    });
  });

  describe('GET /api/menus/:id', () => {
    it('should get a single menu by id', async () => {
      const res = await request(app)
        .get(`/api/menus/${testMenu._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Americano');
      expect(res.body.price).toBe(4000);
      expect(res.body.category).toBe('coffee');
    });

    it('should return 404 if menu not found', async () => {
      const fakeId = new require('mongoose').Types.ObjectId();
      const res = await request(app)
        .get(`/api/menus/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Menu item not found');
    });

    it('should populate cafe information', async () => {
      const res = await request(app)
        .get(`/api/menus/${testMenu._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.cafeId).toHaveProperty('name');
      expect(res.body.cafeId.name).toBe('Test Cafe');
    });
  });
});

