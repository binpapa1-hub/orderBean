const express = require('express');
const Order = require('../models/Order');
const Menu = require('../models/Menu');
const Cafe = require('../models/Cafe');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and merchant/admin role
router.use(auth);
router.use(requireRole('merchant', 'admin'));

// @route   GET /api/admin/orders
// @desc    Get all orders for merchant's cafes
// @access  Private (Merchant/Admin)
router.get('/orders', async (req, res) => {
  try {
    let query = {};
    
    // If merchant, only show orders from their cafes
    if (req.user.role === 'merchant') {
      const cafes = await Cafe.find({ merchantId: req.user._id });
      const cafeIds = cafes.map(c => c._id);
      query.cafeId = { $in: cafeIds };
    }

    const orders = await Order.find(query)
      .populate('customerId', 'name email phone')
      .populate('cafeId', 'name address')
      .populate('items.menuId', 'name price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private (Merchant/Admin)
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if merchant owns the cafe
    if (req.user.role === 'merchant') {
      const cafe = await Cafe.findById(order.cafeId);
      if (cafe.merchantId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    order.status = status;
    if (status === 'ready') {
      order.actualPickupTime = new Date();
    }
    
    await order.save();
    await order.populate('customerId', 'name email');
    await order.populate('cafeId', 'name');

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/menus
// @desc    Get menus for merchant's cafes
// @access  Private (Merchant/Admin)
router.get('/menus', async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'merchant') {
      const cafes = await Cafe.find({ merchantId: req.user._id });
      const cafeIds = cafes.map(c => c._id);
      query.cafeId = { $in: cafeIds };
    }

    const menus = await Menu.find(query).populate('cafeId', 'name');
    res.json(menus);
  } catch (error) {
    console.error('Get admin menus error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/menus
// @desc    Create a new menu item
// @access  Private (Merchant/Admin)
router.post('/menus', async (req, res) => {
  try {
    const { cafeId, ...menuData } = req.body;

    // Verify merchant owns the cafe
    if (req.user.role === 'merchant') {
      const cafe = await Cafe.findById(cafeId);
      if (!cafe || cafe.merchantId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const menu = new Menu({ ...menuData, cafeId });
    await menu.save();
    await menu.populate('cafeId', 'name');

    res.status(201).json(menu);
  } catch (error) {
    console.error('Create menu error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/admin/menus/:id
// @desc    Update menu item
// @access  Private (Merchant/Admin)
router.patch('/menus/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Verify merchant owns the cafe
    if (req.user.role === 'merchant') {
      const cafe = await Cafe.findById(menu.cafeId);
      if (cafe.merchantId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    Object.assign(menu, req.body);
    await menu.save();
    await menu.populate('cafeId', 'name');

    res.json(menu);
  } catch (error) {
    console.error('Update menu error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get sales statistics
// @access  Private (Merchant/Admin)
router.get('/stats', async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'merchant') {
      const cafes = await Cafe.find({ merchantId: req.user._id });
      const cafeIds = cafes.map(c => c._id);
      query.cafeId = { $in: cafeIds };
    }

    const totalOrders = await Order.countDocuments(query);
    const totalRevenue = await Order.aggregate([
      { $match: { ...query, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const popularMenus = await Order.aggregate([
      { $match: query },
      { $unwind: '$items' },
      { $group: { _id: '$items.menuId', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      popularMenus
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

