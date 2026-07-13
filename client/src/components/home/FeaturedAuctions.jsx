import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import StatusBadge from "../ui/StatusBadge";

export default function FeaturedAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auctions", { params: { status: "live" } })
      .then(({ data }) => setAuctions(data.auctions.slice(0, 3)))
      .catch(() => setAuctions([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && auctions.length === 0) return null;

  return (
    <section className="bg-ink py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="eyebrow text-brass">Happening now</span>
            <h2 className="section-title mt-2 text-parchment">Featured Live Auctions</h2>
          </div>
          <Link to="/auctions" className="text-sm font-semibold text-brass hover:text-parchment transition hidden sm:block">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <Link
                key={auction._id}
                to={`/auctions/live/${auction._id}`}
                className="group bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:border-brass transition"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={auction.item?.images?.[0]?.url || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop"}
                    alt={auction.item?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5">
                  <StatusBadge status={auction.status} />
                  <p className="font-display text-lg font-bold text-parchment mt-3 truncate">{auction.item?.title}</p>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-parchment/50">Current Bid</span>
                    <span className="text-brass font-bold text-base">${auction.currentBid?.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
