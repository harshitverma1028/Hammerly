import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import Countdown from "../../components/ui/Countdown";

const FILTERS = [
  { key: "", label: "All" },
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "ended", label: "Ended" },
];

export default function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/auctions", { params: filter ? { status: filter } : {} })
      .then(({ data }) => setAuctions(data.auctions))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-8">
        <span className="eyebrow">The bidding floor</span>
        <h1 className="font-display text-4xl font-bold mt-2">Auctions</h1>
        <p className="text-ink/60 mt-2">Join a live room, or set your sights on what's coming next.</p>
      </div>

      <div className="flex gap-2 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-sm border transition ${
              filter === f.key ? "bg-forest text-parchment border-forest" : "border-ink/15 text-ink/70 hover:border-brass"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading auctions..." />
      ) : auctions.length === 0 ? (
        <EmptyState title="No auctions found" message="Try a different filter, or check back soon." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <Link
              key={auction._id}
              to={auction.status === "ended" ? `/items/${auction.item?._id}` : `/auctions/live/${auction._id}`}
              className="card overflow-hidden group hover:border-brass transition"
            >
              <div className="aspect-[4/3] overflow-hidden bg-ink/5 relative">
                <img
                  src={auction.item?.images?.[0]?.url || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop"}
                  alt={auction.item?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3"><StatusBadge status={auction.status} /></div>
              </div>
              <div className="p-5">
                <p className="font-display text-lg font-bold truncate">{auction.item?.title}</p>
                <p className="text-xs text-ink/40 uppercase tracking-wide mt-1">{auction.item?.category?.name}</p>
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-ink/50">Current Bid</span>
                  <span className="font-bold text-brassdark">${auction.currentBid?.toLocaleString()}</span>
                </div>
                {auction.status === "live" && (
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-ink/50">Ends in</span>
                    <Countdown target={auction.endTime} className="font-semibold text-wine" />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
