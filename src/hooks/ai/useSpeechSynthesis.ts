
export function useSpeechSynthesis() {
  return {
    speak: () => {}, 
    cancel: () => {},
    speaking: false,
    supported: false
  };
}
