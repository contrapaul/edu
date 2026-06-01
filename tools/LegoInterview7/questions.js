/* ============================================================
   LEGO Interview Question Bank
   MYP Grade 7 — Lego Engineers Project
   Students use these questions when interviewing peers and
   teachers about their Lego Technic machines — automatic or
   minimal-input mechanisms demonstrating mechanical systems.

   Tags: function | build_quality | stability | operation | efficiency | design
============================================================ */

var LEGO_QUESTIONS = [

  /* ── Function — what the machine does and how well ──────── */
  {
    id: 1,
    text: "Walk me through what your machine does from start to finish — what happens when it runs?",
    tags: ["function"]
  },
  {
    id: 2,
    text: "What mechanical systems or mechanisms did you integrate into this machine, and how do they work together?",
    tags: ["function"]
  },
  {
    id: 3,
    text: "How closely does the machine's final behaviour match what you originally intended it to do?",
    tags: ["function"]
  },
  {
    id: 4,
    text: "Which part of the machine's function are you most satisfied with, and what makes it work so well?",
    tags: ["function"]
  },
  {
    id: 5,
    text: "If you could add one additional function or movement to your machine, what would it be and why?",
    tags: ["function"]
  },

  /* ── Build Quality — connections, parts, construction ───── */
  {
    id: 6,
    text: "Are there any areas of the build that feel weaker than you'd like — and what do you think caused that?",
    tags: ["build_quality"]
  },
  {
    id: 7,
    text: "Which connection or joint in your machine do you think is the strongest, and how did you achieve that?",
    tags: ["build_quality"]
  },
  {
    id: 8,
    text: "If a part came loose or broke during testing, how did you decide to fix or reinforce it?",
    tags: ["build_quality"]
  },
  {
    id: 9,
    text: "How did you choose between different Technic parts — like beams, pins, or axles — when you had options?",
    tags: ["build_quality"]
  },
  {
    id: 10,
    text: "What would you build differently if you were starting the machine over with the same parts?",
    tags: ["build_quality"]
  },

  /* ── Stability — balance, movement, staying in place ────── */
  {
    id: 11,
    text: "How does your machine stay stable while it operates — does it shift, tip, or vibrate, and what have you done about that?",
    tags: ["stability"]
  },
  {
    id: 12,
    text: "Where is the heaviest part of your machine, and how does that affect the way it sits or moves?",
    tags: ["stability"]
  },
  {
    id: 13,
    text: "At what point during operation does your machine feel least stable, and why do you think that happens?",
    tags: ["stability"]
  },
  {
    id: 14,
    text: "What changes did you make during building to improve stability, and how did you know they worked?",
    tags: ["stability"]
  },
  {
    id: 15,
    text: "If you needed to make your machine more stable without adding more parts, what approach would you try?",
    tags: ["stability"]
  },

  /* ── Operation — how it runs, inputs needed, reliability ── */
  {
    id: 16,
    text: "How much human input does your machine need once it starts — what triggers it, and what keeps it going?",
    tags: ["operation"]
  },
  {
    id: 17,
    text: "How consistently does your machine perform — does it behave the same way every time, or does it vary?",
    tags: ["operation"]
  },
  {
    id: 18,
    text: "What adjustments did you have to make to get the machine running reliably?",
    tags: ["operation"]
  },
  {
    id: 19,
    text: "Is there a step in the operation that still requires more human help than you'd want — and how might you reduce that?",
    tags: ["operation"]
  },
  {
    id: 20,
    text: "How does the speed of your machine's movement affect how well it works — would faster or slower be better?",
    tags: ["operation"]
  },

  /* ── Efficiency — energy transfer, gear ratios, waste ───── */
  {
    id: 21,
    text: "Where do you think the most energy or movement is lost in your machine, and what causes it?",
    tags: ["efficiency"]
  },
  {
    id: 22,
    text: "How did you use gears, levers, or linkages to change the speed or force in your machine — and what tradeoffs did you notice?",
    tags: ["efficiency"]
  },
  {
    id: 23,
    text: "Is there friction anywhere in your machine that slows it down or makes it harder to run — and how did you try to reduce it?",
    tags: ["efficiency"]
  },
  {
    id: 24,
    text: "What mechanical advantage does your machine use, and how does that help it do its job?",
    tags: ["efficiency"]
  },
  {
    id: 25,
    text: "If you could redesign one part of the machine to transfer energy more efficiently, what would you change and how?",
    tags: ["efficiency"]
  },

  /* ── Design — appearance, choices, iteration ─────────────── */
  {
    id: 26,
    text: "What's one design decision you made that you're proud of — and what led you to make it that way?",
    tags: ["design"]
  },
  {
    id: 27,
    text: "How did your design change from your original idea to what you actually built — what caused those changes?",
    tags: ["design"]
  },
  {
    id: 28,
    text: "Is there a part of your machine where the design was driven by how it looks rather than how it works — and do you think that was the right call?",
    tags: ["design"]
  },
  {
    id: 29,
    text: "What was the hardest design problem you had to solve, and how did you work through it?",
    tags: ["design"]
  },
  {
    id: 30,
    text: "Looking at your finished machine, what does it show about the mechanical systems you learned — what do you want someone to notice?",
    tags: ["design"]
  }

];
