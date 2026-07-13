require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { initSocket } = require("./services/socketService");
const startScheduler = require("./services/auctionScheduler");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const itemRoutes = require("./routes/itemRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const bidRoutes = require("./routes/bidRoutes");
const userRoutes = require("./routes/userRoutes");

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Auction House API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

initSocket(io);
startScheduler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
