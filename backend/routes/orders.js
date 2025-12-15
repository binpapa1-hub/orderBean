const express = require('express');
const Order = require('../models/Order');
const Menu = require('../models/Menu');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { cafeId, items, paymentMethod } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const menu = await Menu.findById(item.menuId);
      if (!menu || !menu.isAvailable) {
        return res.status(400).json({ message: `Menu item ${item.menuId} is not available` });
      }
      
      let itemPrice = menu.price;
      
      // Add option prices
      if (item.selectedOptions) {
        if (item.selectedOptions.size && menu.options.sizes) {
          const sizeOption = menu.options.sizes.find(s => s.name === item.selectedOptions.size);
          if (sizeOption) itemPrice += sizeOption.price;
        }
        // Add other option prices similarly
      }
      
      totalAmount += itemPrice * item.quantity;
    }

    // Estimate pickup time (15 minutes from now)
    const estimatedPickupTime = new Date(Date.now() + 15 * 60 * 1000);

    const order = new Order({
      customerId: req.user._id,
      cafeId,
      items: items.map(item => ({
        ...item,
        price: totalAmount / items.length // Simplified - should calculate per item
      })),
      totalAmount,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid', // In production, verify with payment gateway
      estimatedPickupTime
    });

    await order.save();
    await order.populate('cafeId', 'name address');
    await order.populate('items.menuId');

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('cafeId', 'name address')
      .populate('items.menuId', 'name price image')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('cafeId', 'name address phone')
      .populate('items.menuId', 'name price image');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is merchant
    if (order.customerId.toString() !== req.user._id.toString() && req.user.role !== 'merchant') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/orders/:id/cancel
// @desc    Cancel an order
// @access  Private
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.status === 'ready' || order.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel order that is ready or completed' });
    }

    order.status = 'cancelled';
    order.paymentStatus = 'refunded';
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

