# PropChain Backend

This is the backend for PropChain, a decentralized platform for tokenized real estate investment. The backend provides RESTful APIs for property management, marketplace operations, and AI-powered analytics.

## Problem Statement

Real estate investment is traditionally illiquid, expensive, and inaccessible to most people. PropChain aims to solve this by making real estate investment accessible, transparent, and liquid for everyone.

## Features

- **Property Tokenization:** Register and manage tokenized real estate assets.
- **Marketplace:** List, buy, and manage property share listings.
- **AI Integration:** Endpoints for property valuation, risk, and compliance (via microservices).
- **Automated Revenue Sharing:** Distribute rental income and sale proceeds.
- **KYC & Compliance:** User and transaction validation.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in required values (MongoDB URI, AI service URL, blockchain RPC, etc.)

3. **Run the backend server:**
   ```bash
   node index.js
   ```
   or
   ```bash
   npm run dev
   ```

4. **API Endpoints:**
   - `POST /api/properties` - Register/tokenize a property
   - `GET /api/properties` - List all properties
   - `POST /api/marketplace/listings` - Create a new property listing
   - `GET /api/marketplace/listings` - Get all listings
   - `POST /api/marketplace/buy` - Buy a property share
   - `POST /api/ai/valuation` - Get AI property valuation
   - `POST /api/ai/compliance` - Run compliance check

## Technologies

- Node.js, Express
- MongoDB, Mongoose
- Integration with blockchain (Andromeda, Cosmos SDK, CW20/CW721)
- AI microservices (Python, TensorFlow, scikit-learn)

## Architecture

- Modular controllers for properties, marketplace, and AI
- Secure API endpoints with validation
- Designed for integration with smart contracts and decentralized storage

## Learn More

See [../PropChain_Idea.md](../PropChain_Idea.md) for the full project vision, technical architecture, and roadmap.

---

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request.
