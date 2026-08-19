import { afterEach, describe, expect, it, vi } from "vitest";
import { allAlgorithmLearningContent } from "../src/data/phaseTwoAlgorithmContent";
import { filterQuizQuestions, getQuizQuestionForRoute, quizPracticeQuestions } from "../src/data/quizPractice";
import { navigationItems } from "../src/data/navigation";
import { clearQuizAnswer, readQuizProgress, saveQuizAnswer, summarizeQuizProgress, type QuizAnswerRecord } from "../src/lib/quizProgress";

describe("quiz practice data", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates one usable question for every algorithm learning content record", () => {
    expect(quizPracticeQuestions.length).toBe(allAlgorithmLearningContent.length);
    for (const question of quizPracticeQuestions) {
      expect(question.id).toContain(":");
      expect(question.question.length, question.id).toBeGreaterThan(20);
      expect(question.options.length, question.id).toBeGreaterThanOrEqual(2);
      expect(question.correctIndex, question.id).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex, question.id).toBeLessThan(question.options.length);
      expect(question.explanation.length, question.id).toBeGreaterThan(20);
    }
  });

  it("can find the embedded question for an algorithm route", () => {
    const question = getQuizQuestionForRoute("/algorithms/symmetric/aes");
    expect(question?.algorithm).toBe("AES");
  });

  it("filters questions by query, category, and difficulty", () => {
    const aes = filterQuizQuestions({ query: "AES", category: "All", difficulty: "All" });
    expect(aes.length).toBeGreaterThan(0);
    expect(aes.some((item) => item.algorithm === "AES")).toBe(true);

    const hashBeginner = filterQuizQuestions({ query: "", category: "Hash Functions", difficulty: "Beginner" });
    expect(hashBeginner.every((item) => item.category === "Hash Functions" && item.difficulty === "Beginner")).toBe(true);
  });

  it("summarizes locally saved progress", () => {
    const progress: Record<string, QuizAnswerRecord> = {
      one: { quizId: "one", route: "/a", selectedIndex: 0, correct: true, answeredAt: "2026-08-19T00:00:00.000Z" },
      two: { quizId: "two", route: "/b", selectedIndex: 1, correct: false, answeredAt: "2026-08-19T00:00:01.000Z" },
    };
    expect(summarizeQuizProgress(4, progress)).toEqual({ answered: 2, correct: 1, total: 4, percent: 25 });
  });

  it("exposes quiz practice in navigation", () => {
    const navItem = navigationItems.find((item) => item.route === "/quiz-practice");
    expect(navItem?.label).toBe("Quiz and Practice");
    expect(navItem?.category).toBe("Learning Progress");
  });

  it("can clear a single saved quiz answer", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    });
    vi.stubGlobal("window", { dispatchEvent: vi.fn() });
    saveQuizAnswer({ quizId: "sample", route: "/quiz-practice", selectedIndex: 0, correct: true, answeredAt: "2026-08-19T00:00:00.000Z" });
    expect(readQuizProgress().sample).toBeTruthy();
    clearQuizAnswer("sample");
    expect(readQuizProgress().sample).toBeUndefined();
  });
});
