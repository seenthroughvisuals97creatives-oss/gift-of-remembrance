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


/* ===============================================================
   THIS FILE = THE WORLD WITHIN POP-UP
   =============================================================== */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  GOR.cards = GOR.cards || {};

  GOR.cards.worldWithin = {
    title: "World Within",
    paragraphs: [
      "Your power was never truly outside you. Beyond societal expectations, external authority, and limiting beliefs, there is a world within you waiting to be seen, understood, and expressed. Reconnect with yourself, reclaim your voice, and discover the beauty of being understood without having to become someone else."
    ],
    cta: "Enter World Within",
    linkKey: "world-within",
    image: ""
  };
})();

