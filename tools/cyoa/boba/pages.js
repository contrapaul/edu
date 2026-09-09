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
//    toolsUrl   where "Return to the library" points on ending pages.
//
//  CYOA_PAGES is an object keyed by page number. Each page has:
//    paragraphs   array of strings. The engine flows them across the
//                 left and right book pages automatically.
//    choices      array of 1–3 { label, page } objects. `label` is the
//                 full sentence shown on the button ("To do thing 1,
//                 turn to page 2"), `page` is the number it jumps to.
//                 Omit entirely on ending pages.
//    ending       set true on final pages. The engine then shows
//                 "Read Again" and "Return to the library" automatically
//                 — do not write those as choices.
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
//  reader turns pages (see --page-height in ../cyoa.css). Keep each
//  page to roughly two short paragraphs and at most three choices, or
//  the longest page will overflow its leaf.
// ═══════════════════════════════════════════════════════════════════

const CYOA_META = {
  title: "Boba & Beyond",
  subtitle:
    "Daisy is fifteen and permanently late for the bus. When she knocks her boba " +
    "milk tea across a street vendor’s ancient tea set, she drinks what is left of " +
    "it out of sheer embarrassment, burps once, and passes out. She wakes to a world " +
    "that has shifted. Her shadow moves on its own. She can walk through solid objects " +
    "for exactly three seconds. The trouble is that other people already know what she " +
    "can do, and they have plans for her.",
  start: 1,
  toolsUrl: "https://edu.contrapaul.com/tools/cyoa/",
};

const CYOA_PAGES = {

  1: {
    paragraphs: [
      "Daisy wakes in her Shenzhen bedroom with sunlight pooling on the floor and the taste of tea still on her tongue. Something is wrong. Her shadow stretches across the boards, then turns to face her while she lies perfectly still.",
      "She gasps and throws out a hand to steady herself. It goes straight through the nightstand. Whatever was in that cup, it was not milk tea.",
    ],
    choices: [
      { label: "To watch what her shadow does next, turn to page 2", page: 2 },
      { label: "Turn to page 3 to test the power on purpose", page: 3 },
      { label: "To knock on the old woman’s door downstairs, turn to page 14", page: 14 },
    ],
  },

  2: {
    paragraphs: [
      "The shadow peels away from her feet and slinks toward the window like something with its own errand. Daisy watches it lift a thin dark arm and begin to sketch on the glass.",
      "The shapes are geometric and exact, and they pulse faintly, as though something behind them is breathing. Then the shadow turns, holds still a moment as if checking she was paying attention, and slides back under her feet.",
    ],
    choices: [
      { label: "To try phasing through something solid, turn to page 3", page: 3 },
      { label: "Turn to page 15 to take what she saw to the old woman", page: 15 },
      { label: "To call the vendor and ask what he sold her, turn to page 29", page: 29 },
    ],
  },

  3: {
    paragraphs: [
      "Daisy stands in the middle of her bedroom and picks a target. The chair. She closes her eyes and counts down from three, and on three her body goes loose and thin, like sugar dissolving in hot water.",
      "She steps through the chair legs and gasps as she solidifies on the other side. Three seconds, no more. Something cold moves at the edge of her vision, and her shadow gives her a slow, deliberate nod.",
    ],
    choices: [
      { label: "To practice at school where nobody is looking, turn to page 4", page: 4 },
      { label: "Turn to page 7 to take it out into the alleys", page: 7 },
      { label: "To knock on the neighbor’s door instead, turn to page 12", page: 12 },
    ],
  },

  4: {
    paragraphs: [
      "Daisy practices in secret at lunch, crouched behind her backpack, phasing a hand through her desk and then the wall behind it. She laughs at how ridiculous it is. She could walk out of detention.",
      "Then a boy across the aisle looks at her for a beat too long. His eyes catch the light wrong, and for a moment the same geometric pattern turns behind them. He mouths two words. The Obsidian Circle.",
    ],
    choices: [
      { label: "To follow him after the bell, turn to page 5", page: 5 },
      { label: "Turn to page 10 to stop running and let them come", page: 10 },
      { label: "To go straight home and tell nobody, turn to page 27", page: 27 },
    ],
  },

  5: {
    paragraphs: [
      "That afternoon she follows him into the school library. Up close he is clearly not a student. His black jacket is stitched with silver thread in the same pattern her shadow drew on the glass.",
      "“You drank from the vendor,” he says, without looking up from his phone. “They are always hungry.” Before she can ask who they are, he steps through the bookshelf beside her and is gone, leaving a drift of dust in the air.",
    ],
    choices: [
      { label: "To follow him deeper into the stacks, turn to page 6", page: 6 },
      { label: "Turn to page 9 to wake up somewhere she does not recognize", page: 9 },
      { label: "To go to his apartment and have it out with him, turn to page 13", page: 13 },
    ],
  },

  6: {
    paragraphs: [
      "Daisy ends up cornered behind a row of encyclopedias while the boy talks on his phone, three steps away and entirely unbothered. “She is strong,” he says. “Phase time is long. We need her before the Festival.”",
      "In his other hand is the vendor’s tea set, wrapped in black silk. Daisy understands all at once that the spilled cup was never an accident. Somebody meant for her to drink it.",
    ],
    choices: [
      { label: "To get out through the side door, turn to page 7", page: 7 },
      { label: "Turn to page 11 to be caught before she reaches it", page: 11 },
      { label: "To call the vendor and ask what he did, turn to page 25", page: 25 },
    ],
  },

  7: {
    paragraphs: [
      "Daisy is out in the humid alley behind the block when she hears him behind her. “You cannot hide forever,” he says, walking through a wall as though it were mist.",
      "She runs. Her heart slams. She passes a boba stall that looks exactly like the one from that afternoon, the same vendor, the same set laid out on the same cloth. Either the city is looping, or somebody is arranging it.",
    ],
    choices: [
      { label: "To hide in the warehouse down by the harbor, turn to page 8", page: 8 },
      { label: "Turn to page 12 to cut through the neighbor’s courtyard", page: 12 },
      { label: "To keep running until the night of the Festival, turn to page 20", page: 20 },
    ],
  },

  8: {
    paragraphs: [
      "Daisy ducks into an abandoned warehouse near the harbor and stands still until her breathing slows. The shadows inside are longer than the light can account for.",
      "She tries to phase through a crate and only just makes it, flickering back solid on the far side. Her phone buzzes. Unknown number. I see you. Do not fight. This is not one person following her. It is something with a budget.",
    ],
    choices: [
      { label: "To wake up in their hands, turn to page 9", page: 9 },
      { label: "Turn to page 15 to get out and go to the old woman", page: 15 },
      { label: "To wait and meet whoever owns this warehouse, turn to page 24", page: 24 },
    ],
  },

  9: {
    paragraphs: [
      "She wakes in a room full of tea sets, dozens of them, each lid etched with its own pattern. The boy stands at a table covered in maps of Shenzhen, one finger resting on her neighborhood.",
      "“You are close,” he says. “But you have no idea what you woke up.” A woman comes in wearing robes that seem to swallow the light around them. “She drank from our ancestor’s tea,” the woman says. “She belongs to us now.”",
    ],
    choices: [
      { label: "To try the wall and run, turn to page 10", page: 10 },
      { label: "Turn to page 16 to hold out until the old woman finds her", page: 16 },
      { label: "To hear the woman in the robes out, turn to page 23", page: 23 },
    ],
  },

  10: {
    paragraphs: [
      "Daisy sets herself at the wall and counts down from three. Nothing happens. She tries again and feels the power sitting somewhere out of reach, like a light switched off in another room.",
      "The boy smiles and taps his phone. “Control mode.” Through a glass panel she sees other rooms, other girls her age, all of them frightened, all of them waiting. She is not the only one this has been done to.",
    ],
    choices: [
      { label: "To rush him while he is still smiling, turn to page 11", page: 11 },
      { label: "Turn to page 12 to get out through the courtyard next door", page: 12 },
      { label: "To go quietly and see where the van takes her, turn to page 17", page: 17 },
    ],
  },

  11: {
    paragraphs: [
      "Daisy goes for the window and finds it locked from the outside. The boy steps in behind her, and the pattern turns slowly behind his eyes.",
      "“You cannot run forever,” he says, and she realizes with a lurch that her shadow has stopped answering to her. It is leaning toward him. She has seconds before it takes her somewhere dark.",
    ],
    choices: [
      { label: "To slip out through the neighbor’s courtyard, turn to page 12", page: 12 },
      { label: "Turn to page 13 to stop running and face him properly", page: 13 },
      { label: "To let them load her into the van, turn to page 17", page: 17 },
    ],
  },

  12: {
    paragraphs: [
      "Daisy comes out into her neighbor’s courtyard, where an elderly woman is watering a bed of flowers that glow a faint blue. The woman does not look at all surprised to see her.",
      "“You are early,” she says, and pours tea from a plain ceramic pot. When Daisy asks about the boy, the old woman sighs. “They think they own this. They have never understood that it chooses.”",
    ],
    choices: [
      { label: "To go and confront the boy directly, turn to page 13", page: 13 },
      { label: "Turn to page 14 to sit down and let her explain", page: 14 },
      { label: "To visit the Festival site after it is all over, turn to page 26", page: 26 },
    ],
  },

  13: {
    paragraphs: [
      "Daisy finds the boy at his apartment, which is more storeroom than home: tea sets on every surface, and things beside them she has no name for.",
      "“You said I was strong,” she says. “You have no idea what you are doing.” He is quiet a moment, then nods. “We tried controlling it before. It did not work. We need something else.” He is not the villain she wanted. He is frightened, and stuck in the same machine she is.",
    ],
    choices: [
      { label: "To take what he said to the old woman, turn to page 14", page: 14 },
      { label: "Turn to page 15 to press her for the whole story", page: 15 },
      { label: "To be there when the Festival opens, turn to page 20", page: 20 },
    ],
  },

  14: {
    paragraphs: [
      "The old woman sits Daisy down and puts a journal on the table between them, its spine soft with handling. Inside are drawings of tea sets, page after page, each annotated in a small careful hand.",
      "“I need to get you ready,” she says. “If they find you before I do, you will not survive it.” She turns to a page near the back. “This was never only yours. It gets handed on.”",
    ],
    choices: [
      { label: "To ask who else it was handed to, turn to page 15", page: 15 },
      { label: "Turn to page 25 to call the vendor and hear his side", page: 25 },
      { label: "To walk away from all of it, turn to page 30", page: 30 },
    ],
  },

  15: {
    paragraphs: [
      "Daisy comes back the next evening with questions, and this time the old woman answers them. There have been others. Nine that she knows of, across sixty years, and she can name six.",
      "“Two of them are still alive,” she says. “One will not speak to me.” She writes an address on the back of a receipt and slides it over. “You can fight them with this, or help us keep it buried. Both are real choices. Pick with your eyes open.”",
    ],
    choices: [
      { label: "To ask what she wants Daisy to do, turn to page 16", page: 16 },
      { label: "Turn to page 25 to call the vendor first", page: 25 },
      { label: "To leave the address on the table and go, turn to page 30", page: 30 },
    ],
  },

  16: {
    paragraphs: [
      "“What I want,” the old woman says, when Daisy finally asks her, “is for you to be somewhere else on the night of the Festival. What I expect is that you will go anyway.”",
      "She fills Daisy’s cup one more time. “So learn this instead. Three seconds is not a limit, it is a rhythm. Stop counting down and start counting through.” It is the first useful thing anyone has told her.",
    ],
    choices: [
      { label: "To get in the van when it comes, turn to page 17", page: 17 },
      { label: "Turn to page 25 to call the vendor before she decides", page: 25 },
      { label: "To take the advice and stay away, turn to page 30", page: 30 },
    ],
  },

  17: {
    paragraphs: [
      "Daisy rides across the city in the back of the van with the boy and a girl who will only answer in riddles. The lights smear past the window.",
      "Ahead, a building rises that cannot decide which century it belongs to, all upturned eaves and cold white glass. “The Festival,” the girl says. “Where choices echo.” Daisy’s shadow shifts against the seat, answering something inside. This is not a party. It is an examination.",
    ],
    choices: [
      { label: "To go in through the main doors, turn to page 18", page: 18 },
      { label: "Turn to page 20 to arrive as the whole thing comes apart", page: 20 },
      { label: "To find the woman in the robes first, turn to page 23", page: 23 },
    ],
  },

  18: {
    paragraphs: [
      "The Festival fills an old industrial park, lit up in colors that do not sit still. Thousands of people move through halls lined with tea sets, and every set is pulsing at its own speed.",
      "The boy walks her to a stage at the center, where three doorways stand waiting. Control. Freedom. Surrender. Everyone here has come to watch her pick one.",
    ],
    choices: [
      { label: "To refuse all three and walk off the stage, turn to page 19", page: 19 },
      { label: "Turn to page 20 to pick one and watch what it costs", page: 20 },
      { label: "To leave the stage and go back to the warehouse, turn to page 22", page: 22 },
    ],
  },

  19: {
    paragraphs: [
      "She looks at the three doorways for a long moment, then turns and walks off the front of the stage. The crowd makes a sound she will remember for a long time.",
      "“You do not understand,” the boy says, and steps backward through a pillar. Around her the Festival begins to come apart. She does understand. She simply refuses to let three doors be the whole of it.",
    ],
    choices: [
      { label: "To stand still while it collapses, turn to page 20", page: 20 },
      { label: "Turn to page 21 to walk out through the wreckage", page: 21 },
      { label: "To come back to the site months later, turn to page 26", page: 26 },
    ],
  },

  20: {
    paragraphs: [
      "The Festival dissolves into a weather of light and shadow. People run. Structures thin out into mist and stop being there.",
      "The boy throws himself at her and tries to phase straight through, and she holds. Her outline burns with something she did not know she had. “You cannot fight me,” he shouts, already going, already back in the crowd. Then she is alone in the storm with her shadow standing up beside her.",
    ],
    choices: [
      { label: "To pick through what is left, turn to page 21", page: 21 },
      { label: "Turn to page 24 to go back to the warehouse for answers", page: 24 },
      { label: "To call the vendor from the ruins, turn to page 25", page: 25 },
    ],
  },

  21: {
    paragraphs: [
      "Afterward she stands in a ruined plaza full of debris and people who have not worked out what they saw. The boy is gone. The Festival is gone.",
      "One tea set has survived, sitting upright on the ground with its lid open on a slow turn of light. She picks it up, and her shadow puts out a hand to touch it. The choice was never them or you, it says. It is what you build afterward.",
    ],
    choices: [
      { label: "To take the set to the warehouse, turn to page 22", page: 22 },
      { label: "Turn to page 24 to hear what the owner has been protecting", page: 24 },
      { label: "To carry it home and stop there, turn to page 30", page: 30 },
    ],
  },

  22: {
    paragraphs: [
      "Daisy goes to the warehouse. A figure is waiting in the corner where the light does not reach, and does not move when she comes in.",
      "“You have broken something they spent a long time building,” the figure says, and holds out a key cut from black stone. “There are others across this city who have what you have. They are on their own. You can find them, or leave them to it.”",
    ],
    choices: [
      { label: "To take the key and find the woman in the robes, turn to page 23", page: 23 },
      { label: "Turn to page 24 to ask the owner what the sets are for", page: 24 },
      { label: "To put the key down and go home, turn to page 30", page: 30 },
    ],
  },

  23: {
    paragraphs: [
      "The woman from the van meets her in a quiet cafe near the harbor and slides a folder across the table. “I am not your enemy. We have been watching you since the night you drank it.”",
      "The Obsidian Circle, she explains, is a shopfront. Behind it sits a company that finds abilities like Daisy’s and harvests them, and it was doing so long before the Circle existed. The vendor was resistance. Daisy is on a list because three seconds is rare enough to be worth money.",
    ],
    choices: [
      { label: "To ask the warehouse owner whether any of it is true, turn to page 24", page: 24 },
      { label: "Turn to page 25 to hear it from the vendor himself", page: 25 },
      { label: "To go back to the Festival site alone, turn to page 26", page: 26 },
    ],
  },

  24: {
    paragraphs: [
      "The warehouse owner has silver in her hair and a way of looking at a wall as though the far side of it were her business. She explains what the tea sets actually are.",
      "“They are not containers. They are anchors, and they are holding something under this city asleep.” She unrolls a map of Shenzhen marked with glowing points across a dozen neighborhoods. “Stay and help us hold it. Or go, and they will keep taking from people like you.”",
    ],
    choices: [
      { label: "To call the vendor before deciding, turn to page 25", page: 25 },
      { label: "Turn to page 26 to walk the Festival site and think", page: 26 },
      { label: "To give her an answer another day, turn to page 30", page: 30 },
    ],
  },

  25: {
    paragraphs: [
      "Daisy calls the vendor. It rings a long time. When he picks up he sounds like a man who has been waiting for a call he did not want.",
      "“I never meant for you to drink it,” he says. “Somebody told me you would find the set in the alley, and I knew that meant they were already watching.” He has been trying to keep her out of this since before she knew there was a this.",
    ],
    choices: [
      { label: "To visit the Festival site, turn to page 26", page: 26 },
      { label: "Turn to page 27 to walk home and think it over", page: 27 },
      { label: "To meet him at the stall, turn to page 30", page: 30 },
    ],
  },

  26: {
    paragraphs: [
      "Daisy goes back to the Festival site. It is quiet now and mostly rubble, and in among it she finds a small shrine: an altar with tea cups set out in a circle.",
      "She puts her hand on the center cup and says the thing she has worked out, which is that this was never a question of holding on or letting go. It is a question of what connects to what. Shadows come up out of the ground and spread across Shenzhen in a slow net of light.",
    ],
    choices: [
      { label: "To walk home from there, turn to page 27", page: 27 },
      { label: "Turn to page 28 to sit on the balcony and let it settle", page: 28 },
      { label: "To stay until morning, turn to page 30", page: 30 },
    ],
  },

  27: {
    paragraphs: [
      "Daisy walks home through quiet streets with her shadow keeping pace beside her, the way an old friend does. The city has changed for her, or she has changed inside it.",
      "She passes a boba stall and finds the vendor watching from behind the counter. He raises his cup to her without a word. She raises hers back.",
    ],
    choices: [
      { label: "To go up to the balcony, turn to page 28", page: 28 },
      { label: "Turn to page 30 to keep walking down to the harbor", page: 30 },
    ],
  },

  28: {
    paragraphs: [
      "She sits out on the balcony with the skyline going on below her, all those lights scattered like something spilled. Her shadow lies out beneath the chair, calm, exactly where it should be.",
      "She thinks about what she turned down. Control, and surrender, and the version of this where she never asked a single question. The tea was not a curse and it was not a gift. It was an invitation, and she has answered it.",
    ],
    choices: [
      { label: "To answer the phone when it rings, turn to page 29", page: 29 },
      { label: "Turn to page 30 to leave it ringing", page: 30 },
    ],
  },

  29: {
    paragraphs: [
      "The phone rings. It is the vendor. “They are looking for you,” he says, very quietly. “So are we.”",
      "Daisy looks out over Shenzhen and understands that the story has not finished with her. What she can do is real, and so is what is waiting in the dark. She is carrying something now, and someone after her will need it carried well.",
    ],
    choices: [
      { label: "To go and meet them, turn to page 30", page: 30 },
    ],
  },

  30: {
    paragraphs: [
      "She stands where the road divides. One way runs to the city center, where there are more tea sets and nobody honest to explain them. The other runs down to the harbor, where people like her have started gathering.",
      "Her shadow stretches out ahead and offers both directions equally, with no opinion at all. It is hers to pick. For the first time since she woke up able to walk through walls, Daisy is smiling at what comes next.",
    ],
    ending: true,
  },

};
