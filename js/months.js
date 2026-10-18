/* ---------------------------------------------------------------
   MONTHS: the 12 birth months, the sign that STARTS each month,
   and the sign that takes over later in the month.
   Edit the words in SIGNS (key phrase, gifts, edges) any time.
   The words below are a first draft for you to replace with your own.
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

  // First sign = the sign that starts the month. Second = the sign that begins later in the month.
  GOR.months = [
    { n: 1,  name: "January",   first: "Capricorn",   second: "Aquarius" },
    { n: 2,  name: "February",  first: "Aquarius",    second: "Pisces" },
    { n: 3,  name: "March",     first: "Pisces",      second: "Aries" },
    { n: 4,  name: "April",     first: "Aries",       second: "Taurus" },
    { n: 5,  name: "May",       first: "Taurus",      second: "Gemini" },
    { n: 6,  name: "June",      first: "Gemini",      second: "Cancer" },
    { n: 7,  name: "July",      first: "Cancer",      second: "Leo" },
    { n: 8,  name: "August",    first: "Leo",         second: "Virgo" },
    { n: 9,  name: "September", first: "Virgo",       second: "Libra" },
    { n: 10, name: "October",   first: "Libra",       second: "Scorpio" },
    { n: 11, name: "November",  first: "Scorpio",     second: "Sagittarius" },
    { n: 12, name: "December",  first: "Sagittarius", second: "Capricorn" }
  ];
})();
