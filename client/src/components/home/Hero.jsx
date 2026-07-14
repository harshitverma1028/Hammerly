import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-12 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow">Est. by curious minds</span>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-[1.05] mt-4 mb-6 text-ink">
            The gavel falls on things worth chasing.
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed mb-8 max-w-lg">
            Rare watches, vintage motors, first editions, forgotten art. Every lot verified,
            every bid public, every winner real. Step up and raise your paddle.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/auctions" className="btn-primary">Enter Live Auctions</Link>
            <Link to="/categories" className="btn-secondary">Browse Categories</Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] bg-ink rounded-sm overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=1200&auto=format&fit=crop"
              alt="Auction gavel on wooden desk"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-parchment">
              <p className="font-display text-2xl font-bold">Lot 042 — 1962 Chronograph</p>
              <p className="text-sm text-parchment/70">Sold for $18,400 last season</p>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-brass text-ink px-6 py-4 rounded-sm shadow-lg hidden sm:block">
            <p className="font-display text-3xl font-extrabold leading-none">2,300+</p>
            <p className="text-xs font-semibold tracking-wide uppercase mt-1">Lots sold to date</p>
          </div>
        </div>
      </div>
    </section>
  );
}
