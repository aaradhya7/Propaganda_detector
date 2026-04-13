import { useContext } from "react";
import { AppContext } from "./ContextStore";
import { motion } from "framer-motion";

export default function ResultCard() {

  const { result, loading } = useContext(AppContext);

  // 👉 REAL confidence from backend
  const confidence = result ? Math.round(result.confidence * 100) : 0;

  const prediction = result?.prediction || "N/A";

  // 🎯 risk calculation based on confidence
  const riskLabel =
    confidence > 80
      ? "High Severity Risk"
      : confidence > 40
      ? "Moderate Risk"
      : "Low Risk";

  const riskColor =
    confidence > 80
      ? "text-red-400"
      : confidence > 40
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="bg-surface-container p-6 rounded-2xl">

      <h3 className="text-sm mb-6 text-on-surface-variant">
        PROPAGANDA ANALYSIS
      </h3>

      {/* ⚡ LOADING */}
      {loading && (
        <div className="text-center animate-pulse">
          <p className="text-3xl">⚡ Calculating...</p>
        </div>
      )}

      {/* 🎯 RESULT */}
      {!loading && result && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >

          {/* 💥 CONFIDENCE */}
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-4xl font-bold"
          >
            {confidence}%
          </motion.p>

          <p className="text-xs text-on-surface-variant">Confidence</p>

          {/* 🧠 PREDICTION LABEL */}
          <div className="mt-3 text-sm font-medium text-primary">
            {prediction}
          </div>

          {/* 🔥 RISK LEVEL */}
          <div className="mt-2">
            <span className={`${riskColor} text-xs`}>
              {riskLabel}
            </span>
          </div>

        </motion.div>
      )}

    </div>
  );
}