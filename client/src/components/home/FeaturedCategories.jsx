import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data.categories.slice(0, 4)))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="eyebrow">Collections</span>
          <h2 className="section-title mt-2">Browse by Category</h2>
        </div>
        <Link to="/categories" className="text-sm font-semibold text-brassdark hover:text-ink transition hidden sm:block">
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-ink/5 animate-pulse rounded-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/categories/${cat.slug}`}
              className="group relative aspect-square overflow-hidden rounded-sm bg-ink"
            >
              <img
                src={cat.image?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"}
                alt={cat.name}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-display text-xl font-bold text-parchment">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
