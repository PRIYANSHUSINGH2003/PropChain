const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/propertiesController');

// Create a new property (tokenization request)
router.post('/', propertiesController.createProperty);

// Get all properties
router.get('/', propertiesController.getAllProperties);

// Get a single property by ID
router.get('/:id', propertiesController.getPropertyById);

// Update property details
router.put('/:id', propertiesController.updateProperty);

// Delete a property
router.delete('/:id', propertiesController.deleteProperty);

module.exports = router;
