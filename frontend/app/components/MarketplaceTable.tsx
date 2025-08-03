import React from 'react';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

interface Listing {
  listingId: number;
  tokenId: number;
  price: number;
  seller: string;
  share: number;
  propertyName: string;
}

interface MarketplaceTableProps {
  listings: Listing[];
  onBuy: (listingId: number, share: number) => void;
  buyingId?: number;
}

const MarketplaceTable: React.FC<MarketplaceTableProps> = ({ listings, onBuy, buyingId }) => {
  return (
    <div className="overflow-x-auto bg-glass dark:bg-darkglass rounded-2xl shadow-card border border-primary/20 dark:border-primary-dark/30 backdrop-blur-md animate-fade-in">
      <table className="min-w-full divide-y divide-primary/10 dark:divide-primary-dark/20">
        <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary-dark/20 dark:to-secondary-dark/20">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-bold text-primary-dark dark:text-primary-light uppercase tracking-wider flex items-center gap-1">
              <BuildingOffice2Icon className="h-4 w-4 inline text-primary" /> Property
            </th>
            <th className="px-4 py-2 text-left text-xs font-bold text-primary-dark dark:text-primary-light uppercase tracking-wider">Fraction for Sale</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-primary-dark dark:text-primary-light uppercase tracking-wider">Price (USD)</th>
            <th className="px-4 py-2 text-left text-xs font-bold text-primary-dark dark:text-primary-light uppercase tracking-wider">Seller</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="bg-glass dark:bg-darkglass divide-y divide-primary/10 dark:divide-primary-dark/20">
          {listings.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-6">
                <Alert type="info">No listings available.</Alert>
              </td>
            </tr>
          )}
          {listings.map((listing, idx) => (
            <tr key={listing.listingId || `${listing.tokenId}-${listing.seller}` || idx} className="hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-colors group">
              <td className="px-4 py-2 font-semibold text-primary-dark dark:text-primary-light flex items-center gap-2">
                <BuildingOffice2Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                {listing.propertyName}
              </td>
              <td className="px-4 py-2 text-primary font-bold">
                {isNaN(Number(listing.share)) ? '0.00%' : `${(Number(listing.share) * 100).toFixed(2)}%`}
              </td>
              <td className="px-4 py-2 text-secondary font-semibold">${listing.price.toLocaleString()}</td>
              <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-300">
                {(!listing.seller || listing.seller === 'owner-address-placeholder')
                  ? 'Unknown'
                  : `${listing.seller.slice(0, 6)}...${listing.seller.slice(-4)}`}
              </td>
              <td className="px-4 py-2">
                <Button
                  onClick={() => onBuy(listing.listingId, listing.share)}
                  size="sm"
                  variant="primary"
                  loading={buyingId === listing.listingId}
                  className="px-4 py-1"
                  disabled={buyingId === listing.listingId}
                >
                  {buyingId === listing.listingId ? 'Processing...' : 'Buy'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketplaceTable;
