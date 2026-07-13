import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data.categories.filter((c) => c.status === "active")))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading categories..." />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="eyebrow">Collections</span>
        <h1 className="font-display text-4xl font-bold mt-2">All Categories</h1>
        <p className="text-ink/60 mt-2">Pick a collection to see every lot within it.</p>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No categories yet" message="The house hasn't published any collections." />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat._id} to={`/categories/${cat.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-ink">
              <img
                src={cat.image?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"}
                alt={cat.name}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-display text-2xl font-bold text-parchment">{cat.name}</p>
                {cat.description && <p className="text-sm text-parchment/70 mt-1 line-clamp-2">{cat.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
