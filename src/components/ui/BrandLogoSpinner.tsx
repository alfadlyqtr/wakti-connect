
import React from "react";

/**
 * Displays the WAKTI brand logo with a spinning circle loader.
 */
const BrandLogoSpinner: React.FC<{ size?: number }> = ({ size = 64 }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* WAKTI logo */}
        <img
          src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png"
          alt="WAKTI Logo"
          className="rounded-full object-cover"
          style={{ width: size - 12, height: size - 12 }}
        />
        {/* Spinner ring */}
        <span
          className="absolute inset-0 w-full h-full rounded-full"
          style={{
            borderWidth: 4,
            borderStyle: "solid",
            borderColor: "rgba(155, 135, 245, 0.7) transparent transparent transparent",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    </div>
  );
};

export default BrandLogoSpinner;

