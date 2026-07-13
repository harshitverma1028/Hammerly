import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-parchment/70 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl font-bold text-parchment mb-3">
            Heritage<span className="text-brass">&amp;Co.</span>
          </div>
          <p className="text-sm leading-relaxed">
            A house of provenance since curiosity began. Rare items, honest bidding, real winners.
          </p>
        </div>
        <div>
          <h4 className="text-parchment font-semibold mb-3 eyebrow">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/categories" className="hover:text-brass transition">Categories</Link></li>
            <li><Link to="/auctions" className="hover:text-brass transition">Live Auctions</Link></li>
            <li><Link to="/register" className="hover:text-brass transition">Join as Bidder</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-parchment font-semibold mb-3 eyebrow">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-brass transition">Login</Link></li>
            <li><Link to="/register" className="hover:text-brass transition">Register</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-parchment font-semibold mb-3 eyebrow">Newsletter</h4>
          <p className="text-sm mb-3">Word of new lots, before the crowd.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input type="email" placeholder="you@example.com" className="flex-1 min-w-0 bg-white/5 border border-white/15 px-3 py-2 text-sm rounded-sm text-parchment placeholder:text-parchment/40 focus:outline-none focus:border-brass" />
            <button className="bg-brass text-ink px-4 py-2 text-sm font-semibold rounded-sm hover:bg-brassdark transition">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-parchment/40">
        © {new Date().getFullYear()} Heritage &amp; Co. Auction House. College project — not a real auction house.
      </div>
    </footer>
  );
}
