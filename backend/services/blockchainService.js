// Placeholder for blockchain interaction logic
const properties = [];
const listings = [];

// Mint a property token with fractional ownership (default 100% to creator)
exports.mintPropertyToken = async ({ name, description, owner, value }) => {
  const tokenId = properties.length + 1;
  // owners: array of { owner, share } where share is a float (0-1)
  properties.push({ tokenId, name, description, value, owners: [{ owner, share: 1.0 }] });
  return tokenId;
};

exports.getAllProperties = async () => properties;

exports.getPropertyById = async (id) => properties.find(p => p.tokenId == id);

exports.updateProperty = async (id, updates) => {
  const property = properties.find(p => p.tokenId == id);
  if (property) Object.assign(property, updates);
  return property;
};

exports.deleteProperty = async (id) => {
  const idx = properties.findIndex(p => p.tokenId == id);
  if (idx !== -1) properties.splice(idx, 1);
};

// List a fraction of a property for sale
exports.listPropertyForSale = async ({ tokenId, price, seller, share }) => {
  const listingId = listings.length + 1;
  // share: fraction of property to sell (0-1)
  const listing = { listingId, tokenId, price, seller, share };
  listings.push(listing);
  return listing;
};

exports.getAllListings = async () => listings;

// Buy a fraction of a property token
exports.buyPropertyToken = async ({ listingId, buyer }) => {
  const listing = listings.find(l => l.listingId == listingId);
  if (!listing) return null;
  const property = properties.find(p => p.tokenId == listing.tokenId);
  if (!property) return null;
  // Find seller's share
  const sellerShare = property.owners.find(o => o.owner === listing.seller);
  if (!sellerShare || sellerShare.share < listing.share) return null;
  // Deduct share from seller
  sellerShare.share -= listing.share;
  // Add share to buyer (or increment if already owner)
  let buyerShare = property.owners.find(o => o.owner === buyer);
  if (buyerShare) {
    buyerShare.share += listing.share;
  } else {
    property.owners.push({ owner: buyer, share: listing.share });
  }
  // Remove seller if share is now zero
  property.owners = property.owners.filter(o => o.share > 0);
  // Remove listing
  const idx = listings.findIndex(l => l.listingId == listingId);
  if (idx !== -1) listings.splice(idx, 1);
  return { property, buyer, share: listing.share };
};
