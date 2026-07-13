import { useState } from "react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're on the list. Watch your inbox for new lots.");
    setEmail("");
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="bg-ink rounded-sm px-8 py-14 md:px-16 text-center">
        <span className="eyebrow text-brass">Stay in the room</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-parchment mt-3 mb-4">
          Never miss a lot worth chasing
        </h2>
        <p className="text-parchment/60 max-w-md mx-auto mb-8">
          A short note whenever a new category opens or a rare item goes live.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 bg-white/10 border border-white/20 px-4 py-3 rounded-sm text-parchment placeholder:text-parchment/40 focus:outline-none focus:border-brass"
          />
          <button type="submit" className="bg-brass text-ink font-semibold px-6 py-3 rounded-sm hover:bg-parchment transition">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
