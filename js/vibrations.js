/* ===============================================================
   THIS FILE = THE 23 VIBRATIONS in "How are you vibrating right now?"
   They appear as a sideways-scrolling row, from the lightest states to
   the heaviest. When someone taps one, a box opens below with its
   description. Number 23 ("Something else") lets them write their own.

   HOW TO EDIT
     words   = the feeling words shown on the card (keep them in an array)
     tag     = the short line under the words
     text    = the full description shown after the visitor taps it
               (one sentence, or several in square brackets)
     tone    = "light" (feels good), "heavy" (painful) or "neutral".
               This decides which words come next in the Beginner journey.
     support = true shows a gentle "support is available" line for that one.
   =============================================================== */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  GOR.vibrations = [
    { n: 1, id: "v01", tone: "light",
      words: ["Euphoric", "Elated", "Joyful", "Blissful", "Ecstatic", "Radiant"],
      tag: "Lightness, joy and expansion",
      text: "You feel alive in a way that makes the world seem brighter. Possibilities feel closer, connection comes more naturally, and you want to express what is moving through you." },

    { n: 2, id: "v02", tone: "light",
      words: ["Expectant", "Peaceful", "Inspired"],
      tag: "Quiet anticipation",
      text: "Something within you feels open to what might come. You may not know exactly what you are waiting for, but you have room to imagine, breathe, and welcome the next possibility without needing to force it." },

    { n: 3, id: "v03", tone: "light",
      words: ["Passionate", "Excited", "Anticipating"],
      tag: "Energy moving toward something",
      text: "Your attention keeps returning to something you want to experience, create, or become. You can almost feel the possibility before it arrives, and that feeling gives you energy to move." },

    { n: 4, id: "v04", tone: "light",
      words: ["Focused", "Clear", "Purposeful"],
      tag: "Direction and alignment",
      text: "Your mind feels gathered around what matters. Instead of being pulled in every direction, you can see the next step and give it your attention." },

    { n: 5, id: "v05", tone: "light",
      words: ["Believing", "Confident", "Knowing"],
      tag: "Inner certainty",
      text: "You feel able to trust your judgment and stand behind what you believe. You do not need everyone to understand your direction before you take it." },

    { n: 6, id: "v06", tone: "light",
      words: ["Hopeful", "Optimistic", "Trusting"],
      tag: "Possibility without a guarantee",
      text: "You can see that things are not perfect and still believe that something good may be possible. You have not received every answer, but uncertainty has not taken away your willingness to continue." },

    { n: 7, id: "v07", tone: "light",
      words: ["Content", "Happy", "Calm"],
      tag: "Enoughness and ease",
      text: "Nothing extraordinary needs to happen for you to feel okay. You can be where you are without urgently needing to fix, prove, or acquire something else." },

    { n: 8, id: "v08", tone: "neutral",
      words: ["Bored", "Complacent", "Indifferent"],
      tag: "The middle ground, when nothing feels particularly alive",
      text: "You are not necessarily upset, but you are not especially engaged either. Life continues, and you move through it, yet nothing seems to call for your full attention. You might be resting, understimulated, or quietly disconnected from what matters to you." },

    { n: 9, id: "v09", tone: "heavy",
      words: ["Frustrated", "Irritated", "Impatient"],
      tag: "Friction between desire and reality",
      text: "Something is not moving the way you expected. You may know what you want, but the delay, obstacle, or repeated interruption makes it harder to remain at ease." },

    { n: 10, id: "v10", tone: "heavy",
      words: ["Pessimistic", "Disappointed", "Skeptical"],
      tag: "Expectation meeting doubt",
      text: "Something has not lived up to what you hoped for, or experience has taught you to question what you are being offered. You begin to look for what might go wrong before allowing yourself to believe what might go right." },

    { n: 11, id: "v11", tone: "heavy",
      words: ["Discouraged", "Disengaged", "Disheartened"],
      tag: "When the willingness to keep trying begins to fade",
      text: "You may have tried, hoped, or shown up repeatedly without seeing the change you wanted. Gradually, the thing that once mattered begins to feel too far away to keep reaching for." },

    { n: 12, id: "v12", tone: "heavy",
      words: ["Worried", "Doubtful", "Unsure"],
      tag: "Uncertainty asking for reassurance",
      text: "Your mind keeps returning to the question of whether things will be okay. You may want to move forward, but part of you is still searching for enough information, reassurance, or certainty to feel ready." },

    { n: 13, id: "v13", tone: "heavy",
      words: ["Overwhelmed", "Confused", "Stressed"],
      tag: "More arriving than you can comfortably process",
      text: "Thoughts, responsibilities, feelings, or demands seem to arrive all at once. Even when you want to respond, it can be difficult to decide what deserves your attention first." },

    { n: 14, id: "v14", tone: "heavy",
      words: ["Blaming", "Avoidance", "Dismissive"],
      tag: "Moving away from uncomfortable responsibility or connection",
      text: "When something feels difficult to face, attention may turn toward who caused it, why it should not matter, or why the conversation can wait. Sometimes this protects you from discomfort; sometimes it prevents you from seeing the full picture." },

    { n: 15, id: "v15", tone: "heavy",
      words: ["Judgmental", "Elitist", "Egotistical"],
      tag: "The self positioned above others",
      text: "You may begin measuring people by how much they know, what they have, or how closely they match your standards. Being right or feeling superior can become more important than understanding another person's experience." },

    { n: 16, id: "v16", tone: "heavy",
      words: ["Defensive", "Justifying", "Threatened"],
      tag: "Protecting the self when something feels at stake",
      text: "A question, disagreement, or observation feels like a challenge to who you are. Before you have fully considered what is being said, you may find yourself explaining, defending, or proving that your position makes sense." },

    { n: 17, id: "v17", tone: "heavy",
      words: ["Resentful", "Bitter", "Aggrieved"],
      tag: "An unresolved hurt that keeps asking to be acknowledged",
      text: "Something happened that still does not feel settled. You may keep returning to what was unfair, what was taken from you, or what someone should have done differently. Even when the moment has passed, its meaning remains present." },

    { n: 18, id: "v18", tone: "heavy",
      words: ["Angry", "Jealous", "Spiteful"],
      tag: "Pain, comparison, or perceived injustice becoming charged",
      text: "Something feels unfair, threatened, or difficult to accept. Another person's success, attention, or actions may bring your own unmet desires or hurt into sharper focus. The feeling can become an urge to confront, compete, or retaliate." },

    { n: 19, id: "v19", tone: "heavy", support: true,
      words: ["Hateful", "Rage", "Vengeful"],
      tag: "Intense hostility seeking an outlet",
      text: "The hurt or anger feels so consuming that understanding may temporarily give way to wanting someone to suffer, pay, or feel what you have felt. The emotion may be real and powerful, but it does not have to dictate what you do next." },

    { n: 20, id: "v20", tone: "heavy", support: true,
      words: ["Guilty", "Insecure", "Regretful"],
      tag: "Looking inward through the weight of what happened",
      text: "You keep revisiting something you did, something you did not do, or something you wish had gone differently. You may question your worth when what you really need is to understand the action, its impact, and what can be repaired." },

    { n: 21, id: "v21", tone: "heavy", support: true,
      words: ["Fearful", "Helpless", "Anxious"],
      tag: "When safety or control feels uncertain",
      text: "Your attention may become fixed on what could go wrong and what you might not be able to handle. Even when the danger is not immediate, your body or mind may respond as though you need to prepare for it now." },

    { n: 22, id: "v22", tone: "heavy", support: true,
      words: ["Depressed", "Despair", "Shame"],
      tag: "When the weight of being feels difficult to carry",
      text: "The future may seem distant, the present may feel heavy, and even ordinary things may require more energy than you have. Shame can add another layer, making you feel that your struggle says something bad about who you are. But a painful state is not the whole of your identity." },

    // Number 23 lets the visitor write their own words (a text box opens).
    { n: 23, id: "v23", tone: "neutral", custom: true,
      words: ["Something else", "describe it in your own words"],
      tag: "Your experience doesn't have to fit a category.",
      text: [
        "Sometimes you feel several things at once. Sometimes the feeling has no name yet. And sometimes the words available to you do not accurately describe what is happening within you.",
        "You can pause here and write what you are experiencing in your own words, without needing to make it sound right or choose a predefined emotion."
      ] }
  ];
})();
