import React, { useContext } from "react";
import { AppContext } from "./ContextStore";
import { motion } from "framer-motion";

export default function ContextSection() {

  const { result, loading } = useContext(AppContext);

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 ghost-border">

      <h3 className="text-sm font-semibold text-on-surface-variant mb-6 tracking-wider">
        HIGHLIGHTED CONTEXT
      </h3>

      {/* ⚡ LOADING */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-surface-container-highest/50 rounded-xl"></div>
          <div className="h-20 bg-surface-container-highest/50 rounded-xl"></div>
        </div>
      )}

      {/* 🎯 RESULT */}
      {!loading && result !== null && (
        <div className="space-y-4">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 rounded-xl bg-surface-container-highest/50 border-l-4 border-error-dim"
          >
            <p className="text-sm leading-relaxed">
              "...framing arguments through a lens of{" "}
              <span className="bg-error-container/40 px-1 rounded">
                fear while presenting selected statistics
              </span>{" "}
              out of context..."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-surface-container-highest/50 border-l-4 border-tertiary"
          >
            <p className="text-sm leading-relaxed">
              "...objective truth becomes secondary to{" "}
              <span className="bg-tertiary-container/20 px-1 rounded">
                ideological alignment
              </span>
              ..."
            </p>
          </motion.div>

        </div>
      )}

    </div>
  );
}
