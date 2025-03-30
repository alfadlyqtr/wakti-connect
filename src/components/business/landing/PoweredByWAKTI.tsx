
import React from "react";
import CommonPoweredByWAKTI from "@/components/common/PoweredByWAKTI";

interface PoweredByWAKTIProps {
  position?: "top" | "bottom";
}

const PoweredByWAKTI: React.FC<PoweredByWAKTIProps> = ({ position = "bottom" }) => {
  return <CommonPoweredByWAKTI position={position} />;
};

export default PoweredByWAKTI;
