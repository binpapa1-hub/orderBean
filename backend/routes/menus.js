const express = require('express');
const Menu = require('../models/Menu');
const Cafe = require('../models/Cafe');

const router = express.Router();

// @route   GET /api/menus
// @desc    Get menus (optionally filtered by cafe)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { cafeId, category } = req.query;
    
    let query = { isAvailable: true };
    if (cafeId) query.cafeId = cafeId;
    if (category) query.category = category;

    const menus = await Menu.find(query).populate('cafeId', 'name address');
    res.json(menus);
  } catch (error) {
    console.error('Get menus error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/menus/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate('cafeId', 'name address');
    if (!menu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menu);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

