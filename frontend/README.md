# PropChain Frontend

PropChain is a decentralized platform that democratizes real estate investment by enabling property tokenization, AI-powered analytics, and a transparent on-chain marketplace. This frontend is built with React and Next.js, providing a seamless user experience for property owners and investors.

## Problem Statement

Real estate investment is traditionally illiquid, expensive, and inaccessible to most people. PropChain aims to solve this by making real estate investment accessible, transparent, and liquid for everyone.

## Features

- **Dashboard:** View your real estate portfolio, track revenue, and receive notifications.
- **Tokenization:** Mint tokens representing fractional ownership of real estate assets.
- **Marketplace:** List properties for sale, browse available listings, and buy shares.
- **AI Analytics:** Get real-time property valuation, risk assessment, and compliance checks.
- **Automated Revenue Sharing:** Track rental income and sale proceeds distributed to token holders.
- **KYC & Compliance:** Integrated forms and alerts for regulatory compliance.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to use the app.

## Project Structure

- `/app` - Main application pages (dashboard, marketplace, onboarding, etc.)
- `/components` - Reusable UI components (forms, tables, cards, etc.)
- `/public` - Static assets

## API Integration

The frontend communicates with the backend via REST API endpoints for:
- Property management (`/api/properties`)
- Marketplace listings (`/api/marketplace/listings`)
- AI analytics (`/api/ai/valuation`, `/api/ai/compliance`)

## Technologies

- React, Next.js, TypeScript
- Tailwind CSS for styling
- REST API integration

## Learn More

See [../PropChain_Idea.md](../PropChain_Idea.md) for the full project vision, technical architecture, and roadmap.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
