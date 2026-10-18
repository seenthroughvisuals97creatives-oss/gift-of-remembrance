/* ---------------------------------------------------------------
   SESSION: holds the visitor's name, birth date and colour only while
   the page is open. Nothing is saved or sent anywhere. Refreshing the
   page starts again from the intro, with a clean slate.
   --------------------------------------------------------------- */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  var HEX = /^#[0-9a-f]{6}$/i;

  // Clear anything an earlier version may have stored in this browser.
  try { sessionStorage.removeItem("gor-session"); } catch (e) {}

  function luminance(hex) {
    var c = [1, 3, 5].map(function (i) {
      var v = parseInt(hex.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  GOR.applyColor = function (hex) {
    if (!HEX.test(hex)) return;
    var root = document.documentElement.style;
    root.setProperty("--visitor-color", hex);
    root.setProperty("--visitor-rgb", [1, 3, 5].map(function (i) { return parseInt(hex.substr(i, 2), 16); }).join(", "));
    // Dark text on pale colours, white text on deep colours, so buttons stay readable.
    root.setProperty("--on-visitor", luminance(hex) > 0.5 ? "#1c2230" : "#ffffff");
  };

  GOR.session = {
    data: null,
    set: function (d) { this.data = d; },
    // True only when the name, colour and a real calendar date are all present.
    isValid: function (d) {
      if (!d || typeof d.name !== "string" || !d.name.trim() || d.name.length > 30) return false;
      if (!HEX.test(d.color)) return false;
      if (!(d.month >= 1 && d.month <= 12)) return false;
      var m = GOR.months && GOR.months[d.month - 1];
      return !!m && d.day >= 1 && d.day <= m.days;
    }
  };
})();
