/* ---------------------------------------------------------------
   VIBRATIONS: the options for "How are you vibrating right now?"
   name    = what the visitor sees first
   feel    = how it feels (shown after the dash)
   element = the element that feels this vibration most (a first draft, edit freely)
   tone    = "light" (feels good), "heavy" (painful), or "neutral". This decides which
             words come next in the Beginner journey.
   support = true shows a gentle "support is available" line for that feeling.
   --------------------------------------------------------------- */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  GOR.vibrations = [
    { id: "love",     name: "Love & connection",    feel: "loved, connected, appreciated", element: "Water", tone: "light" },
    { id: "joy",      name: "Joy & excitement",     feel: "happy, playful, enthusiastic",  element: "Fire",  tone: "light" },
    { id: "peace",    name: "Peace & stillness",    feel: "calm, grounded, content",       element: "Earth", tone: "light" },
    { id: "hope",     name: "Hope & inspiration",   feel: "lifted, curious, open",         element: "Air",   tone: "light" },
    { id: "numb",     name: "Neutral or numb",      feel: "flat, switched off, blank",     element: "Earth", tone: "neutral" },
    { id: "unsure",   name: "Uncertainty",          feel: "confused, hesitant, unsettled", element: "Air",   tone: "heavy" },
    { id: "sad",      name: "Sadness & grief",      feel: "heavy, disappointed, hurting",  element: "Water", tone: "heavy", support: true },
    { id: "fear",     name: "Fear & worry",         feel: "anxious, tense, on edge",       element: "Air",   tone: "heavy" },
    { id: "anger",    name: "Anger & frustration",  feel: "irritated, upset, fed up",      element: "Fire",  tone: "heavy" },
    { id: "envy",     name: "Envy & comparison",    feel: "wanting what someone else has", element: "Fire",  tone: "heavy" },
    { id: "tired",    name: "Exhaustion & overwhelm", feel: "drained, stretched, too much", element: "Earth", tone: "heavy", support: true },
    { id: "other",    name: "Something else",       feel: "my feeling isn't listed here",  element: "",      tone: "neutral", custom: true }
  ];
})();
