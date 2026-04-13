import { useState, useContext } from "react";
import { AppContext } from "./ContextStore";

export default function InputSection() {

  const [inputText, setInputText] = useState("");

  const { setResult, setLoading, setHistory } = useContext(AppContext);

  const detectPropaganda = async () => {
    if (!inputText.trim()) return; // 🛑 empty input check

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: inputText })
      });

      const data = await res.json();
      console.log("API Response:", data);

      // 🎬 cinematic delay
      setTimeout(() => {
        setResult(data);   // ✅ STORE FULL OBJECT (IMPORTANT)
        setHistory(prev => [
          {
            text: inputText,
            result: data,
            date: new Date().toISOString()
          },
          ...prev
        ]);
        setLoading(false);
      }, 1200);

    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-6">
      
      <label className="text-sm font-semibold text-on-surface-variant">
        INPUT DATA SOURCE
      </label>

      <textarea
        className="w-full mt-4 bg-surface-container rounded-xl p-4 min-h-[300px]"
        placeholder="Paste text for analysis..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <div className="flex justify-end mt-6">
        <button 
          onClick={detectPropaganda}
          className="bg-primary text-black px-6 py-3 rounded-full font-bold"
        >
          EXECUTE ANALYSIS
        </button>
      </div>

    </div>
  );
}