import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function PhaseCompleteScreen({ phase, nextPhase, onContinue, wird }) {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.3 },
      colors: ["#C4A464", "#EDD9A0", "#255038", "#163323"],
      scalar: 1.1,
      gravity: 0.9,
    });
  }, []);

  return (
    <div className="screen" style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "48px 28px", minHeight: "100vh",
      background: "var(--c-primary)",
    }}>

      {/* ── Arabic centerpiece ── */}
      <div style={{ position: "relative", marginBottom: 40 }}>
        <div className="noor-glow noor-reveal" style={{
          width: 240, height: 240,
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(196,164,100,0.25) 0%, rgba(196,164,100,0.08) 50%, transparent 70%)",
        }} />
        <p className="scale-in" style={{
          fontFamily: "var(--font-arabic)", fontSize: 72, lineHeight: 1.3,
          color: "var(--c-accent)", position: "relative", zIndex: 1,
        }} dir="rtl">
          الحمد لله
        </p>
      </div>

      {/* ── Phase Complete label ── */}
      <p className="fade-up" style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em",
        color: "var(--c-accent)", marginBottom: 12, opacity: 0.85,
      }}>Phase Complete</p>

      {/* ── Phase title ── */}
      <h1 className="fade-up" style={{
        fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 600,
        color: "#FFFFFF", marginBottom: 16, animationDelay: "0.05s",
      }}>
        {phase?.title || "Phase"}
      </h1>

      {/* ── Affirmation ── */}
      <p className="fade-up" style={{
        fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.6,
        maxWidth: 280, marginBottom: 32, animationDelay: "0.1s",
      }}>
        {phase?.phase === 1 && "You now recognize the foundations of the Arabic alphabet."}
        {phase?.phase === 2 && "You can hear and distinguish the sounds of every letter."}
        {phase?.phase === 3 && "You've learned how vowel marks shape Arabic words."}
      </p>

      {/* ── Wird badge ── */}
      {wird > 0 && (
        <div className="fade-up" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          padding: "6px 14px", borderRadius: 999, marginBottom: 32, animationDelay: "0.15s",
        }}>
          <span style={{ fontSize: 13, color: "var(--c-accent)" }}>☽</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
            {wird} {wird === 1 ? "day" : "days"}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Wird</span>
        </div>
      )}

      {/* ── Next phase unlock or completion reflection ── */}
      {nextPhase ? (
        <div className="fade-up" style={{
          width: "100%", maxWidth: 320, marginBottom: 40, animationDelay: "0.2s",
          animation: "unlockReveal 0.7s ease both",
          animationDelay: "0.3s",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 20, padding: "24px 20px", textAlign: "center",
          }}>
            <p style={{
              fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em",
              color: "var(--c-accent)", marginBottom: 8, opacity: 0.8,
            }}>Unlocked</p>
            <h3 style={{
              fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 600,
              color: "#FFFFFF", marginBottom: 6,
            }}>
              {nextPhase.title}
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
              Your next chapter awaits.
            </p>
          </div>
        </div>
      ) : (
        <p className="fade-up" style={{
          fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.55)",
          maxWidth: 260, marginBottom: 40, lineHeight: 1.6, animationDelay: "0.2s",
          fontFamily: "var(--font-heading)",
        }}>
          You have completed every phase. May this knowledge stay with you.
        </p>
      )}

      {/* ── Continue button ── */}
      <div className="fade-up" style={{ width: "100%", maxWidth: 320, animationDelay: "0.35s" }}>
        <button onClick={onContinue} style={{
          width: "100%", background: "var(--c-accent)", color: "var(--c-primary-dark)",
          borderRadius: 16, padding: "16px 24px", border: "none",
          fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 600,
          cursor: "pointer", transition: "all 0.2s",
          boxShadow: "0 4px 20px rgba(196,164,100,0.30)",
        }}>
          Continue
        </button>
      </div>
    </div>
  );
}
