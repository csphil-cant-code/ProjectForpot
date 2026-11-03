import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pondo.app',
  appName: 'Pondo',
  webDir: 'dist',
  android: {
    backgroundColor: '#e9f5ec',
  },
  plugins: {
    // Handles Android 15+ edge-to-edge. `css` keeps the WebView full-screen and
    // exposes --safe-area-inset-* CSS variables so the app can pad around the
    // status bar and gesture bar.
    SystemBars: {
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
      style: 'LIGHT',
      hidden: false,
    },
    SplashScreen: {
      // Let the branded in-app loader be the first thing users see. A native
      // splash duration of 0 skips Capacitor's logo overlay entirely.
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#e9f5ec',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: false,
    },
  },
};

export default config;
