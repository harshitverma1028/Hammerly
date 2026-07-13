const testimonials = [
  {
    name: "Priya Malhotra",
    role: "Collector, Mumbai",
    quote: "Won a 1970s Leica for less than I expected and the bidding felt completely transparent.",
  },
  {
    name: "Daniel Osei",
    role: "First-time bidder",
    quote: "The live counter made it easy to know exactly when to push and when to walk away.",
  },
  {
    name: "Wei Zhang",
    role: "Vintage motors enthusiast",
    quote: "Item details were thorough enough that I trusted the lot without seeing it in person.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-forest/5 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span className="eyebrow">From the bidding floor</span>
          <h2 className="section-title mt-2">What Winners Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <p className="text-ink/80 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brass/30 flex items-center justify-center font-display font-bold text-brassdark">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-ink">{t.name}</p>
                  <p className="text-xs text-ink/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
