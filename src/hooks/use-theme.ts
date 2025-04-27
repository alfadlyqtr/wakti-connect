
import { useTheme as useNextTheme } from "next-themes";

export const useTheme = () => {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  
  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme
  };
};
