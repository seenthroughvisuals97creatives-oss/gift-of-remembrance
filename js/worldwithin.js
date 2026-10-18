/* ===============================================================
   THIS FILE = THE WORLD WITHIN POP-UP (the one that opens when someone
   taps the World Within tile near the bottom of the page).

   TO CHANGE THE WORDS: edit the lines inside "paragraphs" below.
   Each line between quote marks is one paragraph in the pop-up.
   TO CHANGE THE BUTTON: edit "cta" (the words on the button).
   TO CHANGE WHERE THE BUTTON GOES: open js/links.js and fill in "worldWithin".
   TO SHOW YOUR FLYER ON THE TILE: put the picture in the assets folder and
   set image: "assets/world-within.jpg".
   =============================================================== */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  GOR.cards = GOR.cards || {};
  GOR.cards.worldWithin = {
    title: "World Within",
    paragraphs: [
      "Write a short invitation to World Within here, in your own words."
    ],
    cta: "Enter World Within",
    linkKey: "worldWithin",
    image: ""
  };
})();
