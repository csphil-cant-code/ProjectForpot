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
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#e9f5ec',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: false,
    },
  },
};

export default config;
