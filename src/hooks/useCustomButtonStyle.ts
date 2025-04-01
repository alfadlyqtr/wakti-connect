
import React, { useMemo } from 'react';

interface CustomButtonStyleProps {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  hoverColor?: string;
  hoverTextColor?: string;
  hoverBorderColor?: string;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  paddingX?: string;
  paddingY?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl";
  variant?: string;
  buttonStyle?: React.CSSProperties;
}

export const useCustomButtonStyle = ({
  backgroundColor,
  textColor,
  borderRadius,
  borderColor,
  borderWidth,
  hoverColor,
  hoverTextColor,
  hoverBorderColor,
  fontWeight,
  paddingX,
  paddingY,
  gradientFrom,
  gradientTo,
  gradientDirection = "to-r",
  variant,
  buttonStyle,
}: CustomButtonStyleProps) => {
  
  // Generate a gradient background if variant is gradient
  const getGradientStyle = () => {
    if (variant !== 'gradient') return {};
    
    const fromColor = gradientFrom || '#3B82F6';
    const toColor = gradientTo || '#10B981';
    
    return {
      background: `linear-gradient(${gradientDirection === 'to-r' ? '90deg' : 
                                     gradientDirection === 'to-l' ? '270deg' : 
                                     gradientDirection === 'to-t' ? '0deg' : 
                                     gradientDirection === 'to-b' ? '180deg' : 
                                     gradientDirection === 'to-tr' ? '45deg' : 
                                     gradientDirection === 'to-tl' ? '315deg' : 
                                     gradientDirection === 'to-br' ? '135deg' : '225deg'}, 
                                     ${fromColor}, ${toColor})`
    };
  };
  
  // Custom styles based on props
  const customButtonStyle: React.CSSProperties = useMemo(() => ({
    ...(buttonStyle || {}),
    ...(backgroundColor && variant !== 'gradient' ? { backgroundColor } : {}),
    ...(variant === 'gradient' ? getGradientStyle() : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderRadius ? { borderRadius } : {}),
    ...(borderColor ? { borderColor } : {}),
    ...(borderWidth ? { borderWidth } : {}),
    ...(fontWeight ? { fontWeight } : {}),
    ...(paddingX || paddingY ? { padding: `${paddingY || '8px'} ${paddingX || '16px'}` } : {}),
    transition: 'all 0.2s ease'
  }), [
    backgroundColor, 
    variant, 
    textColor, 
    borderRadius, 
    borderColor, 
    borderWidth, 
    fontWeight, 
    paddingX, 
    paddingY,
    gradientFrom,
    gradientTo,
    gradientDirection,
    buttonStyle
  ]);

  // Build CSS variables for hover effects
  const customVarsClass = useMemo(() => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const className = `custom-btn-${randomId}`;
    
    // Create a style element for the hover styles
    if (typeof document !== 'undefined' && (hoverColor || hoverTextColor || hoverBorderColor)) {
      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        .${className}:hover {
          ${hoverColor ? `background-color: ${hoverColor} !important;` : ''}
          ${hoverTextColor ? `color: ${hoverTextColor} !important;` : ''}
          ${hoverBorderColor ? `border-color: ${hoverBorderColor} !important;` : ''}
          transform: translateY(-1px);
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    return className;
  }, [hoverColor, hoverTextColor, hoverBorderColor]);

  return {
    customButtonStyle,
    customVarsClass
  };
};
