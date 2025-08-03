// Revenue distribution logic: splits proceeds among all owners by share
const blockchainService = require('./blockchainService');

exports.distributeRevenue = async (listingId, totalRevenue) => {
  // Find the property for this listing
  const listings = await blockchainService.getAllListings();
  const listing = listings.find(l => l.listingId == listingId);
  if (!listing) return { distributed: false, reason: 'Listing not found' };
  const property = await blockchainService.getPropertyById(listing.tokenId);
  if (!property) return { distributed: false, reason: 'Property not found' };
  // Distribute revenue by share
  const distributions = property.owners.map(({ owner, share }) => ({
    owner,
    amount: totalRevenue * share
  }));
  // Simulate distribution (in real app, trigger payments)
  return { distributed: true, listingId, distributions };
};
