const request = require('supertest');
const express = require('express');
const orderRoutes = require('../routes/orders');
const Order = require('../models/Order');
const Menu = require('../models/Menu');
const Cafe = require('../models/Cafe');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

describe('Order Routes', () => {
  let customer;
  let merchant;
  let testCafe;
  let testMenu;
  let customerToken;

  beforeEach(async () => {
    // Create customer user
    customer = new User({
      name: 'Customer',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer'
    });
    await customer.save();

    // Create merchant user
    merchant = new User({
      name: 'Merchant',
      email: 'merchant@example.com',
      password: 'password123',
      role: 'merchant'
    });
    await merchant.save();

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
      isAvailable: true,
      options: {
        sizes: [
          { name: 'Small', price: 0 },
          { name: 'Large', price: 1000 }
        ]
      }
    });
    await testMenu.save();

    // Generate token for customer
    customerToken = jwt.sign(
      { userId: customer._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '7d' }
    );
  });

  describe('POST /api/orders', () => {
    it('should create a new order successfully', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          cafeId: testCafe._id,
          items: [
            {
              menuId: testMenu._id,
              quantity: 2,
              selectedOptions: {
                size: 'Large'
              }
            }
          ],
          paymentMethod: 'card'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.customerId).toBe(customer._id.toString());
      expect(res.body.status).toBe('pending');
      expect(res.body.paymentStatus).toBe('paid');
      expect(res.body.items.length).toBe(1);
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          cafeId: testCafe._id,
          items: [{ menuId: testMenu._id, quantity: 1 }]
        });

      expect(res.statusCode).toBe(401);
    });

    it('should return 400 if menu is not available', async () => {
      // Make menu unavailable
      testMenu.isAvailable = false;
      await testMenu.save();

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          cafeId: testCafe._id,
          items: [{ menuId: testMenu._id, quantity: 1 }]
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('not available');
    });

    it('should calculate total amount correctly', async () => {
      const menu2 = new Menu({
        name: 'Latte',
        category: 'coffee',
        price: 5000,
        cafeId: testCafe._id,
        isAvailable: true
      });
      await menu2.save();

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          cafeId: testCafe._id,
          items: [
            { menuId: testMenu._id, quantity: 1 },
            { menuId: menu2._id, quantity: 2 }
          ]
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.totalAmount).toBeGreaterThan(0);
    });

    it('should set estimated pickup time', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          cafeId: testCafe._id,
          items: [{ menuId: testMenu._id, quantity: 1 }]
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.estimatedPickupTime).toBeDefined();
    });
  });

  describe('GET /api/orders', () => {
    it('should get user orders', async () => {
      // Create an order
      const order = new Order({
        customerId: customer._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        paymentStatus: 'paid'
      });
      await order.save();

      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].customerId).toBe(customer._id.toString());
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get('/api/orders');

      expect(res.statusCode).toBe(401);
    });

    it('should only return orders for the authenticated user', async () => {
      // Create another customer and order
      const customer2 = new User({
        name: 'Customer 2',
        email: 'customer2@example.com',
        password: 'password123',
        role: 'customer'
      });
      await customer2.save();

      const order2 = new Order({
        customerId: customer2._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        paymentStatus: 'paid'
      });
      await order2.save();

      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(0); // customer has no orders yet
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should get a single order by id', async () => {
      const order = new Order({
        customerId: customer._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        paymentStatus: 'paid'
      });
      await order.save();

      const res = await request(app)
        .get(`/api/orders/${order._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(order._id.toString());
    });

    it('should return 404 if order not found', async () => {
      const fakeId = new require('mongoose').Types.ObjectId();
      const res = await request(app)
        .get(`/api/orders/${fakeId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Order not found');
    });

    it('should return 403 if user does not own the order', async () => {
      const customer2 = new User({
        name: 'Customer 2',
        email: 'customer2@example.com',
        password: 'password123',
        role: 'customer'
      });
      await customer2.save();

      const order = new Order({
        customerId: customer2._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        paymentStatus: 'paid'
      });
      await order.save();

      const res = await request(app)
        .get(`/api/orders/${order._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('Access denied');
    });
  });

  describe('PATCH /api/orders/:id/cancel', () => {
    it('should cancel an order successfully', async () => {
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
        .patch(`/api/orders/${order._id}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('cancelled');
      expect(res.body.paymentStatus).toBe('refunded');
    });

    it('should return 404 if order not found', async () => {
      const fakeId = new require('mongoose').Types.ObjectId();
      const res = await request(app)
        .patch(`/api/orders/${fakeId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(404);
    });

    it('should return 403 if user does not own the order', async () => {
      const customer2 = new User({
        name: 'Customer 2',
        email: 'customer2@example.com',
        password: 'password123',
        role: 'customer'
      });
      await customer2.save();

      const order = new Order({
        customerId: customer2._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        status: 'pending',
        paymentStatus: 'paid'
      });
      await order.save();

      const res = await request(app)
        .patch(`/api/orders/${order._id}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(403);
    });

    it('should return 400 if order is already ready', async () => {
      const order = new Order({
        customerId: customer._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        status: 'ready',
        paymentStatus: 'paid'
      });
      await order.save();

      const res = await request(app)
        .patch(`/api/orders/${order._id}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Cannot cancel');
    });

    it('should return 400 if order is already completed', async () => {
      const order = new Order({
        customerId: customer._id,
        cafeId: testCafe._id,
        items: [{ menuId: testMenu._id, quantity: 1, price: 4000 }],
        totalAmount: 4000,
        status: 'completed',
        paymentStatus: 'paid'
      });
      await order.save();

      const res = await request(app)
        .patch(`/api/orders/${order._id}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Cannot cancel');
    });
  });
});

