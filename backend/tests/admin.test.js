const request = require('supertest');
const express = require('express');
const adminRoutes = require('../routes/admin');
const Order = require('../models/Order');
const Menu = require('../models/Menu');
const Cafe = require('../models/Cafe');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

describe('Admin Routes', () => {
  let merchant;
  let customer;
  let testCafe;
  let testMenu;
  let merchantToken;
  let customerToken;

  beforeEach(async () => {
    // Create merchant user
    merchant = new User({
      name: 'Merchant',
      email: 'merchant@example.com',
      password: 'password123',
      role: 'merchant'
    });
    await merchant.save();

    // Create customer user
    customer = new User({
      name: 'Customer',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer'
    });
    await customer.save();

    // Create test cafe
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

    // Create test menu
    testMenu = new Menu({
      name: 'Americano',
      category: 'coffee',
      price: 4000,
      cafeId: testCafe._id,
      isAvailable: true
    });
    await testMenu.save();

    // Generate tokens
    merchantToken = jwt.sign(
      { userId: merchant._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '7d' }
    );

    customerToken = jwt.sign(
      { userId: customer._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '7d' }
    );
  });

  describe('GET /api/admin/orders', () => {
    it('should get all orders for merchant', async () => {
      const order = new Order({
        customerId: customer._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        paymentStatus: 'paid'
      });
      await order.save();

      const res = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${merchantToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get('/api/admin/orders');

      expect(res.statusCode).toBe(401);
    });

    it('should return 403 if user is not merchant or admin', async () => {
      const res = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(403);
    });

    it('should only return orders from merchant cafes', async () => {
      // Create another merchant and cafe
      const merchant2 = new User({
        name: 'Merchant 2',
        email: 'merchant2@example.com',
        password: 'password123',
        role: 'merchant'
      });
      await merchant2.save();

      const cafe2 = new Cafe({
        name: 'Second Cafe',
        address: '456 Test Avenue',
        location: {
          latitude: 37.5650,
          longitude: 126.9790
        },
        merchantId: merchant2._id,
        isOpen: true
      });
      await cafe2.save();

      const order2 = new Order({
        customerId: customer._id,
        cafeId: cafe2._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        paymentStatus: 'paid'
      });
      await order2.save();

      const res = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${merchantToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(0); // merchant has no orders yet
    });
  });

  describe('PATCH /api/admin/orders/:id/status', () => {
    it('should update order status successfully', async () => {
      const order = new Order({
        customerId: customer._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        status: 'pending',
        paymentStatus: 'paid'
      });
      await order.save();

      const res = await request(app)
        .patch(`/api/admin/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({ status: 'confirmed' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('confirmed');
    });

    it('should set actualPickupTime when status is ready', async () => {
      const order = new Order({
        customerId: customer._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        status: 'preparing',
        paymentStatus: 'paid'
      });
      await order.save();

      const res = await request(app)
        .patch(`/api/admin/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({ status: 'ready' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ready');
      expect(res.body.actualPickupTime).toBeDefined();
    });

    it('should return 400 if status is invalid', async () => {
      const order = new Order({
        customerId: customer._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        status: 'pending',
        paymentStatus: 'paid'
      });
      await order.save();

      const res = await request(app)
        .patch(`/api/admin/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({ status: 'invalid-status' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid status');
    });

    it('should return 404 if order not found', async () => {
      const fakeId = new require('mongoose').Types.ObjectId();
      const res = await request(app)
        .patch(`/api/admin/orders/${fakeId}/status`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({ status: 'confirmed' });

      expect(res.statusCode).toBe(404);
    });

    it('should return 403 if merchant does not own the cafe', async () => {
      const merchant2 = new User({
        name: 'Merchant 2',
        email: 'merchant2@example.com',
        password: 'password123',
        role: 'merchant'
      });
      await merchant2.save();

      const cafe2 = new Cafe({
        name: 'Second Cafe',
        address: '456 Test Avenue',
        location: {
          latitude: 37.5650,
          longitude: 126.9790
        },
        merchantId: merchant2._id,
        isOpen: true
      });
      await cafe2.save();

      const order = new Order({
        customerId: customer._id,
        cafeId: cafe2._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        status: 'pending',
        paymentStatus: 'paid'
      });
      await order.save();

      const res = await request(app)
        .patch(`/api/admin/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({ status: 'confirmed' });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/admin/menus', () => {
    it('should get menus for merchant cafes', async () => {
      const res = await request(app)
        .get('/api/admin/menus')
        .set('Authorization', `Bearer ${merchantToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Americano');
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get('/api/admin/menus');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/admin/menus', () => {
    it('should create a new menu item', async () => {
      const res = await request(app)
        .post('/api/admin/menus')
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({
          cafeId: testCafe._id,
          name: 'Cappuccino',
          category: 'coffee',
          price: 5000,
          isAvailable: true
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Cappuccino');
      expect(res.body.price).toBe(5000);
    });

    it('should return 403 if merchant does not own the cafe', async () => {
      const merchant2 = new User({
        name: 'Merchant 2',
        email: 'merchant2@example.com',
        password: 'password123',
        role: 'merchant'
      });
      await merchant2.save();

      const cafe2 = new Cafe({
        name: 'Second Cafe',
        address: '456 Test Avenue',
        location: {
          latitude: 37.5650,
          longitude: 126.9790
        },
        merchantId: merchant2._id,
        isOpen: true
      });
      await cafe2.save();

      const res = await request(app)
        .post('/api/admin/menus')
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({
          cafeId: cafe2._id,
          name: 'Latte',
          category: 'coffee',
          price: 4500
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PATCH /api/admin/menus/:id', () => {
    it('should update menu item', async () => {
      const res = await request(app)
        .patch(`/api/admin/menus/${testMenu._id}`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({
          price: 4500,
          isAvailable: false
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(4500);
      expect(res.body.isAvailable).toBe(false);
    });

    it('should return 404 if menu not found', async () => {
      const fakeId = new require('mongoose').Types.ObjectId();
      const res = await request(app)
        .patch(`/api/admin/menus/${fakeId}`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({ price: 5000 });

      expect(res.statusCode).toBe(404);
    });

    it('should return 403 if merchant does not own the cafe', async () => {
      const merchant2 = new User({
        name: 'Merchant 2',
        email: 'merchant2@example.com',
        password: 'password123',
        role: 'merchant'
      });
      await merchant2.save();

      const cafe2 = new Cafe({
        name: 'Second Cafe',
        address: '456 Test Avenue',
        location: {
          latitude: 37.5650,
          longitude: 126.9790
        },
        merchantId: merchant2._id,
        isOpen: true
      });
      await cafe2.save();

      const menu2 = new Menu({
        name: 'Latte',
        category: 'coffee',
        price: 4500,
        cafeId: cafe2._id,
        isAvailable: true
      });
      await menu2.save();

      const res = await request(app)
        .patch(`/api/admin/menus/${menu2._id}`)
        .set('Authorization', `Bearer ${merchantToken}`)
        .send({ price: 5000 });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/admin/stats', () => {
    it('should get sales statistics', async () => {
      const order1 = new Order({
        customerId: customer._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        paymentStatus: 'paid'
      });
      await order1.save();

      const order2 = new Order({
        customerId: customer._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 2, price: 4000 }],
        totalAmount: 8000,
        paymentStatus: 'paid'
      });
      await order2.save();

      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${merchantToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalOrders');
      expect(res.body).toHaveProperty('totalRevenue');
      expect(res.body).toHaveProperty('popularMenus');
      expect(res.body.totalOrders).toBeGreaterThanOrEqual(0);
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get('/api/admin/stats');

      expect(res.statusCode).toBe(401);
    });
  });
});

