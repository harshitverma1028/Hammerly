import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/categories", label: "Categories" },
    { to: "/auctions", label: "Live Auctions" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 
          
      }`}
    >
      <div
        className={`absolute inset-x-0 bottom-0 h-px `}
      />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 font-display text-2xl font-bold text-ink">
          <span className="relative flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-brass/25 blur-md scale-0 group-hover:scale-150 transition-transform duration-500" />
            <svg
              width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="url(#brassGrad)" strokeWidth="2"
              className="relative transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110"
            >
              <defs>
                <linearGradient id="brassGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#D4AF6A" />
                  <stop offset="100%" stopColor="#B08D57" />
                </linearGradient>
              </defs>
              <path d="M14 10l-7.5 7.5a1.5 1.5 0 01-2-2L12 8" />
              <path d="M17.5 2.5l4 4L17 11l-4-4z" />
              <path d="M2 22h8" />
            </svg>
          </span>
          <span className="bg-gradient-to-r from-ink via-ink to-brassdark bg-clip-text text-transparent group-hover:from-brassdark group-hover:via-brass group-hover:to-brassdark transition-all duration-500">
            Hammerly
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9 text-sm font-semibold tracking-wide text-ink/80">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="relative py-1 group transition-colors hover:text-brassdark">
              {link.label}
              <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-gradient-to-r from-brass to-brassdark transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1.5 border border-ink/10 hover:border-brass/60 hover:bg-brass/5 transition-all duration-300"
              >
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-gradient-to-br from-brass to-brassdark p-[2px]">
                    <span className="block w-full h-full rounded-full bg-parchment" />
                  </span>
                  <div className="relative w-[26px] h-[26px] rounded-full bg-gradient-to-br from-forest to-forest/70 text-parchment flex items-center justify-center text-xs font-bold overflow-hidden">
                    {user.avatar?.url ? (
                      <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.[0]?.toUpperCase()
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold hidden sm:block">{user.name}</span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className={`text-ink/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div
                className={`absolute right-0 mt-2 w-52 origin-top-right rounded-lg border border-brass/15 bg-white/90 backdrop-blur-xl shadow-xl py-1.5 transition-all duration-200 ${
                  open
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                }`}
              >
                <Link to={dashboardPath} onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink/80 hover:bg-brass/10 hover:text-brassdark transition-colors">
                  Dashboard
                </Link>
                {user.role !== "admin" && (
                  <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink/80 hover:bg-brass/10 hover:text-brassdark transition-colors">
                    Profile
                  </Link>
                )}
                <div className="my-1 h-px bg-ink/10" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-wine hover:bg-wine/10 transition-colors">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login" className="!px-4 !py-2 text-sm font-semibold text-ink/80 hover:text-brassdark transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="!px-5 !py-2 text-sm font-semibold rounded-sm text-parchment bg-gradient-to-r from-brassdark to-brass shadow-md shadow-brass/25 hover:shadow-lg hover:shadow-brass/40 hover:brightness-110 transition-all duration-300"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-sm border border-ink/10 hover:border-brass/60 transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 border-t border-brass/15" : "max-h-0"
        } bg-parchment/90 backdrop-blur-xl`}
      >
        <nav className="flex flex-col px-6 py-3 text-sm font-semibold text-ink/80">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="py-2.5 border-b border-ink/5 last:border-none hover:text-brassdark transition-colors">
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="flex items-center gap-3 pt-3 sm:hidden">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center !px-4 !py-2 text-sm font-semibold border border-ink/15 rounded-sm hover:border-brass transition-colors">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center !px-4 !py-2 text-sm font-semibold rounded-sm text-parchment bg-gradient-to-r from-brassdark to-brass">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}