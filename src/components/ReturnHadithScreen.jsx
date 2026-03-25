export default function ReturnHadithScreen({ onContinue }) {
  return (
    <div className="screen" style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "40px 28px", minHeight: "100vh",
      background: "linear-gradient(180deg, var(--c-bg-warm) 0%, var(--c-bg) 50%)",
    }}>
      {/* decorative circle */}
      <div className="scale-in" style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "var(--c-accent-light)", border: "1.5px solid var(--c-accent)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 32, position: "relative",
      }}>
        <div className="noor-glow" style={{ width: 140, height: 140, top: -30, left: -30 }} />
        <span style={{ fontSize: 32, position: "relative", zIndex: 1 }}>&#9789;</span>
      </div>

      <p className="fade-up" style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em",
        color: "var(--c-accent)", marginBottom: 16,
      }}>Welcome back</p>

      <div className="fade-up" style={{
        background: "var(--c-bg-card)", borderRadius: 24, padding: "28px 24px",
        border: "1px solid var(--c-border)", boxShadow: "var(--shadow-card)",
        maxWidth: 340, width: "100%", marginBottom: 32, animationDelay: "0.1s",
      }}>
        <p style={{
          fontFamily: "var(--font-heading)", fontSize: 17, fontStyle: "italic",
          color: "var(--c-text)", lineHeight: 1.6, marginBottom: 16,
        }}>
          "The most beloved of deeds to Allah are those that are most consistent, even if they are small."
        </p>
        <p style={{
          fontSize: 12, color: "var(--c-text-muted)", fontWeight: 600,
        }}>
          — Prophet Muhammad (peace be upon him)
        </p>
      </div>

      <p className="fade-up" style={{
        fontSize: 15, color: "var(--c-text-soft)", lineHeight: 1.6,
        maxWidth: 300, marginBottom: 32, animationDelay: "0.15s",
      }}>
        Every return is a step forward. Pick up right where you left off.
      </p>

      <div className="fade-up" style={{ width: "100%", maxWidth: 320, animationDelay: "0.2s" }}>
        <button className="btn btn-primary" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
