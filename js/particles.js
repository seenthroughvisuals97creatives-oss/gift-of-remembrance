/* ---------------------------------------------------------------
   PARTICLES: soft dots rising in the visitor's colour, an occasional
   thin line between two dots, and a few small heart outlines.
   Nothing is drawn until GOR.particles.start(colour) is called,
   which only happens after the visitor has chosen their colour.
   --------------------------------------------------------------- */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  var cv = document.getElementById("particles");
  var ctx = cv.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W = 0, H = 0, dpr = 1, ps = [], lines = [], raf = 0, color = "#a78bfa", rgb = "167,139,250";
  var running = false, last = 0, nextLine = 0;

  function toRgb(hex) {
    return [1, 3, 5].map(function (i) { return parseInt(hex.substr(i, 2), 16); }).join(",");
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(anywhere, isHeart) {
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 24,
      r: isHeart ? 6 + Math.random() * 6 : 1 + Math.random() * 2.4,
      vy: 0.12 + Math.random() * 0.3,
      sway: Math.random() * 6.28,
      amp: 0.2 + Math.random() * 0.5,
      a: 0.28 + Math.random() * 0.45,
      heart: isHeart
    };
  }

  function build() {
    var n = Math.round(Math.min(70, Math.max(28, (W * H) / 22000)));
    ps = [];
    for (var i = 0; i < n; i++) ps.push(spawn(true, i % 9 === 0));
  }

  function drawHeart(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.35);
    ctx.bezierCurveTo(x - s, y - s * 0.3, x - s * 0.55, y - s, x, y - s * 0.45);
    ctx.bezierCurveTo(x + s * 0.55, y - s, x + s, y - s * 0.3, x, y + s * 0.35);
    ctx.stroke();
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    var i, p;
    for (i = 0; i < ps.length; i++) {
      p = ps[i];
      if (p.heart) {
        ctx.strokeStyle = "rgba(" + rgb + "," + (p.a * 0.8) + ")";
        ctx.lineWidth = 1.2;
        drawHeart(p.x, p.y, p.r);
      } else {
        ctx.fillStyle = "rgba(" + rgb + "," + (p.a * 0.18) + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.2, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "rgba(" + rgb + "," + p.a + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
    }
    ctx.lineWidth = 1;
    for (i = lines.length - 1; i >= 0; i--) {
      var l = lines[i], age = t - l.born;
      if (age > 2400) { lines.splice(i, 1); continue; }
      ctx.strokeStyle = "rgba(" + rgb + "," + (Math.sin(Math.PI * age / 2400) * 0.4) + ")";
      ctx.beginPath(); ctx.moveTo(l.a.x, l.a.y); ctx.lineTo(l.b.x, l.b.y); ctx.stroke();
    }
  }

  function addLine(t) {
    var a = ps[Math.floor(Math.random() * ps.length)], best = null, bd = 1e9;
    for (var i = 0; i < ps.length; i++) {
      var b = ps[i];
      if (b === a || b.heart || a.heart) continue;
      var d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > 40 && d < 240 && d < bd) { bd = d; best = b; }
    }
    if (best) lines.push({ a: a, b: best, born: t });
  }

  function frame(t) {
    if (!running) return;
    var dt = Math.min(48, t - (last || t)); last = t;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      p.y -= p.vy * dt * 0.06 * 16;
      p.x += Math.sin(t / 1800 + p.sway) * p.amp * 0.3;
      if (p.y < -24) ps[i] = spawn(false, p.heart);
    }
    if (t > nextLine) { addLine(t); nextLine = t + 1300 + Math.random() * 1500; }
    draw(t);
    raf = requestAnimationFrame(frame);
  }

  function run() {
    if (running) return;
    running = true; last = 0;
    raf = requestAnimationFrame(frame);
  }

  GOR.particles = {
    start: function (hex) {
      color = hex; rgb = toRgb(hex);
      resize(); build();
      cv.classList.add("on");
      if (reduce) { running = false; draw(0); } else { run(); }
    },
    setColor: function (hex) { color = hex; rgb = toRgb(hex); if (reduce) draw(0); }
  };

  window.addEventListener("resize", function () {
    if (!cv.classList.contains("on")) return;
    resize(); build(); if (reduce) draw(0);
  });
  document.addEventListener("visibilitychange", function () {
    if (!cv.classList.contains("on") || reduce) return;
    if (document.hidden) { running = false; cancelAnimationFrame(raf); } else { run(); }
  });
})();
