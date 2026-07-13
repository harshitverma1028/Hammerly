const steps = [
  {
    title: "Register",
    text: "Create a free account in under a minute. No paddle fees, no fine print.",
  },
  {
    title: "Browse & Inspect",
    text: "Explore categories, open item details, study photos, condition and provenance.",
  },
  {
    title: "Join the Room",
    text: "Enter a live auction the moment it opens. Watch the bid climb in real time.",
  },
  {
    title: "Bid & Win",
    text: "Raise your bid past the floor. Highest bid standing when the clock hits zero takes the lot.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-12">
        <span className="eyebrow">The process</span>
        <h2 className="section-title mt-2">How It Works</h2>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={step.title} className="relative pl-6 border-l-2 border-brass/40">
            <p className="font-display text-4xl font-extrabold text-brass/30 mb-2">{String(i + 1).padStart(2, "0")}</p>
            <p className="font-display text-lg font-bold text-ink mb-2">{step.title}</p>
            <p className="text-sm text-ink/60 leading-relaxed">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
