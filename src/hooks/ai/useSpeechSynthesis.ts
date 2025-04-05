
export function useSpeechSynthesis() {
  // Disabled implementation - returning a non-functional interface
  return {
    speak: () => {}, 
    cancel: () => {},
    speaking: false,
    supported: false
  };
}
