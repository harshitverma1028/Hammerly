import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import Categories from "./pages/category/Categories";
import CategoryItems from "./pages/category/CategoryItems";
import ItemDetails from "./pages/item/ItemDetails";

import Auctions from "./pages/auction/Auctions";
import LiveAuction from "./pages/auction/LiveAuction";

import MyBids from "./pages/user/MyBids";
import WonAuctions from "./pages/user/WonAuctions";
import Profile from "./pages/user/Profile";

import ManageCategories from "./pages/admin/ManageCategories";
import ManageItems from "./pages/admin/ManageItems";
import ManageAuctions from "./pages/admin/ManageAuctions";
import ManageUsers from "./pages/admin/ManageUsers";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <p className="font-display text-6xl font-extrabold text-brass/40">
        404
      </p>
      <p className="text-ink/60 mt-2">
        This page doesn't exist.
      </p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:slug" element={<CategoryItems />} />
      <Route path="/items/:id" element={<ItemDetails />} />
      <Route path="/auctions" element={<Auctions />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/auctions/live/:id" element={<LiveAuction />} />
        <Route path="/my-bids" element={<MyBids />} />
        <Route path="/won-auctions" element={<WonAuctions />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<ManageCategories />} />
        <Route path="/admin/items" element={<ManageItems />} />
        <Route path="/admin/auctions" element={<ManageAuctions />} />
        <Route path="/admin/users" element={<ManageUsers />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}