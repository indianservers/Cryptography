import { useMemo, useState } from "react";
import type { Challenge } from "../data/moduleChallenges";

const keyFor = (id: string) => `challenge-complete:${id}`;

export function useChallengeMode(challenge?: Challenge) {
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const completed = useMemo(() => {
    if (!challenge || typeof localStorage === "undefined") return false;
    return localStorage.getItem(keyFor(challenge.id)) === "true";
  }, [challenge]);
  const [complete, setComplete] = useState(completed);
  const normalized = (value: string) => value.trim().toLowerCase();
  const correct = challenge ? normalized(answer) === normalized(challenge.correctAnswer) : false;

  return {
    answer,
    setAnswer,
    revealed,
    correct,
    complete,
    submit: () => {
      setRevealed(true);
      if (challenge && correct) {
        setComplete(true);
        localStorage.setItem(keyFor(challenge.id), "true");
      }
    },
    reveal: () => setRevealed(true),
    reset: () => {
      setAnswer("");
      setRevealed(false);
    },
  };
}
