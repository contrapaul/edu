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
//  page-1.mp3 … page-30.mp3, matching the page numbers below.
//  Pages with no recording yet show a quiet "no recording" note when
//  narration is on. See audio/README.md.
//
//  Page length: the book is a fixed size and does not resize as the
//  reader turns pages (see --page-height in cyoa.css). Keep each page
//  to roughly two short paragraphs and at most three choices, or the
//  longest page will overflow its leaf.
// ═══════════════════════════════════════════════════════════════════

const CYOA_META = {
  title: "Twin Paths of Aethelgard",
  subtitle:
    "Kaelen and Lyra live in the quiet village of Oakhaven at the edge of Aethelgard, " +
    "a realm torn between the light-dominated kingdoms of the north and the shadow-woven " +
    "lands of the south. Kaelen is sixteen, apprenticing to Master Thorne, a reclusive " +
    "wizard who has withdrawn from the world after a past tragedy. Lyra is seventeen, " +
    "training in martial arts under a retired knight, her spear practice becoming " +
    "legendary among the village guards.",
  start: 1,
  toolsUrl: "https://edu.contrapaul.com/tools",
};

const CYOA_PAGES = {

  1: {
    paragraphs: [
      "Dawn breaks over Oakhaven as Kaelen struggles with his magic for the tenth time this week. His wand shakes, sparks fly everywhere, and Master Thorne sighs from across the room. “Control is not about force,” the old wizard says gently. “It’s about understanding what flows through you.”",
      "Meanwhile, Lyra practices her spear drill in the courtyard below—her strikes precise, powerful, devastating. Her father watches with pride as she parries his training sword and sends it flying into the trees.",
    ],
    choices: [
      { label: "To sit with Master Thorne for the lesson, turn to page 2", page: 2 },
      { label: "Turn to page 14 to leave the wand behind and train at Lyra’s side", page: 14 },
      { label: "To let the practice go and watch the sun set over Oakhaven, turn to page 28", page: 28 },
    ],
  },

  2: {
    paragraphs: [
      "Kaelen sits cross-legged before Master Thorne’s crystal ball, trying to focus on a simple illusion spell. The wizard speaks in riddles about “the river that flows both ways” and “two hands that must move as one.”",
      "When Kaelen finally creates a flickering light, the wizard smiles faintly. “Your magic responds to emotion,” he says. “Not technique. That’s why it’s unpredictable. But it also means you’re more than we thought.”",
    ],
    choices: [
      { label: "To take the riddles away and practise alone, turn to page 3", page: 3 },
      { label: "Turn to page 15 to test what the wizard said about emotion", page: 15 },
      { label: "To answer the offer that comes from the northern kingdom, turn to page 29", page: 29 },
    ],
  },

  3: {
    paragraphs: [
      "Kaelen practices alone in his bedroom, frustrated but determined. He tries different spell forms—hand signs, incantations, even channeling through his shadow.",
      "Nothing works properly until a strange sensation hits him: when he focuses on Lyra’s training from downstairs, his magic steadies. The two of them are connected, whether they realize it or not.",
    ],
    choices: [
      { label: "To search Master Thorne’s room for an explanation, turn to page 4", page: 4 },
      { label: "Turn to page 16 to see what Lyra’s spear has become", page: 16 },
      { label: "To wait for the gathering at midnight, turn to page 27", page: 27 },
    ],
  },

  4: {
    paragraphs: [
      "Kaelen discovers Master Thorne has left behind a hidden journal beneath his bed. It’s filled with sketches of twin sigils—one glowing, one sharp and angular—and notes about “the guardians who split the realm.”",
      "The last entry reads: “They chose to separate their gifts so neither would be used by tyrants. But now the darkness returns. They must reunite them.”",
    ],
    choices: [
      { label: "To find Lyra training in the moonlight, turn to page 5", page: 5 },
      { label: "Turn to page 17 to face the rogue mage who comes for the journal", page: 17 },
      { label: "To close the journal and sit with it until dusk, turn to page 28", page: 28 },
    ],
  },

  5: {
    paragraphs: [
      "Lyra trains through the night, her spear moving like a blur in the moonlight. She’s not just learning how to fight—she’s learning what it means to protect.",
      "When she hears Kaelen practicing upstairs, she pauses and listens for a moment before continuing. The village is small, but her brother’s magic feels different than other people’s. It hums with something familiar, like a heartbeat she can’t place.",
    ],
    choices: [
      { label: "To take the question into the forest at dawn, turn to page 6", page: 6 },
      { label: "Turn to page 18 to see Master Thorne step out of the shadows", page: 18 },
      { label: "To stand at the gates when the northern army arrives, turn to page 23", page: 23 },
    ],
  },

  6: {
    paragraphs: [
      "Kaelen finds Lyra in the forest behind the village, trying to create a protective ward spell. It keeps failing because he’s forcing it.",
      "“You’re thinking like him,” she says, stepping into his space. “Master Thorne taught you to control. But maybe some things need to be felt.” She demonstrates her spear technique—fluid movements that follow natural rhythms—and Kaelen watches, realizing she’s right about the flow of energy.",
    ],
    choices: [
      { label: "To let the ward wait until the Harvest Festival, turn to page 7", page: 7 },
      { label: "Turn to page 19 to meet the delegation that comes demanding their power", page: 19 },
      { label: "To stand with Lyra at the center of the battle, turn to page 24", page: 24 },
    ],
  },

  7: {
    paragraphs: [
      "A shadow beast attacks the village during the Harvest Festival, tearing through stalls and scattering townsfolk. The knights’ swords pass through it harmlessly. Kaelen tries a fireball spell that fizzles into smoke.",
      "But when Lyra charges with her spear while Kaelen focuses on amplifying her movements, their combined effort strikes true. The beast recoils and flees into the night.",
    ],
    choices: [
      { label: "To find Master Thorne after the beast flees, turn to page 8", page: 8 },
      { label: "Turn to page 20 to learn what the northern delegation does to the old wizard", page: 20 },
      { label: "To see what the twins are offered once the fighting is over, turn to page 25", page: 25 },
    ],
  },

  8: {
    paragraphs: [
      "Master Thorne finds Kaelen shaken by what happened. “What you just did,” he says quietly, “was magic and martial arts working in harmony. That hasn’t happened in three hundred years.”",
      "He reveals that Kaelen’s magic was always tied to Lyra’s discipline—two halves of one power. They’ve been separated their entire lives without knowing it, and now something ancient has noticed their awakening.",
    ],
    choices: [
      { label: "To read the rest of the journal with Lyra, turn to page 9", page: 9 },
      { label: "Turn to page 17 to face the rogue mage before the truth sinks in", page: 17 },
      { label: "To spend the coming weeks building something new at the academy, turn to page 26", page: 26 },
    ],
  },

  9: {
    paragraphs: [
      "Kaelen and Lyra read the rest of Master Thorne’s journal together, piecing together the truth about their lineage. The Aethelgard guardians weren’t just warriors and mages—they were twin aspects of a single power, split when the realm was young to prevent either from becoming tyrants.",
      "Now that they’re awakening, both magic and martial traditions are being drawn into conflict by those who want to control one while destroying the other.",
    ],
    choices: [
      { label: "To trade lessons in the academy courtyard, turn to page 10", page: 10 },
      { label: "Turn to page 18 to let Master Thorne show them what one power looks like", page: 18 },
      { label: "To wait for the midnight gathering and the rest of the truth, turn to page 27", page: 27 },
    ],
  },

  10: {
    paragraphs: [
      "Lyra finds Kaelen practicing in the academy courtyard, trying to create a spell that channels magic through a spear strike. “Teach me,” she says, brandishing her spear like it’s a wand.",
      "He laughs at the absurdity but agrees to show her. They spend hours practicing—him teaching her how to channel energy through her movements, her teaching him how to move with intention rather than force.",
    ],
    choices: [
      { label: "To be ready when the rogue mage attacks the academy, turn to page 11", page: 11 },
      { label: "Turn to page 20 to find the northern delegation waiting for Master Thorne", page: 20 },
      { label: "To walk out to the edge of the village and look at what comes next, turn to page 30", page: 30 },
    ],
  },

  11: {
    paragraphs: [
      "Kaelen and Lyra face their first test together when a rogue mage attacks the academy, trying to steal their powers with dark rituals. Kaelen tries to blast the attacker with raw magic, but his spells scatter harmlessly.",
      "Lyra charges with her spear, but the rogue mage phases through it using illusion magic. They realize they need to work in sync—Kaelen creating openings while Lyra strikes at the right moments.",
    ],
    choices: [
      { label: "To let Master Thorne step out of the shadows, turn to page 12", page: 12 },
      { label: "Turn to page 21 to go looking for the old wizard in his chains", page: 21 },
      { label: "To leave the fight behind and sit on the porch at dusk, turn to page 28", page: 28 },
    ],
  },

  12: {
    paragraphs: [
      "Master Thorne appears from the shadows, watching them fight. “You’re thinking like separate people,” he says. “But you’re not. Your magic and your discipline are two hands of one power.”",
      "He demonstrates a spell that requires both magical focus and martial precision—Kaelen channels energy through Lyra’s spear strikes to create devastating blasts. The rogue mage flees, but the academy students gather around in awe.",
    ],
    choices: [
      { label: "To meet the two delegations at the gates, turn to page 13", page: 13 },
      { label: "Turn to page 20 to see the price Master Thorne pays", page: 20 },
      { label: "To follow the road out of Oakhaven, turn to page 30", page: 30 },
    ],
  },

  13: {
    paragraphs: [
      "Kaelen and Lyra are approached by a delegation from the northern kingdom, demanding they hand over their powers for “the greater good.” Simultaneously, a shadow faction arrives at the academy gates, demanding the twins surrender so they can be captured.",
      "Both sides believe they’re protecting Aethelgard, but both want to control one half of the twin power while destroying the other.",
    ],
    choices: [
      { label: "To refuse them both and keep training, turn to page 14", page: 14 },
      { label: "Turn to page 21 to slip through the academy grounds after dark", page: 21 },
      { label: "To go home to Oakhaven and think it over, turn to page 28", page: 28 },
    ],
  },

  14: {
    paragraphs: [
      "Kaelen and Lyra spend weeks training together in the academy, creating new techniques that blend magic and martial arts for the first time. They design spells that require combat precision and combat moves that channel magical energy.",
      "Other twin-powered students learn from them, beginning to see a third path beyond the old divisions. The academy transforms into a sanctuary where both traditions flourish together.",
    ],
    choices: [
      { label: "To watch Kaelen’s own gift turn unpredictable, turn to page 15", page: 15 },
      { label: "Turn to page 24 to stand at the center of the battle to come", page: 24 },
      { label: "To wait for the midnight gathering, turn to page 27", page: 27 },
    ],
  },

  15: {
    paragraphs: [
      "Kaelen’s magical gift grows unpredictable, flaring when he’s emotional and fading when he’s calm. He begins to understand Master Thorne’s lesson about “the river that flows both ways.”",
      "The power responds to balance—not between magic and martial arts, but within himself. With practice and guidance from the academy students, Kaelen learns to harmonize his emotions with his magic.",
    ],
    choices: [
      { label: "To see how far Lyra’s spear has come, turn to page 16", page: 16 },
      { label: "Turn to page 25 to face the choice offered after the battle", page: 25 },
      { label: "To end the day on the porch at home, turn to page 28", page: 28 },
    ],
  },

  16: {
    paragraphs: [
      "Lyra’s spear technique evolves as she incorporates magical awareness. She can now sense the flow of energy through objects and people, making her strikes more effective and her defense nearly impenetrable.",
      "When a training dummy shatters into splinters from her strike, she realizes her power has grown significantly. But with greater ability comes greater responsibility—if others are being hunted because of what they’re becoming.",
    ],
    choices: [
      { label: "To be there when the rogue mage attacks, turn to page 17", page: 17 },
      { label: "Turn to page 24 to hold the line at the center of the battle", page: 24 },
      { label: "To look out over Aethelgard from the edge of the village, turn to page 30", page: 30 },
    ],
  },

  17: {
    paragraphs: [
      "Kaelen and Lyra face their first test together when a rogue mage attacks the academy, trying to steal their powers with dark rituals. Kaelen tries to blast the attacker with raw magic, but his spells scatter harmlessly.",
      "Lyra charges with her spear, but the rogue mage phases through it using illusion magic. They realize they need to work in sync—Kaelen creating openings while Lyra strikes at the right moments.",
    ],
    choices: [
      { label: "To let Master Thorne end the fight, turn to page 18", page: 18 },
      { label: "Turn to page 21 to search the grounds for the chained wizard", page: 21 },
      { label: "To hear the offer that arrives from the north, turn to page 29", page: 29 },
    ],
  },

  18: {
    paragraphs: [
      "Master Thorne appears from the shadows, watching them fight. “You’re thinking like separate people,” he says. “But you’re not. Your magic and your discipline are two hands of one power.”",
      "He demonstrates a spell that requires both magical focus and martial precision—Kaelen channels energy through Lyra’s spear strikes to create devastating blasts. The rogue mage flees, but the academy students gather around in awe.",
    ],
    choices: [
      { label: "To meet the delegation at the gates, turn to page 19", page: 19 },
      { label: "Turn to page 20 to see Master Thorne taken", page: 20 },
      { label: "To walk out to the road and what waits beyond it, turn to page 30", page: 30 },
    ],
  },

  19: {
    paragraphs: [
      "Kaelen and Lyra are approached by a delegation from the northern kingdom, demanding they hand over their powers for “the greater good.” Simultaneously, a shadow faction arrives at the academy gates, demanding the twins surrender so they can be captured.",
      "Both sides believe they’re protecting Aethelgard, but both want to control one half of the twin power while destroying the other.",
    ],
    choices: [
      { label: "To watch the northern delegation take Master Thorne, turn to page 20", page: 20 },
      { label: "Turn to page 21 to go after him through the dark", page: 21 },
      { label: "To go home and sit with the question until dusk, turn to page 28", page: 28 },
    ],
  },

  20: {
    paragraphs: [
      "Master Thorne is captured by the northern delegation, his mind partially drained of magic as payment for their demands. Kaelen and Lyra realize they can’t stay in the academy anymore—they must find a way to save Master Thorne without compromising their powers or each other’s lives.",
      "The old wizard’s final words echo in their minds: “Balance is not weakness.”",
    ],
    choices: [
      { label: "To move through the academy grounds at night, turn to page 21", page: 21 },
      { label: "Turn to page 23 to meet the army at the gates instead", page: 23 },
      { label: "To wait for the midnight gathering, turn to page 27", page: 27 },
    ],
  },

  21: {
    paragraphs: [
      "Kaelen and Lyra sneak through the academy grounds at night, using Kaelen’s magic to sense traps and Lyra’s combat training to navigate obstacles. They find Master Thorne bound in magical chains that drain his power.",
      "“Don’t try to break them,” he says weakly. “Break the chains from the inside—combine your powers as we trained together.”",
    ],
    choices: [
      { label: "To break the chains together, turn to page 22", page: 22 },
      { label: "Turn to page 25 to face the choice waiting on the other side", page: 25 },
      { label: "To leave the academy behind for good, turn to page 30", page: 30 },
    ],
  },

  22: {
    paragraphs: [
      "Kaelen and Lyra work together to break Master Thorne’s magical bonds. Kaelen channels magic into his hands while Lyra uses her spear as a conduit, directing the energy through him like lightning through metal.",
      "The chains shatter, but the backlash leaves them both exhausted. Master Thorne is freed, though weakened, and thanks them with a smile that says more than words could.",
    ],
    choices: [
      { label: "To hold the academy when the army arrives, turn to page 23", page: 23 },
      { label: "Turn to page 26 to rebuild the academy instead of defending it", page: 26 },
      { label: "To hear the offer the north sends afterward, turn to page 29", page: 29 },
    ],
  },

  23: {
    paragraphs: [
      "The northern kingdom’s delegation arrives at the academy gates with an army, demanding their surrender. Simultaneously, a shadow faction breaches the walls.",
      "The academy students must choose: flee and survive, or fight for Aethelgard using the twin power they’ve learned to control. Kaelen and Lyra step forward together, their powers syncing as one.",
    ],
    choices: [
      { label: "To stand at the center of the battle, turn to page 24", page: 24 },
      { label: "Turn to page 27 to hear the truth Master Thorne has kept for three hundred years", page: 27 },
      { label: "To see where the road goes after all of it, turn to page 30", page: 30 },
    ],
  },

  24: {
    paragraphs: [
      "Kaelen and Lyra stand at the center of the battle, their combined power creating a dome of light that pushes back both armies. The northern soldiers retreat when their weapons begin to shatter from magical feedback; the shadow faction dissipates when their darkness can’t touch the twin light.",
      "Master Thorne watches as Kaelen and Lyra demonstrate true mastery—not by choosing between magic and martial arts, but by making them work in perfect harmony.",
    ],
    choices: [
      { label: "To hear the choice they are offered afterward, turn to page 25", page: 25 },
      { label: "Turn to page 26 to begin rebuilding the academy", page: 26 },
      { label: "To follow them to the edge of the village, turn to page 30", page: 30 },
    ],
  },

  25: {
    paragraphs: [
      "In the aftermath of the battle, Kaelen and Lyra are offered a choice by Master Thorne’s former students.",
      "They can return to their original paths—Kaelen back to solitary magic study, Lyra back to martial training—or they can stay together and help rebuild Aethelgard as a kingdom where both magic and martial traditions coexist equally.",
    ],
    choices: [
      { label: "To stay and build the new academy, turn to page 26", page: 26 },
      { label: "Turn to page 28 to go home to Oakhaven first", page: 28 },
      { label: "To take the road out of Aethelgard together, turn to page 30", page: 30 },
    ],
  },

  26: {
    paragraphs: [
      "Kaelen and Lyra spend weeks training together in the academy, creating new techniques that blend magic and martial arts for the first time. They design spells that require combat precision and combat moves that channel magical energy.",
      "Other twin-powered students learn from them, beginning to see a third path beyond the old divisions. The academy transforms into a sanctuary where both traditions flourish together.",
    ],
    choices: [
      { label: "To hear the whole truth at the midnight gathering, turn to page 27", page: 27 },
      { label: "Turn to page 30 to stand at the edge of the village and look ahead", page: 30 },
    ],
  },

  27: {
    paragraphs: [
      "Master Thorne’s memory begins to return as Kaelen and Lyra restore his power through their combined magic. He shares the full truth of what happened three hundred years ago: when Aethelgard was young, the twin guardians chose to split their power so no single person could ever dominate both magic and martial arts.",
      "Their separation wasn’t punishment—it was a solution. Now they must choose whether to bring them back together or keep them separate forever.",
    ],
    choices: [
      { label: "To take the question home to the porch in Oakhaven, turn to page 28", page: 28 },
      { label: "Turn to page 30 to answer it on the road out of the village", page: 30 },
    ],
  },

  28: {
    paragraphs: [
      "Dusk settles over Oakhaven as Kaelen and Lyra sit on their parents’ porch, watching the sunset paint the sky in shades of gold and purple. “What do we do now?” Lyra asks quietly.",
      "Kaelen smiles. “We live. We train together. We protect this world where both magic and martial arts can exist.” Their shadow stands together behind them—two shadows that have finally learned to stand side by side.",
    ],
    choices: [
      { label: "To hear the last offer from the north, turn to page 29", page: 29 },
      { label: "Turn to page 30 to let the morning come and take the road", page: 30 },
    ],
  },

  29: {
    paragraphs: [
      "A rider comes up the Oakhaven road one last time under the northern kingdom’s seal, carrying a deal that would restore Master Thorne’s full power but require Kaelen to leave for training in the capital.",
      "Lyra considers it, then shakes her head. “We’re not going back,” she says. “We’re staying here and building something new.”",
    ],
    choices: [
      { label: "To see where that leaves them, turn to page 30", page: 30 },
    ],
  },

  30: {
    paragraphs: [
      "Kaelen and Lyra stand at the edge of their village, looking out over Aethelgard—the realm that divided them and now unites them through their combined power.",
      "Behind them, Master Thorne teaches new students in the academy courtyard below; ahead, the road stretches into an uncertain future where they’ll face new challenges but never alone. Their shadow stands together behind them—a testament to what happens when two halves choose to become whole.",
    ],
    ending: true,
  },

};
