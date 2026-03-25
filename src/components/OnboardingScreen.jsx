import { useState } from "react";
import { playLetterAudio, sfxTap, sfxCorrect, sfxWrong, sfxOnboardingAdvance, sfxOnboardingComplete } from "../lib/audio.js";

const intentionOptions = [
  "I want to read the Quran confidently",
  "I want to build a daily Quran habit",
  "I want to learn for prayer and understanding",
];

const goalOptions = [
  { label: "3 minutes", value: "3" },
  { label: "5 minutes", value: "5" },
  { label: "10 minutes", value: "10" },
];

const microInteractionCorrectAnswer = "Alif";

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedIntention, setSelectedIntention] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerChecked, setAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setIsTransitioning(false);
    }, 200);
  };

  const handleIntentionSelect = (option) => {
    sfxTap();
    setSelectedIntention(option);
  };

  const handleGoalSelect = (goalValue) => {
    sfxTap();
    setSelectedGoal(goalValue);
  };

  const handlePlayAudio = () => {
    playLetterAudio(1, "name");
  };

  const handleAnswerSelect = (option) => {
    if (answerChecked) return;
    sfxTap();
    setSelectedAnswer(option);
  };

  const handleCheckAnswer = () => {
    const correct = selectedAnswer === microInteractionCorrectAnswer;
    setIsCorrect(correct);
    setAnswerChecked(true);
    if (correct) sfxCorrect();
    else sfxWrong();
  };

  const handleFinish = () => {
    sfxOnboardingComplete();
    setIsTransitioning(true);
    localStorage.setItem("hasCompletedOnboarding", "true");
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div style={styles.noorGlow} />
            <h1 style={styles.headline}>It's okay to start from the beginning</h1>
            <p style={styles.body}>
              Every strong reader starts with a first letter. You're not behind — you're beginning.
            </p>
            <div style={styles.actions}>
              <button className="btn btn-primary" onClick={() => { sfxOnboardingAdvance(); goNext(); }}>
                Continue
              </button>
            </div>
          </>
        );

      case 1:
        return (
          <>
            <div style={styles.noorGlow} />
            <h1 style={styles.headline}>Every small effort counts</h1>
            <p style={styles.body}>
              Even a few focused minutes each day can grow into something meaningful.
            </p>
            <div style={styles.actions}>
              <button className="btn btn-primary" onClick={() => { sfxOnboardingAdvance(); goNext(); }}>
                Continue
              </button>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h1 style={styles.headline}>Why are you learning?</h1>
            <p style={styles.body}>
              Choose the reason that feels closest to your heart.
            </p>
            <div style={styles.optionsContainer}>
              {intentionOptions.map((option) => (
                <button
                  key={option}
                  className="ob-option"
                  style={{
                    ...styles.optionBtn,
                    ...(selectedIntention === option ? styles.optionSelected : {}),
                  }}
                  onClick={() => handleIntentionSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div style={styles.actions}>
              <button
                className="btn btn-primary"
                disabled={!selectedIntention}
                style={!selectedIntention ? styles.btnDisabled : {}}
                onClick={() => {
                  sfxOnboardingAdvance();
                  localStorage.setItem("onboardingIntention", selectedIntention);
                  goNext();
                }}
              >
                Continue
              </button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h1 style={styles.headline}>Choose your daily goal</h1>
            <p style={styles.body}>
              Start small. You can always adjust this later.
            </p>
            <div style={styles.optionsContainer}>
              {goalOptions.map((g) => (
                <button
                  key={g.value}
                  className="ob-option"
                  style={{
                    ...styles.optionBtn,
                    ...(selectedGoal === g.value ? styles.optionSelected : {}),
                  }}
                  onClick={() => handleGoalSelect(g.value)}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <div style={styles.actions}>
              <button
                className="btn btn-primary"
                disabled={!selectedGoal}
                style={!selectedGoal ? styles.btnDisabled : {}}
                onClick={() => {
                  sfxOnboardingAdvance();
                  localStorage.setItem("onboardingDailyGoal", selectedGoal);
                  goNext();
                }}
              >
                Set my goal
              </button>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h1 style={styles.headline}>Let's hear your first letter</h1>
            <p style={styles.body}>
              Tap play, listen carefully, then choose the correct answer.
            </p>
            <button
              className="btn btn-outline"
              style={{ marginBottom: 24, maxWidth: 220, alignSelf: "center" }}
              onClick={handlePlayAudio}
            >
              <span style={{ fontSize: 20 }}>&#9654;</span> Play sound
            </button>
            <p style={{ fontSize: 14, color: "var(--c-text-soft)", marginBottom: 12, fontWeight: 600 }}>
              Which letter did you hear?
            </p>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, justifyContent: "center" }}>
              {["Alif", "Ba"].map((option) => {
                let optStyle = { ...styles.answerBtn };
                if (answerChecked) {
                  if (option === microInteractionCorrectAnswer) {
                    optStyle = { ...optStyle, ...styles.answerCorrect };
                  } else if (option === selectedAnswer && !isCorrect) {
                    optStyle = { ...optStyle, ...styles.answerWrong };
                  }
                } else if (selectedAnswer === option) {
                  optStyle = { ...optStyle, ...styles.optionSelected };
                }
                return (
                  <button
                    key={option}
                    style={optStyle}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {answerChecked && (
              <p style={{
                fontSize: 14,
                color: isCorrect ? "var(--c-primary)" : "var(--c-danger)",
                fontWeight: 600,
                marginBottom: 16,
                animation: "softReveal 0.3s ease both",
              }}>
                {isCorrect
                  ? "Correct — this is Alif."
                  : "Not quite. This one is Alif."}
              </p>
            )}
            <div style={styles.actions}>
              {!answerChecked ? (
                <button
                  className="btn btn-primary"
                  disabled={!selectedAnswer}
                  style={!selectedAnswer ? styles.btnDisabled : {}}
                  onClick={handleCheckAnswer}
                >
                  Check answer
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => { sfxOnboardingAdvance(); goNext(); }}>
                  Continue
                </button>
              )}
            </div>
          </>
        );

      case 5:
        return (
          <>
            <div style={styles.noorGlow} />
            <h1 style={styles.headline}>You've already begun</h1>
            <p style={styles.body}>
              One small step is all it takes to start. Your first lesson is ready.
            </p>
            <div style={styles.actions}>
              <button className="btn btn-primary" onClick={handleFinish}>
                Start Lesson 1
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.progressRow}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              ...styles.progressDot,
              background: i <= step ? "var(--c-primary)" : "var(--c-border)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          ...styles.card,
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        {renderStepContent()}
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "40px 24px",
    background: "linear-gradient(180deg, var(--c-bg-warm) 0%, var(--c-bg) 50%)",
    position: "relative",
  },
  progressRow: {
    display: "flex",
    gap: 8,
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "background 0.3s ease",
  },
  card: {
    background: "var(--c-bg-card)",
    borderRadius: "var(--radius)",
    padding: "36px 28px",
    border: "1px solid var(--c-border)",
    boxShadow: "var(--shadow-card)",
    width: "100%",
    maxWidth: 380,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  headline: {
    fontFamily: "var(--font-heading)",
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1.3,
    color: "var(--c-text)",
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "var(--c-text-muted)",
    maxWidth: 300,
    marginBottom: 28,
  },
  actions: {
    width: "100%",
    marginTop: 8,
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    marginBottom: 24,
  },
  optionBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 20px",
    borderRadius: "var(--radius-btn)",
    border: "2px solid var(--c-border)",
    background: "var(--c-bg-card)",
    fontSize: 15,
    fontWeight: 500,
    fontFamily: "var(--font-body)",
    color: "var(--c-text)",
    cursor: "pointer",
    transition: "all 0.15s ease",
    textAlign: "center",
  },
  optionSelected: {
    borderColor: "var(--c-primary)",
    background: "var(--c-primary-soft)",
    color: "var(--c-primary)",
  },
  answerBtn: {
    flex: 1,
    padding: "16px 24px",
    borderRadius: "var(--radius-btn)",
    border: "2.5px solid var(--c-border)",
    background: "var(--c-bg-card)",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "var(--font-body)",
    color: "var(--c-text)",
    cursor: "pointer",
    transition: "all 0.15s ease",
    boxShadow: "var(--shadow-soft)",
  },
  answerCorrect: {
    borderColor: "var(--c-primary)",
    background: "var(--c-primary-soft)",
    color: "var(--c-primary)",
  },
  answerWrong: {
    borderColor: "var(--c-danger)",
    background: "var(--c-danger-light)",
    color: "var(--c-danger)",
  },
  btnDisabled: {
    opacity: 0.45,
    pointerEvents: "none",
  },
  noorGlow: {
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(196,164,100,0.15) 0%, rgba(196,164,100,0.04) 50%, transparent 70%)",
    animation: "noorBreath 4s ease-in-out infinite",
    marginBottom: 8,
    pointerEvents: "none",
  },
};
