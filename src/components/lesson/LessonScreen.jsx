import { useState, useEffect, useRef } from "react";
import { LESSONS } from "../../data/lessons.js";
import { getLetter } from "../../data/letters.js";
import { sfxTap, sfxCorrect, sfxWrong, sfxComplete, sfxTransition, playLetterAudio, sfxStreakTier1, sfxStreakTier2, sfxStreakTier3 } from "../../lib/audio.js";
import { playGeneratedArabicAudio } from "../../lib/tts.js";
import { generateLessonQuestions, getWrongExplanation, getContrastExplanation, getHarakatWrongExplanation, pickRandom, shuffle } from "../../lib/questions/index.js";
import { getCombo, generateHarakatCombos } from "../../data/harakat.js";
import { pickCopy, getCorrectPool, STREAK_COPY, MID_CELEBRATE_COPY, WRONG_ENCOURAGEMENT } from "../../lib/engagement.js";

import LessonIntro from "./LessonIntro.jsx";
import LessonQuiz from "./LessonQuiz.jsx";
import LessonMidCelebrate from "./LessonMidCelebrate.jsx";
import LessonSummary from "./LessonSummary.jsx";
import LessonSpeak from "./LessonSpeak.jsx";

const CORRECT_MESSAGES = ["That's right.", "You got it.", "Correct.", "Well spotted.", "Exactly right.", "You see the difference.", "Good eye.", "Clear and correct."];
const SOUND_CORRECT = ["You matched it.", "Good ear.", "That's the sound.", "You recognized it.", "Right match.", "Your ear is learning."];
const HARAKAT_CORRECT = ["You read that.", "You heard the vowel.", "That's the right sound.", "You're reading Arabic sounds.", "You matched the mark to the sound.", "You can hear the difference."];

export default function LessonScreen({ lessonId, lessonOverride, progress, completedLessonIds, lessonsCompleted, onComplete, onBack }) {
  const lesson = lessonOverride || LESSONS.find(l => l.id === lessonId);
  const teachLetters = (lesson.teachIds || []).map(id => getLetter(id));
  const isSound = lesson.lessonMode === "sound";
  const isContrast = lesson.lessonMode === "contrast";
  const isHarakatIntro = lesson.lessonMode === "harakat-intro";
  const isHarakatApplied = lesson.lessonMode === "harakat" || lesson.lessonMode === "harakat-mixed";
  const isHarakatLesson = isHarakatIntro || isHarakatApplied;
  const lessonCombos = isHarakatApplied
    ? (lesson.teachCombos?.length > 0
      ? lesson.teachCombos.map(id => getCombo(id)).filter(Boolean)
      : generateHarakatCombos(lesson.teachIds || [], lesson.teachHarakat))
    : [];
  const audioType = (isSound || isContrast) ? "sound" : "name";

  const [phase, setPhase] = useState("intro");
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [streak, setStreak] = useState(0);
  const [wrongExplanation, setWrongExplanation] = useState(null);
  const [originalQCount, setOriginalQCount] = useState(0);
  const [midPoint, setMidPoint] = useState(-1);
  const [midShown, setMidShown] = useState(false);
  const [speakIndex, setSpeakIndex] = useState(0);
  const [speakPhase, setSpeakPhase] = useState("ready");
  const [speakResults, setSpeakResults] = useState([]);
  const [bannerStreak, setBannerStreak] = useState(null);
  const bannerTimeoutRef = useRef(null);

  useEffect(() => {
    return () => { if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current); };
  }, []);

  useEffect(() => {
    if (phase === "quiz" && questions.length === 0) {
      const qs = generateLessonQuestions(lesson, progress);
      setQuestions(qs);
      setOriginalQCount(qs.length);
      if (qs.length >= 8) setMidPoint(Math.floor(qs.length * 0.45));
    }
  }, [phase]);

  const currentQ = questions[qIndex];
  const answered = selected !== null;
  const isCorrect = answered && currentQ?.options.find(o => o.id === selected)?.isCorrect;
  const isFirstCorrect = lessonsCompleted === 0 && lesson.id === 1 && isCorrect && quizResults.filter(r => r.correct).length === 1;

  const playQuestionAudio = (q) => {
    console.log("[AUDIO UI] playQuestionAudio called, ttsText:", q?.ttsText, "targetId:", q?.targetId);
    if (q?.ttsText) playGeneratedArabicAudio(q.ttsText);
    else if (q?.targetId) playLetterAudio(q.targetId, audioType);
  };

  const handleSelect = (optionId) => {
    if (answered) return; setSelected(optionId);
    const correct = currentQ.options.find(o => o.id === optionId)?.isCorrect;
    setQuizResults(prev => [...prev, { targetId: currentQ.targetId, correct }]);
    if (correct) {
      sfxCorrect(); setWrongExplanation(null);
      const ns = streak + 1; setStreak(ns);
      if ([3, 5, 7].includes(ns)) {
        if (ns === 3) sfxStreakTier1();
        else if (ns === 5) sfxStreakTier2();
        else sfxStreakTier3();
        if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);
        setBannerStreak(ns);
        bannerTimeoutRef.current = setTimeout(() => setBannerStreak(null), 2000);
      }
    } else {
      sfxWrong(); setStreak(0);
      const isSoundQ = currentQ.hasAudio || currentQ.optionMode === "sound";
      if (currentQ.isHarakat) {
        setWrongExplanation(getHarakatWrongExplanation(currentQ, optionId));
      } else {
        setWrongExplanation(isContrast ? getContrastExplanation(optionId, currentQ.targetId) : getWrongExplanation(optionId, currentQ.targetId, isSoundQ ? "sound" : "recognition"));
      }
      if (isSoundQ || currentQ.ttsText) {
        setTimeout(() => playQuestionAudio(currentQ), 600);
      }
      if (!currentQ._recycled) setQuestions(prev => [...prev, { ...currentQ, options: shuffle([...currentQ.options]), _recycled: true }]);
    }
  };

  const handleQuizNext = () => {
    const nextIdx = qIndex + 1;
    if (nextIdx < questions.length) {
      if (midPoint > 0 && nextIdx === midPoint && !midShown) {
        setPhase("midCelebrate");
        return;
      }
      setQIndex(nextIdx); setSelected(null); setWrongExplanation(null);
    } else {
      sfxTransition(); setPhase("summary");
    }
  };

  const handleMidContinue = () => {
    setMidShown(true);
    setQIndex(midPoint); setSelected(null); setWrongExplanation(null);
    setPhase("quiz");
  };

  // Auto-play audio when a new sound question appears
  useEffect(() => {
    if (phase === "quiz" && currentQ && currentQ.hasAudio && !answered) {
      const t = setTimeout(() => playQuestionAudio(currentQ), 300);
      return () => clearTimeout(t);
    }
  }, [qIndex, phase]);

  useEffect(() => { if (answered && isCorrect) { const t = setTimeout(handleQuizNext, 850); return () => clearTimeout(t); } }, [answered, isCorrect]);
  useEffect(() => { if (phase === "midCelebrate") { const t = setTimeout(handleMidContinue, 1400); return () => clearTimeout(t); } }, [phase]);

  const currentSpeakLetter = teachLetters[speakIndex];
  const handleRecord = () => {
    sfxTap(); setSpeakPhase("recording");
    setTimeout(() => {
      setSpeakPhase("done");
      setSpeakResults(prev => [...prev, { letterId: currentSpeakLetter.id }]);
      sfxCorrect();
    }, 2000);
  };
  const handleSpeakNext = () => { if (speakIndex < teachLetters.length - 1) { setSpeakIndex(speakIndex + 1); setSpeakPhase("ready"); } else { sfxComplete(); setPhase("summary"); } };

  const progressPct = phase === "quiz" ? (qIndex / Math.max(originalQCount, 1)) * 100 : phase === "midCelebrate" ? 50 : phase === "speak" ? 90 + ((speakIndex / Math.max(teachLetters.length, 1)) * 8) : phase === "summary" ? 100 : 0;

  // ── Route to sub-components ──

  if (phase === "intro") {
    return <LessonIntro lesson={lesson} teachLetters={teachLetters} lessonCombos={lessonCombos} isSound={isSound} isContrast={isContrast} isHarakatIntro={isHarakatIntro} isHarakatApplied={isHarakatApplied} audioType={audioType} onBack={onBack} onStartQuiz={() => setPhase("quiz")} />;
  }

  if (phase === "midCelebrate") {
    return <LessonMidCelebrate isHarakatLesson={isHarakatLesson} correctCount={quizResults.filter(r => r.correct).length} onContinue={handleMidContinue} />;
  }

  if (phase === "summary") {
    return <LessonSummary lesson={lesson} lessonId={lessonId} teachLetters={teachLetters} lessonCombos={lessonCombos} quizResults={quizResults} speakResults={speakResults} lessonsCompleted={lessonsCompleted} isHarakatIntro={isHarakatIntro} isHarakatApplied={isHarakatApplied} onComplete={onComplete} onBack={onBack} onStartSpeak={() => setPhase("speak")} />;
  }

  if (phase === "speak" && currentSpeakLetter) {
    return <LessonSpeak currentLetter={currentSpeakLetter} speakIndex={speakIndex} totalLetters={teachLetters.length} speakPhase={speakPhase} audioType={audioType} onRecord={handleRecord} onNext={handleSpeakNext} onSkipToSummary={() => setPhase("summary")} />;
  }

  // phase === "quiz"
  const isSoundQ = currentQ?.hasAudio || currentQ?.optionMode === "sound";
  const feedbackMsg = answered ? (isCorrect ? (isFirstCorrect ? "You're already learning this" : currentQ.isHarakat ? pickRandom(HARAKAT_CORRECT) : isSoundQ ? pickRandom(SOUND_CORRECT) : pickRandom(CORRECT_MESSAGES)) : wrongExplanation) : null;

  return (
    <LessonQuiz currentQ={currentQ} qIndex={qIndex} originalQCount={originalQCount} progressPct={progressPct} selected={selected} isCorrect={isCorrect} answered={answered} feedbackMsg={feedbackMsg} wrongExplanation={wrongExplanation} streak={streak} bannerStreak={bannerStreak} isHarakatLesson={isHarakatLesson} isContrast={isContrast} isSoundQ={isSoundQ} audioType={audioType} onSelect={handleSelect} onNext={handleQuizNext} onBack={onBack} playQuestionAudio={playQuestionAudio} />
  );
}
