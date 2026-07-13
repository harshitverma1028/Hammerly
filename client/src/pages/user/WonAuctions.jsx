import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

export default function WonAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/won-auctions")
      .then(({ data }) => setAuctions(data.auctions))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading won auctions..." />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="eyebrow">The trophy case</span>
        <h1 className="font-display text-4xl font-bold mt-2">Won Auctions</h1>
        <p className="text-ink/60 mt-2">Lots you've claimed and their payment status.</p>
      </div>

      {auctions.length === 0 ? (
        <EmptyState title="No wins yet" message="Keep bidding — your first win could be next." action={<Link to="/auctions" className="btn-primary">Browse Auctions</Link>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div key={auction._id} className="card overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-ink/5">
                <img
                  src={auction.item?.images?.[0]?.url || "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800&auto=format&fit=crop"}
                  alt={auction.item?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <p className="font-display text-lg font-bold truncate">{auction.item?.title}</p>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-ink/50">Winning Price</span>
                  <span className="font-bold text-brassdark">${auction.currentBid?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-ink/50">Payment</span>
                  <span className={`font-semibold ${auction.isPaid ? "text-forest" : "text-wine"}`}>
                    {auction.isPaid ? "Paid" : "Payment Pending"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
