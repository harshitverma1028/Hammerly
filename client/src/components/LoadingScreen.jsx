import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const SHOP_TEXT = "WELCOME TO HAMMERLY";
function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro -> ready -> opening -> done
  const [progress, setProgress] = useState(0);
  const hasTriggered = useRef(false);

  const trigger = () => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    setPhase("opening");
  };

  // fake but smooth progress counter, purely for atmosphere
  useEffect(() => {
    if (phase !== "intro") return;
    const start = Date.now();
    const duration = 1500;
    const id = setInterval(() => {
      const pct = Math.min(100, Math.round(((Date.now() - start) / duration) * 100));
      setProgress(pct);
      if (pct >= 100) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [phase]);

  // let the sign animation finish playing before we start listening for scroll
  useEffect(() => {
    const t = setTimeout(() => setPhase("ready"), 1500);
    return () => clearTimeout(t);
  }, []);

  // listen for the "pull the shutter" gesture once we're ready
  useEffect(() => {
    if (phase !== "ready") return;

    let touchY = 0;
    const handleWheel = (e) => e.deltaY > 0 && trigger();
    const handleTouchStart = (e) => (touchY = e.touches[0].clientY);
    const handleTouchMove = (e) => {
      if (touchY - e.touches[0].clientY > 20) trigger();
    };
    const handleKey = (e) =>
      ["ArrowDown", "PageDown", " "].includes(e.key) && trigger();

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKey);
    };
  }, [phase]);

  // lock body scroll until the shutter has fully rolled up
  useEffect(() => {
    document.body.style.overflow = phase === "done" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  const words = SHOP_TEXT.split(" ");
  const totalLetters = SHOP_TEXT.replace(/ /g, "").length;
  const opening = phase === "opening";

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#14100c]">
      {/* exterior brick wall the shutter is mounted on */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundColor: "#1c1512",
          backgroundImage:
            "linear-gradient(335deg, rgba(0,0,0,.35) 23%, transparent 23%), linear-gradient(155deg, rgba(0,0,0,.35) 23%, transparent 23%), linear-gradient(335deg, rgba(0,0,0,.35) 23%, transparent 23%), linear-gradient(155deg, rgba(0,0,0,.35) 23%, transparent 23%)",
          backgroundSize: "58px 58px",
          backgroundPosition: "0 0, 0 0, 29px 29px, 29px 29px",
        }}
      />

      {/* warm light spilling out from inside the shop as the shutter lifts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0.9 : 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-amber-400/40 via-amber-500/10 to-transparent"
      />

      {/* film-grain / rust texture over everything */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ===== housing box the shutter rolls up into ===== */}
      <div
        className="absolute inset-x-0 top-0 z-20 h-11 border-b border-black/40"
        style={{
          background:
            "linear-gradient(180deg, #7a828a 0%, #565e65 35%, #3a4046 100%)",
          boxShadow: "0 6px 14px rgba(0,0,0,0.45)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 10px)",
          }}
        />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-semibold tracking-[0.35em] text-slate-300/70">
          HAMMERLY -Auction House
        </span>
      </div>

      {/* ===== left + right guide rails ===== */}
      {["left-0", "right-0"].map((side) => (
        <div
          key={side}
          className={`absolute ${side} top-11 bottom-0 z-20 w-6`}
          style={{
            backgroundImage:
              "linear-gradient(90deg, #565e65 0%, #3a4046 50%, #2a2f34 100%), radial-gradient(circle, #23262a 0%, #23262a 38%, transparent 40%)",
            backgroundSize: "100% 100%, 100% 40px",
            backgroundRepeat: "no-repeat, repeat-y",
            backgroundPosition: "center, center 8px",
            boxShadow:
              side === "left-0"
                ? "inset -3px 0 6px rgba(0,0,0,0.4)"
                : "inset 3px 0 6px rgba(0,0,0,0.4)",
          }}
        />
      ))}

      {/* ===== the rolling shutter panel itself ===== */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: opening ? "-102%" : 0 }}
        transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {
          if (opening) {
            onComplete?.();
            setPhase("done");
          }
        }}
        className="absolute inset-x-6 top-11 bottom-0 z-10 flex flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, #767d84 0px, #767d84 3px, #565d64 3px, #565d64 6px, #3c4348 6px, #3c4348 42px), repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 3px)",
          boxShadow: "inset 0 12px 22px rgba(0,0,0,0.45)",
        }}
      >
        {/* corner rivets on every slat, subtle */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.45) 25%, transparent 27%)",
            backgroundSize: "16px 42px",
            backgroundPosition: "6px 6px",
          }}
        />

        {/* eyebrow */}
        <motion.span
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 mb-5 text-[10px] font-semibold uppercase text-amber-400/80"
        >
          The Shop Is Opening
        </motion.span>

        {/* shop name, letter by letter, stencilled / welded look */}
        <div className="relative z-10 flex flex-wrap justify-center gap-x-4 px-6 text-center">
          {words.map((word, wi) => {
            const priorLetters = words.slice(0, wi).join("").length;
            return (
              <span key={wi} className="inline-flex">
                {Array.from(word).map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: 0.25 + (priorLetters + i) * 0.05,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-orange-500 [text-shadow:0_0_28px_rgba(251,146,60,0.35)] sm:text-5xl md:text-6xl"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </div>

        {/* signage plate: name + role, fades in once the shop name has welded in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 + totalLetters * 0.05 + 0.25, duration: 0.6 }}
          className="relative z-10 mt-4 flex items-center gap-3 rounded-sm border border-slate-500/30 bg-black/20 px-4 py-1.5"
        >
        </motion.div>

        {/* progress gauge, doubles as a loading indicator */}
        <div className="relative z-10 mt-10 flex w-48 flex-col items-center gap-2">
          <div className="flex w-full items-center justify-between text-[9px] tracking-[0.2em] text-slate-400">
            <span>OPENING SEQUENCE</span>
            <span className="font-mono tabular-nums text-amber-400/90">
              {progress}%
            </span>
          </div>
          <div className="h-[4px] w-full overflow-hidden rounded-full bg-black/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.05 }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(251,146,60,0.6)]"
            />
          </div>
        </div>

        {/* bottom pull-bar with handles + padlock */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 flex h-8 items-center justify-center gap-6 border-t border-black/40"
          style={{ backgroundImage: "linear-gradient(180deg, #565d64, #26292d)" }}
        >
          <span className="h-3 w-8 rounded-full border-2 border-slate-500/70" />

          <motion.svg
            width="26"
            height="30"
            viewBox="0 0 26 30"
            fill="none"
            animate={opening ? { rotate: -18, y: -3, opacity: 0 } : { rotate: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
          >
            <rect x="3" y="13" width="20" height="15" rx="2.5" fill="#d97706" />
            <path
              d="M7 13V9a6 6 0 0 1 12 0v4"
              stroke="#f2b154"
              strokeWidth="3"
              fill="none"
            />
            <circle cx="13" cy="20" r="2.2" fill="#3a2a10" />
          </motion.svg>

          <span className="h-3 w-8 rounded-full border-2 border-slate-500/70" />
        </div>
      </motion.div>

      {/* pull-to-open hint, only shown once ready */}
      <motion.button
        type="button"
        onClick={trigger}
        aria-label="Open the shop"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "ready" ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-12 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-200"
      >
        <span className="text-xs uppercase tracking-[0.3em] [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
          Pull up to open
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center leading-none text-amber-400"
        >
          <span>▲</span>
          <span className="-mt-2 opacity-60">▲</span>
        </motion.div>
      </motion.button>
    </div>
  );
}

export default LoadingScreen;
