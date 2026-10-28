/* ---------------------------------------------------------------
   JOURNEY ENGINE: one pop-up box that keeps changing its content.
   It reads a level from GOR.journeys (for example beginner.js) and
   shows one step at a time. Answers decide which step comes next.
   This file only handles how things work. The words live in
   js/beginner.js and js/vibrations.js, so you should not need to edit
   this file to change any wording.

   The visitor's name is shown in double quotes, bold and in their colour
   everywhere {name} is used. The look of it is the ".you" style in
   css/main.css.
   --------------------------------------------------------------- */
(function () {
  "use strict";
  var GOR = (window.GOR = window.GOR || {});
  var dlg = document.getElementById("journey");
  var body = document.getElementById("journey-body");
  var bar = document.getElementById("journey-bar");
  var nextBtn = document.getElementById("journey-next");
  var backBtn = document.getElementById("journey-back");
  var noteEl = document.getElementById("journey-note");
  var rememberEl = document.getElementById("journey-remember");
  var supportEl = document.getElementById("journey-support");
  var CRISIS = /(suicid|kill myself|end my life|want to die|wanna die|hurt myself|self[\s-]?harm)/i;
  var SUPPORT_TEXT = "If this feels like too much to carry alone, support is available.";
  var NAME_MARK = "\u0001";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var levelId, journey, state, history, current, chosen, textInput;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Swap {name} and {vibration} in a sentence. The name becomes a marker so it
  // can be drawn as a highlighted element instead of plain text.
  function fill(s) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      if (k === "name") return NAME_MARK;
      if (k === "vibration") return state.vibration ? state.vibration.label.toLowerCase() : "this feeling";
      return m;
    });
  }

  // Put a sentence into an element, drawing each name as "Name" in bold and colour.
  function rich(parent, s) {
    String(s).split(NAME_MARK).forEach(function (part, i) {
      if (i > 0) parent.appendChild(el("span", "you", "“" + state.name + "”"));
      if (part) parent.appendChild(document.createTextNode(part));
    });
    return parent;
  }

  function richEl(tag, cls, text) { return rich(el(tag, cls), fill(text)); }

  function setNote(text) {
    noteEl.textContent = "";
    noteEl.hidden = !text;
    if (text) rich(noteEl, fill(text));
  }

  function showSupport(show, text) {
    supportEl.hidden = !show;
    supportEl.textContent = "";
    if (!show) return;
    supportEl.appendChild(document.createTextNode(text + " "));
    var a = el("a", null, "Find a helpline");
    a.href = (GOR.links && GOR.links.support) || "https://findahelpline.com";
    a.target = "_blank"; a.rel = "noopener";
    supportEl.appendChild(a);
  }

  function ready(on) { nextBtn.disabled = !on; }

  function answered() {
    ready(true);
    if (current.remember && journey.remember) { rememberEl.hidden = false; rememberEl.textContent = journey.remember; }
  }

  function watchText(input) {
    input.addEventListener("input", function () {
      if (CRISIS.test(input.value)) {
        showSupport(true, "What you wrote sounds heavy. You deserve support from a real person, and it is available right now.");
      } else if (!(state.vibration && state.vibration.support)) {
        showSupport(false);
      }
    });
  }

  function progress() {
    bar.style.width = Math.min(100, ((history.length + 1) / journey.length) * 100) + "%";
  }

  // The box that explains the vibration the visitor tapped.
  function fillDetail(box, v) {
    box.textContent = "";
    box.appendChild(el("h3", "vib-detail-title", v.words.join(" — ")));
    box.appendChild(el("p", "vib-detail-tag", v.tag));
    [].concat(v.text).forEach(function (t) { box.appendChild(el("p", "vib-detail-text", t)); });
    box.hidden = false;
  }

  function render(id) {
    current = journey.steps[id];
    current.id = id;
    chosen = null; textInput = null;
    body.textContent = "";
    rememberEl.hidden = true;
    var keepSupport = state.vibration && state.vibration.support && id !== journey.start;
    showSupport(!!keepSupport, SUPPORT_TEXT);
    setNote(current.note);
    backBtn.hidden = history.length === 0;
    progress();

    var wrap = el("div", "step");
    var h = richEl("h2", "step-title", current.title);
    h.id = "journey-title"; h.tabIndex = -1;
    wrap.appendChild(h);
    (current.body || []).forEach(function (p) { wrap.appendChild(richEl("p", "step-text", p)); });
    if (current.hint) wrap.appendChild(richEl("p", "hint", current.hint));

    if (current.breath) {
      var br = el("div", "breath"); br.setAttribute("aria-hidden", "true");
      br.appendChild(el("span", "breath-ring")); br.appendChild(el("span", "breath-core"));
      wrap.appendChild(br);
    }

    if (current.type === "vibrations") {
      var rail = el("div", "rail"); rail.setAttribute("role", "radiogroup"); rail.setAttribute("aria-label", "Vibrations");
      var detail = el("div", "vib-detail"); detail.hidden = true; detail.setAttribute("aria-live", "polite");
      textInput = el("textarea", "text-in");
      textInput.rows = 3; textInput.maxLength = 280; textInput.hidden = true;
      textInput.setAttribute("aria-label", "Describe your feeling in your own words");
      textInput.placeholder = "Write what you are experiencing, in your own words.";

      var all = GOR.vibrations.slice();
      var other = all.filter(function (v) { return v.custom; })[0];
      var cards = all.filter(function (v) { return !v.custom; });
      cards.sort(function (a, b) { return GOR.vibrationOrder === "light-first" ? a.n - b.n : b.n - a.n; });

      var otherBtn = null;
      function choose(v, node) {
        Array.prototype.forEach.call(rail.children, function (c) { c.setAttribute("aria-checked", "false"); });
        if (otherBtn) otherBtn.setAttribute("aria-pressed", "false");
        if (node === otherBtn) node.setAttribute("aria-pressed", "true"); else node.setAttribute("aria-checked", "true");
        chosen = v;
        state.vibration = { id: v.id, name: v.words.join(" – "), label: v.words.slice(0, 3).join(", "), tone: v.tone, support: !!v.support };
        fillDetail(detail, v);
        if (v.custom) {
          textInput.hidden = false;
          state.vibration.label = textInput.value.trim() || "this feeling";
          ready(textInput.value.trim().length > 0);
        } else {
          textInput.hidden = true;
          showSupport(!!v.support, SUPPORT_TEXT);
          answered();
        }
        // Scroll to the description only after the lines at the bottom of the pop-up have
        // appeared, because they change how much room is left to read in.
        requestAnimationFrame(function () {
          detail.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
        });
      }

      cards.forEach(function (v) {
        var b = el("button", "vib");
        b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false");
        b.appendChild(el("span", "vib-num", (v.n < 10 ? "0" : "") + v.n));
        b.appendChild(el("span", "vib-name", v.words.join(" – ")));
        b.appendChild(el("span", "vib-feel", v.tag));
        b.addEventListener("click", function () { choose(v, b); });
        rail.appendChild(b);
      });

      textInput.addEventListener("input", function () {
        var t = textInput.value.trim();
        if (state.vibration) state.vibration.label = t || "this feeling";
        ready(t.length > 0);
        if (t.length > 0) answered();
      });
      watchText(textInput);
      wrap.appendChild(rail);

      if (other) {
        otherBtn = el("button", "vib-other", other.words[0] + " – " + other.words[1]);
        otherBtn.type = "button"; otherBtn.setAttribute("aria-pressed", "false");
        otherBtn.addEventListener("click", function () { choose(other, otherBtn); });
        wrap.appendChild(otherBtn);
      }
      wrap.appendChild(detail);
      wrap.appendChild(textInput);
      ready(false);

    } else if (current.type === "choice") {
      var list = el("div", "opts"); list.setAttribute("role", "radiogroup");
      current.options.forEach(function (o) {
        var b = richEl("button", "opt", o.label);
        b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false");
        b.addEventListener("click", function () {
          Array.prototype.forEach.call(list.children, function (c) { c.setAttribute("aria-checked", "false"); });
          b.setAttribute("aria-checked", "true");
          chosen = o;
          state.answers[id] = o.id;
          answered();
        });
        list.appendChild(b);
      });
      wrap.appendChild(list);
      if (current.allowText) {
        textInput = el("input", "text-in");
        textInput.type = "text"; textInput.maxLength = 140;
        textInput.setAttribute("aria-label", "Optional note");
        textInput.placeholder = current.textPlaceholder || "";
        watchText(textInput);
        wrap.appendChild(textInput);
      }
      ready(!!current.optional);

    } else {
      // statement or end
      ready(true);
    }

    nextBtn.textContent = current.type === "end" ? (current.cta || "Done") :
      current.type === "statement" ? (current.cta || "Continue") :
      (current.optional ? "Continue" : "Next");
    body.appendChild(wrap);
    body.scrollTop = 0;
    h.focus({ preventScroll: true });
  }

  function resolveNext() {
    var n = current.next;
    if (chosen && chosen.goto !== undefined) n = chosen.goto;
    if (typeof n === "function") n = n(state, chosen);
    return n;
  }

  nextBtn.addEventListener("click", function () {
    if (current.type === "end") {
      dlg.close();
      if (GOR.onJourneyComplete) GOR.onJourneyComplete(levelId);
      return;
    }
    var to = resolveNext();
    if (!to || !journey.steps[to]) return;
    history.push(current.id);
    render(to);
  });

  backBtn.addEventListener("click", function () {
    if (!history.length) return;
    render(history.pop());
  });

  document.getElementById("journey-close").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  GOR.journey = {
    open: function (id, name) {
      journey = GOR.journeys && GOR.journeys[id];
      if (!journey) return;
      levelId = id;
      state = { name: name, vibration: null, answers: {} };
      history = [];
      if (GOR.onJourneyOpen) GOR.onJourneyOpen(id);
      dlg.showModal();
      render(journey.start);
    }
  };
})();
