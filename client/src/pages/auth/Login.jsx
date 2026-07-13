import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      const redirectTo = location.state?.from || (user.role === "admin" ? "/admin/dashboard" : "/dashboard");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="eyebrow">Welcome back</span>
          <h1 className="font-display text-3xl font-bold mt-2">Sign In to Your Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-brassdark font-semibold hover:text-ink">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
