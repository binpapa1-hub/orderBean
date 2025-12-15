const express = require('express');
const Cafe = require('../models/Cafe');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cafes
// @desc    Get all cafes (with optional location filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;
    
    let cafes;
    
    if (latitude && longitude) {
      // Location-based search (simplified - in production, use geospatial queries)
      cafes = await Cafe.find({ isOpen: true });
      // Filter by distance (simplified calculation)
      cafes = cafes.filter(cafe => {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          cafe.location.latitude,
          cafe.location.longitude
        );
        return distance <= parseFloat(radius);
      });
    } else {
      cafes = await Cafe.find({ isOpen: true });
    }

    res.json(cafes);
  } catch (error) {
    console.error('Get cafes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cafes/:id
// @desc    Get single cafe
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }
    res.json(cafe);
  } catch (error) {
    console.error('Get cafe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

module.exports = router;

