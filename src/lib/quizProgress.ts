export interface QuizAnswerRecord {
  quizId: string;
  route: string;
  selectedIndex: number;
  correct: boolean;
  answeredAt: string;
}

const quizProgressKey = "mega-crypto-quiz-progress";

export function readQuizProgress(): Record<string, QuizAnswerRecord> {
  try {
    return JSON.parse(localStorage.getItem(quizProgressKey) ?? "{}") as Record<string, QuizAnswerRecord>;
  } catch {
    return {};
  }
}

export function saveQuizAnswer(record: QuizAnswerRecord) {
  const progress = readQuizProgress();
  progress[record.quizId] = record;
  localStorage.setItem(quizProgressKey, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("quiz-progress-change"));
}

export function clearQuizAnswer(quizId: string) {
  const progress = readQuizProgress();
  delete progress[quizId];
  localStorage.setItem(quizProgressKey, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("quiz-progress-change"));
}

export function resetQuizProgress() {
  localStorage.removeItem(quizProgressKey);
  window.dispatchEvent(new CustomEvent("quiz-progress-change"));
}

export function summarizeQuizProgress(total: number, progress = readQuizProgress()) {
  const answered = Object.values(progress);
  const correct = answered.filter((item) => item.correct).length;
  return {
    answered: answered.length,
    correct,
    total,
    percent: total ? Math.round((correct / total) * 100) : 0,
  };
}
