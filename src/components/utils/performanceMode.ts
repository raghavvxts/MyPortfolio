export type PerformanceMode = "auto" | "quality" | "smooth";
export type RenderQuality = "high" | "balanced" | "light";

const PERFORMANCE_MODE_KEY = "rv-performance-mode";

export const getPerformanceMode = (): PerformanceMode => {
  if (typeof window === "undefined") return "auto";
  const stored = window.localStorage.getItem(PERFORMANCE_MODE_KEY);
  if (stored === "auto" || stored === "quality" || stored === "smooth") {
    return stored;
  }
  return "auto";
};

export const setPerformanceMode = (mode: PerformanceMode) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PERFORMANCE_MODE_KEY, mode);
  window.dispatchEvent(
    new CustomEvent("rv-performance-mode-change", {
      detail: mode,
    })
  );
};

const getAutoQuality = (): RenderQuality => {
  if (typeof window === "undefined") return "balanced";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowMemory = nav.deviceMemory !== undefined && nav.deviceMemory <= 4;
  const lowCpu = navigator.hardwareConcurrency <= 6;

  if (reducedMotion || window.innerWidth < 900 || lowMemory || lowCpu) {
    return "light";
  }

  if (window.innerWidth < 1400) {
    return "balanced";
  }

  return "high";
};

export const resolveQuality = (mode: PerformanceMode): RenderQuality => {
  if (mode === "quality") return "high";
  if (mode === "smooth") return "light";
  return getAutoQuality();
};

export const isCharacterLowPower = (mode: PerformanceMode): boolean => {
  const quality = resolveQuality(mode);
  return quality !== "high";
};
