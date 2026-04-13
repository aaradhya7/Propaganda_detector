import React from "react";

export default function InsightsCard() {
  return (
    <div className="bg-surface-container-high p-5 rounded-2xl border border-primary/10">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
        <h3 className="text-xs font-bold text-primary tracking-widest uppercase">AI Insights</h3>
      </div>
      <p className="text-sm text-on-surface-variant leading-relaxed italic">
        "The text exhibits a calculated use of 'Us vs Them' framing, likely intended to trigger emotional responses rather than logical evaluation. Recommend cross-referencing with primary data sources."
      </p>
    </div>
  );
}
