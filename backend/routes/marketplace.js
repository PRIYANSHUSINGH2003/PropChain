const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

// Create a new listing
router.post('/listings', marketplaceController.createListing);

// Get all listings
router.get('/listings', marketplaceController.getAllListings);

// Get a single listing by ID
router.get('/listings/:id', marketplaceController.getListingById);

// Delete a listing
router.delete('/listings/:id', marketplaceController.deleteListing);

module.exports = router;
