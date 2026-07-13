import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { getSocket } from "../../services/socket";
import useAuthStore from "../../store/authStore";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import Countdown from "../../components/ui/Countdown";

export default function LiveAuction() {
  const { id } = useParams();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [placing, setPlacing] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);

  const socketRef = useRef(null);

  const loadAuction = () => {
    return api.get(`/auctions/${id}`).then(({ data }) => {
      setAuction(data.auction);
      setParticipantsCount(data.auction.participants?.length || 0);
      return data.auction;
    });
  };

  const loadBids = () => {
    return api.get(`/bids/${id}`).then(({ data }) => setBids(data.bids));
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to join the auction");
      navigate("/login", { state: { from: `/auctions/live/${id}` } });
      return;
    }

    setLoading(true);
    Promise.all([loadAuction(), loadBids()]).finally(() => setLoading(false));

    const socket = getSocket();
    socketRef.current = socket;
    socket.emit("join-auction", id);

    const handleBidUpdated = (payload) => {
      if (payload.auctionId !== id) return;
      setAuction((prev) =>
        prev
          ? {
              ...prev,
              currentBid: payload.currentBid,
              highestBidder: payload.highestBidder,
              totalBids: payload.totalBids,
            }
          : prev
      );
      setParticipantsCount(payload.participants);
      setBids((prev) => [payload.bid, ...prev]);
    };

    const handleAuctionEnded = (payload) => {
      if (payload.auctionId !== id) return;
      setAuction((prev) => (prev ? { ...prev, status: "ended", winner: payload.winner, currentBid: payload.currentBid } : prev));
      toast("This auction has ended.", { icon: "🔨" });
    };

    socket.on("bid-updated", handleBidUpdated);
    socket.on("auction-ended", handleAuctionEnded);

    return () => {
      socket.emit("leave-auction", id);
      socket.off("bid-updated", handleBidUpdated);
      socket.off("auction-ended", handleAuctionEnded);
    };
  }, [id, token]);

  const minimumBid = auction ? auction.currentBid + auction.bidIncrement : 0;

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!bidAmount || Number(bidAmount) < minimumBid) {
      toast.error(`Bid must be at least $${minimumBid.toLocaleString()}`);
      return;
    }
    setPlacing(true);
    try {
      await api.post("/bids", { auctionId: id, amount: Number(bidAmount) });
      setBidAmount("");
      toast.success("Bid placed!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place bid");
    } finally {
      setPlacing(false);
    }
  };

  const handleAuctionEndedFromTimer = () => {
    loadAuction();
  };

  if (loading) return <Loader label="Entering the room..." />;
  if (!auction) return null;

  const isHighestBidder = auction.highestBidder && (auction.highestBidder._id === user?._id);
  const item = auction.item;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Link to={`/items/${item?._id}`} className="text-sm font-semibold text-brassdark hover:text-ink transition">
        ← Item Details
      </Link>

      <div className="grid md:grid-cols-2 gap-12 mt-6">
        {/* Item Image + Description */}
        <div>
          <div className="aspect-square rounded-sm overflow-hidden bg-ink/5">
            <img
              src={item?.images?.[0]?.url || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop"}
              alt={item?.title}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-display text-3xl font-bold mt-6">{item?.title}</h1>
          <p className="text-ink/70 leading-relaxed mt-3">{item?.description}</p>
        </div>

        {/* Bidding Panel */}
        <div>
          <div className="card p-7 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <StatusBadge status={auction.status} />
              {auction.status === "live" && (
                <div className="text-right">
                  <p className="text-xs text-ink/40 uppercase tracking-wide font-semibold">Time Remaining</p>
                  <Countdown target={auction.endTime} onComplete={handleAuctionEndedFromTimer} className="font-display text-xl font-bold text-wine" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-ink/40 uppercase tracking-wide font-semibold">Starting Bid</p>
                <p className="font-semibold mt-0.5">${auction.startingBid?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-ink/40 uppercase tracking-wide font-semibold">Bid Increment</p>
                <p className="font-semibold mt-0.5">${auction.bidIncrement?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-ink/40 uppercase tracking-wide font-semibold">Participants</p>
                <p className="font-semibold mt-0.5">{participantsCount}</p>
              </div>
              <div>
                <p className="text-xs text-ink/40 uppercase tracking-wide font-semibold">Total Bids</p>
                <p className="font-semibold mt-0.5">{auction.totalBids}</p>
              </div>
            </div>

            <div className="bg-forest/5 border border-forest/20 rounded-sm p-5 mb-6 text-center">
              <p className="text-xs text-ink/50 uppercase tracking-wide font-semibold">Current Bid</p>
              <p className="font-display text-4xl font-extrabold text-forest mt-1">${auction.currentBid?.toLocaleString()}</p>
              <p className="text-sm text-ink/60 mt-2">
                Highest bidder:{" "}
                <span className="font-semibold text-ink">
                  {auction.highestBidder ? auction.highestBidder.name : "No bids yet"}
                  {isHighestBidder && " (You)"}
                </span>
              </p>
            </div>

            {auction.status === "live" ? (
              <form onSubmit={handlePlaceBid} className="space-y-3">
                <label className="label">Your Bid (minimum ${minimumBid.toLocaleString()})</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    min={minimumBid}
                    step={auction.bidIncrement}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={String(minimumBid)}
                    className="input-field"
                  />
                  <button type="submit" disabled={placing} className="btn-primary whitespace-nowrap">
                    {placing ? "Placing..." : "Place Bid"}
                  </button>
                </div>
              </form>
            ) : auction.status === "ended" ? (
              <div className="text-center py-3">
                <p className="font-display text-lg font-bold">
                  {auction.winner ? "Auction Won" : "Auction Ended — No Bids"}
                </p>
                {auction.winner && (
                  <p className="text-sm text-ink/60 mt-1">
                    Won by {auction.winner.name === user?.name ? "you!" : auction.winner.name}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-ink/60 py-3">This auction hasn't started yet.</p>
            )}
          </div>

          {/* Bid History */}
          <div className="mt-8">
            <p className="font-display text-lg font-bold mb-3">Bid History</p>
            {bids.length === 0 ? (
              <p className="text-sm text-ink/50">No bids placed yet. Be the first.</p>
            ) : (
              <div className="divide-y divide-ink/10 border-t border-b border-ink/10 max-h-72 overflow-y-auto">
                {bids.map((bid) => (
                  <div key={bid._id} className="flex justify-between py-2.5 text-sm">
                    <span className="font-medium">{bid.user?.name}</span>
                    <span className="text-ink/50">{new Date(bid.createdAt).toLocaleTimeString()}</span>
                    <span className="font-bold text-brassdark">${bid.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
