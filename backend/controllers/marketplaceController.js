const Listing = require('../models/Listing');
const blockchainService = require('../services/blockchainService');

// Create a new listing
exports.createListing = async (req, res) => {
  try {
    const { tokenId, price, seller, share } = req.body;

    // Validate required fields
    if (!tokenId || !price || !seller || share === undefined) {
      return res.status(400).json({ message: 'Missing required fields: tokenId, price, seller, share' });
    }

    // Validate tokenId is a valid ObjectId (only if string)
    if (typeof tokenId === 'string' && !tokenId.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's a string but not a valid ObjectId, allow fallback to numeric below
    } else if (typeof tokenId !== 'string' && typeof tokenId !== 'number') {
      return res.status(400).json({ message: 'Invalid tokenId type' });
    }

    // Validate price and share are numbers
    if (isNaN(price) || isNaN(share)) {
      return res.status(400).json({ message: 'Price and share must be numbers' });
    }
    if (price <= 0 || share <= 0 || share > 1) {
      return res.status(400).json({ message: 'Price must be > 0 and share must be between 0 and 1' });
    }

    // Validate property exists (use in-memory blockchainService for demo)
    const property = await blockchainService.getPropertyById(tokenId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Validate seller owns enough share
    const owner = property.owners.find(o => o.owner === seller);
    if (!owner) {
      return res.status(400).json({ message: 'Seller does not own this property' });
    }
    if (owner.share < share) {
      return res.status(400).json({ message: `Seller does not own enough share. Available: ${owner.share}` });
    }

    // Create listing
    const listing = new Listing({ tokenId, price, seller, share });
    await listing.save();
    res.status(201).json({ message: 'Listing created', listing });
  } catch (err) {
    console.error('Error in createListing:', err);
    res.status(500).json({ message: 'Failed to create listing', error: err.message });
  }
};

// Get all listings
exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('tokenId');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch listings', error: err.message });
  }
};

// Get a single listing by ID
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('tokenId');
    if (listing) res.json(listing);
    else res.status(404).json({ message: 'Listing not found' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch listing', error: err.message });
  }
};

// Delete a listing
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    if (deleted) res.json({ message: 'Listing deleted' });
    else res.status(404).json({ message: 'Listing not found' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete listing', error: err.message });
  }
};
