import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import api from "../../services/api";

const cards = [
  { to: "/admin/categories", title: "Manage Categories", desc: "Create, edit or remove collections.", icon: "🗂️" },
  { to: "/admin/items", title: "Manage Items", desc: "Add lots and control their details.", icon: "📦" },
  { to: "/admin/auctions", title: "Manage Auctions", desc: "Schedule auctions and set bidding rules.", icon: "🔨" },
  { to: "/admin/users", title: "Manage Users", desc: "View registered bidders and remove accounts.", icon: "👥" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ categories: 0, items: 0, auctions: 0, users: 0, liveAuctions: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, items, auctions, users] = await Promise.all([
          api.get("/categories"),
          api.get("/items"),
          api.get("/auctions"),
          api.get("/users"),
        ]);
        setStats({
          categories: cats.data.count,
          items: items.data.count,
          auctions: auctions.data.count,
          users: users.data.count,
          liveAuctions: auctions.data.auctions.filter((a) => a.status === "live").length,
        });
      } catch {
        // silently ignore, analytics is non-critical
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="eyebrow">Admin Dashboard</span>
        <h1 className="font-display text-4xl font-bold mt-2">House Controls, {user?.name?.split(" ")[0]}</h1>
        <p className="text-ink/60 mt-2">Manage every category, lot, auction and bidder from here.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {[
          ["Categories", stats.categories],
          ["Items", stats.items],
          ["Auctions", stats.auctions],
          ["Live Now", stats.liveAuctions],
          ["Users", stats.users],
        ].map(([label, value]) => (
          <div key={label} className="card p-5 text-center">
            <p className="font-display text-3xl font-extrabold text-brassdark">{value}</p>
            <p className="text-xs uppercase tracking-wide text-ink/50 font-semibold mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="card p-7 hover:border-brass hover:-translate-y-1 transition-all duration-200">
            <div className="text-3xl mb-4">{card.icon}</div>
            <h3 className="font-display text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-sm text-ink/60 leading-relaxed">{card.desc}</p>
          </Link>
        ))}

        <button onClick={handleLogout} className="card p-7 text-left hover:border-wine hover:-translate-y-1 transition-all duration-200">
          <div className="text-3xl mb-4">🚪</div>
          <h3 className="font-display text-xl font-bold mb-2 text-wine">Logout</h3>
          <p className="text-sm text-ink/60 leading-relaxed">End your current session securely.</p>
        </button>
      </div>
    </div>
  );
}
