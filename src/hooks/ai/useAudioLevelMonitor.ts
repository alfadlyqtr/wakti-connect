
import { useState, useEffect, useCallback } from 'react';

interface AudioLevelMonitorOptions {
  isActive: boolean;
  sensitivity?: number;
}

export const useAudioLevelMonitor = (options: AudioLevelMonitorOptions) => {
  const { isActive, sensitivity = 1.5 } = options;
  const [audioLevel, setAudioLevel] = useState(0);
  
  const monitorAudioLevel = useCallback(async () => {
    if (!isActive) {
      setAudioLevel(0);
      return;
    }
    
    try {
      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create audio context
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      // Configuration
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Monitoring function
      const checkAudioLevel = () => {
        if (!isActive) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        
        // Normalize to 0-1 range and apply sensitivity
        const average = (sum / bufferLength) / 255;
        const normalizedLevel = Math.min(average * sensitivity, 1);
        
        setAudioLevel(normalizedLevel);
        
        // Continue monitoring
        requestAnimationFrame(checkAudioLevel);
      };
      
      // Start monitoring
      checkAudioLevel();
      
      // Cleanup
      return () => {
        stream.getTracks().forEach(track => track.stop());
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
      return () => {};
    }
  }, [isActive, sensitivity]);
  
  // Start monitoring when active
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    if (isActive) {
      // Start monitoring and get cleanup function
      monitorAudioLevel().then(cleanupFn => {
        cleanup = cleanupFn;
      });
    } else {
      // Reset level when inactive
      setAudioLevel(0);
    }
    
    // Cleanup function
    return () => {
      if (cleanup) cleanup();
    };
  }, [isActive, monitorAudioLevel]);
  
  return { audioLevel };
};
