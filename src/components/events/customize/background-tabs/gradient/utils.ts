// Generate a gradient string based on colors, angle
export const generateGradient = (color1: string, color2: string, angle: number): string => {
  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
};

// Convert direction to angle
export const directionToAngle = (direction: string): number => {
  switch (direction) {
    case 'to-right': return 90;
    case 'to-left': return 270;
    case 'to-bottom': return 180;
    case 'to-top': return 0;
    case 'to-bottom-right': return 135;
    case 'to-bottom-left': return 225;
    case 'to-top-right': return 45;
    case 'to-top-left': return 315;
    default: return 90;
  }
};

// Extract colors from gradient string
export const extractColorsFromGradient = (gradientString: string): [string, string] => {
  try {
    const colorsMatch = gradientString.match(/rgba?\([\d\s,.]+\)|#[0-9a-f]{3,8}/gi);
    if (colorsMatch && colorsMatch.length >= 2) {
      return [colorsMatch[0], colorsMatch[1]];
    }
  } catch (e) {
    // Keep default colors if parsing fails
  }
  return ['#f6d365', '#fda085'];
};
