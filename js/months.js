/* ---------------------------------------------------------------
   BIRTH DATE AND SIGNS: the visitor gives a month AND a day, and the
   exact sign is worked out from the date. Each sign has its element,
   key phrase, gifts and edges.
   Edit the words in SIGNS any time. The words below are a first draft
   for you to replace with your own list.
   --------------------------------------------------------------- */
(function () {
  var GOR = (window.GOR = window.GOR || {});

  GOR.signs = {
    Capricorn:   { element: "Earth", phrase: "I build what lasts.",
                   gifts: ["disciplined", "patient", "dependable"],
                   edges: ["hard on yourself", "overworking", "forgetting to rest"] },
    Aquarius:    { element: "Air", phrase: "I see what could be.",
                   gifts: ["original", "humane", "independent"],
                   edges: ["distant when hurt", "stubborn", "hard to reach"] },
    Pisces:      { element: "Water", phrase: "I feel the whole ocean.",
                   gifts: ["compassionate", "intuitive", "imaginative"],
                   edges: ["absorbing other people's feelings", "escaping", "loose boundaries"] },
    Aries:       { element: "Fire", phrase: "I begin.",
                   gifts: ["brave", "direct", "energising"],
                   edges: ["impatient", "quick to anger", "restless"] },
    Taurus:      { element: "Earth", phrase: "I stay with what is real.",
                   gifts: ["loyal", "steady", "sensual"],
                   edges: ["stubborn", "slow to change", "holding on too tightly"] },
    Gemini:      { element: "Air", phrase: "I wonder.",
                   gifts: ["curious", "quick", "sociable"],
                   edges: ["scattered", "restless", "starting more than you finish"] },
    Cancer:      { element: "Water", phrase: "I protect what I love.",
                   gifts: ["caring", "intuitive", "loyal"],
                   edges: ["moody", "clinging", "holding on to hurt"] },
    Leo:         { element: "Fire", phrase: "I shine, and I let others shine.",
                   gifts: ["warm", "generous", "confident"],
                   edges: ["needing applause", "pride", "taking things personally"] },
    Virgo:       { element: "Earth", phrase: "I tend to the details of love.",
                   gifts: ["helpful", "thoughtful", "practical"],
                   edges: ["over-critical", "worrying", "perfectionism"] },
    Libra:       { element: "Air", phrase: "I look for harmony.",
                   gifts: ["fair", "graceful", "diplomatic"],
                   edges: ["indecisive", "people-pleasing", "avoiding conflict"] },
    Scorpio:     { element: "Water", phrase: "I go to the depths.",
                   gifts: ["intense", "loyal", "perceptive"],
                   edges: ["jealousy", "secrecy", "holding grudges"] },
    Sagittarius: { element: "Fire", phrase: "I search for meaning.",
                   gifts: ["optimistic", "honest", "adventurous"],
                   edges: ["blunt", "restless", "promising too much"] }
  };

  // Month names and how many days each month can have (February allows the 29th).
  GOR.months = [
    { n: 1,  name: "January",   days: 31 }, { n: 2,  name: "February",  days: 29 },
    { n: 3,  name: "March",     days: 31 }, { n: 4,  name: "April",     days: 30 },
    { n: 5,  name: "May",       days: 31 }, { n: 6,  name: "June",      days: 30 },
    { n: 7,  name: "July",      days: 31 }, { n: 8,  name: "August",    days: 31 },
    { n: 9,  name: "September", days: 30 }, { n: 10, name: "October",   days: 31 },
    { n: 11, name: "November",  days: 30 }, { n: 12, name: "December",  days: 31 }
  ];

  // The date each sign begins (month, day), in order through the year.
  // January 1 to 19 belongs to Capricorn, and Capricorn begins again on December 22.
  var STARTS = [
    [1, 20, "Aquarius"], [2, 19, "Pisces"], [3, 21, "Aries"], [4, 20, "Taurus"],
    [5, 21, "Gemini"], [6, 21, "Cancer"], [7, 23, "Leo"], [8, 23, "Virgo"],
    [9, 23, "Libra"], [10, 23, "Scorpio"], [11, 22, "Sagittarius"], [12, 22, "Capricorn"]
  ];
  var ORDER = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];

  // Returns { sign, element, cusp, neighbour }.
  // cusp is true when the date sits on the first day of a sign, or the day before it,
  // because the exact change can move by a day from year to year.
  GOR.signForDate = function (month, day) {
    var sign = "Capricorn", cusp = false, neighbour = "";
    var i, s, idx;
    for (i = 0; i < STARTS.length; i++) {
      s = STARTS[i];
      if (month > s[0] || (month === s[0] && day >= s[1])) sign = s[2];
    }
    for (i = 0; i < STARTS.length; i++) {
      s = STARTS[i];
      if (month === s[0] && day === s[1]) { cusp = true; idx = ORDER.indexOf(s[2]); neighbour = ORDER[(idx + 11) % 12]; }
      if (month === s[0] && day === s[1] - 1) { cusp = true; idx = ORDER.indexOf(s[2]); neighbour = s[2]; }
    }
    return { sign: sign, element: GOR.signs[sign].element, cusp: cusp, neighbour: neighbour };
  };

  // Short version used by the page: just the sign's name for a month and day.
  GOR.signFor = function (month, day) { return GOR.signForDate(month, day).sign; };
})();
