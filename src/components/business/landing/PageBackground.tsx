
import React from "react";

interface PageBackgroundProps {
  bgColor: string;
  pagePattern?: string;
  textColor?: string;
  fontFamily?: string;
  children: React.ReactNode;
}

const PageBackground: React.FC<PageBackgroundProps> = ({
  bgColor,
  pagePattern,
  textColor,
  fontFamily,
  children
}) => {
  const isCustomBgImage = pagePattern && pagePattern.startsWith('data:');

  const pageStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor || "#1f2937",
    fontFamily: fontFamily || "inherit",
    backgroundImage: isCustomBgImage 
      ? `url(${pagePattern})`
      : getBackgroundPattern(pagePattern),
    backgroundSize: isCustomBgImage ? "cover" : "auto",
    backgroundRepeat: isCustomBgImage ? "no-repeat" : "repeat",
    backgroundPosition: "center",
  };

  return (
    <div style={pageStyle} className="min-h-screen relative pb-10">
      {children}
    </div>
  );
};

export function getBackgroundPattern(pattern?: string): string {
  if (!pattern || pattern === 'none') return "none";
  
  switch (pattern) {
    case 'dots':
      return 'radial-gradient(#00000022 1px, transparent 1px)';
    case 'grid':
      return 'linear-gradient(to right, #00000011 1px, transparent 1px), linear-gradient(to bottom, #00000011 1px, transparent 1px)';
    case 'waves':
      return 'url("data:image/svg+xml,%3Csvg width="100" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 10 C 30 0, 70 0, 100 10 L 100 20 L 0 20 Z" fill="%2300000011"/%3E%3C/svg%3E")';
    case 'diagonal':
      return 'repeating-linear-gradient(45deg, #00000011, #00000011 1px, transparent 1px, transparent 10px)';
    case 'circles':
      return 'radial-gradient(circle, #00000011 10px, transparent 11px)';
    case 'triangles':
      return 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0 L 30 52 L 60 0 Z" fill="%2300000011"/%3E%3C/svg%3E")';
    case 'hexagons':
      return 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 15 L 15 0 L 45 0 L 60 15 L 60 45 L 45 60 L 15 60 L 0 45 Z" fill="%2300000011"/%3E%3C/svg%3E")';
    case 'stripes':
      return 'repeating-linear-gradient(90deg, #00000011, #00000011 5px, transparent 5px, transparent 15px)';
    case 'zigzag':
      return 'linear-gradient(135deg, #00000011 25%, transparent 25%) 0 0, linear-gradient(225deg, #00000011 25%, transparent 25%) 0 0';
    case 'confetti':
      return 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Crect x="10" y="10" width="4" height="4" transform="rotate(45 12 12)" fill="%2300000022"/%3E%3Crect x="30" y="20" width="4" height="4" transform="rotate(30 32 22)" fill="%2300000022"/%3E%3Crect x="15" y="40" width="4" height="4" transform="rotate(60 17 42)" fill="%2300000022"/%3E%3Crect x="40" y="45" width="4" height="4" transform="rotate(12 42 47)" fill="%2300000022"/%3E%3C/svg%3E")';
    case 'bubbles':
      return 'radial-gradient(circle at 25px 25px, #00000011 15px, transparent 16px), radial-gradient(circle at 75px 75px, #00000011 15px, transparent 16px)';
    case 'noise':
      return 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.15"/%3E%3C/svg%3E")';
    case 'paper':
      return 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="paperFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5"/%3E%3CfeDisplacementMap in="SourceGraphic" scale="10"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23paperFilter)" opacity="0.1"/%3E%3C/svg%3E")';
    default:
      return 'none';
  }
}

export default PageBackground;
