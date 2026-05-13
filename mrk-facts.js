/* ============================================================
   mrk-facts.js — Mr. K Facts database
   Shared by the landing page (index.html) and the about page
   generator (about.html).

   Each entry: { id: Number, text: String, tags: [String] }

   Tags (for future filtering):
     "classroom"  — things that happen in the room
     "design"     — design thinking / aesthetics
     "tech"       — making, coding, hardware
     "ib"         — IB-specific teacher experience
     "personal"   — general personality / habits

   To add a fact: copy the last entry, increment id by 1,
   write the text, assign tags, add a trailing comma.
   ============================================================ */

var MRK_FACTS = [

  /* ── Classroom ────────────────────────────────────────── */
  {
    id: 1,
    text: "Mr. K has never lost at table tennis — though some claim the table was slightly tilted.",
    tags: ["classroom", "personal"]
  },
  {
    id: 2,
    text: "Mr. K's classroom has more unfinished prototypes than chairs.",
    tags: ["classroom", "design"]
  },
  {
    id: 3,
    text: "Mr. K is technically undefeated at Kahoot if you don't count that one time.",
    tags: ["classroom", "ib"]
  },
  {
    id: 4,
    text: "Mr. K once stayed until 9pm helping a student finish their IA, then came back the next morning still enthusiastic.",
    tags: ["classroom", "ib"]
  },
  {
    id: 5,
    text: "Mr. K has explained the Design Cycle enough times that he occasionally does it in his sleep.",
    tags: ["classroom", "ib", "design"]
  },
  {
    id: 6,
    text: "Mr. K's lesson plans are meticulously organised. His desk is not.",
    tags: ["classroom", "personal"]
  },
  {
    id: 7,
    text: "Mr. K genuinely gets excited about materials science at 8am, which is either inspiring or concerning.",
    tags: ["classroom", "design"]
  },
  {
    id: 8,
    text: "Mr. K grades design folios on a rubric he wrote himself, then spends hours second-guessing the rubric.",
    tags: ["classroom", "ib"]
  },
  {
    id: 9,
    text: "Mr. K's students have collectively produced more 3D-printed objects than some small countries.",
    tags: ["classroom", "tech"]
  },

  /* ── Design ───────────────────────────────────────────── */
  {
    id: 10,
    text: "Mr. K can identify a typeface within three seconds — he timed himself.",
    tags: ["design", "personal"]
  },
  {
    id: 11,
    text: "Mr. K once spent three hours choosing the right font for a worksheet, then used Arial anyway.",
    tags: ["design", "personal"]
  },
  {
    id: 12,
    text: "Mr. K's all-time favourite design is whichever one he hasn't built yet.",
    tags: ["design", "personal"]
  },
  {
    id: 13,
    text: "Mr. K's definition of 'a quick prototype' is different from everyone else's definition of 'a quick prototype'.",
    tags: ["design", "tech"]
  },
  {
    id: 14,
    text: "Mr. K once got into a 20-minute discussion about kerning that no one else fully understood but everyone enjoyed.",
    tags: ["design", "personal"]
  },
  {
    id: 15,
    text: "Mr. K considers the original Xbox dashboard a masterpiece of interface design. He is correct.",
    tags: ["design", "personal", "tech"]
  },

  /* ── Tech / Making ────────────────────────────────────── */
  {
    id: 16,
    text: "Mr. K once fixed a 3D printer with a bent paperclip and genuine optimism.",
    tags: ["tech", "classroom"]
  },
  {
    id: 17,
    text: "Mr. K has a drawer labelled 'failed experiments' that is very, very full.",
    tags: ["tech", "personal"]
  },
  {
    id: 18,
    text: "Mr. K claims he only needs one more tool to complete the workshop. He has said this for four years.",
    tags: ["tech", "personal"]
  },
  {
    id: 19,
    text: "Mr. K built a macropad. Then built a second one to fix the problems with the first. The second one also has problems.",
    tags: ["tech", "personal"]
  },
  {
    id: 20,
    text: "Mr. K owns at least three versions of the same screwdriver because he 'couldn't find the first one'.",
    tags: ["tech", "personal"]
  },
  {
    id: 21,
    text: "Mr. K once built an entire curriculum resource on a long-haul flight. He called it productive. Others call it concerning.",
    tags: ["tech", "ib", "personal"]
  },
  {
    id: 22,
    text: "Mr. K has a collection of broken electronics he describes as 'teaching materials'. They are technically both things.",
    tags: ["tech", "classroom"]
  },

  /* ── IB / Teaching ────────────────────────────────────── */
  {
    id: 23,
    text: "Mr. K knows the IB Design syllabus well enough to recite whole sections from memory, but still checks the guide anyway.",
    tags: ["ib", "personal"]
  },
  {
    id: 24,
    text: "Mr. K has corrected the IB's own wording at least once. He has not yet told them.",
    tags: ["ib", "personal"]
  },
  {
    id: 25,
    text: "Mr. K is the only person in his department who can explain both the Design Cycle and the CSS box model in the same breath.",
    tags: ["ib", "tech", "personal"]
  },

  /* ── Personal ─────────────────────────────────────────── */
  {
    id: 26,
    text: "Mr. K's desk is a fully functional example of creative chaos theory.",
    tags: ["personal"]
  },
  {
    id: 27,
    text: "Mr. K's laptop has so many browser tabs open that the tab icons are no longer visible. He knows exactly where everything is.",
    tags: ["personal", "tech"]
  },
  {
    id: 28,
    text: "Mr. K once drank four coffees and redesigned a unit plan from scratch. The new version was better. The old version was also good.",
    tags: ["personal", "ib"]
  },
  {
    id: 29,
    text: "Mr. K will spend an unreasonable amount of time making a tool for a task that would have taken ten minutes by hand.",
    tags: ["personal", "tech"]
  },
  {
    id: 30,
    text: "Mr. K believes Nightmare mode was a mistake. He also believes it was brilliant. Both things are true.",
    tags: ["personal", "design"]
  }

];
