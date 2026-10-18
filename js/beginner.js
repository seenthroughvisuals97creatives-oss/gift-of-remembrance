/* ---------------------------------------------------------------
   BEGINNER JOURNEY: all the words and the branching for this level.
   Edit sentences freely. Use {name} for the visitor's name and
   {vibration} for the feeling they chose.

   Step types:
     vibrations : the sideways-scrolling list from vibrations.js
     choice     : buttons. Each option can have a "goto" (which step comes next)
     statement  : a calm message with a Continue button
     end        : the closing screen

   "note"     = the gentle warning shown BEFORE the Next button
   "remember" = shows the "happiness is free" line once they have answered
   "optional" = they can continue without answering
   --------------------------------------------------------------- */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  GOR.journeys = GOR.journeys || {};

  GOR.journeys.beginner = {
    title: "Beginner",
    start: "vibrating",
    length: 10,
    remember: "Remember: happiness is free.",
    steps: {

      vibrating: {
        type: "vibrations",
        save: "vibration",
        title: "{name}, how are you vibrating right now?",
        body: ["There is no right or wrong answer. Pick the one that is closest."],
        note: "Don't be ashamed to name what you feel and how you feel it. Naming it is how awareness begins.",
        remember: true,
        next: "attention"
      },

      attention: {
        type: "statement",
        title: "Whatever we feed attention to receives our power to expand.",
        body: ["Take a breath, {name}. You are here, and this moment is the only place breathing happens."],
        cta: "I'm with it",
        next: "bridge"
      },

      // THE BRIDGE: the yes / no question that splits the journey.
      bridge: {
        type: "choice",
        title: "{name}, do you honestly want to expand your vibration of {vibration}?",
        body: ["Is it something your heart truly desires to feel?"],
        note: "There is no wrong answer. A feeling is never a failure.",
        remember: true,
        options: [
          { id: "yes", label: "Yes, I want more of this feeling",
            goto: function (st) { return st.vibration && st.vibration.tone === "heavy" ? "yes-heavy" : "yes-light"; } },
          { id: "no", label: "No, I'd like to feel something different", goto: "no-path" },
          { id: "maybe", label: "I'm not sure yet", goto: "unsure-path" }
        ]
      },

      "yes-light": {
        type: "statement",
        title: "Then give yourself full permission to enjoy it, {name}.",
        body: ["What would it mean to make room for even more of this feeling?"],
        next: "love"
      },

      "yes-heavy": {
        type: "statement",
        title: "I can understand that what you're feeling is valid, {name}.",
        body: [
          "You don't have to pretend otherwise.",
          "Now that you can see it clearly, you get to choose how much room it keeps. Seeing a feeling clearly is already a gift."
        ],
        next: "love"
      },

      "no-path": {
        type: "statement",
        title: "Then you have already begun, {name}.",
        body: [
          "I can understand that what you're feeling is valid.",
          "Wanting something different is the first step toward choosing it."
        ],
        next: "love"
      },

      "unsure-path": {
        type: "statement",
        title: "You don't have to decide right now, {name}.",
        body: ["Sometimes awareness begins simply by noticing what is here."],
        next: "love"
      },

      // WORDING TO CONFIRM: your exact sentence about love and existence.
      love: {
        type: "statement",
        title: "{name}, you are love.",
        body: [
          "Love used itself so that all that can exist could exist. So nothing can ever be above love.",
          "Whatever you are feeling right now does not cancel the love you are."
        ],
        next: "positivity"
      },

      positivity: {
        type: "statement",
        title: "Feeling good is not a luxury.",
        body: [
          "Someone wrote a book called The Power of Positive Thinking, and it became a best seller. People need reminding of how much positive energy matters.",
          "Many people call this the law of attraction. Here, we simply notice where your attention rests."
        ],
        next: "force"
      },

      force: {
        type: "statement",
        title: "But you can't force it, {name}.",
        body: [
          "It only becomes true when it feels good. Feeling good out of obligation is not feeling good.",
          "So do not push a feeling away. Just reach for the next thought that feels even a little lighter."
        ],
        note: "It has to feel good to feel good.",
        next: "shift"
      },

      shift: {
        type: "choice",
        optional: true,
        allowText: true,
        textPlaceholder: "One small thing you can notice, remember or do right now (optional)",
        title: "What would you like to give your attention to now?",
        note: "You can skip this and continue whenever you are ready.",
        remember: true,
        options: [
          { id: "appreciate", label: "Something I appreciate" },
          { id: "someone", label: "Someone I love" },
          { id: "hope", label: "Something that gives me hope" },
          { id: "beauty", label: "Something beautiful in this moment" },
          { id: "influence", label: "What I can influence or change" },
          { id: "rest", label: "Rest, gentleness, space for myself" }
        ],
        next: "closing"
      },

      closing: {
        type: "choice",
        title: "And now, {name}, how are you vibrating?",
        body: ["Notice whether anything has changed. Feeling calmer or more aware counts too."],
        note: "You do not have to feel happier for this to have mattered.",
        remember: true,
        options: [
          { id: "different", label: "I feel different" },
          { id: "same", label: "I feel much the same" },
          { id: "aware", label: "I feel more aware of what I'm experiencing" },
          { id: "unsure", label: "I'm not sure how I feel yet" }
        ],
        next: "end"
      },

      end: {
        type: "end",
        title: "Thank you for giving yourself this moment, {name}.",
        body: [
          "You don't have to carry every thought forward, and you don't have to force yourself to feel a certain way. Take what feels helpful with you.",
          "Happiness is free."
        ],
        cta: "Return to My Space"
      }
    }
  };
})();
