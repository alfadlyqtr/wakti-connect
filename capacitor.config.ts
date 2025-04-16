
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
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#0066FF",
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  android: {
    backgroundColor: "#FFFFFF",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  ios: {
    backgroundColor: "#FFFFFF",
    contentInset: "always",
    cordovaSwiftVersion: "5.0",
    preferredContentMode: "mobile",
    scheme: "app",
    limitsNavigationsToAppBoundDomains: true
  }
};

export default config;
