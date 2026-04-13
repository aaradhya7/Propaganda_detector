import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import InputSection from "../components/InputSection";
import ResultCard from "../components/ResultCard";
import InsightsCard from "../components/InsightsCard";
import ContextSection from "../components/ContextSection";
import Techniques from "../components/Techniques";
import { AppContext } from "../components/ContextStore";
import { AnimatePresence, motion } from "framer-motion";

export default function Dashboard() {

  const { result, loading } = useContext(AppContext);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* 🔥 TOP SECTION */}
          <div className="grid grid-cols-12 gap-6">

            <div className="col-span-12 lg:col-span-8">
              <InputSection />
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
              <ResultCard />
              <InsightsCard />
            </div>

          </div>

          {/* 🎬 ANIMATED LOWER SECTION */}
          <AnimatePresence mode="wait">

            {/* 👇 key ensures re-animation on every result */}
            {!loading && result !== null && (

              <motion.div
                key={result}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-12 gap-6 pb-8"
              >

                <div className="col-span-12 lg:col-span-7">
                  <ContextSection />
                </div>

                <div className="col-span-12 lg:col-span-5">
                  <Techniques />
                </div>

              </motion.div>

            )}

          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}