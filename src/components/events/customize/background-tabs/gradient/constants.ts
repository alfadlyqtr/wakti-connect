
import { GradientDirection, GradientPreset } from "./types";

// Direction options
export const GRADIENT_DIRECTIONS: GradientDirection[] = [
  { value: 'to-right', label: 'Right', icon: '→' },
  { value: 'to-left', label: 'Left', icon: '←' },
  { value: 'to-bottom', label: 'Down', icon: '↓' },
  { value: 'to-top', label: 'Up', icon: '↑' },
  { value: 'to-bottom-right', label: 'Bottom Right', icon: '↘' },
  { value: 'to-bottom-left', label: 'Bottom Left', icon: '↙' },
  { value: 'to-top-right', label: 'Top Right', icon: '↗' },
  { value: 'to-top-left', label: 'Top Left', icon: '↖' }
];

// Preset gradients
export const GRADIENT_PRESETS: GradientPreset[] = [
  { value: 'linear-gradient(90deg, #f6d365 0%, #fda085 100%)' },
  { value: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)' },
  { value: 'linear-gradient(180deg, rgb(254,100,121) 0%, rgb(251,221,186) 100%)' },
  { value: 'linear-gradient(to right, #243949 0%, #517fa4 100%)' },
  { value: 'linear-gradient(to top, #d299c2 0%, #fef9d7 100%)' },
  { value: 'linear-gradient(to right, #ee9ca7, #ffdde1)' },
  { value: 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)' },
  { value: 'linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)' },
  { value: 'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)' },
  { value: 'linear-gradient(102.3deg, rgba(147,39,143,1) 5.9%, rgba(234,172,232,1) 64%, rgba(246,219,245,1) 89%)' },
  { value: 'linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)' },
  { value: 'linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)' }
];
