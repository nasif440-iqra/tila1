import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { sfxStreakTier1, sfxStreakTier2, sfxStreakTier3 } from "../../lib/audio.js";

// ── Tier 1: streak === 3 (Quiet momentum) ──
function Tier1() {
  return (
    <>
      {/* Gold pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "rgba(196,164,100,0.15)",
          border: "1px solid rgba(196,164,100,0.3)",
          padding: "6px 18px", borderRadius: 999, marginBottom: 28,
        }}
      >
        <span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "var(--c-accent)" }}>
          3 in a row
        </span>
      </motion.div>

      {/* Arabic word */}
      <motion.p
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        style={{
          fontFamily: "var(--font-arabic)", fontSize: 56, color: "var(--c-accent)",
          lineHeight: 1.4, margin: 0, position: "relative", zIndex: 1,
        }}
        dir="rtl"
      >
        {"\u0623\u064E\u062D\u0652\u0633\u064E\u0646\u0652\u062A\u064E"}
      </motion.p>

      {/* English translation */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        style={{
          fontFamily: "var(--font-heading)", fontSize: 15, fontStyle: "italic",
          color: "rgba(255,255,255,0.5)", marginTop: 10,
        }}
      >
        Well done
      </motion.p>
    </>
  );
}

// ── Tier 2: streak === 5 (Building intensity) ──
function Tier2() {
  return (
    <>
      {/* Flanking lines + number row */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 48, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          style={{ height: 1, background: "rgba(196,164,100,0.35)" }}
        />
        <motion.span
          initial={{ scale: 0.3, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 12 }}
          style={{
            fontFamily: "var(--font-heading)", fontSize: 96, fontWeight: 700,
            color: "var(--c-accent)", lineHeight: 1,
          }}
        >
          5
        </motion.span>
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 48, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          style={{ height: 1, background: "rgba(196,164,100,0.35)" }}
        />
      </div>

      {/* "in a row" */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        style={{
          fontFamily: "var(--font-body)", fontSize: 16, color: "rgba(255,255,255,0.75)",
          marginTop: 8,
        }}
      >
        in a row
      </motion.p>

      {/* Motivational line */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        style={{
          fontFamily: "var(--font-heading)", fontSize: 18, fontStyle: "italic",
          color: "var(--c-accent)", marginTop: 14,
        }}
      >
        Sharp focus.
      </motion.p>
    </>
  );
}

// ── Tier 3: streak >= 7 (Full celebration) ──
function Tier3({ streak }) {
  const motivational = streak === 7
    ? "This is real momentum."
    : streak === 10
    ? "Exceptional focus."
    : "Unstoppable.";

  return (
    <>
      {/* Gold radial gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 40%, rgba(196,164,100,0.12) 0%, transparent 65%)",
      }} />

      {/* Streak number with shimmer */}
      <motion.span
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, color: ["#C4A464", "#EDD9A0", "#C4A464"] }}
        transition={{
          scale: { type: "spring", stiffness: 400, damping: 10 },
          opacity: { duration: 0.2 },
          color: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          fontFamily: "var(--font-heading)", fontSize: 112, fontWeight: 700,
          lineHeight: 1, position: "relative", zIndex: 1,
        }}
      >
        {streak}
      </motion.span>

      {/* Three gold stars with stagger */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: "flex", gap: 14, marginTop: 12, position: "relative", zIndex: 1 }}
      >
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            variants={{
              hidden: { scale: 0, opacity: 0 },
              show: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 18 } },
            }}
            style={{ fontSize: 18, color: "var(--c-accent)" }}
          >
            {"\u2726"}
          </motion.span>
        ))}
      </motion.div>

      {/* Motivational line */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        style={{
          fontFamily: "var(--font-heading)", fontSize: 19, fontStyle: "italic",
          color: "var(--c-accent)", marginTop: 16, position: "relative", zIndex: 1,
        }}
      >
        {motivational}
      </motion.p>

      {/* Hadith quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{
          fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 20,
          maxWidth: 280, textAlign: "center", lineHeight: 1.6,
          fontFamily: "var(--font-body)", position: "relative", zIndex: 1,
        }}
      >
        {"\u201C"}The most beloved of deeds to Allah are the most consistent, even if small.{"\u201D"}
        <span style={{ display: "block", fontSize: 11, marginTop: 4, opacity: 0.7 }}>
          {"\u2014"} Prophet Muhammad {"\uFDFA"} (Bukhari)
        </span>
      </motion.p>
    </>
  );
}

// ── Main component ──
export default function StreakBurst({ streak, onDismiss }) {
  const tier = streak >= 7 ? 3 : streak === 5 ? 2 : 1;
  const dismissMs = tier === 3 ? 2200 : 1800;

  useEffect(() => {
    // Tier-appropriate sound
    if (tier === 1) sfxStreakTier1();
    else if (tier === 2) sfxStreakTier2();
    else sfxStreakTier3();

    // Tier-appropriate confetti
    if (tier === 2) {
      confetti({
        particleCount: 20,
        spread: 60,
        origin: { y: 0.45 },
        colors: ["#C4A464", "#EDD9A0", "#255038"],
        scalar: 0.85,
        gravity: 0.8,
      });
    } else if (tier === 3) {
      confetti({
        particleCount: 70,
        spread: 110,
        origin: { y: 0.45 },
        colors: ["#C4A464", "#EDD9A0", "#255038"],
        scalar: 0.85,
        gravity: 0.8,
      });
    }

    const t = setTimeout(onDismiss, dismissMs);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "var(--c-primary)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}
    >
      {tier === 1 && <Tier1 />}
      {tier === 2 && <Tier2 />}
      {tier === 3 && <Tier3 streak={streak} />}
    </motion.div>
  );
}
