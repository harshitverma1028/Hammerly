import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/users").then(({ data }) => setUsers(data.users)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (user) => {
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${user._id}`);
      toast.success("User deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="eyebrow">Admin</span>
        <h1 className="font-display text-4xl font-bold mt-2">Manage Users</h1>
      </div>

      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <EmptyState title="No users" message="No one has registered yet." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-left text-ink/50 uppercase text-xs tracking-wide">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Joined</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="py-4 pr-4 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest text-parchment flex items-center justify-center text-xs font-bold overflow-hidden">
                      {user.avatar?.url ? <img src={user.avatar.url} className="w-full h-full object-cover" alt="" /> : user.name[0].toUpperCase()}
                    </div>
                    {user.name}
                  </td>
                  <td className="py-4 pr-4 text-ink/60">{user.email}</td>
                  <td className="py-4 pr-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${user.role === "admin" ? "bg-brass/20 text-brassdark" : "bg-ink/10 text-ink/60"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-ink/50">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 text-right">
                    {user.role !== "admin" && (
                      <button onClick={() => handleDelete(user)} className="text-wine font-semibold hover:text-ink">Delete</button>
                    )}
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
