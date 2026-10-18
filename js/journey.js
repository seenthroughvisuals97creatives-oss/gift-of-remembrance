/* ---------------------------------------------------------------
   JOURNEY ENGINE: one pop-up box that keeps changing its content.
   It reads a level from GOR.journeys (for example beginner.js) and
   shows one step at a time. Answers decide which step comes next.
   This file only handles how things work. The words live in the
   level files.
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

  var levelId, journey, state, history, current, chosen, textInput;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function fill(s) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      if (k === "name") return state.name;
      if (k === "vibration") return state.vibration ? state.vibration.label.toLowerCase() : "this feeling";
      return m;
    });
  }

  function setNote(text) { noteEl.hidden = !text; noteEl.textContent = text ? fill(text) : ""; }

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

  function render(id) {
    current = journey.steps[id];
    current.id = id;
    chosen = null; textInput = null;
    body.textContent = "";
    rememberEl.hidden = true;
    var keepSupport = state.vibration && state.vibration.support && id !== journey.start;
    showSupport(!!keepSupport, "If this feels like too much to carry alone, support is available.");
    setNote(current.note);
    backBtn.hidden = history.length === 0;
    progress();

    var wrap = el("div", "step");
    var h = el("h2", "step-title", fill(current.title));
    h.id = "journey-title"; h.tabIndex = -1;
    wrap.appendChild(h);
    (current.body || []).forEach(function (p) { wrap.appendChild(el("p", "step-text", fill(p))); });

    if (current.type === "vibrations") {
      var rail = el("div", "rail"); rail.setAttribute("role", "radiogroup"); rail.setAttribute("aria-label", "Vibrations");
      GOR.vibrations.forEach(function (v) {
        var b = el("button", "vib");
        b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false");
        b.appendChild(el("span", "vib-name", v.name + " – " + v.feel));
        if (v.element) b.appendChild(el("span", "vib-el", v.element));
        b.addEventListener("click", function () {
          Array.prototype.forEach.call(rail.children, function (c) { c.setAttribute("aria-checked", "false"); });
          b.setAttribute("aria-checked", "true");
          chosen = v;
          state.vibration = { id: v.id, name: v.name, label: v.name, tone: v.tone, support: !!v.support };
          if (v.custom) {
            textInput.hidden = false; textInput.focus();
            state.vibration.label = textInput.value.trim() || "this feeling";
            ready(textInput.value.trim().length > 0);
          } else {
            textInput.hidden = true;
            showSupport(!!v.support, "If this feels like too much to carry alone, support is available.");
            answered();
          }
        });
        rail.appendChild(b);
      });
      wrap.appendChild(rail);
      textInput = el("input", "text-in");
      textInput.type = "text"; textInput.maxLength = 60; textInput.hidden = true;
      textInput.setAttribute("aria-label", "Describe your feeling");
      textInput.placeholder = "In a few words, how do you feel?";
      textInput.addEventListener("input", function () {
        var t = textInput.value.trim();
        if (state.vibration) state.vibration.label = t || "this feeling";
        ready(t.length > 0);
        if (t.length > 0) answered();
      });
      watchText(textInput);
      wrap.appendChild(textInput);
      ready(false);

    } else if (current.type === "choice") {
      var list = el("div", "opts"); list.setAttribute("role", "radiogroup");
      current.options.forEach(function (o) {
        var b = el("button", "opt", fill(o.label));
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
      if (current.optional) nextBtn.textContent = "Continue";

    } else {
      // statement or end
      ready(true);
    }

    nextBtn.textContent = current.type === "end" ? (current.cta || "Done") :
      current.type === "statement" ? (current.cta || "Continue") : "Next";
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
