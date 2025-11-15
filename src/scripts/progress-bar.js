// src/scripts/progress-bar.js

export function initializeProgressBar() {
  const el = document.getElementById('progress-bar');
  if (!el) return;

  function clamp(v, a = 0, b = 100) { return Math.max(a, Math.min(b, v)); }

  function updateProgressBar() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const denom = docHeight - winHeight;
    const scrollPercent = denom <= 0 ? 100 : clamp((scrollTop / denom) * 100);
    el.style.width = `${scrollPercent}%`;
  }

  window.addEventListener('scroll', updateProgressBar, { passive: true });
  window.addEventListener('resize', updateProgressBar);

  // Initialize the progress bar on page load
  updateProgressBar();
}
