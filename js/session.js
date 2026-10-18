/* ---------------------------------------------------------------
   SESSION: remembers the visitor's name, month and colour while the
   browser tab stays open. Nothing is sent anywhere, and it is gone
   when the tab is closed.
   --------------------------------------------------------------- */
(function () {
  var GOR = (window.GOR = window.GOR || {});
  var KEY = "gor-session";
  var HEX = /^#[0-9a-f]{6}$/i;

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
    set: function (d) {
      this.data = d;
      try { sessionStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
    },
    load: function () {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (!raw) return null;
        var d = JSON.parse(raw);
        if (d && typeof d.name === "string" && d.name.trim() && HEX.test(d.color) && d.month >= 1 && d.month <= 12) {
          this.data = d;
          return d;
        }
      } catch (e) {}
      return null;
    },
    isValid: function (d) {
      return !!d && typeof d.name === "string" && d.name.trim().length > 0 && d.name.length <= 30 &&
        HEX.test(d.color) && d.month >= 1 && d.month <= 12;
    }
  };
})();
