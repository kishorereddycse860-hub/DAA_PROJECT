/* =========================================================
   SortLab — page transitions
   Clicking an internal link now flies you through a bright
   cyan/green TunnelFX warp (instead of a hard page jump),
   navigates underneath, then the new page warps back out to
   reveal itself the same way. Falls back to instant nav if
   canvas / TunnelFX isn't available, or motion is reduced.
   ========================================================= */

(function(){
  "use strict";

  const NAV_FLAG = "sl_pt_nav";
  const COVER_MS = 2200;
  const REVEAL_MS = 2400;

  const WARP_LABELS = [
    "O(1)", "O(n)", "O(log n)", "O(n log n)", "O(n\u00B2)", "O(n\u00B3)",
    "swap()", "compare", "i++", "j--", "pivot", "merge()",
    "partition()", "heapify()", "divide & conquer", "recursive",
    "stable", "in-place", "temp = arr[i]", "arr[j]",
    "bubble sort", "selection sort", "insertion sort",
    "merge sort", "quick sort", "heap sort", "sorted \u2713"
  ];

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let tunnel = null;

  function buildOverlay(){
    const overlay = document.getElementById("ptOverlay");
    if (!overlay || overlay.dataset.built) return overlay;
    overlay.dataset.built = "1";
    overlay.innerHTML = `<canvas class="pt-canvas"></canvas><div class="pt-label">entering…</div>`;
    return overlay;
  }

  function ensureTunnel(overlay){
    if (tunnel || reduced || !window.TunnelFX) return tunnel;
    const canvas = overlay.querySelector(".pt-canvas");
    if (!canvas) return null;
    tunnel = window.TunnelFX.start(canvas, {
      colorway: "warp",
      speed: 3.2,
      rings: 30,
      labels: WARP_LABELS,
      opacityScale: 1,
      fill: "rgba(6,10,22,0.5)"
    });
    return tunnel;
  }

  function isSameOriginHtmlLink(a){
    if (!a || !a.getAttribute) return false;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
    if (a.target && a.target !== "" && a.target !== "_self") return false;
    if (a.hasAttribute("download")) return false;
    let url;
    try { url = new URL(href, window.location.href); } catch (err) { return false; }
    if (url.origin !== window.location.origin) return false;
    return true;
  }

  function playEntrance(){
    const overlay = buildOverlay();
    if (!overlay) return;
    const wasInternalNav = sessionStorage.getItem(NAV_FLAG) === "1";
    sessionStorage.removeItem(NAV_FLAG);

    if (!wasInternalNav || reduced){
      overlay.classList.remove("pt-covering", "pt-covered", "pt-revealing");
      return; // direct load / refresh — no forced warp
    }

    overlay.classList.add("pt-covered");
    const t = ensureTunnel(overlay);
    void overlay.offsetWidth;
    requestAnimationFrame(() => {
      overlay.classList.add("pt-revealing");
      overlay.classList.remove("pt-covered");
      setTimeout(() => {
        overlay.classList.remove("pt-revealing", "pt-covering");
        if (t){ t.stop(); tunnel = null; }
      }, REVEAL_MS);
    });
  }

  function handleClick(e){
    const a = e.target.closest ? e.target.closest("a") : null;
    if (!isSameOriginHtmlLink(a)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const dest = a.href;
    if (dest === window.location.href) return;

    e.preventDefault();

    if (reduced){
      window.location.href = dest;
      return;
    }

    const overlay = buildOverlay();
    overlay.classList.remove("pt-revealing");
    overlay.classList.add("pt-covering");
    ensureTunnel(overlay);
    sessionStorage.setItem(NAV_FLAG, "1");
    setTimeout(() => { window.location.href = dest; }, COVER_MS);
  }

  document.addEventListener("click", handleClick);
  window.addEventListener("DOMContentLoaded", playEntrance);
})();
