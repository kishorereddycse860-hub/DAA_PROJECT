/* =========================================================
   SortLab — ambient background fx
   Fills the fixed background layer with a continuously
   rotating "flying forward" tunnel of glowing DAA-notation
   rings (via TunnelFX), and tilts the whole layer slightly
   toward the cursor for extra depth. The tunnel is the thing
   in motion — page content above it stays put and readable.
   ========================================================= */

(function(){
  "use strict";

  const SYMBOLS = [
    "O(1)", "O(n)", "O(log n)", "O(n log n)", "O(n\u00B2)", "O(n\u00B3)", "\u03A9(n)", "\u0398(n)",
    "i++", "j--", "k = 0", "n - 1", "mid = (l+r)/2",
    "swap()", "compare", "pivot", "partition()", "merge()", "heapify()",
    "if (a[j] > a[j+1])", "while (i < n)", "for (int i=0;...)",
    "arr[i]", "arr[j]", "temp = arr[i]",
    "left", "right", "low", "high",
    "stable", "in-place", "recursive", "divide & conquer",
    "best case", "worst case", "average case",
    "space: O(1)", "space: O(n)", "space: O(log n)",
    "bubble sort", "selection sort", "insertion sort",
    "merge sort", "quick sort", "heap sort",
    "[ ]", "{ }", "return;", "void sort()",
    "n elements", "sorted \u2713", "unsorted", "DAA"
  ];

  function build(){
    const layer = document.getElementById("bgfxLayer");
    if (!layer || layer.dataset.built) return;
    layer.dataset.built = "1";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const canvas = document.createElement("canvas");
    canvas.className = "bgfx-canvas";
    layer.appendChild(canvas);

    window.TunnelFX.start(canvas, {
      colorway: "ambient",
      speed: 1.6,
      rings: window.innerWidth < 700 ? 16 : 26,
      labels: SYMBOLS,
      opacityScale: 0.55
    });
  }

  let raf = null;
  function parallax(e){
    const layer = document.getElementById("bgfxLayer");
    if (!layer) return;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      layer.style.transform = `rotateY(${(x * 3).toFixed(2)}deg) rotateX(${(-y * 3).toFixed(2)}deg)`;
    });
  }

  window.addEventListener("DOMContentLoaded", build);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    window.addEventListener("mousemove", parallax, { passive: true });
  }
})();
