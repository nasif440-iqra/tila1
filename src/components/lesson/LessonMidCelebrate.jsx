import { Icons } from "../Icons.jsx";
import { pickCopy } from "../../lib/engagement.js";
import { MID_CELEBRATE_COPY } from "../../lib/engagement.js";

export default function LessonMidCelebrate({ isHarakatLesson, correctCount, onContinue }) {
  const midMsg = pickCopy(isHarakatLesson ? MID_CELEBRATE_COPY.harakat : MID_CELEBRATE_COPY.default);
  return (
    <div className="screen" style={{ background: "var(--c-bg)", justifyContent: "center", alignItems: "center", textAlign: "center", position: "relative" }} onClick={onContinue}>
      <div className="noor-reveal" style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,164,100,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ animation: "subtleLift 0.4s ease both", position: "relative", zIndex: 1 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--c-accent-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "scaleIn 0.4s ease both" }}>
          <Icons.Star size={24} color="var(--c-accent)" />
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 600, color: "var(--c-primary-dark)", marginBottom: 8 }}>{midMsg}</h2>
        <p style={{ fontSize: 14, color: "var(--c-text-soft)" }}><span key={correctCount} style={{ animation: "numberReveal 0.35s ease both", display: "inline-block", fontWeight: 700, color: "var(--c-primary)" }}>{correctCount}</span>{" correct so far"}</p>
        <div className="progress-track" style={{ maxWidth: 200, margin: "16px auto 0" }}><div className="progress-fill" style={{ width: "50%", transition: "width 0.6s ease" }} /></div>
      </div>
    </div>
  );
}
