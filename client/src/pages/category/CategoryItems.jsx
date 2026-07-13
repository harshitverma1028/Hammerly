import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

export default function CategoryItems() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/items/category/${slug}`)
      .then(({ data }) => {
        setCategory(data.category);
        setItems(data.items);
      })
      .catch((err) => setError(err.response?.data?.message || "Category not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader label="Loading items..." />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <EmptyState title="Category not found" message={error} action={<Link to="/categories" className="btn-secondary">Back to Categories</Link>} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <Link to="/categories" className="text-sm font-semibold text-brassdark hover:text-ink transition">← All Categories</Link>
        <h1 className="font-display text-4xl font-bold mt-4">{category?.name}</h1>
        {category?.description && <p className="text-ink/60 mt-2 max-w-xl">{category.description}</p>}
      </div>

      {items.length === 0 ? (
        <EmptyState title="No items in this category" message="Check back soon, or explore another collection." action={<Link to="/categories" className="btn-secondary">Browse other categories</Link>} />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link key={item._id} to={`/items/${item._id}`} className="card overflow-hidden group hover:border-brass transition">
              <div className="aspect-[4/3] overflow-hidden bg-ink/5">
                <img
                  src={item.images?.[0]?.url || "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800&auto=format&fit=crop"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5">
                <p className="font-display text-lg font-bold truncate">{item.title}</p>
                <p className="text-sm text-ink/50 mt-1 line-clamp-2">{item.description}</p>
                {item.brand && <p className="text-xs text-brassdark font-semibold uppercase tracking-wide mt-3">{item.brand}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
