import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";

export default function MyBids() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/my-bids")
      .then(({ data }) => setResults(data.results))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading your bids..." />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="eyebrow">Your activity</span>
        <h1 className="font-display text-4xl font-bold mt-2">My Bids</h1>
        <p className="text-ink/60 mt-2">Every auction you've raised a paddle in.</p>
      </div>

      {results.length === 0 ? (
        <EmptyState title="No bids yet" message="Join a live auction to start bidding." action={<Link to="/auctions" className="btn-primary">Browse Auctions</Link>} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-left text-ink/50 uppercase text-xs tracking-wide">
                <th className="py-3 pr-4">Auction</th>
                <th className="py-3 pr-4">My Bid</th>
                <th className="py-3 pr-4">Highest Bid</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {results.map(({ auction, myHighestBid, isHighestBidder }) => (
                <tr key={auction._id}>
                  <td className="py-4 pr-4 font-semibold flex items-center gap-3">
                    <img
                      src={auction.item?.images?.[0]?.url || "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=200&auto=format&fit=crop"}
                      className="w-10 h-10 rounded-sm object-cover"
                      alt=""
                    />
                    {auction.item?.title}
                  </td>
                  <td className="py-4 pr-4">${myHighestBid.toLocaleString()}</td>
                  <td className="py-4 pr-4">
                    ${auction.currentBid?.toLocaleString()}
                    {isHighestBidder && auction.status !== "ended" && (
                      <span className="ml-2 text-xs text-forest font-semibold">You're leading</span>
                    )}
                  </td>
                  <td className="py-4 pr-4"><StatusBadge status={auction.status} /></td>
                  <td className="py-4 text-right">
                    <Link
                      to={auction.status === "ended" ? `/items/${auction.item?._id}` : `/auctions/live/${auction._id}`}
                      className="text-brassdark font-semibold hover:text-ink"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
