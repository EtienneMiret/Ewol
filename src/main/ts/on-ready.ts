export function onReady (callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener ('DOMContentLoaded', callback, {
      once: true,
      passive: true
    });
  } else {
    callback ();
  }
}
