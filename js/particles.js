/* ---------------------------------------------------------------
   PARTICLES: calm outlines (hearts, diamonds, butterflies, rings) and
   tiny dots in the visitor's colour. Each one slowly fades in, drifts
   gently, and fades out again, then returns somewhere new. They never
   pile up, and nothing rushes.

   Easy settings to change are in SETTINGS just below.
   Nothing is drawn until GOR.particles.start(colour) is called, which
   only happens after the visitor has chosen their colour.
   --------------------------------------------------------------- */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  var cv = document.getElementById("particles");
  var ctx = cv.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SETTINGS = {
    speed: 1,            // 1 is calm. 0.7 is slower, 1.4 is livelier.
    shapeLife: [11, 18], // seconds each outline takes to fade in and out
    dotLife: [8, 14],    // seconds each dot takes to fade in and out
    hueSpread: 22        // how far the colours may drift from the chosen colour (degrees)
  };

  var W = 0, H = 0, dpr = 1, ps = [], lines = [], raf = 0, hsl = { h: 260, s: 90, l: 70 };
  var running = false, last = 0, clock = 0, nextLine = 0;

  function hexToHsl(hex) {
    var r = parseInt(hex.substr(1, 2), 16) / 255, g = parseInt(hex.substr(3, 2), 16) / 255, b = parseInt(hex.substr(5, 2), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, h = 0, s = 0, d = max - min;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (max === r) h = ((g - b) / d) % 6; else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60; if (h < 0) h += 360;
    }
    return { h: h, s: s * 100, l: l * 100 };
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ---------- Outline shapes, drawn around (0, 0) ---------- */
  function heart(s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.55, -s, 0, -s * 0.45);
    ctx.bezierCurveTo(s * 0.55, -s, s, -s * 0.3, 0, s * 0.35);
    ctx.stroke();
  }
  function diamond(s) {
    ctx.beginPath();
    ctx.moveTo(0, -s); ctx.lineTo(s * 0.65, 0); ctx.lineTo(0, s); ctx.lineTo(-s * 0.65, 0);
    ctx.closePath(); ctx.stroke();
  }
  function wing(s) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-s * 0.3, -s * 0.9, -s * 1.2, -s * 0.95, -s * 1.05, -s * 0.2);
    ctx.bezierCurveTo(-s * 0.95, s * 0.2, -s * 0.4, s * 0.15, 0, 0);
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-s * 0.5, s * 0.15, -s * 0.9, s * 0.45, -s * 0.7, s * 0.85);
    ctx.bezierCurveTo(-s * 0.45, s * 1.05, -s * 0.1, s * 0.6, 0, 0);
    ctx.stroke();
  }
  function butterfly(s) {
    s *= 0.8;
    wing(s);
    ctx.save(); ctx.scale(-1, 1); wing(s); ctx.restore();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.35); ctx.lineTo(0, s * 0.4); ctx.stroke();
  }
  function ring(s) { ctx.beginPath(); ctx.arc(0, 0, s * 0.7, 0, 6.2832); ctx.stroke(); }
  // A four-pointed sparkle: the shape of a shining light or a star.
  function sparkle(s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * 0.12, -s * 0.12, s * 0.8, 0);
    ctx.quadraticCurveTo(s * 0.12, s * 0.12, 0, s);
    ctx.quadraticCurveTo(-s * 0.12, s * 0.12, -s * 0.8, 0);
    ctx.quadraticCurveTo(-s * 0.12, -s * 0.12, 0, -s);
    ctx.closePath(); ctx.stroke();
  }
  // Which shapes appear, and how often (a shape listed twice appears twice as often).
  var SHAPES = [heart, diamond, butterfly, sparkle, heart, sparkle, diamond, ring, butterfly];

  /* ---------- Creating particles, spread out so they never crowd ---------- */
  function farSpot() {
    var best = null, bd = -1, i, c, d, k;
    for (k = 0; k < 9; k++) {
      c = { x: rand(0.04, 0.96) * W, y: rand(0.04, 0.96) * H };
      d = 1e9;
      for (i = 0; i < ps.length; i++) d = Math.min(d, Math.hypot(c.x - ps[i].x, c.y - ps[i].y));
      if (d > bd) { bd = d; best = c; }
    }
    return best;
  }

  function make(kind, startAge) {
    var shape = kind === "shape", pos = farSpot() || { x: W / 2, y: H / 2 };
    var life = shape ? rand(SETTINGS.shapeLife[0], SETTINGS.shapeLife[1]) : rand(SETTINGS.dotLife[0], SETTINGS.dotLife[1]);
    var size = rand(0, 1);
    return {
      kind: kind,
      x: pos.x, y: pos.y,
      // a mix of big, medium and small outlines; tiny dots
      r: shape ? (size < 0.3 ? rand(32, 54) : size < 0.7 ? rand(18, 28) : rand(9, 15)) : rand(0.8, 2.4),
      draw: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      vx: rand(-4, 4) * SETTINGS.speed,
      vy: -rand(5, 11) * SETTINGS.speed,
      sway: rand(0, 6.28), swayAmp: rand(3, 8),
      rot: rand(-0.35, 0.35), spin: rand(-0.02, 0.02),
      hue: hsl.h + rand(-SETTINGS.hueSpread, SETTINGS.hueSpread),
      life: life, age: startAge ? rand(0, life) : 0,
      peak: shape ? rand(0.4, 0.7) : rand(0.35, 0.7)
    };
  }

  function build() {
    var area = (W * H) / 1000000;               // millions of pixels
    var shapes = Math.round(Math.max(6, Math.min(13, 8 * area + 4)));
    var dots = Math.round(Math.max(22, Math.min(44, 26 * area + 14)));
    ps = []; lines = [];
    var i;
    for (i = 0; i < shapes; i++) ps.push(make("shape", true));
    for (i = 0; i < dots; i++) ps.push(make("dot", true));
  }

  function color(p, a) {
    var l = Math.min(hsl.l, 62), s = hsl.s;
    // very dark colours (like black) are drawn a little softer
    if (hsl.l < 20) a *= 0.7;
    return "hsla(" + p.hue.toFixed(0) + "," + s.toFixed(0) + "%," + l.toFixed(0) + "%," + a.toFixed(3) + ")";
  }

  // The breath: rises slowly, rests, then fades away.
  function breath(p) {
    var x = Math.min(1, Math.max(0, p.age / p.life));
    return Math.pow(Math.sin(Math.PI * x), 1.4);
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    var i, p, a;
    for (i = 0; i < ps.length; i++) {
      p = ps[i]; a = breath(p) * p.peak;
      if (a < 0.01) continue;
      if (p.kind === "dot") {
        ctx.fillStyle = color(p, a * 0.16);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.4, 0, 6.2832); ctx.fill();
        ctx.fillStyle = color(p, a);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        var sc = 1 + 0.05 * Math.sin(p.age * 0.9 + p.sway); // a very small in-and-out breath
        ctx.scale(sc, sc);
        ctx.strokeStyle = color(p, a);
        ctx.lineWidth = p.r > 30 ? 1.5 : p.r > 17 ? 1.3 : 1.1;
        ctx.lineJoin = "round";
        p.draw(p.r);
        ctx.restore();
      }
    }
    ctx.lineWidth = 1;
    for (i = lines.length - 1; i >= 0; i--) {
      var l = lines[i], x = (clock - l.born) / 4.5;
      if (x >= 1) { lines.splice(i, 1); continue; }
      ctx.strokeStyle = color(l.a, Math.sin(Math.PI * x) * 0.28);
      ctx.beginPath(); ctx.moveTo(l.a.x, l.a.y); ctx.lineTo(l.b.x, l.b.y); ctx.stroke();
    }
  }

  function addLine() {
    var dots = ps.filter(function (p) { return p.kind === "dot" && breath(p) > 0.5; });
    if (dots.length < 2) return;
    var a = dots[Math.floor(Math.random() * dots.length)], best = null, bd = 1e9, i, d;
    for (i = 0; i < dots.length; i++) {
      if (dots[i] === a) continue;
      d = Math.hypot(a.x - dots[i].x, a.y - dots[i].y);
      if (d > 50 && d < 230 && d < bd) { bd = d; best = dots[i]; }
    }
    if (best) lines.push({ a: a, b: best, born: clock });
  }

  function frame(t) {
    if (!running) return;
    var dt = Math.min(0.05, (t - (last || t)) / 1000); last = t; clock += dt;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      p.age += dt;
      p.x += (p.vx + Math.sin(clock * 0.35 + p.sway) * p.swayAmp * 0.25) * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      if (p.age >= p.life) ps[i] = make(p.kind, false); // fade out, then return somewhere new
    }
    if (clock > nextLine) { addLine(); nextLine = clock + rand(3, 6); }
    render();
    raf = requestAnimationFrame(frame);
  }

  function run() {
    if (running) return;
    running = true; last = 0;
    raf = requestAnimationFrame(frame);
  }

  GOR.particles = {
    start: function (hex) {
      hsl = hexToHsl(hex);
      resize(); build();
      cv.classList.add("on");
      if (reduce) { running = false; render(); } else { run(); }
    },
    setColor: function (hex) { hsl = hexToHsl(hex); for (var i = 0; i < ps.length; i++) ps[i].hue = hsl.h + rand(-SETTINGS.hueSpread, SETTINGS.hueSpread); if (reduce) render(); }
  };

  window.addEventListener("resize", function () {
    if (!cv.classList.contains("on")) return;
    resize(); build(); if (reduce) render();
  });
  document.addEventListener("visibilitychange", function () {
    if (!cv.classList.contains("on") || reduce) return;
    if (document.hidden) { running = false; cancelAnimationFrame(raf); } else { run(); }
  });
})();
