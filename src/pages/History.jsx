import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { AppContext } from "../components/ContextStore";
import BubbleBackground from "../components/BubbleBackground";

export default function History() {
  const { history } = useContext(AppContext);

  return (
    <BubbleBackground>
    <div className="flex min-h-screen relative" style={{ zIndex: 1 }}>
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Header Section */}
          <header className="mb-4">
            <h2 className="text-on-surface text-4xl font-extrabold tracking-tight mb-2">
              Analysis History
            </h2>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 shadow-[0_0_8px_var(--color-primary)]" />
              <p className="text-on-surface-variant text-sm font-medium tracking-wide">
                Historical Neural Records — Secured &amp; Local
              </p>
            </div>
          </header>

          {/* Vertical Entry List */}
          <section className="max-w-4xl space-y-6 pb-12">
            {history.length === 0 ? (
              <p className="text-on-surface-variant text-lg bg-surface-container-low p-8 rounded-2xl">
                No analysis history found. Run an analysis on the Home page to start recording.
              </p>
            ) : (
              history.map((entry, index) => {
                const confidence = entry.result ? Math.round(entry.result.confidence * 100) : 0;
                const isPropaganda = confidence > 40; // Moderate or high risk

                // Format date string
                const dateObj = new Date(entry.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }).toUpperCase();
                const formattedTime = dateObj.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                });

                return (
                  <div key={index} className="bg-surface-container-low p-8 rounded-2xl hover:bg-surface-container transition-colors duration-300">
                    <div className="flex justify-between items-start mb-4">
                      {isPropaganda ? (
                        <div className="px-3 py-1 rounded-full bg-red-400/10 border border-red-400/30 text-red-400 text-[11px] font-bold uppercase tracking-widest">
                          Propaganda Detected
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-bold uppercase tracking-widest">
                          No Propaganda
                        </div>
                      )}
                      <time className="text-on-surface-variant text-xs font-medium uppercase tracking-tighter">
                        {formattedDate} · {formattedTime}
                      </time>
                    </div>
                    <p className="text-on-surface text-lg leading-relaxed font-normal opacity-90 whitespace-pre-wrap">
                      "{entry.text}"
                    </p>
                  </div>
                );
              })
            )}
          </section>

        </div>
      </main>
    </div>
    </BubbleBackground>
  );
}
