# Heritage & Co. — Auction House Web Application

A full-stack MERN auction platform with real-time bidding. Built as a college major project.

## Tech Stack
- **Frontend:** React (Vite), React Router DOM, Tailwind CSS, Axios, Zustand, Socket.io-client
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Socket.io, Cloudinary, Multer

## Folder Structure
```
auction-house/
├── client/     React frontend
└── server/     Express + Socket.io backend
```

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, and Cloudinary credentials
npm run dev
```
Runs on `http://localhost:5000`.

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Runs on `http://localhost:5173`.

### 3. MongoDB
You need a running MongoDB instance (local or Atlas). Set `MONGO_URI` in `server/.env`.

### 4. Cloudinary
Create a free account at cloudinary.com and set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
and `CLOUDINARY_API_SECRET` in `server/.env`. This is used for uploading category images,
item images, and user avatars.

## Creating an Admin Account

Registration always creates a `user` role. To create an admin:
1. Register a normal account through the app.
2. Open your MongoDB database (e.g. with MongoDB Compass or `mongosh`).
3. Find the user document in the `users` collection and change `role` from `"user"` to `"admin"`.
4. Log out and log back in — you'll now land on the Admin Dashboard.

## Application Flow

Home → Login/Register → Dashboard → Categories → Category Items → Item Details →
Join Auction → Live Auction → Place Bid → Auction Ends → Winner → Won Auctions

## Real-Time Bidding

The `LiveAuction` page connects to Socket.io on mount, joins a room for that auction
(`join-auction`), and listens for `bid-updated` and `auction-ended` events broadcast
by the server whenever any bidder places a bid. A background cron job (every 10 seconds)
auto-transitions auctions between `upcoming → live → ended` based on their start/end time,
even if no one is actively bidding.

## Admin Features
- Manage Categories (create / edit / delete)
- Manage Items (create / edit / delete, with images & specifications)
- Manage Auctions (create / edit / delete, with start/end time, starting bid, bid increment)
- Manage Users (view / delete)

## Notes
- Bid validation happens both client-side (UX) and server-side (source of truth) — a bid
  must be at least `currentBid + bidIncrement` and the auction must be `live`.
- An auction cannot be edited once it has received bids (only deleted).
- A category cannot be deleted while it still has items.
- An item cannot be deleted while it has an active (`upcoming`/`live`) auction.
