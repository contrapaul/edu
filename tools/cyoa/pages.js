// ═══════════════════════════════════════════════════════════════════
//  Choose Your Own Adventure — story data.
//
//  This file is the whole book. Edit it by hand; no other file needs
//  to change when the story changes.
//
//  CYOA_META fields:
//    title      book title shown on the cover and running header.
//    subtitle   small line under the title on the cover.
//    start      page number the book opens to ("Begin" / "Read Again").
//    toolsUrl   where "Return to /tools" points on ending pages.
//
//  CYOA_PAGES is an object keyed by page number. Each page has:
//    paragraphs   array of strings. The engine flows them across the
//                 left and right book pages automatically.
//    choices      array of 1–3 { label, page } objects. `label` is the
//                 full sentence shown on the button ("To do thing 1,
//                 turn to page 2"), `page` is the number it jumps to.
//                 Omit entirely on ending pages.
//    ending       set true on final pages. The engine then shows
//                 "Read Again" and "Return to /tools" automatically —
//                 do not write those as choices.
//    audio        OPTIONAL override for the narration file. By default
//                 page N plays audio/page-N.mp3; set this only if a
//                 page should use a differently named recording.
//
//  Narration recordings: drop MP3s into the audio/ folder named
//  page-1.mp3, page-2.mp3, … matching the page numbers below.
//  Pages with no recording yet show a quiet "no recording" note when
//  narration is on. See audio/README.md.
// ═══════════════════════════════════════════════════════════════════

const CYOA_META = {
  title: "The Thing That Happened",
  subtitle: "A placeholder adventure for testing — every page is a stub.",
  start: 1,
  toolsUrl: "https://edu.contrapaul.com/tools",
};

const CYOA_PAGES = {

  1: {
    paragraphs: [
      "You are on a perfectly normal walk when a thing happens. Somehow, you survive it. You're saved… for now.",
      "But oh no! A NEW thing happens, and it's coming right at you. Choose quickly!",
    ],
    choices: [
      { label: "To do thing 1, turn to page 2", page: 2 },
      { label: "Turn to page 3 to do thing 2", page: 3 },
    ],
  },

  2: {
    paragraphs: [
      "Doing thing 1 works! The new thing is thoroughly confused, and you slip away. Saved… for now.",
      "But oh no! An unexpected thing appears and blocks your path!",
    ],
    choices: [
      { label: "To sneak around the unexpected thing, turn to page 4", page: 4 },
      { label: "Turn to page 5 to charge straight past it", page: 5 },
    ],
  },

  3: {
    paragraphs: [
      "Thing 2 was risky, but it pays off. The new thing gives up and wanders away. Saved… for now.",
      "But oh no! The ground does a thing! You're sliding toward two possible handholds.",
    ],
    choices: [
      { label: "Grab the left thing — turn to page 5", page: 5 },
      { label: "Turn to page 6 to grab the right thing", page: 6 },
    ],
  },

  4: {
    paragraphs: [
      "Your sneaking is legendary. The unexpected thing never even notices you. Saved… for now.",
      "But oh no! THREE things happen at once, and there's only time to deal with one of them!",
    ],
    choices: [
      { label: "Deal with the first thing — turn to page 7", page: 7 },
      { label: "Turn to page 8 to deal with the second thing", page: 8 },
      { label: "The third thing looks easiest — turn to page 9", page: 9 },
    ],
  },

  5: {
    paragraphs: [
      "Whichever way you got here, it worked. The thing behind you is gone. Saved… for now.",
      "But oh no! Somewhere in the distance, a very large thing begins to rumble!",
    ],
    choices: [
      { label: "To hide from the rumbling thing, turn to page 8", page: 8 },
      { label: "Turn to page 10 to face the rumbling thing", page: 10 },
    ],
  },

  6: {
    paragraphs: [
      "The right thing holds your weight, and you climb to safety. Saved… for now.",
      "But oh no! A mysterious thing appears and offers you a deal!",
    ],
    choices: [
      { label: "Accept the mysterious deal — turn to page 10", page: 10 },
      { label: "Turn to page 11 to politely refuse", page: 11 },
    ],
  },

  7: {
    paragraphs: [
      "You deal with the first thing brilliantly. The other two things wander off, embarrassed for having tried.",
      "The dust settles. There is only one way forward now.",
    ],
    choices: [
      { label: "Turn to page 12 to walk through the final thing", page: 12 },
    ],
  },

  8: {
    paragraphs: [
      "The second thing (or was it the rumbling thing?) turns out to be mostly harmless. Saved… for now.",
      "But oh no! A door-shaped thing rises out of the ground and presents two options!",
    ],
    choices: [
      { label: "Take the bright doorway — turn to page 12", page: 12 },
      { label: "Turn to page 13 to take the shadowy doorway", page: 13 },
    ],
  },

  9: {
    paragraphs: [
      "The third thing was a trap all along! You wriggle free at the very last second. Saved… for now.",
      "But oh no! Two paths ahead, and an ominous thing hangs over each of them!",
    ],
    choices: [
      { label: "To brave the left ominous thing, turn to page 13", page: 13 },
      { label: "Turn to page 14 to brave the right ominous thing", page: 14 },
    ],
  },

  10: {
    paragraphs: [
      "The enormous thing rumbles right past without noticing you. Saved… for now.",
      "But oh no! One final thing rises up between you and the exit!",
    ],
    choices: [
      { label: "Challenge the final thing — turn to page 15", page: 15 },
      { label: "Turn to page 13 to look for a way around it", page: 13 },
    ],
  },

  11: {
    paragraphs: [
      "Refusing the mysterious thing felt right. It nods respectfully and vanishes. Saved… for now.",
      "But oh no! The ground-thing from earlier is back, and it brought a friend!",
    ],
    choices: [
      { label: "Stand your ground — turn to page 15", page: 15 },
      { label: "Turn to page 14 to make a run for it", page: 14 },
    ],
  },

  12: {
    paragraphs: [
      "You walk through the final thing and out into the sunshine.",
      "Every thing is resolved. You did all the right things, in all the right order.",
    ],
    ending: true,
  },

  13: {
    paragraphs: [
      "Oh no. This thing was too much thing for any one hero.",
      "As everything goes dark, you vow to choose differently next time.",
    ],
    ending: true,
  },

  14: {
    paragraphs: [
      "The ominous thing does exactly what ominous things do.",
      "It's over. At least it was quick.",
    ],
    ending: true,
  },

  15: {
    paragraphs: [
      "With one last brave thing, you defeat the final thing once and for all.",
      "The land is saved from things… for now.",
    ],
    ending: true,
  },

};
