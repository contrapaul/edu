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
    text: "Mr. K was (officially) homeschooled until grade 12, though he did most of his grade 11 classes at a community college. ",
    tags: ["classroom", "personal"]
  },
  {
    id: 2,
    text: "Mr. K's unfinished project list has never been empty.",
    tags: ["classroom", "design", "personal"]
  },
  {
    id: 3,
    text: "Mr. K can and will pwn the whole class on Shellshockers or Ev.io.",
    tags: ["classroom", "personal"]
  },
  {
    id: 4,
    text: "The only thing Mr. K loves more than learning something new and awesome is sharing it with someone else.",
    tags: ["classroom", "personal"]
  },
  {
    id: 5,
    text: "Mr. K has explained the Design Cycle enough times that he occasionally does it in his sleep.",
    tags: ["classroom", "ib", "design"]
  },
  {
    id: 6,
    text: "Mr. K's learning materials are fairly well organised. His desk is not.",
    tags: ["classroom", "personal"]
  },
  {
    id: 7,
    text: "Mr. K thinks troubleshooting should be an ATL skill.",
    tags: ["classroom", "ib"]
  },
  {
    id: 8,
    text: "It takes Mr. K so much more time to write quizzes and tests than it takes students to take them.",
    tags: ["classroom", "ib"]
  },
  {
    id: 9,
    text: "Young Mr. K would be extremely jealous of older Mr. K's technology.",
    tags: ["personal", "tech"]
  },
  {
    id: 10,
    text: "Mr. K would much rather design a thing for himself than spend less money to buy the same thing online.",
    tags: ["design", "personal"]
  },
  {
    id: 11,
    text: "Mr. K can tell you more than you wanted to know about font design and why fonts are annoying in Fusion.",
    tags: ["design", "personal"]
  },
  {
    id: 12,
    text: "Mr. K accidentally became an influencer but is terrible at keeping it up.",
    tags: ["design", "personal"]
  },
  {
    id: 13,
    text: "Mr. K's definition of 'a quick prototype' is different from everyone else's definition of 'a quick prototype'.",
    tags: ["design", "tech"]
  },
  {
    id: 14,
    text: "Mr. K's design journey probably began with Lego.",
    tags: ["design", "personal"]
  },
  {
    id: 15,
    text: "Mr. K will happily talk to you about how great the Microsoft Zune was!",
    tags: ["design", "personal", "tech"]
  },
  {
    id: 16,
    text: "Mr. K built a Halo helmet with cardstock, wood glue, and very little else.",
    tags: ["tech", "classroom"]
  },
  {
    id: 17,
    text: "Mr. K is proud to own a digital microscope.",
    tags: ["tech", "personal"]
  },
  {
    id: 18,
    text: "Mr. K's first operating system was MS-DOS, but his first PC ran Windows XP.",
    tags: ["tech", "personal"]
  },
  {
    id: 19,
    text: "Mr. K currently owns 5 3D printers, and wishes he had space for more.",
    tags: ["tech", "personal"]
  },
  {
    id: 20,
    text: "Mr. K believes in buying extra glue, knives, microcontrollers, and pretty much anything else he might need later but could possibly misplace.",
    tags: ["tech", "personal"]
  },
  {
    id: 21,
    text: "Mr. K often feels genuinely lucky to have the privilege of teaching design.",
    tags: ["tech", "ib", "personal"]
  },
  {
    id: 22,
    text: "Mr. K has had well over 100 rolls of filament at once before.",
    tags: ["tech", "classroom"]
  },
  {
    id: 23,
    text: "Mr. K hardly rememembers a time before he knew all the MYP design criteria.",
    tags: ["ib", "personal"]
  },
  {
    id: 24,
    text: "Mr. K is great a painting miniatures, he just doesn't do it that often.",
    tags: ["ib", "personal"]
  },
  {
    id: 25,
    text: "Mr. K loves building computers so much.",
    tags: ["ib", "tech", "personal"]
  },
  {
    id: 26,
    text: "Mr. K is a cat person. He and his wife have 4 cats- Oscar, Xiaolong, Goose, and Rufus.",
    tags: ["personal"]
  },
  {
    id: 27,
    text: "Mr. K deeply regrets not investing in hundreds of gigabytes of RAM between 2022 and 2025. He won't make this mistake again when prices fall.",
    tags: ["personal", "tech"]
  },
  {
    id: 28,
    text: "Mr. K drinks a lot of coffee, but others might debate whether Old Town White Coffee Hazelnut 3-in-1 packets count as coffee.",
    tags: ["personal", "ib"]
  },
  {
    id: 29,
    text: "Mr. K is definitely allergic to sawdust. This isn't a cool fact at all.",
    tags: ["personal", "tech"]
  },
  {
    id: 30,
    text: "Mr. K wants you to explore this site. Go find the themes, then give 'Nightmare' a try.",
    tags: ["personal", "design"]
  },
  {
    id: 31,
    text: "Mr. K loves few things as much as building PC's",
    tags: ["personal", "design"]
  }

];
