import React, { useContext } from "react";
import { AppContext } from "./ContextStore";
import { motion } from "framer-motion";

export default function Techniques() {

  const { result, loading } = useContext(AppContext);

  // 👉 labels must match backend order
  const labels = [
    "Loaded Language",
    "Name Calling",
    "Fear Mongering",
    "Appeal to Authority",
    "Glittering Generalities",
    "Bandwagon",
    "Card Stacking"
  ];

  // 👉 build dynamic list from backend scores
  const techniquesList = result?.all_scores
    ?.map((score, i) => ({
      name: labels[i],
      score: score,
    }))
    .sort((a, b) => b.score - a.score) // highest first
    .slice(0, 5); // top 5 only

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 ghost-border">

      <h3 className="text-sm font-semibold text-on-surface-variant mb-6 tracking-wider">
        DETECTED TECHNIQUES
      </h3>

      {/* ⚡ LOADING */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-10 bg-surface-container-highest/30 rounded-xl"></div>
          ))}
        </div>
      )}

      {/* 🎯 RESULT */}
      {!loading && result && (
        <div className="grid grid-cols-1 gap-3">

          {techniquesList?.map((tech, i) => {

            const percent = Math.round(tech.score * 100);

            // 🎨 dynamic color based on confidence
            const color =
              percent > 70
                ? "bg-error"
                : percent > 40
                ? "bg-tertiary"
                : "bg-on-surface-variant";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -80, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  delay: i * 0.25,
                  duration: 0.4
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-highest/30 hover:bg-surface-container-highest transition-all group shadow-sm"
              >

                <div className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>

                <span className="text-[10px] font-mono text-on-surface-variant group-hover:text-primary transition-colors">
                  {percent}%
                </span>

              </motion.div>
            );
          })}

        </div>
      )}

    </div>
  );
}