/* =========================================================
   SortLab — TunnelFX
   A small canvas engine that draws a continuously rotating,
   forward-flying tunnel of glowing polygon "rings" — used
   both as the page's ambient background (slow, low-opacity)
   and as the full-screen page-transition warp (fast, bright).
   DAA notation is attached to rings so the labels travel
   and rotate WITH the tunnel, not just drift on their own.
   ========================================================= */

(function(){
  "use strict";

  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function start(canvas, opts){
    opts = Object.assign({
      colorway: "ambient",   // 'ambient' (purple/pink) | 'warp' (cyan/green)
      speed: 1,
      rings: 22,
      labels: [],
      opacityScale: 1,
      fill: null              // optional solid clear color, else transparent clear
    }, opts || {});

    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, cx = 0, cy = 0, raf = null, running = true, t = 0;

    function resize(){
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = Math.max(1, Math.round(rect.width * DPR));
      h = canvas.height = Math.max(1, Math.round(rect.height * DPR));
      cx = w / 2; cy = h / 2;
    }
    window.addEventListener("resize", resize);
    resize();

    const PALETTES = {
      warp:    { a: "#2FE3C9", b: "#3AA7FF", glow: "rgba(58,231,201,0.65)" },
      ambient: { a: "#8A6BFF", b: "#FF5FB8", glow: "rgba(138,107,255,0.45)" }
    };
    const colors = PALETTES[opts.colorway] || PALETTES.ambient;

    const ringData = [];
    for (let i = 0; i < opts.rings; i++){
      ringData.push({
        rot: Math.random() * Math.PI * 2,
        dir: (i % 2 === 0) ? 1 : -1,
        sides: 3 + (i % 4),
        label: opts.labels.length ? opts.labels[Math.floor(Math.random() * opts.labels.length)] : null
      });
    }

    function draw(){
      if (!running) return;
      t += 0.016 * opts.speed;

      if (opts.fill){
        ctx.fillStyle = opts.fill;
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      const maxR = Math.hypot(w, h) / 2 * 1.08;

      for (let i = opts.rings - 1; i >= 0; i--){
        const ring = ringData[i];
        const prog = (t * 0.17 + i / opts.rings) % 1;   // 0 -> 1, loops = flying forward
        const r = prog * maxR;
        const rot = ring.rot + t * 0.5 * ring.dir * opts.speed;
        const alpha = Math.max(0, (1 - prog) * 0.95 * opts.opacityScale);
        if (alpha <= 0.01) continue;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = (i % 2 === 0) ? colors.a : colors.b;
        ctx.lineWidth = 1.6 * DPR;
        ctx.shadowBlur = 16 * DPR;
        ctx.shadowColor = colors.glow;
        ctx.beginPath();
        for (let s = 0; s <= ring.sides; s++){
          const a = (s / ring.sides) * Math.PI * 2;
          const x = Math.cos(a) * r, y = Math.sin(a) * r;
          if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        if (ring.label && prog > 0.06 && prog < 0.9){
          ctx.save();
          ctx.rotate(-rot * 1.6);
          ctx.globalAlpha = Math.min(1, alpha * 1.15);
          ctx.fillStyle = (i % 2 === 0) ? colors.a : colors.b;
          ctx.font = `${Math.round((10 + prog * 12) * DPR)}px 'IBM Plex Mono', monospace`;
          ctx.textAlign = "center";
          ctx.fillText(ring.label, 0, -r);
          ctx.restore();
        }
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    return {
      stop(){ running = false; if (raf) cancelAnimationFrame(raf); window.removeEventListener("resize", resize); },
      setSpeed(v){ opts.speed = v; }
    };
  }

  window.TunnelFX = { start };
})();
