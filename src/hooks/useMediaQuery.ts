
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Update the state with the match
    const updateMatches = () => {
      setMatches(media.matches);
    };
    
    // Run once initially
    updateMatches();
    
    // Add the listener for subsequent updates
    media.addEventListener("change", updateMatches);
    
    // Clean up the listener
    return () => {
      media.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}
