
import { useState, useEffect, useRef } from 'react';

interface AudioLevelMonitorOptions {
  isActive: boolean;
  sensitivity?: number; // Sensitivity multiplier
}

export const useAudioLevelMonitor = (options: AudioLevelMonitorOptions) => {
  const { isActive, sensitivity = 1.0 } = options;
  const [audioLevel, setAudioLevel] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Helper function to get audio context with browser prefixes
  const getAudioContext = () => {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  };
  
  useEffect(() => {
    async function setupAudioMonitoring() {
      if (isActive) {
        try {
          // Get microphone access
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          
          // Initialize audio context
          audioContextRef.current = getAudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          
          // Create source from the microphone stream
          sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
          sourceRef.current.connect(analyserRef.current);
          
          // Prepare data array for frequency analysis
          dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
          
          // Start monitoring audio levels
          const updateAudioLevel = () => {
            if (analyserRef.current && dataArrayRef.current && isActive) {
              // Get frequency data
              analyserRef.current.getByteFrequencyData(dataArrayRef.current);
              
              // Calculate average level
              let sum = 0;
              for (let i = 0; i < dataArrayRef.current.length; i++) {
                sum += dataArrayRef.current[i];
              }
              
              // Normalize to 0-1 range and apply sensitivity
              const avg = Math.min(1, (sum / dataArrayRef.current.length / 255) * sensitivity);
              
              // Smooth transitions with slight damping
              setAudioLevel(prev => prev * 0.3 + avg * 0.7);
              
              // Continue monitoring
              animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
            }
          };
          
          updateAudioLevel();
        } catch (error) {
          console.error('Error accessing microphone:', error);
          // Set a fake pulsing audio level for better UX even when mic access fails
          let pulse = 0;
          const pulsate = () => {
            if (isActive) {
              pulse = (pulse + 0.05) % 1;
              const level = 0.3 + Math.sin(pulse * Math.PI * 2) * 0.2;
              setAudioLevel(level);
              animationFrameRef.current = requestAnimationFrame(pulsate);
            }
          };
          pulsate();
        }
      } else {
        // Clean up when inactive
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        
        if (sourceRef.current) {
          sourceRef.current.disconnect();
          sourceRef.current = null;
        }
        
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(e => console.error(e));
          audioContextRef.current = null;
        }
        
        setAudioLevel(0);
      }
    }
    
    setupAudioMonitoring();
    
    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.error(e));
      }
    };
  }, [isActive, sensitivity]);
  
  return { audioLevel };
};
