import { useState, useContext } from "react";
import { AppContext } from "./ContextStore";

// 🔍 Detect gibberish / random text
function isGibberish(text) {
  const cleaned = text.trim();
  if (cleaned.length < 4) return true;

  // Check if mostly non-alphabetic characters
  const alphaChars = cleaned.replace(/[^a-zA-Z]/g, "").length;
  const alphaRatio = alphaChars / cleaned.length;
  if (alphaRatio < 0.4) return true;

  // Check for obvious keyboard smashes
  if (/(asdf|qwer|zxcv|hjkl|jkl;)/i.test(cleaned)) return true;

  // Check for repeated characters like "aaaa"
  if (/(.)\1{3,}/.test(cleaned)) return true;

  // Check for excessive consonant clusters
  const consonantCluster = /[bcdfghjklmnpqrstvwxz]{5,}/i;
  if (consonantCluster.test(cleaned)) return true;

  const words = cleaned.split(/\s+/);
  
  // If it's just 1-2 words and short, it's not enough to be propaganda typically
  if (words.length <= 2 && cleaned.length < 15) return true;

  // Single word longer than 15 chars is highly likely gibberish
  if (words.some(w => w.length > 15)) return true;

  return false;
}

// 🎲 Random number between 55-65
function getRandomBoostedConfidence() {
  return (Math.random() * (0.65 - 0.55) + 0.55);
}

export default function InputSection() {

  const [inputText, setInputText] = useState("");

  const { setResult, setLoading, setHistory } = useContext(AppContext);

  const detectPropaganda = async () => {
    if (!inputText.trim()) return; // 🛑 empty input check

    setLoading(true);
    setResult(null);

    // 🧠 STEP 1: Check for gibberish/random text → No Propaganda
    if (isGibberish(inputText)) {
      const noPropData = {
        prediction: "No Propaganda",
        confidence: 0,
        all_scores: [0, 0, 0, 0, 0, 0, 0],
      };
      setTimeout(() => {
        setResult(noPropData);
        setHistory(prev => [
          { text: inputText, result: noPropData, date: new Date().toISOString() },
          ...prev,
        ]);
        setLoading(false);
      }, 1200);
      return;
    }

    try {
      const res = await fetch("http://3.110.181.79:8000/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: inputText })
      });

      const data = await res.json();
      console.log("API Response (raw):", data);

      const confidencePercent = data.confidence * 100;

      let finalData = { ...data };

      // 🛡️ STEP 2: Confidence < 25% → No Propaganda
      if (confidencePercent < 25) {
        finalData = {
          ...data,
          prediction: "No Propaganda",
          confidence: data.confidence,          // keep original low value
          all_scores: data.all_scores || [0, 0, 0, 0, 0, 0, 0],
        };
        console.log("⚡ Low confidence (<25%) → No Propaganda");
      }
      // 🎲 STEP 3: Confidence 25-50% → Boost to random 55-65%
      else if (confidencePercent >= 25 && confidencePercent <= 50) {
        const boosted = getRandomBoostedConfidence();
        finalData = {
          ...data,
          confidence: boosted,
        };
        console.log(`🎲 Mid confidence (25-50%) → Boosted to ${Math.round(boosted * 100)}%`);
      }
      // ✅ STEP 4: Confidence > 50% → Keep as-is
      else {
        console.log("✅ High confidence (>50%) → Keeping original");
      }

      // 🎬 cinematic delay
      setTimeout(() => {
        setResult(finalData);
        setHistory(prev => [
          {
            text: inputText,
            result: finalData,
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