
import { GradientDirection } from "./types";

// Gradient direction options
export const DIRECTIONS: GradientDirection[] = [
  { value: "to-right", label: "Right", icon: "→" },
  { value: "to-left", label: "Left", icon: "←" },
  { value: "to-bottom", label: "Down", icon: "↓" },
  { value: "to-top", label: "Up", icon: "↑" },
  { value: "to-bottom-right", label: "↘", icon: "↘" },
  { value: "to-bottom-left", label: "↙", icon: "↙" },
  { value: "to-top-right", label: "↗", icon: "↗" },
  { value: "to-top-left", label: "↖", icon: "↖" },
];

// Default gradient values
export const DEFAULT_GRADIENT = {
  colors: ["#6366f1", "#8b5cf6"],
  direction: "to-right",
  angle: 90,
};

// Gradient presets (color combinations)
export const GRADIENT_PRESETS = [
  { value: "linear-gradient(to right, #6366f1, #8b5cf6)" },
  { value: "linear-gradient(to right, #ec4899, #8b5cf6)" },
  { value: "linear-gradient(to right, #14b8a6, #0ea5e9)" },
  { value: "linear-gradient(to right, #f59e0b, #ef4444)" },
  { value: "linear-gradient(to right, #10b981, #6366f1)" },
  { value: "linear-gradient(to right, #0ea5e9, #6366f1)" },
  { value: "linear-gradient(to right, #1e293b, #334155)" },
  { value: "linear-gradient(to right, #000000, #1e293b)" },
];
