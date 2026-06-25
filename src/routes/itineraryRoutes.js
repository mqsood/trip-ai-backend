const express = require('express');
const router = express.Router();
const { generateItinerary, getUserHistory, getItineraryById } = require('../controllers/itineraryController.js');
const { protect } = require('../middlewares/authMiddleware.js');
const upload = require('../middlewares/uploadMiddleware.js');

router.post('/generate', protect, upload.single('document'), generateItinerary);
router.get('/history', protect, getUserHistory);
router.get('/:id', protect, getItineraryById); // ✅ Last mein rakho

module.exports = router;