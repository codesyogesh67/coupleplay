"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type QType = "discuss" | "choice" | "input";

type QuestionDTO = {
  id: string;
  text: string;
  category: string;
  type: QType;
  options: string[];
};

export default function QuestionGameClient({
  gameId,
  questions,
}: {
  gameId: string;
  questions: QuestionDTO[];
}) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const goToResults = () => {
    const score = Math.floor(Math.random() * 36) + 60;
    router.push(`/results?score=${score}&game=${gameId}`);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedChoice(null);
      setInputValue("");
      return;
    }
    goToResults();
  };

  const handleSkip = () => handleNext();

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <ProgressBar current={currentIndex + 1} total={totalQuestions} />
          </motion.div>

          <QuestionCard
            question={currentQuestion.text}
            category={currentQuestion.category}
          >
            <AnimatePresence mode="wait">
              {currentQuestion.type === "choice" && (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-2 gap-3 mt-6"
                >
                  {(currentQuestion.options?.length
                    ? currentQuestion.options
                    : ["Option A", "Option B", "Option C", "Option D"]
                  ).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedChoice(option)}
                      className={`p-4 rounded-2xl text-sm font-medium transition-all duration-200 ${
                        selectedChoice === option
                          ? "romantic-gradient text-primary-foreground shadow-soft"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}

              {currentQuestion.type === "input" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6"
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your answer..."
                    className="h-14 rounded-2xl text-base px-5 border-2 border-border focus:border-primary"
                  />
                </motion.div>
              )}

              {currentQuestion.type === "discuss" && (
                <motion.div
                  key="discuss"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 rounded-2xl bg-secondary/50 text-center"
                >
                  <span className="text-muted-foreground text-sm">
                    💬 Discuss this together, then tap Next
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </QuestionCard>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-3"
          >
            <Button onClick={handleNext} className="w-full">
              {currentIndex === totalQuestions - 1
                ? "See Results"
                : "Next Question"}
            </Button>

            <Button variant="skip" onClick={handleSkip} className="w-full">
              Skip this one
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
