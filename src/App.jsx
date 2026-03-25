import { useState, useCallback, useMemo, useRef } from "react";
import useIqraAppState from "./hooks/useIqraAppState.js";
import OnboardingScreen from "./components/OnboardingScreen.jsx";
import HomeScreen from "./components/HomeScreen.jsx";
import LessonScreen from "./components/lesson/LessonScreen.jsx";
import ProgressScreen from "./components/ProgressScreen.jsx";
import PhaseCompleteScreen from "./components/PhaseCompleteScreen.jsx";
import ReturnHadithScreen from "./components/ReturnHadithScreen.jsx";
import { Icons } from "./components/Icons.jsx";
import { getDueLetters, getCurrentPhase } from "./lib/selectors.js";
import { getTodayDateString } from "./lib/progress.js";
import { unlockAudio, sfxTransition } from "./lib/audio.js";

export default function App() {
  const {
    progress,
    completedLessonIds,
    lessonsCompleted,
    lastCompletedLesson,
    wirdState,
    phaseCompleteData,
    initialScreen,
    hasCompletedOnboarding: savedOnboarded,
    handleLessonComplete: onLessonComplete,
    handlePhaseCompleteContinue: onPhaseCompleteContinue,
    handleDismissHadith: onDismissHadith,
  } = useIqraAppState();

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    () => savedOnboarded || localStorage.getItem("hasCompletedOnboarding") === "true"
  );
  const [screen, setScreen] = useState(initialScreen);
  const [activeTab, setActiveTab] = useState("home");
  const [currentLessonId, setCurrentLessonId] = useState(null);

  const hasUnlocked = useRef(false);
  const handleFirstTouch = () => {
    if (!hasUnlocked.current) {
      unlockAudio();
      hasUnlocked.current = true;
    }
  };

  const handleOnboard = useCallback(() => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    setHasCompletedOnboarding(true);
  }, []);

  const handleStartLesson = useCallback((id) => { sfxTransition(); setCurrentLessonId(id); setScreen("lesson"); }, []);
  const handleGoHome = useCallback(() => { sfxTransition(); setScreen("home"); setActiveTab("home"); }, []);

  const handleLessonComplete = useCallback((lessonId, quizResults, speakResults) => {
    const hasPhaseIntercept = onLessonComplete(lessonId, quizResults, speakResults);
    if (hasPhaseIntercept) {
      setScreen("phaseComplete");
    } else {
      setScreen("home");
      setActiveTab("home");
    }
  }, [onLessonComplete]);

  const handleDismissHadith = useCallback(() => {
    onDismissHadith();
    setScreen("home");
    setActiveTab("home");
  }, [onDismissHadith]);

  const handlePhaseCompleteContinue = useCallback(() => {
    onPhaseCompleteContinue();
    setScreen("home");
    setActiveTab("home");
  }, [onPhaseCompleteContinue]);

  if (!hasCompletedOnboarding) return (<div className="app-shell" onClick={handleFirstTouch}><OnboardingScreen onComplete={handleOnboard} /></div>);
  return (
    <div className="app-shell" onClick={handleFirstTouch}>
      {screen === "returnHadith" && <ReturnHadithScreen onContinue={handleDismissHadith} />}
      {screen === "phaseComplete" && phaseCompleteData && <PhaseCompleteScreen phase={phaseCompleteData} nextPhase={phaseCompleteData.nextPhase} onContinue={handlePhaseCompleteContinue} wird={wirdState.currentWird} />}
      {screen === "home" && <HomeScreen progress={progress} completedLessonIds={completedLessonIds} lessonsCompleted={lessonsCompleted} lastCompletedLesson={lastCompletedLesson} onStartLesson={handleStartLesson} currentWird={wirdState.currentWird} todayLessonCount={wirdState.todayLessonCount} />}
      {screen === "lesson" && currentLessonId === "review" && (
        <LessonScreen
          lessonId="review"
          lessonOverride={{
            id: "review",
            phase: getCurrentPhase(completedLessonIds),
            lessonMode: "review",
            title: "Review Session",
            description: "Letters due for practice",
            teachIds: getDueLetters(progress, getTodayDateString()),
            reviewIds: [],
            familyRule: "Practice the letters you've already learned.",
          }}
          progress={progress} completedLessonIds={completedLessonIds} lessonsCompleted={lessonsCompleted} onComplete={handleLessonComplete} onBack={handleGoHome}
        />
      )}
      {screen === "lesson" && currentLessonId !== "review" && <LessonScreen lessonId={currentLessonId} progress={progress} completedLessonIds={completedLessonIds} lessonsCompleted={lessonsCompleted} onComplete={handleLessonComplete} onBack={handleGoHome} />}
      {screen === "progress" && <ProgressScreen progress={progress} completedLessonIds={completedLessonIds} onStartLesson={handleStartLesson} />}
      {!["lesson", "returnHadith", "phaseComplete"].includes(screen) && <div className="nav-bar">
        <button className={`nav-item ${activeTab === "home" ? "active" : ""}`} onClick={() => { setScreen("home"); setActiveTab("home"); }}><Icons.Home size={22} color={activeTab === "home" ? "var(--c-primary)" : "var(--c-text-muted)"} /><span>Home</span></button>
        <button className={`nav-item ${activeTab === "progress" ? "active" : ""}`} onClick={() => { setScreen("progress"); setActiveTab("progress"); }}><Icons.Chart size={22} color={activeTab === "progress" ? "var(--c-primary)" : "var(--c-text-muted)"} /><span>Progress</span></button>
      </div>}
    </div>
  );
}
