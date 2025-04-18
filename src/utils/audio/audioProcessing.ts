
/**
 * Utility functions for audio processing in the meeting summary tool
 */

/**
 * Stops all tracks in a media stream
 * @param stream Media stream to stop
 */
export const stopMediaTracks = (stream: MediaStream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

/**
 * Formats time in seconds to minutes:seconds format
 * @param seconds Total seconds
 * @returns Formatted time string (e.g. "2:45")
 */
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * Analyzes audio data for silence detection
 * @param audioContext Audio context
 * @param stream Media stream to analyze
 * @param silenceThreshold Threshold for silence detection (0-1)
 * @param onSilenceDetected Callback for when silence is detected
 * @returns Audio analyzer node
 */
export const createSilenceDetector = (
  audioContext: AudioContext,
  stream: MediaStream,
  silenceThreshold: number = 0.05,
  onSilenceDetected: (isSilent: boolean) => void
) => {
  const source = audioContext.createMediaStreamSource(stream);
  const analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 256;
  analyzer.smoothingTimeConstant = 0.8;
  source.connect(analyzer);
  
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  let silentFrames = 0;
  const SILENT_FRAMES_THRESHOLD = 15; // About 1.5 seconds of silence
  
  const checkSilence = () => {
    analyzer.getByteFrequencyData(dataArray);
    
    // Get average volume level
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength / 255; // Normalize to 0-1
    
    // Detect if silent
    if (average < silenceThreshold) {
      silentFrames++;
      if (silentFrames >= SILENT_FRAMES_THRESHOLD) {
        onSilenceDetected(true);
      }
    } else {
      silentFrames = 0;
      onSilenceDetected(false);
    }
    
    requestAnimationFrame(checkSilence);
  };
  
  checkSilence();
  return analyzer;
};

/**
 * Converts a Blob to base64 string format
 * @param blob Blob to convert
 * @returns Promise that resolves with base64 string
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Creates an audio visualization on a canvas
 * @param canvas Canvas element to draw on
 * @param audioContext Audio context
 * @param stream Media stream to visualize
 * @returns Audio analyzer node
 */
export const createAudioVisualizer = (
  canvas: HTMLCanvasElement,
  audioContext: AudioContext,
  stream: MediaStream
) => {
  const canvasCtx = canvas.getContext('2d');
  if (!canvasCtx) return null;
  
  const source = audioContext.createMediaStreamSource(stream);
  const analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 256;
  source.connect(analyzer);
  
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  const draw = () => {
    requestAnimationFrame(draw);
    
    analyzer.getByteFrequencyData(dataArray);
    
    canvasCtx.fillStyle = 'rgb(20, 20, 20)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;
      
      // Use a gradient for visualization
      const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#4f46e5');
      gradient.addColorStop(1, '#818cf8');
      
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  };
  
  draw();
  return analyzer;
};
