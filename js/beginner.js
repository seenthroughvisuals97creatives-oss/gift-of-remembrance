/* ===============================================================
   THIS FILE = EVERY WORD AND EVERY BRANCH OF THE BEGINNER LEVEL.
   Edit any sentence between the quote marks. The steps run in the
   order below, and "next" says which step comes after.

   {name}      = the visitor's name. It appears in double quotes, bold, in
                 their chosen colour, so it always stands out.
   {vibration} = the feeling they chose.

   Step types
     statement  : a calm message with a Continue button
                  (breath: true adds the slow breathing circle)
     vibrations : the sideways-scrolling list from js/vibrations.js
     choice     : buttons. An option's "goto" says which step comes next
     end        : the closing screen

   "note"     = the gentle warning shown BEFORE the Next button
   "remember" = shows the "happiness is free" line once they have answered
   "optional" = they can continue without answering
   "cta"      = the words on the main button

   THE FLOW
     here > alive > weight > direction > identify > vibrating >
     likeattracts > attention > bridge > (one of four answers) >
     love > positivity > force > shift > closing > end
   =============================================================== */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  GOR.journeys = GOR.journeys || {};

  GOR.journeys.beginner = {
    title: "Beginner",
    start: "here",
    length: 16,   // how many screens a typical visit has (this sets the progress bar)
    remember: "Remember: happiness is free.",
    steps: {

      /* ---------- 1. PRESENCE: breath, aliveness ---------- */

      here: {
        type: "statement",
        breath: true,
        title: "{name}, you are here.",
        body: [
          "Not yesterday. Not tomorrow. Here.",
          "Feel the breath moving in and out of you. Breathing happens in the present moment. It cannot happen at any other time."
        ],
        cta: "I'm here",
        next: "alive"
      },

      alive: {
        type: "statement",
        title: "Breathing is what makes everything else possible.",
        body: [
          "Without breathing, you could not have a hard day. You could not feel sad, or tired, or afraid. Every feeling you have ever had needed you to be alive first.",
          "An old saying puts it simply: a living dog is better than a dead lion.",
          "We are not here to push the heavy feelings away. We are here to remember what they stand on: {name}, alive, breathing, right now."
        ],
        next: "weight"
      },

      /* ---------- 2. THE SIMPLE LOGIC: why feeling good makes sense ---------- */

      weight: {
        type: "statement",
        title: "Picture a scale, {name}.",
        body: [
          "On one side, a feather. On the other, a heart. Love is the feather. It feels good, so it weighs nothing.",
          "Whatever does not feel good has weight, and carrying weight for a long time is what wears us down.",
          "{name}, would you hold waste in your body for five years? Of course not. So why keep holding a feeling that hurts?"
        ],
        next: "direction"
      },

      direction: {
        type: "statement",
        title: "You already move toward what feels better, {name}.",
        body: [
          "Think about your day. Hungry, you eat. Cold, you find warmth. Pressed for the toilet, you go. You do not argue with it. You simply move toward relief.",
          "Feelings work the same way. When you stay in a feeling that hurts, you grow uncomfortable with it after a while. That discomfort is not a flaw. It is your nature leaning back toward feeling good.",
          "So feeling good is not an extra, and it is not something you have to earn. It is the most natural thing about you."
        ],
        cta: "That makes sense",
        next: "identify"
      },

      identify: {
        type: "statement",
        title: "Your feelings are how you know you are alive.",
        body: [
          "Naming what you feel is not a test, and nothing here is wrong. Whatever is happening in you is valid.",
          "But look at who is feeling it. It is {name}. Not everyone, not someone else. You.",
          "So let's see what is moving through you right now."
        ],
        cta: "Show me",
        next: "vibrating"
      },

      /* ---------- 3. THE QUESTION ---------- */

      vibrating: {
        type: "vibrations",
        save: "vibration",
        title: "{name}, how are you vibrating right now?",
        body: ["Tap the one that is closest. You can read how each one feels before you decide."],
        hint: "Swipe sideways. They begin with the heaviest states and move toward the lightest, and every one is welcome here.",
        note: "Don't be ashamed to name what you feel and how you feel it. Naming it is how awareness begins.",
        remember: true,
        next: "likeattracts"
      },

      /* ---------- 4. WHY IT MATTERS: like attracts like, attention, choice ---------- */

      likeattracts: {
        type: "statement",
        title: "“Like attracts like.”",
        body: [
          "This is the principle behind this whole session. Birds of the same feather flock together for the same reason: like energy draws in a matching energy.",
          "Whatever you are vibrating, {name}, you tend to draw more of the same toward you. That is why it matters which feeling you give room to."
        ],
        cta: "I see it",
        next: "attention"
      },

      attention: {
        type: "statement",
        title: "Whatever we feed attention to only receives our power to expand.",
        body: [
          "Feed worry, and worry has more room. Feed gratitude, and gratitude has more room.",
          "But you can change what you expand, {name}. You change it by being intentional about what you feed your attention to.",
          "Breathing happens in the present moment. So does choosing."
        ],
        cta: "I'm with it",
        next: "bridge"
      },

      // THE BRIDGE: the yes / no question that splits the journey.
      bridge: {
        type: "choice",
        title: "{name}, do you honestly want to expand your vibration of {vibration}?",
        body: [
          "Remember: like attracts like. Whatever you give room to, more of its kind comes.",
          "So, honestly: is it something your heart truly desires to feel?"
        ],
        note: "There is no wrong answer. A feeling is never a failure.",
        remember: true,
        options: [
          { id: "yes", label: "Yes, I want more of this feeling",
            goto: function (st) { return st.vibration && st.vibration.tone === "light" ? "yes-light" : "yes-heavy"; } },
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
          "Just remember that a feeling draws more of its own kind when it is all we feed. Seeing it clearly is how you get to choose how much room it keeps."
        ],
        next: "love"
      },

      "no-path": {
        type: "statement",
        title: "Then you have already begun, {name}.",
        body: [
          "I can understand that what you're feeling is valid.",
          "Wanting something different is the first step toward choosing it. You do it by changing what you feed your attention to."
        ],
        next: "love"
      },

      "unsure-path": {
        type: "statement",
        title: "You don't have to decide right now, {name}.",
        body: [
          "Sometimes awareness begins simply by noticing what is here.",
          "When you are ready, you can choose what to feed your attention to."
        ],
        next: "love"
      },

      /* ---------- 5. REMEMBERING LOVE ---------- */

      // WORDING TO CONFIRM: your exact sentence about love and existence.
      love: {
        type: "statement",
        title: "{name}, you are love.",
        body: [
          "Whatever you are feeling right now does not cancel the fact that, at your core, the breath flowing through you is love.",
          "Love used itself so that all that can exist could exist. So nothing can ever be above love."
        ],
        next: "positivity"
      },

      positivity: {
        type: "statement",
        title: "Feeling good is not a luxury.",
        body: [
          "We need reminding of how much positive energy affects our well-being. Research links an optimistic outlook with lower distress and better coping, and The Power of Positive Thinking became a best seller because so many people needed that reminder.",
          "Positivity is not about any law or trick. It is simply the strongest place to stand.",
          "Breathing is positive. It is the simplest proof. The only thing we can truly be is ourselves, and being yourself feels good, because breathing feels good."
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

      /* ---------- 6. CHOOSING A NEW DIRECTION ---------- */

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
