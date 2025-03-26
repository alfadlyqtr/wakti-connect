
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

// Extract colors from gradient string with improved parsing
export const extractColorsFromGradient = (gradientString: string): [string, string] => {
  try {
    // First try to match standard hex colors
    const hexMatch = gradientString.match(/#[0-9a-f]{3,8}/gi);
    if (hexMatch && hexMatch.length >= 2) {
      return [hexMatch[0], hexMatch[1]];
    }
    
    // Then try to match rgba or rgb colors
    const rgbMatch = gradientString.match(/rgba?\([^)]+\)/gi);
    if (rgbMatch && rgbMatch.length >= 2) {
      return [rgbMatch[0], rgbMatch[1]];
    }
    
    // Try to extract any color format with more complex regex
    const colorRegex = /(#[0-9a-f]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/gi;
    const allColors = gradientString.match(colorRegex);
    if (allColors && allColors.length >= 2) {
      return [allColors[0], allColors[1]];
    }
    
    console.log("Could not extract colors from gradient:", gradientString);
  } catch (e) {
    console.error("Error parsing gradient:", e);
  }
  
  // Return default colors if parsing fails
  return ['#f6d365', '#fda085'];
};
