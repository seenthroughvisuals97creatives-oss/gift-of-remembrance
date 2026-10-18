/* ---------------------------------------------------------------
   INTRO: the title comes together (CSS), the subtitle types itself,
   it holds for a breath, then the whole screen fades away.
   Edit the subtitle here.
   --------------------------------------------------------------- */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  var SUBTITLE = "A free online session for well-being. A moment to pause, reflect, and reconnect.";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  GOR.intro = {
    play: function () {
      return new Promise(function (resolve) {
        var section = document.getElementById("intro");
        var typed = document.getElementById("typed");
        var skip = document.getElementById("skip");
        var timers = [], done = false;

        function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
        function finish() {
          if (done) return;
          done = true;
          timers.forEach(clearTimeout);
          section.classList.add("leaving");
          setTimeout(resolve, reduce ? 0 : 900);
        }

        skip.addEventListener("click", function () { typed.textContent = SUBTITLE; finish(); });

        if (reduce) {
          typed.textContent = SUBTITLE;
          later(finish, 1800);
          return;
        }

        // Start typing once the two halves of the title have met.
        later(function () {
          var i = 0;
          (function type() {
            if (done) return;
            typed.textContent = SUBTITLE.slice(0, ++i);
            if (i < SUBTITLE.length) { later(type, 42); }
            else { later(finish, 2800); } // let it breathe
          })();
        }, 2400);
      });
    }
  };
})();
