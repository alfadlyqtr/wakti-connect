
import { useState, useEffect, useRef } from 'react';

interface AudioLevelMonitorOptions {
  isActive: boolean;
  onLevelChange?: (level: number) => void;
}

export const useAudioLevelMonitor = (options: AudioLevelMonitorOptions = { isActive: false }) => {
  const { isActive, onLevelChange } = options;
  
  const [audioLevel, setAudioLevel] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameId = useRef<number | null>(null);
  
  // Start monitoring audio levels
  const startMonitoring = async () => {
    try {
      if (!stream) {
        const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(userStream);
        
        // Set up audio context and analyser
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser.current = audioContext.current.createAnalyser();
        analyser.current.fftSize = 256;
        
        mediaStreamSource.current = audioContext.current.createMediaStreamSource(userStream);
        mediaStreamSource.current.connect(analyser.current);
        
        monitorAudioLevel();
      } else {
        monitorAudioLevel();
      }
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError(err instanceof Error ? err : new Error('Error accessing microphone'));
    }
  };
  
  // Stop monitoring audio levels
  const stopMonitoring = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    
    if (mediaStreamSource.current) {
      mediaStreamSource.current.disconnect();
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (audioContext.current && audioContext.current.state !== 'closed') {
      audioContext.current.close();
      audioContext.current = null;
    }
    
    setAudioLevel(0);
  };
  
  // Monitor audio level using the analyser
  const monitorAudioLevel = () => {
    if (analyser.current) {
      const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
      
      const updateLevel = () => {
        if (analyser.current && isActive) {
          analyser.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume level (0-1)
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length / 255; // Normalize to 0-1
          
          setAudioLevel(average);
          if (onLevelChange) onLevelChange(average);
          
          animationFrameId.current = requestAnimationFrame(updateLevel);
        }
      };
      
      updateLevel();
    }
  };
  
  // Effect to start/stop monitoring based on isActive
  useEffect(() => {
    if (isActive) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
    
    return () => {
      stopMonitoring();
    };
  }, [isActive]);
  
  return {
    audioLevel,
    error,
    isActive
  };
};
