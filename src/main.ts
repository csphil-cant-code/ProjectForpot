import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import "./app/App";

/** Keep the branded loader on screen long enough to avoid a flash. */
const LOADER_MIN_MS = 850;
const loaderStartedAt = performance.now();

const dismissLoader = (): void => {
  const loader = document.getElementById("app-loader");
  if (!loader) return;

  const remaining = Math.max(
    0,
    LOADER_MIN_MS - (performance.now() - loaderStartedAt),
  );

  window.setTimeout(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        loader.classList.add("is-done");
        loader.setAttribute("aria-hidden", "true");
        loader.addEventListener("transitionend", () => loader.remove(), {
          once: true,
        });
        // Transitions can be disabled (prefers-reduced-motion), so clean up
        // the node even if `transitionend` never fires.
        window.setTimeout(() => loader.remove(), 600);
      });
    });
  }, remaining);
};

const nextPaint = (): Promise<void> =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

const revealApp = async (): Promise<void> => {
  if (Capacitor.isNativePlatform()) {
    // Paint the in-app loader before removing the native splash so the launch
    // has no blank frame between the two.
    await nextPaint();
    void SplashScreen.hide().catch(() => {
      // The in-app loader still covers startup if the native splash is missing.
    });
  }

  dismissLoader();
};

void revealApp();

if (Capacitor.isNativePlatform()) {
  // Keep dark status/navigation bar icons on Pondo's light background.
  void SystemBars.setStyle({ style: SystemBarsStyle.Light }).catch(() => {
    // Native implementation is unavailable (e.g. web preview); nothing to do.
  });
}
