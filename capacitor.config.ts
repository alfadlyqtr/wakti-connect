
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4c81db950ca9462093efa38758325074',
  appName: 'wakti-connect',
  webDir: 'dist',
  server: {
    url: 'https://4c81db95-0ca9-4620-93ef-a38758325074.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
