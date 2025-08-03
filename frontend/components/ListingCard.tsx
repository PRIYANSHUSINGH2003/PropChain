import React from 'react';

type ListingCardProps = {
  tokenId: number;
  price: number;
  seller: string;
  onBuy: () => void;
};

export default function ListingCard({ tokenId, price, seller, onBuy }: ListingCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-teal-600">Token #{tokenId}</span>
        <span className="text-teal-700 dark:text-teal-400 font-semibold">${price}</span>
      </div>
      <div className="text-xs text-gray-500 mb-2">Seller: {seller}</div>
      <button
        className="mt-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
        onClick={onBuy}
      >
        Buy
      </button>
    </div>
  );
}
