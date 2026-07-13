import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [auction, setAuction] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/items/${id}`)
      .then(({ data }) => {
        setItem(data.item);
        setAuction(data.auction);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoinAuction = () => {
    if (!token) {
      toast.error("Please login to join the auction");
      navigate("/login", { state: { from: `/auctions/live/${auction._id}` } });
      return;
    }
    navigate(`/auctions/live/${auction._id}`);
  };

  if (loading) return <Loader label="Loading item..." />;
  if (!item) return null;

  const images = item.images?.length ? item.images : [{ url: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1200&auto=format&fit=crop" }];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Link to={`/categories/${item.category?.slug}`} className="text-sm font-semibold text-brassdark hover:text-ink transition">
        ← {item.category?.name}
      </Link>

      <div className="grid md:grid-cols-2 gap-12 mt-6">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-sm overflow-hidden bg-ink/5">
            <img src={images[activeImage].url} alt={item.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-sm overflow-hidden border-2 ${i === activeImage ? "border-brass" : "border-transparent"}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="font-display text-4xl font-bold">{item.title}</h1>
          {item.authenticityCertificate && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest bg-forest/10 px-2.5 py-1 rounded-full mt-3">
              ✓ Certificate of Authenticity
            </span>
          )}
          <p className="text-ink/70 leading-relaxed mt-5">{item.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            {item.brand && (
              <div>
                <p className="text-ink/40 font-semibold uppercase tracking-wide text-xs">Brand</p>
                <p className="font-medium mt-0.5">{item.brand}</p>
              </div>
            )}
            {item.location && (
              <div>
                <p className="text-ink/40 font-semibold uppercase tracking-wide text-xs">Location</p>
                <p className="font-medium mt-0.5">{item.location}</p>
              </div>
            )}
            {item.year && (
              <div>
                <p className="text-ink/40 font-semibold uppercase tracking-wide text-xs">Year</p>
                <p className="font-medium mt-0.5">{item.year}</p>
              </div>
            )}
            <div>
              <p className="text-ink/40 font-semibold uppercase tracking-wide text-xs">Condition</p>
              <p className="font-medium mt-0.5 capitalize">{item.condition}</p>
            </div>
          </div>

          {item.specifications?.length > 0 && (
            <div className="mt-8">
              <p className="font-display text-lg font-bold mb-3">Specifications</p>
              <div className="divide-y divide-ink/10 border-t border-b border-ink/10">
                {item.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between py-2.5 text-sm">
                    <span className="text-ink/50">{spec.key}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-lg font-bold">Auction Status</p>
              {auction && <StatusBadge status={auction.status} />}
            </div>

            {auction ? (
              <>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-ink/50">Current Bid</span>
                  <span className="font-bold text-xl text-brassdark">${auction.currentBid?.toLocaleString()}</span>
                </div>
                {auction.status === "ended" ? (
                  <button disabled className="btn-secondary w-full">Auction Has Ended</button>
                ) : (
                  <button onClick={handleJoinAuction} className="btn-primary w-full">
                    Join Auction
                  </button>
                )}
              </>
            ) : (
              <p className="text-ink/50 text-sm">Auction Not Available for this item yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
