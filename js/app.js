/* ---------------------------------------------------------------
   APP: connects everything. Intro, welcome pop-up, landing page,
   level cards, info pop-ups, sharing, and the surprise notice.
   --------------------------------------------------------------- */
(function () {
  "use strict";
  var GOR = window.GOR;
  var $ = function (s) { return document.querySelector(s); };
  var engaged = false, noticeShown = false, feedbackVisible = false;
  var SWATCHES = ["#a78bfa", "#6ec6b8", "#e6b34c", "#e88fa8", "#6fa8e8", "#f08a5d"];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function show(id) {
    ["intro", "welcome", "landing"].forEach(function (s) { $("#" + s).hidden = s !== id; });
    document.body.dataset.stage = id;
  }

  /* ---------- Welcome pop-up ---------- */
  var form = $("#welcome-form"), nameIn = $("#name"), monthIn = $("#month"), dayIn = $("#day"), colorIn = $("#color"), errEl = $("#welcome-error");

  GOR.months.forEach(function (m) {
    var o = el("option", null, m.name); o.value = String(m.n); monthIn.appendChild(o);
  });

  // The days offered depend on the month, so nobody can pick 31 April.
  function fillDays() {
    var m = GOR.months[(parseInt(monthIn.value, 10) || 1) - 1];
    var keep = parseInt(dayIn.value, 10);
    dayIn.textContent = "";
    var first = el("option", null, "Day"); first.value = ""; first.disabled = true; first.selected = true;
    dayIn.appendChild(first);
    for (var d = 1; d <= m.days; d++) { var o = el("option", null, String(d)); o.value = String(d); dayIn.appendChild(o); }
    if (keep >= 1 && keep <= m.days) dayIn.value = String(keep);
  }
  fillDays();
  monthIn.addEventListener("change", fillDays);

  var swatchWrap = $("#swatches");
  function pressSwatch(hex) {
    Array.prototype.forEach.call(swatchWrap.children, function (b) {
      b.setAttribute("aria-pressed", b.dataset.hex === hex ? "true" : "false");
    });
  }
  SWATCHES.forEach(function (hex) {
    var b = el("button", "swatch"); b.type = "button"; b.dataset.hex = hex;
    b.style.background = hex; b.setAttribute("aria-label", "Use colour " + hex); b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () { colorIn.value = hex; GOR.applyColor(hex); pressSwatch(hex); });
    swatchWrap.appendChild(b);
  });
  pressSwatch("#a78bfa");
  colorIn.addEventListener("input", function () { GOR.applyColor(colorIn.value); pressSwatch(colorIn.value.toLowerCase()); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = { name: nameIn.value.trim(), month: parseInt(monthIn.value, 10), day: parseInt(dayIn.value, 10), color: colorIn.value };
    if (!data.name) { return fail("Please tell us what you would like to be called.", nameIn); }
    if (data.name.length > 30) { return fail("Please keep your name to 30 characters.", nameIn); }
    if (!(data.month >= 1 && data.month <= 12)) { return fail("Please choose your birth month.", monthIn); }
    if (!GOR.session.isValid(data)) { return fail("Please choose your birth day.", dayIn); }
    errEl.hidden = true;
    GOR.session.set(data);
    enterLanding(data, true);
  });
  function fail(msg, field) { errEl.textContent = msg; errEl.hidden = false; field.focus(); }

  /* ---------- Landing page ---------- */
  function enterLanding(data, animate) {
    GOR.applyColor(data.color);
    GOR.particles.start(data.color); // the colour is set before any particle appears
    $("#greeting").textContent = "Welcome, " + data.name + ".";
    show("landing");
    window.scrollTo(0, 0);
    $("#greeting").focus({ preventScroll: true });
    setupFeedbackWatcher();
    floatIn();
  }

  // Everything floats in slowly, one piece after another, as if breathing in.
  function floatIn() {
    var items = document.querySelectorAll("#landing .hero > *, #landing .levels, #landing .feedback, #landing .footer-grid, #landing .share, #landing .about");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(items, function (it, i) {
      it.classList.add("reveal");
      if (i < 4) it.style.transitionDelay = (0.35 + i * 0.45) + "s"; // the first lines arrive one by one
      io.observe(it);
    });
  }

  document.querySelectorAll(".level:not(.is-soon)").forEach(function (b) {
    b.addEventListener("click", function () { GOR.journey.open(b.dataset.level, GOR.session.data.name); });
  });

  GOR.onJourneyOpen = function () { engaged = true; maybeShowNotice(); };
  GOR.onJourneyComplete = function (id) {
    var card = document.querySelector('.level[data-level="' + id + '"]');
    if (card) { card.classList.add("is-done"); card.querySelector("[data-status]").textContent = "Completed. Visit again any time."; }
    window.scrollTo({ top: 0, behavior: "smooth" });
    engaged = true; maybeShowNotice();
  };

  /* ---------- Info pop-ups (Starseed, World Within, Pure Love Network) ---------- */
  var info = $("#info");
  function openCard(key) {
    var c = GOR.cards && GOR.cards[key]; if (!c) return;
    $("#info-title").textContent = c.title;
    var box = $("#info-text"); box.textContent = "";
    c.paragraphs.forEach(function (p) { box.appendChild(el("p", "step-text", p)); box.lastChild.style.marginTop = "12px"; });
    var link = $("#info-link"), url = GOR.links && GOR.links[c.linkKey];
    link.textContent = c.cta;
    link.href = url || "#"; // add the address in js/links.js
    info.showModal();
    $("#info-title").focus({ preventScroll: true });
  }
  document.querySelectorAll("[data-card]").forEach(function (b) {
    b.addEventListener("click", function () { openCard(b.dataset.card); });
    var key = b.dataset.card, c = GOR.cards[key];
    if (c && c.image) {
      var art = b.querySelector(".tile-art");
      if (art) { var img = el("img"); img.src = c.image; img.alt = ""; art.appendChild(img); }
    }
  });
  $("#info-close").addEventListener("click", function () { info.close(); });
  $("#info-link").addEventListener("click", function (e) { if (this.getAttribute("href") === "#") e.preventDefault(); });
  info.addEventListener("click", function (e) { if (e.target === info) info.close(); });

  /* ---------- Feedback + surprise notice ---------- */
  var fbUrl = GOR.links && GOR.links.feedback;
  var fl = $("#feedback-link");
  if (fbUrl) { fl.href = fbUrl; } else { fl.addEventListener("click", function (e) { e.preventDefault(); }); }
  var support = GOR.links && GOR.links.support;
  if (support) { $("#support-link").href = support; document.querySelector(".need-support").href = support; }

  var notice = $("#notice");
  function setupFeedbackWatcher() {
    if (!("IntersectionObserver" in window)) { feedbackVisible = true; return; }
    new IntersectionObserver(function (entries) {
      feedbackVisible = entries[0].isIntersecting;
      maybeShowNotice();
    }, { threshold: 0.6 }).observe($("#feedback"));
  }
  function maybeShowNotice() {
    if (!engaged || noticeShown || !feedbackVisible) return;
    if (document.querySelector("dialog[open]")) return; // never interrupt a pop-up
    var d = GOR.session.data; if (!d) return;
    noticeShown = true;
    buildNotice(d);
    notice.showModal();
  }
  function list(items) {
    var w = el("div", "chips");
    items.forEach(function (t) { w.appendChild(el("span", "chip", t)); });
    return w;
  }
  function buildNotice(d) {
    var m = GOR.months[d.month - 1], signName = GOR.signFor(d.month, d.day), s1 = GOR.signs[signName];
    var box = $("#notice-body"); box.textContent = "";
    var card = el("div", "notice-card");
    var h = el("h2", null, "Thank you for being here, " + d.name + "."); h.id = "notice-title"; h.tabIndex = -1;
    card.appendChild(h);
    card.appendChild(el("p", "step-text", "You were born on " + d.day + " " + m.name + ". That makes you " + signName + ", a " + s1.element.toLowerCase() + " sign, so you are a " + s1.element + " being."));
    card.appendChild(el("p", "notice-phrase", "“" + s1.phrase + "”"));
    card.appendChild(el("p", "notice-label", "Your gifts"));
    card.appendChild(list(s1.gifts));
    card.appendChild(el("p", "notice-label", "Your edges"));
    card.appendChild(list(s1.edges));
    card.appendChild(el("p", "step-text", "Your edges are nothing to be ashamed of. You could not have them if you were not alive. Seeing them clearly helps you work with them. Having a trait does not bind you to it. Your awareness can choose what you express."));
    card.appendChild(el("p", "step-text", "This is a reflection, not a prediction. If you were born right on the edge between two signs, the date can shift by a day from year to year."));
    card.appendChild(el("p", "step-text", "Feeling good lets the love you are shine brighter. Happiness is free."));
    box.appendChild(card);
  }
  $("#notice-close").addEventListener("click", function () { notice.close(); });
  $("#notice-done").addEventListener("click", function () { notice.close(); });
  notice.addEventListener("click", function (e) { if (e.target === notice) notice.close(); });

  /* ---------- Sharing ---------- */
  (function buildShare() {
    var row = $("#share-row"), status = $("#share-status");
    var url = (GOR.links && GOR.links.siteUrl) || location.href.split("#")[0];
    var text = "A Gift of Remembrance: a free online session for well-being. A moment to pause, reflect, and reconnect.";
    function link(label, href) {
      var a = el("a", "btn btn-ghost", label); a.href = href; a.target = "_blank"; a.rel = "noopener"; row.appendChild(a);
    }
    if (navigator.share) {
      var n = el("button", "btn", "Share"); n.type = "button";
      n.addEventListener("click", function () {
        navigator.share({ title: "A Gift of Remembrance", text: text, url: url }).catch(function () {});
      });
      row.appendChild(n);
    }
    link("Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url));
    link("WhatsApp", "https://wa.me/?text=" + encodeURIComponent(text + " " + url));
    link("X", "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url));
    link("Telegram", "https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(text));
    var mail = el("a", "btn btn-ghost", "Email");
    mail.href = "mailto:?subject=" + encodeURIComponent("A Gift of Remembrance") + "&body=" + encodeURIComponent(text + "\n\n" + url);
    row.appendChild(mail);
    var cp = el("button", "btn btn-ghost", "Copy link"); cp.type = "button";
    cp.addEventListener("click", function () {
      var done = function () { status.textContent = "Link copied. Paste it into Instagram, TikTok or anywhere you like."; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { status.textContent = url; });
      else status.textContent = url;
    });
    row.appendChild(cp);
  })();

  /* ---------- Start ---------- */
  // Every refresh begins again at the intro, with nothing remembered from before.
  show("intro");
  GOR.intro.play().then(function () {
    show("welcome");
    $("#welcome").classList.add("entering");
    nameIn.focus({ preventScroll: true });
  });
})();
