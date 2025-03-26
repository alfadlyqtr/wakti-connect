
export interface GradientPreset {
  value: string;
  label?: string;
}

export interface GradientDirection {
  value: string;
  label: string;
  icon: string;
}

export interface GradientTabProps {
  value: string;
  onChange: (value: string) => void;
  direction?: string;
  angle?: number;
  onDirectionChange?: (direction: string) => void;
  onAngleChange?: (angle: number) => void;
}
