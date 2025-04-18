
import React, { useRef, useEffect } from 'react';

const AudioVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  useEffect(() => {
    let canceled = false;
    
    const setupAudioVisualization = async () => {
      try {
        // Get access to the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        if (canceled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        // Create an audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        // Create an analyzer node
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256;
        analyzerRef.current = analyzer;
        
        // Connect the microphone to the analyzer
        const source = audioContext.createMediaStreamSource(stream);
        sourceRef.current = source;
        source.connect(analyzer);
        
        // Get a reference to the canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const canvasContext = canvas.getContext('2d');
        if (!canvasContext) return;
        
        // Set up the canvas size
        const resizeCanvas = () => {
          if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
          }
        };
        
        // Call resize initially and on window resize
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Animation function
        const drawVisualization = () => {
          if (canceled) return;
          
          const bufferLength = analyzer.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          // Get frequency data
          analyzer.getByteFrequencyData(dataArray);
          
          // Clear the canvas
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          
          // Set up bar width based on canvas width and frequency data length
          const barWidth = (canvas.width / bufferLength) * 2.5;
          let x = 0;
          
          // Draw bars for each frequency
          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            
            // Create gradient for each bar
            const gradient = canvasContext.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)'); // Light blue at bottom
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)'); // Darker blue at top
            
            canvasContext.fillStyle = gradient;
            canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
          }
          
          // Request next frame
          animationFrameRef.current = requestAnimationFrame(drawVisualization);
        };
        
        // Start the visualization
        drawVisualization();
        
        return () => {
          window.removeEventListener('resize', resizeCanvas);
        };
      } catch (error) {
        console.error('Error setting up audio visualization:', error);
      }
    };
    
    setupAudioVisualization();
    
    return () => {
      canceled = true;
      
      // Clean up resources
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  return (
    <div className="w-full bg-black/5 dark:bg-white/5 rounded-md overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-[150px]"
      />
    </div>
  );
};

export default AudioVisualization;
