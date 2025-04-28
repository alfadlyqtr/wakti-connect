
export interface GradientColor {
  color: string;
  position?: number;
}

export interface GradientDirection {
  value: string;
  label: string;
  icon: string;
}

export interface GradientPreset {
  value: string;
  name?: string;
}

export interface GradientTabProps {
  value: string;
  onChange: (value: string) => void;
  direction?: string;
  angle?: number;
  onDirectionChange?: (direction: string) => void;
  onAngleChange?: (angle: number) => void;
}

export interface GradientGeneratorProps {
  value: string;
  onChange: (value: string) => void;
  angle?: number;
  direction?: string;
  onAngleChange?: (angle: number) => void;
  onDirectionChange?: (direction: string) => void;
}
