import { useEffect, useState } from "react";
import "./styles/PerformanceToggle.css";
import {
  getPerformanceMode,
  PerformanceMode,
  setPerformanceMode,
} from "./utils/performanceMode";

const options: Array<{ label: string; value: PerformanceMode }> = [
  { label: "Auto", value: "auto" },
  { label: "Quality", value: "quality" },
  { label: "Smooth", value: "smooth" },
];

const PerformanceToggle = () => {
  const [mode, setMode] = useState<PerformanceMode>(getPerformanceMode());

  useEffect(() => {
    const onModeChange = () => {
      setMode(getPerformanceMode());
    };

    window.addEventListener("rv-performance-mode-change", onModeChange as EventListener);
    window.addEventListener("storage", onModeChange);

    return () => {
      window.removeEventListener("rv-performance-mode-change", onModeChange as EventListener);
      window.removeEventListener("storage", onModeChange);
    };
  }, []);

  return (
    <div className="performance-toggle" data-cursor="disable">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`performance-toggle-btn ${mode === option.value ? "active" : ""}`}
          onClick={() => {
            setPerformanceMode(option.value);
            setMode(option.value);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PerformanceToggle;
