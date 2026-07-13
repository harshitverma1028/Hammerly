import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const cards = [
  {
    to: "/categories",
    title: "Browse Categories",
    desc: "Explore every collection currently on the house floor.",
    icon: "🗂️",
  },
  {
    to: "/auctions",
    title: "Live Auctions",
    desc: "Jump into a room where the bidding is happening now.",
    icon: "🔨",
  },
  {
    to: "/my-bids",
    title: "My Bids",
    desc: "Track every auction you've raised a paddle in.",
    icon: "📋",
  },
  {
    to: "/won-auctions",
    title: "Won Auctions",
    desc: "Lots you've claimed and their payment status.",
    icon: "🏆",
  },
  {
    to: "/profile",
    title: "Profile",
    desc: "Update your name, avatar and password.",
    icon: "⚙️",
  },
];

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <span className="eyebrow">Bidder Dashboard</span>
        <h1 className="font-display text-4xl font-bold mt-2">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-ink/60 mt-2">Everything you need to browse, bid and win, in one place.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="card p-7 hover:border-brass hover:-translate-y-1 transition-all duration-200"
          >
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
