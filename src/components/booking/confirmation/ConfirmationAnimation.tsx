
import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const ConfirmationAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          duration: 0.6 
        }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Check className="h-10 w-10 text-green-500" />
        </motion.div>
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-2xl font-bold mb-2"
      >
        Booking Confirmed!
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="text-muted-foreground text-center"
      >
        Thanks for your booking. We look forward to seeing you soon!
      </motion.p>
    </div>
  );
};

export default ConfirmationAnimation;
