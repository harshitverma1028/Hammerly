import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar?.url || "");
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      if (name && name !== user.name) formData.append("name", name);
      if (password) formData.append("password", password);
      if (avatarFile) formData.append("avatar", avatarFile);

      const { data } = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(data.user);
      setPassword("");
      setAvatarFile(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="eyebrow">Your account</span>
        <h1 className="font-display text-4xl font-bold mt-2">Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-forest text-parchment flex items-center justify-center text-2xl font-bold overflow-hidden shrink-0">
            {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <label className="btn-secondary !px-4 !py-2 text-sm cursor-pointer">
              Change Avatar
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="label">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </div>

        <div>
          <label className="label">Email Address</label>
          <input type="email" value={user?.email || ""} disabled className="input-field opacity-60 cursor-not-allowed" />
        </div>

        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="input-field"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
