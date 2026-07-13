import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  brand: "",
  location: "",
  year: "",
  condition: "good",
  authenticityCertificate: false,
  featured: false,
};

const CONDITIONS = ["new", "like-new", "excellent", "good", "fair", "poor"];

export default function ManageItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [specs, setSpecs] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.get("/items"), api.get("/categories")])
      .then(([itemsRes, catsRes]) => {
        setItems(itemsRes.data.items);
        setCategories(catsRes.data.categories);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0]?._id || "" });
    setSpecs([]);
    setImageFiles([]);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      category: item.category?._id,
      brand: item.brand || "",
      location: item.location || "",
      year: item.year || "",
      condition: item.condition,
      authenticityCertificate: item.authenticityCertificate,
      featured: item.featured,
    });
    setSpecs(item.specifications || []);
    setImageFiles([]);
    setModalOpen(true);
  };

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const updateSpec = (i, field, value) => {
    const next = [...specs];
    next[i][field] = value;
    setSpecs(next);
  };
  const removeSpec = (i) => setSpecs(specs.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("specifications", JSON.stringify(specs.filter((s) => s.key)));
      imageFiles.forEach((file) => formData.append("images", file));

      if (editing) {
        await api.put(`/items/${editing._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Item updated");
      } else {
        await api.post("/items", formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Item created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete item "${item.title}"?`)) return;
    try {
      await api.delete(`/items/${item._id}`);
      toast.success("Item deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete item");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="font-display text-4xl font-bold mt-2">Manage Items</h1>
        </div>
        <button onClick={openCreate} disabled={categories.length === 0} className="btn-primary">+ New Item</button>
      </div>

      {categories.length === 0 && !loading && (
        <p className="text-sm text-wine mb-6">Create a category first before adding items.</p>
      )}

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState title="No items" message="Add your first item to get started." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="card overflow-hidden">
              <div className="aspect-video bg-ink/5 overflow-hidden">
                <img src={item.images?.[0]?.url || "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800&auto=format&fit=crop"} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <p className="font-display text-lg font-bold truncate">{item.title}</p>
                <p className="text-xs text-ink/40 uppercase tracking-wide mt-1">{item.category?.name}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(item)} className="btn-secondary !py-2 !px-4 text-sm flex-1">Edit</button>
                  <button onClick={() => handleDelete(item)} className="btn-danger !py-2 !px-4 text-sm flex-1">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-ink/60 flex items-start justify-center z-50 px-6 py-10 overflow-y-auto" onClick={() => setModalOpen(false)}>
          <div className="bg-parchment max-w-2xl w-full rounded-sm p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-bold mb-6">{editing ? "Edit Item" : "New Item"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Condition</label>
                  <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="input-field">
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Brand</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Year</label>
                  <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="input-field" />
                </div>
              </div>

              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={form.authenticityCertificate} onChange={(e) => setForm({ ...form, authenticityCertificate: e.target.checked })} />
                  Authenticity Certificate
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label !mb-0">Specifications</label>
                  <button type="button" onClick={addSpec} className="text-xs font-semibold text-brassdark hover:text-ink">+ Add Spec</button>
                </div>
                <div className="space-y-2">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <input placeholder="Key" value={spec.key} onChange={(e) => updateSpec(i, "key", e.target.value)} className="input-field" />
                      <input placeholder="Value" value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)} className="input-field" />
                      <button type="button" onClick={() => removeSpec(i)} className="text-wine px-2">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Images (up to 6)</label>
                <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files))} className="input-field" />
                {editing && <p className="text-xs text-ink/40 mt-1">Uploading new images will replace existing ones.</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
