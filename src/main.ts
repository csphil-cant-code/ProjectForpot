import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";
import "./app/App";

if (Capacitor.isNativePlatform()) {
  // Keep dark status/navigation bar icons on Pondo's light background.
  void SystemBars.setStyle({ style: SystemBarsStyle.Light }).catch(() => {
    // Native implementation is unavailable (e.g. web preview); nothing to do.
  });
}
