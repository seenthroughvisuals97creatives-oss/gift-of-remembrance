/* ===============================================================
   THIS FILE = THE STARSEED POP-UP (the one that opens when someone
   taps the Starseed tile near the bottom of the page).

   TO CHANGE THE WORDS: edit the lines inside "paragraphs" below.
   Each line between quote marks is one paragraph in the pop-up.
   The order is: what a star is, what a seed is, then what a Starseed is.

   TO CHANGE THE BUTTON: edit "cta" (the words on the button).
   TO CHANGE WHERE THE BUTTON GOES: open js/links.js and fill in "starseed".
   (World Within has its own file: js/worldwithin.js)
   =============================================================== */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  GOR.cards = GOR.cards || {};
  GOR.cards.starseed = {
    title: "Starseed",
    paragraphs: [
      "A star is a simple drawing of a shining light, a small mark that points to something far greater: light that shines on its own.",
      "A seed always grows after its own kind. A mango seed grows into a mango tree. An apple seed grows into an apple tree.",
      "A Starseed is a love seed. It grows after its own kind, so it grows into love, and love is what feels good. That is why a Starseed is naturally positive."
    ],
    cta: "Enter Starseed",
    linkKey: "starseed",
    image: ""
  };
})();
