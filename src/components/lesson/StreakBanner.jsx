import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function StreakBanner({ streak }) {
  useEffect(() => {
    if (streak >= 7) {
      confetti({
        particleCount: 35,
        spread: 65,
        origin: { y: 0.3 },
        colors: ["#C4A464", "#EDD9A0", "#255038"],
        scalar: 0.8,
        gravity: 0.9,
      });
    }
  }, []);

  const isTier3 = streak >= 7;
  const isTier2 = streak === 5;

  const pillBg = isTier3
    ? "linear-gradient(135deg, #163323 0%, #255038 100%)"
    : "var(--c-primary)";

  const pillBorder = isTier3
    ? "1px solid rgba(196,164,100,0.35)"
    : isTier2
    ? "1px solid rgba(196,164,100,0.3)"
    : "1px solid rgba(196,164,100,0.25)";

  return (
    <motion.div
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -64, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      style={{
        position: "fixed",
        top: 16,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 150,
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 20px",
          borderRadius: 999,
          boxShadow: "0 4px 20px rgba(22,51,35,0.3)",
          background: pillBg,
          border: pillBorder,
        }}
      >
        {isTier3 ? (
          /* Tier 3: streak number | divider | Arabic + English */
          <>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.2 }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--c-accent)",
              }}
            >
              {streak}
            </motion.span>
            <div
              style={{
                width: 1,
                height: 16,
                background: "rgba(196,164,100,0.3)",
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-arabic)",
                  fontSize: 18,
                  color: "var(--c-accent)",
                }}
                dir="rtl"
              >
                {"\u0645\u0627\u0634\u0627\u0621 \u0627\u0644\u0644\u0647"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  fontStyle: "italic",
                }}
              >
                What Allah wills
              </span>
            </motion.div>
          </>
        ) : isTier2 ? (
          /* Tier 2: double star + text */
          <>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.2 }}
              style={{ fontSize: 11, color: "var(--c-accent)" }}
            >
              {"\u2726\u2726"}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.2 }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--c-accent)",
              }}
            >
              5 in a row  ·  Sharp focus.
            </motion.span>
          </>
        ) : (
          /* Tier 1: single star + text */
          <>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.2 }}
              style={{ fontSize: 12, color: "var(--c-accent)" }}
            >
              {"\u2726"}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.2 }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--c-accent)",
              }}
            >
              3 in a row
            </motion.span>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
