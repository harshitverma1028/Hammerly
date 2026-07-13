import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password);
      toast.success(`Welcome, ${user.name.split(" ")[0]}!`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="eyebrow">Join the house</span>
          <h1 className="font-display text-3xl font-bold mt-2">Create Your Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          <div>
            <label className="label">Full Name</label>
            <input type="text" name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" name="password" required value={form.password} onChange={handleChange} className="input-field" placeholder="At least 6 characters" />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} className="input-field" placeholder="Repeat password" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brassdark font-semibold hover:text-ink">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
