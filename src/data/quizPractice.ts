import { allAlgorithmLearningContent } from "./phaseTwoAlgorithmContent";

export interface QuizPracticeQuestion {
  id: string;
  route: string;
  algorithm: string;
  category: string;
  difficulty: string;
  status: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizPracticeQuestions: QuizPracticeQuestion[] = allAlgorithmLearningContent.flatMap((algorithm) =>
  algorithm.quiz.map((quiz, index) => ({
    id: `${algorithm.id}:${index}`,
    route: algorithm.route,
    algorithm: algorithm.name,
    category: algorithm.category,
    difficulty: algorithm.difficulty,
    status: algorithm.securityStatus,
    question: quiz.question,
    options: quiz.options,
    correctIndex: quiz.correctIndex,
    explanation: quiz.explanation,
  })),
);

export const quizCategories = Array.from(new Set(quizPracticeQuestions.map((item) => item.category))).sort();
export const quizDifficulties = Array.from(new Set(quizPracticeQuestions.map((item) => item.difficulty))).sort();

export function getQuizQuestionForRoute(route: string) {
  return quizPracticeQuestions.find((item) => item.route === route);
}

export function filterQuizQuestions({ query, category, difficulty }: { query: string; category: string; difficulty: string }) {
  const needle = query.trim().toLowerCase();
  return quizPracticeQuestions.filter((item) => {
    const matchesQuery = !needle || [item.algorithm, item.category, item.status, item.question].some((value) => value.toLowerCase().includes(needle));
    const matchesCategory = category === "All" || item.category === category;
    const matchesDifficulty = difficulty === "All" || item.difficulty === difficulty;
    return matchesQuery && matchesCategory && matchesDifficulty;
  });
}
