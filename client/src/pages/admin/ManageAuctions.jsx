import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";

const emptyForm = { item: "", startTime: "", endTime: "", startingBid: "", bidIncrement: "" };

function toLocalInput(dateStr) {
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ManageAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.get("/auctions"), api.get("/items")])
      .then(([auctionsRes, itemsRes]) => {
        setAuctions(auctionsRes.data.auctions);
        setItems(itemsRes.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const availableItems = items.filter(
    (item) => !auctions.some((a) => a.item?._id === item._id && ["upcoming", "live"].includes(a.status))
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, item: availableItems[0]?._id || "" });
    setModalOpen(true);
  };

  const openEdit = (auction) => {
    setEditing(auction);
    setForm({
      item: auction.item?._id,
      startTime: toLocalInput(auction.startTime),
      endTime: toLocalInput(auction.endTime),
      startingBid: auction.startingBid,
      bidIncrement: auction.bidIncrement,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/auctions/${editing._id}`, {
          startTime: form.startTime,
          endTime: form.endTime,
          startingBid: Number(form.startingBid),
          bidIncrement: Number(form.bidIncrement),
        });
        toast.success("Auction updated");
      } else {
        await api.post("/auctions", {
          item: form.item,
          startTime: form.startTime,
          endTime: form.endTime,
          startingBid: Number(form.startingBid),
          bidIncrement: Number(form.bidIncrement),
        });
        toast.success("Auction created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save auction");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (auction) => {
    if (!confirm(`Delete auction for "${auction.item?.title}"?`)) return;
    try {
      await api.delete(`/auctions/${auction._id}`);
      toast.success("Auction deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete auction");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="font-display text-4xl font-bold mt-2">Manage Auctions</h1>
        </div>
        <button onClick={openCreate} disabled={availableItems.length === 0} className="btn-primary">+ New Auction</button>
      </div>

      {availableItems.length === 0 && !loading && (
        <p className="text-sm text-wine mb-6">All items already have an active auction, or no items exist yet.</p>
      )}

      {loading ? (
        <Loader />
      ) : auctions.length === 0 ? (
        <EmptyState title="No auctions" message="Create your first auction to get started." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-left text-ink/50 uppercase text-xs tracking-wide">
                <th className="py-3 pr-4">Item</th>
                <th className="py-3 pr-4">Start</th>
                <th className="py-3 pr-4">End</th>
                <th className="py-3 pr-4">Current Bid</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {auctions.map((auction) => (
                <tr key={auction._id}>
                  <td className="py-4 pr-4 font-semibold">{auction.item?.title}</td>
                  <td className="py-4 pr-4">{new Date(auction.startTime).toLocaleString()}</td>
                  <td className="py-4 pr-4">{new Date(auction.endTime).toLocaleString()}</td>
                  <td className="py-4 pr-4">${auction.currentBid?.toLocaleString()}</td>
                  <td className="py-4 pr-4"><StatusBadge status={auction.status} /></td>
                  <td className="py-4 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(auction)} disabled={auction.totalBids > 0} className="text-brassdark font-semibold hover:text-ink mr-4 disabled:opacity-30 disabled:cursor-not-allowed">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(auction)} className="text-wine font-semibold hover:text-ink">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 px-6" onClick={() => setModalOpen(false)}>
          <div className="bg-parchment max-w-lg w-full rounded-sm p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-bold mb-6">{editing ? "Edit Auction" : "New Auction"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editing && (
                <div>
                  <label className="label">Item</label>
                  <select required value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} className="input-field">
                    {availableItems.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Time</label>
                  <input required type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">End Time</label>
                  <input required type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Starting Bid ($)</label>
                  <input required type="number" min="0" value={form.startingBid} onChange={(e) => setForm({ ...form, startingBid: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Bid Increment ($)</label>
                  <input required type="number" min="1" value={form.bidIncrement} onChange={(e) => setForm({ ...form, bidIncrement: e.target.value })} className="input-field" />
                </div>
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
