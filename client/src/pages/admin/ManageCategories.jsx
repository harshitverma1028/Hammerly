import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const emptyForm = { name: "", description: "", status: "active" };

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get("/categories").then(({ data }) => setCategories(data.categories)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "", status: cat.status });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("status", form.status);
      if (imageFile) formData.append("image", imageFile);

      if (editing) {
        await api.put(`/categories/${editing._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Category updated");
      } else {
        await api.post("/categories", formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Category created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/categories/${cat._id}`);
      toast.success("Category deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="font-display text-4xl font-bold mt-2">Manage Categories</h1>
        </div>
        <button onClick={openCreate} className="btn-primary">+ New Category</button>
      </div>

      {loading ? (
        <Loader />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories" message="Create your first category to get started." action={<button onClick={openCreate} className="btn-primary">+ New Category</button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="card overflow-hidden">
              <div className="aspect-video bg-ink/5 overflow-hidden">
                <img src={cat.image?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg font-bold">{cat.name}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cat.status === "active" ? "bg-forest/10 text-forest" : "bg-ink/10 text-ink/50"}`}>
                    {cat.status}
                  </span>
                </div>
                <p className="text-sm text-ink/50 mt-1 line-clamp-2">{cat.description}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(cat)} className="btn-secondary !py-2 !px-4 text-sm flex-1">Edit</button>
                  <button onClick={() => handleDelete(cat)} className="btn-danger !py-2 !px-4 text-sm flex-1">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 px-6" onClick={() => setModalOpen(false)}>
          <div className="bg-parchment max-w-lg w-full rounded-sm p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-bold mb-6">{editing ? "Edit Category" : "New Category"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} />
              </div>
              <div>
                <label className="label">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="label">Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="input-field" />
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
