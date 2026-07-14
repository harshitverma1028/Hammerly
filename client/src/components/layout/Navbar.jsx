import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 bg-parchment/90 backdrop-blur border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B08D57" strokeWidth="2">
            <path d="M14 10l-7.5 7.5a1.5 1.5 0 01-2-2L12 8" />
            <path d="M17.5 2.5l4 4L17 11l-4-4z" />
            <path d="M2 22h8" />
          </svg>
          Hammerly
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-ink/80">
          <Link to="/" className="hover:text-brassdark transition">Home</Link>
          <Link to="/categories" className="hover:text-brassdark transition">Categories</Link>
          <Link to="/auctions" className="hover:text-brassdark transition">Live Auctions</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 border border-ink/15 rounded-sm px-3 py-2 hover:border-brass transition"
              >
                <div className="w-7 h-7 rounded-full bg-forest text-parchment flex items-center justify-center text-xs font-bold overflow-hidden">
                  {user.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.[0]?.toUpperCase()
                  )}
                </div>
                <span className="text-sm font-semibold hidden sm:block">{user.name}</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-ink/10 shadow-lg rounded-sm py-1">
                  <Link to={dashboardPath} onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-parchment">
                    Dashboard
                  </Link>
                  {user.role !== "admin" && (
                    <Link to="/profile" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-parchment">
                      Profile
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-wine hover:bg-parchment">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-4 !py-2 text-sm">Login</Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">Register</Link>
            </>
          )}

          
        </div>
      </div>
    </header>
  );
}
