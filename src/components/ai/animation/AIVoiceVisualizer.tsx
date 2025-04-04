
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AIVoiceVisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const AIVoiceVisualizer: React.FC<AIVoiceVisualizerProps> = ({
  isActive,
  isSpeaking
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  useEffect(() => {
    if (!isActive || !isSpeaking || !canvasRef.current) return;
    
    // Set up audio context for visualization if browser supports it
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 128;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      // Create a dummy source (since we can't directly tap into the speech synthesis)
      const oscillator = audioContext.createOscillator();
      oscillator.connect(analyserRef.current);
      analyserRef.current.connect(audioContext.destination);
      
      // Random visualization without actual audio data
      const draw = () => {
        if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
        
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;
        
        // Create random data to simulate audio visualization
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          // Vary heights to simulate speech pattern
          const randomHeight = Math.random() * 80 + 20; // between 20-100
          dataArrayRef.current[i] = randomHeight;
        }
        
        // Clear canvas
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw visualization
        const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5;
        let x = 0;
        
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const barHeight = dataArrayRef.current[i] / 2;
          
          // Use color based on height
          canvasCtx.fillStyle = `rgb(0, ${96 + barHeight}, ${175 + barHeight})`;
          canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          
          x += barWidth + 1;
        }
        
        animationRef.current = requestAnimationFrame(draw);
      };
      
      draw();
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        // Close audio context to free resources
        audioContext.close();
      };
    } catch (error) {
      console.error("Audio visualization not supported:", error);
    }
  }, [isActive, isSpeaking]);
  
  if (!isActive) return null;
  
  return (
    <div className={`relative rounded-lg overflow-hidden ${isSpeaking ? 'opacity-100' : 'opacity-0'}`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isSpeaking ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center"
      >
        <canvas 
          ref={canvasRef} 
          width={200} 
          height={60} 
          className="bg-transparent"
        />
      </motion.div>
    </div>
  );
};
