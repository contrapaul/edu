/* ═══════════════════════════════════════════════════════════════════
   GAME MECHANICS CATALOG: content file.
   Edit this file to add or change mechanics. Nothing else needs to
   change. See README.md for the full field guide.
   ═══════════════════════════════════════════════════════════════════ */

/* The ten families. `cls` is the card style, `color` drives the filter
   chip and the accent inside the detail window. */
const FAMILIES = {
  turn:    { name: "Turn Order and Sequence", short: "Turn Order",  cls: "fam-turn",    color: "#8fa3c4", note: "Who acts, and when." },
  move:    { name: "Movement and Space",      short: "Movement",    cls: "fam-move",    color: "#4f9e6a", note: "Where pieces go and how far." },
  chance:  { name: "Chance and Randomness",   short: "Chance",      cls: "fam-chance",  color: "#ff4a3d", note: "Dice, draws, and luck." },
  cards:   { name: "Cards and Decks",         short: "Cards",       cls: "fam-cards",   color: "#e0728c", note: "Hands, decks, and building them." },
  econ:    { name: "Resources and Economy",   short: "Resources",   cls: "fam-econ",    color: "#a89880", note: "Getting, spending, and trading." },
  combat:  { name: "Conflict and Combat",     short: "Combat",      cls: "fam-combat",  color: "#e08a2e", note: "Attacking, defending, damage." },
  hidden:  { name: "Hidden Information",      short: "Hidden Info", cls: "fam-hidden",  color: "#b98ce0", note: "Secrets, bluffing, fog of war." },
  fair:    { name: "Fairness and Catch-Up",   short: "Fairness",    cls: "fam-fair",    color: "#b9c0cc", note: "Keeping a losing player in the game." },
  growth:  { name: "Progress and Growth",     short: "Progress",    cls: "fam-growth",  color: "#5fd6a6", note: "Levelling, upgrading, unlocking." },
  goals:   { name: "Goals and Scoring",       short: "Goals",       cls: "fam-goals",   color: "#FFE536", note: "How you win, and how you count." }
};

/* Filter vocabularies. Values used in mechanics below must appear here. */
const FILTERS = {
  components: ["Dice", "Cards", "Board or grid", "Tokens", "Timer", "Paper and pencil", "Nothing extra"],
  complexity: ["Simple", "Medium", "Complex"],
  playerFit:  ["Works at 2", "Works at 3 to 4", "Works at 5 or more"]
};

const MECHANICS = [

/* ── TURN ORDER AND SEQUENCE ─────────────────────────────────────── */
{
  slug: "you-go-i-go",
  name: "You Go, I Go",
  family: "turn",
  alsoCalled: ["Alternating activation", "Ping-pong turns"],
  blurb: "Players take turns one piece at a time, back and forth.",
  complexity: "Simple",
  components: ["Nothing extra"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "In some games one player moves their whole army. Then the other player moves theirs. The waiting player has nothing to do for a long time.",
    "You Go, I Go cuts the turn into small pieces. You move one unit. Then your opponent moves one unit. You keep swapping until everyone has gone.",
    "Warhammer 40,000: Kill Team works this way. So do most modern skirmish games."
  ],
  howItWorks: [
    "Decide who acts first. A dice roll works. So does a bid.",
    "The first player picks one unit and finishes its whole turn.",
    "The other player picks one unit and finishes its whole turn.",
    "Keep swapping. Each unit may act only once per round.",
    "When every unit has acted, the round ends. Start again."
  ],
  games: [
    { title: "Warhammer 40,000: Kill Team", note: "Players alternate one operative at a time, so nobody watches a long enemy turn." },
    { title: "Chess", note: "The simplest version. One piece each, forever." },
    { title: "Checkers", note: "Same idea, with capture rules that force the swap to matter." }
  ],
  watchOut: [
    "If one player has many more units, they act several times in a row at the end. That can feel unfair.",
    "Players must pay attention the whole round. This keeps people awake, but it can tire out a long game."
  ],
  tryThis: "Find a game where each player moves everything on their turn. Change it so players alternate one piece at a time. Play both versions and ask your testers which felt better.",
  links: [
    { label: "Kill Team free rules and downloads", url: "https://www.warhammer-community.com/en-gb/downloads/kill-team/", kind: "Rules", vpn: false },
    { label: "How games handle turns and rounds", url: "https://en.wikipedia.org/wiki/Turns,_rounds_and_time-keeping_systems_in_games", kind: "Article", vpn: true }
  ],
  media: {
    image: null,
    imageNeed: "Photo of a Kill Team board mid-round, with two players reaching in at the same time.",
    video: null,
    videoNeed: "20 second clip of one full round of alternating activation, ideally filmed top-down on a real table.",
    diagram: "turn-alternating"
  }
},
{
  slug: "simultaneous-selection",
  name: "Simultaneous Selection",
  family: "turn",
  alsoCalled: ["Secret orders", "Programmed movement"],
  blurb: "Everyone chooses in secret, then all choices are revealed together.",
  complexity: "Medium",
  components: ["Cards", "Paper and pencil"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Nobody waits. All players decide at the same time, in secret. Then everyone shows their choice at once.",
    "This makes players guess what other people will do. Rock Paper Scissors is the smallest possible version of this rule.",
    "It also keeps a five player game fast, because five people are thinking at once instead of one."
  ],
  howItWorks: [
    "Give every player the same set of choices. Cards, dials, or a slip of paper all work.",
    "Everyone picks in secret at the same time. Set a time limit so nobody stalls.",
    "On a count of three, all players reveal.",
    "Resolve the revealed choices in a fixed order that the rules set out.",
    "Clear the choices and start the next round."
  ],
  games: [
    { title: "RoboRally", note: "Players program five moves in advance, then watch the robots crash into each other." },
    { title: "Diplomacy", note: "All orders are written down in secret and read out together." },
    { title: "Rock Paper Scissors", note: "The whole game is one simultaneous reveal." }
  ],
  watchOut: [
    "Resolving everything at once is the hard part. Write the order of resolution down before you playtest.",
    "Players can freeze up when they cannot see what others are doing. A time limit fixes this."
  ],
  tryThis: "Give every player the same five action cards. Ask them to play one face down each round. Reveal together and see how quickly players start reading each other.",
  links: [
    { label: "Simultaneous action selection, explained", url: "https://en.wikipedia.org/wiki/Simultaneous_action_selection", kind: "Article", vpn: true },
    { label: "RoboRally and its programmed movement", url: "https://en.wikipedia.org/wiki/RoboRally", kind: "Article", vpn: true }
  ],
  media: {
    image: null,
    imageNeed: "Photo of four players holding face-down cards over a table, just before the reveal.",
    video: null,
    videoNeed: "Short clip of a countdown and a simultaneous reveal, showing the moment everyone flips.",
    diagram: "turn-simultaneous"
  }
},
{
  slug: "action-points",
  name: "Action Points",
  family: "turn",
  alsoCalled: ["AP", "Action budget"],
  blurb: "You get a small budget of actions and spend it how you like.",
  complexity: "Simple",
  components: ["Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Instead of a fixed list of things you must do, you get a number. That number is your budget for the turn.",
    "Every action costs points. Moving might cost one. Attacking might cost two. You choose what to buy.",
    "This gives players real choices without adding many rules. It is one of the cheapest ways to add depth."
  ],
  howItWorks: [
    "Give each player the same number of points at the start of their turn. Four is a good starting number.",
    "Write a short price list. Keep it to five or six actions.",
    "The player spends points in any order they like.",
    "Unspent points are usually lost at the end of the turn.",
    "Refill the budget at the start of the next turn."
  ],
  games: [
    { title: "Pandemic", note: "Four actions per turn, chosen from a short list. The tension comes from never having enough." },
    { title: "XCOM", note: "Two actions per soldier. Move and shoot, or move twice, but never both." },
    { title: "Gloomhaven", note: "Cards set the budget, so the choice starts before the turn even begins." }
  ],
  watchOut: [
    "If one action is much better than the others, everyone buys the same thing every turn. Price it higher.",
    "Letting players save points for later turns can break the game. Most designs make points expire."
  ],
  tryThis: "Take your game and give each player exactly three actions per turn. Write the price list on one index card. If the card does not fit, your list is too long.",
  links: [
    { label: "Pandemic and its four actions per turn", url: "https://en.wikipedia.org/wiki/Pandemic_(board_game)", kind: "Article", vpn: true }
  ],
  media: {
    image: null,
    imageNeed: "Photo of a player's action tokens being spent one by one across a turn.",
    video: null,
    videoNeed: "Clip of a single Pandemic turn, narrating each of the four actions as they are spent.",
    diagram: "turn-action-points"
  }
},

/* ── MOVEMENT AND SPACE ──────────────────────────────────────────── */
{
  slug: "movement-patterns",
  name: "Movement Patterns",
  family: "move",
  alsoCalled: ["Piece-specific movement"],
  blurb: "Each piece moves in its own fixed shape, and nothing else.",
  complexity: "Simple",
  components: ["Board or grid"],
  playerFit: ["Works at 2"],
  origin: "tabletop",
  whatItIs: [
    "Every piece has one movement rule. The rook moves in straight lines. The knight jumps in an L shape. The bishop moves on diagonals.",
    "Because the rules never change, players learn them once and then think about strategy instead of rules.",
    "The shapes also give each piece a personality. A knight feels tricky. A rook feels blunt and strong."
  ],
  howItWorks: [
    "Choose a small number of piece types. Chess uses six, which is already a lot.",
    "Give each type one clear movement shape. Draw it, do not describe it.",
    "Decide what happens when a piece lands on another piece.",
    "Print the shapes on the pieces or on a reference card. Players should never have to remember.",
    "Test whether any piece is so strong that players ignore the others."
  ],
  games: [
    { title: "Chess", note: "Six pieces, six shapes. The whole game grows out of how those shapes interact." },
    { title: "Onitama", note: "The movement shapes sit on cards, and the cards pass between players during the game." },
    { title: "Checkers", note: "One shape for everyone, until a piece is crowned and gains a second one." }
  ],
  watchOut: [
    "More piece types is not more fun. Four well chosen shapes beat ten similar ones.",
    "A piece that moves anywhere makes every other piece boring."
  ],
  tryThis: "Design three pieces on grid paper. Draw the movement shape for each one. Hand your sketch to someone who has not seen it and ask them to play a turn without asking you a question.",
  links: [
    { label: "How every chess piece moves", url: "https://www.chess.com/learn-how-to-play-chess", kind: "Rules", vpn: false },
    { label: "Practise the moves on Lichess", url: "https://lichess.org/learn", kind: "Rules", vpn: false },
    { label: "Onitama, where the moves sit on cards", url: "https://www.arcanewonders.com/game/onitama/", kind: "Rules", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "Overhead photo of a chess board with movement arrows drawn on with a marker or overlaid.",
    video: null,
    videoNeed: "Short clip showing a knight's L shaped jump from several starting squares.",
    diagram: "move-patterns"
  }
},
{
  slug: "grids-and-hexes",
  name: "Grids and Hexes",
  family: "move",
  alsoCalled: ["Square grid", "Hex grid"],
  blurb: "The shape of your board decides how fair movement feels.",
  complexity: "Simple",
  components: ["Board or grid"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "A square grid gives every space eight neighbours. Four of them share an edge. Four only touch at a corner.",
    "That difference causes a problem. Moving diagonally covers more ground than moving straight, but usually costs the same.",
    "A hex grid gives every space six neighbours, and all six are the same distance away. Movement becomes even in every direction."
  ],
  howItWorks: [
    "Pick squares if your game is about lines, walls, and buildings. Cities and rooms fit squares.",
    "Pick hexes if your game is about open ground and fair distances. Battles and maps fit hexes.",
    "If you use squares, decide early whether diagonal moves are allowed and what they cost.",
    "Keep the space size big enough for your pieces to sit inside without touching.",
    "Print a test sheet and place real pieces on it before you commit."
  ],
  games: [
    { title: "Chess", note: "Squares, and diagonal movement is given only to certain pieces to control the problem." },
    { title: "Catan", note: "Hexes, because the map needs to feel like open land with no favoured direction." },
    { title: "Civilization VI", note: "Moved the series from squares to hexes so that armies could not gain ground by moving diagonally." }
  ],
  watchOut: [
    "Hexes are harder to draw and harder to print. Budget time for this.",
    "Mixing squares and hexes in one game confuses players. Choose one."
  ],
  tryThis: "Draw the same short journey on square paper and on hex paper. Count the moves each way. If the counts differ, you have found the reason hexes exist.",
  links: [
    { label: "Printable hex and grid paper", url: "https://incompetech.com/graphpaper/hexagonal/", kind: "Tool", vpn: false },
    { label: "Hex grids, deeply explained", url: "https://www.redblobgames.com/grids/hexagons/", kind: "Article", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "Side by side photo of the same game piece on square paper and on hex paper.",
    video: null,
    videoNeed: "Not needed. The diagram carries this one.",
    diagram: "move-grid-hex"
  }
},
{
  slug: "line-of-sight",
  name: "Line of Sight",
  family: "move",
  alsoCalled: ["LOS", "Cover"],
  blurb: "You can only hit what you can see. Walls block your view.",
  complexity: "Medium",
  components: ["Board or grid"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "Line of sight means drawing an imaginary straight line from your piece to your target. If something solid sits on that line, you cannot shoot.",
    "This turns the board into a puzzle about position. Players start hiding behind walls instead of running straight at each other.",
    "Video games do this automatically. On a table, you need a rule simple enough to check in a few seconds."
  ],
  howItWorks: [
    "Decide what blocks sight. Walls block. Low crates might only give cover. Other players might do neither.",
    "Choose a checking method. A piece of string held between two models is the fastest.",
    "Decide whether partly blocked counts. Many games call this cover and make the shot harder instead of impossible.",
    "Mark blocking terrain clearly. Players should see at a glance what is solid.",
    "Test with two players who disagree. If they argue for more than ten seconds, the rule is too vague."
  ],
  games: [
    { title: "Warhammer 40,000: Kill Team", note: "Players physically look from behind the model to check what it can see." },
    { title: "XCOM", note: "Shows cover as a shield icon, so the player never has to work it out." },
    { title: "Khet", note: "Built entirely around sight lines, using a real laser to settle every argument." }
  ],
  watchOut: [
    "This is the rule players argue about most. Write it once, clearly, and put it on the reference card.",
    "Tall terrain looks great but makes checking slow. Keep some of it low."
  ],
  tryThis: "Put a wall in the middle of your board. Give one player a piece behind it. Ask both players where the wall stops the shot. Where they disagree is where your rule needs work.",
  links: [
    { label: "Kill Team free rules and downloads", url: "https://www.warhammer-community.com/en-gb/downloads/kill-team/", kind: "Rules", vpn: false },
    { label: "How games calculate what you can see", url: "https://www.redblobgames.com/articles/visibility/", kind: "Article", vpn: false },
    { label: "Line of sight as a game rule", url: "https://en.wikipedia.org/wiki/Line_of_sight_(gaming)", kind: "Article", vpn: true }
  ],
  media: {
    image: null,
    imageNeed: "Photo of a string or laser pointer being used to check a sight line across terrain.",
    video: null,
    videoNeed: "Clip of a player crouching to model eye level to check line of sight.",
    diagram: "move-line-of-sight"
  }
},

/* ── FAIRNESS AND CATCH-UP ───────────────────────────────────────── */
{
  slug: "the-coin",
  name: "The Coin",
  family: "fair",
  alsoCalled: ["First player compensation", "Komi"],
  blurb: "The player who goes second gets a small gift to even things out.",
  complexity: "Simple",
  components: ["Cards", "Tokens"],
  playerFit: ["Works at 2"],
  origin: "video game",
  whatItIs: [
    "Going first is an advantage in almost every game. You get to act before anyone can stop you.",
    "In Hearthstone, the player who goes second receives a card called The Coin. It gives them one extra resource, once.",
    "That small gift is enough. It does not make the second player stronger overall. It just closes the gap."
  ],
  howItWorks: [
    "Play or model your game and count who wins. If the first player wins far more often, you have a problem.",
    "Give the second player a small one time benefit. An extra resource, an extra card, or a single extra move.",
    "Keep it small. The goal is to make the win rate even, not to flip it.",
    "Test again and count again. Adjust the size of the gift until both seats win about as often.",
    "Write the reason for the gift in your rules so players understand it is deliberate."
  ],
  games: [
    { title: "Hearthstone", note: "The second player gets The Coin, worth one extra mana on any single turn." },
    { title: "Go", note: "Uses komi. The second player starts with extra points already added to their score." },
    { title: "Magic: The Gathering", note: "Solves it the other way. The player going first gives up their first card draw." }
  ],
  watchOut: [
    "Guessing the size of the gift does not work. You have to count wins across many games.",
    "A gift that is too big just moves the unfairness to the other seat."
  ],
  tryThis: "Play your game ten times and write down who went first each time. If first player wins seven or more, design a coin of your own and test ten more.",
  links: [
    { label: "The Coin, on the Hearthstone wiki", url: "https://hearthstone.wiki.gg/wiki/The_Coin", kind: "Wiki", vpn: false },
    { label: "Hearthstone, and how a match starts", url: "https://en.wikipedia.org/wiki/Hearthstone", kind: "Article", vpn: true },
    { label: "Komi, the same idea in Go", url: "https://en.wikipedia.org/wiki/Komi_(Go)", kind: "Article", vpn: true }
  ],
  media: {
    image: {
      src: "media/coin.png",
      alt: "The Coin, a Hearthstone card costing zero mana, reading Gain 1 Mana Crystal this turn only",
      caption: "The whole rule fits on one card. The player going second gets one extra mana, once, and that is enough to even out the win rate."
    },
    imageNeed: "Not needed.",
    video: null,
    videoNeed: "Short clip of a Hearthstone match start where The Coin is dealt and then played.",
    diagram: "fair-first-player"
  }
},
{
  slug: "rubber-banding",
  name: "Rubber-Banding",
  family: "fair",
  alsoCalled: ["Catch-up mechanic", "Dynamic difficulty"],
  blurb: "Players who fall behind get help. Players in front get less.",
  complexity: "Medium",
  components: ["Cards", "Dice"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "video game",
  whatItIs: [
    "In a long game, a player who falls behind early can spend an hour knowing they cannot win. That player stops trying.",
    "Rubber-banding stretches the players back together. The game quietly helps whoever is losing.",
    "Mario Kart is the clearest example. Players near the back open item boxes and find powerful items. Players in first place find bananas.",
    "The name comes from the picture of a rubber band pulling the racers back into a group."
  ],
  howItWorks: [
    "Find one number that shows who is losing. Score, position, or resources all work.",
    "Choose a help that fires automatically when a player is behind by enough.",
    "Make the help useful but not decisive. It should give a chance, not a win.",
    "Make sure the help is visible. Players should understand why it happened.",
    "Test with a player who is far behind. Ask them whether they still want to keep playing."
  ],
  games: [
    { title: "Mario Kart 8", note: "Item strength depends on your race position, so last place gets the strongest items." },
    { title: "Mario Party", note: "Hands out bonus stars at the end, which can hand the win to a player who was behind." },
    { title: "Left 4 Dead", note: "A hidden system watches how the team is doing and sends fewer enemies when they struggle." }
  ],
  watchOut: [
    "Too much help feels like cheating. The player in first will notice and stop caring about their lead.",
    "Hiding the help entirely can feel unfair. Players should be able to see the rule working."
  ],
  tryThis: "Add one rule: the player in last place draws an extra card each round. Play a full game. Ask both the leader and the last place player whether it felt fair.",
  links: [
    { label: "How games adjust difficulty as you play", url: "https://en.wikipedia.org/wiki/Dynamic_game_difficulty_balancing", kind: "Article", vpn: true },
    { label: "Mario Kart 8 Deluxe items, by position", url: "https://www.mariowiki.com/Mario_Kart_8_Deluxe#Items", kind: "Wiki", vpn: false }
  ],
  media: {
    image: null,
    imageNeed: "Diagram or screenshot showing the Mario Kart item table by race position.",
    video: null,
    videoNeed: "Clip of a last place racer opening an item box and receiving a powerful item.",
    diagram: "fair-rubber-band"
  }
},
{
  slug: "bidding-for-turn-order",
  name: "Bidding for Turn Order",
  family: "fair",
  alsoCalled: ["Auction for first player"],
  blurb: "Going first is worth something, so players pay for the privilege.",
  complexity: "Medium",
  components: ["Tokens"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Instead of fixing the first player advantage with a gift, this rule sells it.",
    "Players bid resources for the right to go first. Whoever wants it most pays the most.",
    "This is elegant. The players themselves decide how much going first is worth, and that value changes as the game changes."
  ],
  howItWorks: [
    "Before the round, ask each player to bid a resource they care about. Coins, points, or actions all work.",
    "The highest bid takes the first seat. The next highest takes the second seat, and so on.",
    "Winners pay what they bid. Losers pay nothing.",
    "Play the round in that order.",
    "Bid again next round. The right price will move as the game state changes."
  ],
  games: [
    { title: "Small World", note: "Players pay coins onto the races they skip, so a strong race costs more to take." },
    { title: "Amun-Re", note: "Turn order comes from an auction, and the auction is most of the game." },
    { title: "Power Grid", note: "Turn order is set by how well you are doing, and leading means buying last." }
  ],
  watchOut: [
    "Bidding slows a game down. With five or more players, use a fast method such as one simultaneous secret bid.",
    "New players often bid badly and then fall behind. Give them a suggested opening bid in the rules."
  ],
  tryThis: "Add a single bidding round to the start of your game. Give every player five tokens and ask them to bid in secret for first place. See whether the bids change once players understand the game.",
  links: [
    { label: "Small World and its race auction", url: "https://en.wikipedia.org/wiki/Small_World_(board_game)", kind: "Article", vpn: true },
    { label: "Amun-Re, a game built on auctions", url: "https://en.wikipedia.org/wiki/Amun-Re_(board_game)", kind: "Article", vpn: true }
  ],
  media: {
    image: null,
    imageNeed: "Photo of players placing secret bids with closed fists over a table.",
    video: null,
    videoNeed: "Clip of a bidding round resolving, showing the reveal and the turn order it produces.",
    diagram: "fair-bidding"
  }
}
,
{
  slug: "rolling-for-initiative",
  name: "Rolling for Initiative",
  family: "turn",
  alsoCalled: ["Initiative", "Roll for turn order"],
  blurb: "Roll dice at the start of each round to decide who acts first.",
  complexity: "Simple",
  components: ["Dice"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Turn order is not decided by where you sit. It is decided by a dice roll, and it is rolled again every round.",
    "This keeps every round tense. A player who went last can suddenly be first, and a careful plan can fall apart before it starts.",
    "Dungeons & Dragons rolls initiative at the start of every fight. Many skirmish games roll to see who takes the first turn."
  ],
  howItWorks: [
    "At the start of each round, every player rolls one die.",
    "List the results from highest to lowest. That is the turn order.",
    "Break a tie with a second roll, or give the tie to the player who is behind.",
    "Play the round in that order.",
    "Roll again next round, so nobody keeps the good position."
  ],
  games: [
    { title: "Dungeons & Dragons", note: "Every fight opens with an initiative roll that fixes the order for the whole fight." },
    { title: "Warhammer 40,000", note: "Players roll off to see who takes the first turn, which is often the most important roll of the game." },
    { title: "Gloomhaven", note: "Uses the same idea without dice. The cards you play carry a number, and that number sets your place in the order." }
  ],
  watchOut: [
    "Rolling every round costs time. With six players that is a minute gone before anyone does anything.",
    "Losing the roll twice in a row feels like being punished by luck alone. Consider giving the loser a small benefit."
  ],
  tryThis: "Play one game where turn order goes around the table, and one where you roll for it each round. Ask your testers which game felt more tense, and which felt more fair.",
  links: [
    { label: "Free D&D basic rules", url: "https://media.wizards.com/2018/dnd/downloads/DnD_BasicRules_2018.pdf", kind: "Rules", vpn: false },
    { label: "How games handle turns and rounds", url: "https://en.wikipedia.org/wiki/Turns,_rounds_and_time-keeping_systems_in_games", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of four players rolling initiative dice together, results visible.", video: null, videoNeed: "Not needed.", diagram: "turn-initiative" }
},
{
  slug: "variable-turn-order",
  name: "Variable Turn Order",
  family: "turn",
  alsoCalled: ["Changing turn order"],
  blurb: "Turn order changes each round instead of going around the table.",
  complexity: "Medium",
  components: ["Cards", "Tokens"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Going around the table in the same order every round is easy to teach, but it hands a permanent advantage to whoever sits first.",
    "Variable turn order changes the order using something inside the game. It might follow the score, the cards played, or a choice each player made earlier.",
    "The clever part is choosing what decides the order. If the order follows the score, the leader gets slowed down for free."
  ],
  howItWorks: [
    "Pick one thing in your game that already changes each round. Score, money, or a played card all work.",
    "Write a rule that turns that thing into an order. Lowest score goes first is the most common.",
    "Show the order somewhere everyone can see, or players will lose track.",
    "Play the round in that order.",
    "Work the order out again at the start of the next round."
  ],
  games: [
    { title: "Power Grid", note: "The player doing best goes last in most phases, which is a catch-up rule hidden inside the turn order." },
    { title: "Citadels", note: "Each character card carries a number, and the numbers decide who acts when." },
    { title: "Gloomhaven", note: "Players and monsters are all sorted together by their initiative number, so enemies can act in the middle of your team." }
  ],
  watchOut: [
    "Players need to see the order at a glance. Without a track or a row of cards, this rule causes constant questions.",
    "If the order is decided by something players cannot predict, planning becomes guessing."
  ],
  tryThis: "Add one rule to your game: whoever has the fewest points goes first next round. Play it twice and see whether the leader still runs away with the game.",
  links: [
    { label: "Power Grid and its order rules", url: "https://en.wikipedia.org/wiki/Power_Grid", kind: "Article", vpn: true },
    { label: "Citadels, where the roles set the order", url: "https://en.wikipedia.org/wiki/Citadels_(card_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a turn order track with player markers in a changed order.", video: null, videoNeed: "Not needed.", diagram: "turn-variable" }
},
{
  slug: "real-time-and-timers",
  name: "Real Time and Timers",
  family: "turn",
  alsoCalled: ["Real time", "Sand timer games"],
  blurb: "No turns at all. Everyone plays at once against a clock.",
  complexity: "Medium",
  components: ["Timer"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Turns disappear completely. A timer starts, and every player acts as fast as they can until it runs out.",
    "This produces noise, shouting, and mistakes. That is the point. The pressure is the game.",
    "It also solves the waiting problem entirely, because there is never a moment when a player has nothing to do."
  ],
  howItWorks: [
    "Choose a length. Two to four minutes is enough for most rounds.",
    "Write rules that a panicking player can follow. Anything needing careful counting will not survive.",
    "Make sure two players grabbing the same piece has an obvious answer.",
    "Start the timer and let everyone play at once.",
    "When time runs out, everything stops immediately. Score what is on the table."
  ],
  games: [
    { title: "Galaxy Trucker", note: "Players build a spaceship out of shared tiles against a timer, then fly the mess they built." },
    { title: "Escape: The Curse of the Temple", note: "The whole game is ten minutes long and runs on a soundtrack that tells you when to run back." },
    { title: "Overcooked", note: "A video game built entirely on this. The kitchen never pauses, so players have to shout instructions at each other." }
  ],
  watchOut: [
    "Fast players win by being fast, not by thinking well. Decide whether that is the game you want.",
    "Real time is hard on anyone who processes instructions slowly, including students reading in a second language. Offer a longer timer as an option."
  ],
  tryThis: "Take one round of your game and give the whole table ninety seconds to do it at the same time. Watch what breaks. Whatever players argue about is a rule you have not written clearly enough.",
  links: [
    { label: "Galaxy Trucker and its build timer", url: "https://en.wikipedia.org/wiki/Galaxy_Trucker", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo taken mid-round of a real time game, hands blurred, timer visible.", video: null, videoNeed: "Clip of a real time round, showing the noise and the moment the timer ends.", diagram: "turn-realtime" }
},
{
  slug: "role-selection",
  name: "Role Selection",
  family: "turn",
  alsoCalled: ["Role choosing", "Follow the leader"],
  blurb: "You pick a job for the round. Everyone uses it, you use it best.",
  complexity: "Medium",
  components: ["Cards"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "A set of roles sits on the table. Builder, trader, soldier, and so on. On your turn you take one.",
    "The role you take happens for everybody. The difference is that you get a bonus and they do not.",
    "This makes every choice a double decision. You are asking what helps you, and also what you are willing to hand your rivals."
  ],
  howItWorks: [
    "Write four to six roles. Each one should do a clearly different job.",
    "Give each role a bonus that only the player who chose it receives.",
    "On their turn a player takes one role and everyone resolves it, starting with the chooser.",
    "Remove that role for the rest of the round so nobody repeats it.",
    "Return all the roles at the start of the next round."
  ],
  games: [
    { title: "Puerto Rico", note: "The best known version. Choosing the role your opponent needed is often stronger than choosing the one you wanted." },
    { title: "Citadels", note: "Roles are picked in secret, so half the game is guessing which one your rivals took." },
    { title: "Race for the Galaxy", note: "Everyone picks at once, and roles that two players picked happen only once." }
  ],
  watchOut: [
    "Players need to see what every role does at all times. Print them large and leave them face up.",
    "If one role is clearly the strongest, it gets taken every round and the choice disappears."
  ],
  tryThis: "Write four roles for your game on index cards. Play a round where the chosen role also helps everyone else, just less. See whether players start hesitating before they choose.",
  links: [
    { label: "Puerto Rico and its role selection", url: "https://en.wikipedia.org/wiki/Puerto_Rico_(board_game)", kind: "Article", vpn: true },
    { label: "Citadels, where the roles are secret", url: "https://en.wikipedia.org/wiki/Citadels_(card_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a row of face-up role cards with one being taken.", video: null, videoNeed: "Not needed.", diagram: "turn-roles" }
},
{
  slug: "point-to-point-movement",
  name: "Point to Point Movement",
  family: "move",
  alsoCalled: ["Network movement", "Node movement"],
  blurb: "Pieces travel along drawn routes between places, not across open ground.",
  complexity: "Simple",
  components: ["Board or grid"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "There is no grid. The board is a set of places joined by lines, like a map of a train network.",
    "A piece moves from one place to a connected place. If there is no line between them, there is no way to get there directly.",
    "This lets you control exactly where players can go. Distance stops being about centimetres and starts being about how many steps away something is."
  ],
  howItWorks: [
    "Draw your places as circles. Ten to thirty is a workable range.",
    "Draw lines only where travel should be possible. Every line you leave out is a decision.",
    "Decide how many steps a piece may take in a turn. One is often enough.",
    "Check for places with only one line in. Those become traps, which may be exactly what you want.",
    "Test whether any route is so much faster than the others that everyone uses it."
  ],
  games: [
    { title: "Ticket to Ride", note: "The routes between cities are the whole game. Players claim them so that others cannot use them." },
    { title: "Pandemic", note: "Cities connect by air and land, so a disease can jump across the world in one move." },
    { title: "Scotland Yard", note: "Different transport types use different routes, so the hidden player leaves clues just by moving." }
  ],
  watchOut: [
    "A place with too many connections becomes the centre of every game. Count the lines coming out of each one.",
    "Hand-drawn maps get messy fast. Keep the lines from crossing where you can."
  ],
  tryThis: "Draw your game map as circles and lines instead of a grid. Count the steps between the two furthest places. If it is more than six, players will spend the game travelling instead of playing.",
  links: [
    { label: "Ticket to Ride and its route map", url: "https://en.wikipedia.org/wiki/Ticket_to_Ride_(board_game)", kind: "Article", vpn: true },
    { label: "How games find paths across a map", url: "https://www.redblobgames.com/pathfinding/a-star/introduction.html", kind: "Article", vpn: false }
  ],
  media: { image: null, imageNeed: "Photo of a route-based board such as Ticket to Ride, shot from directly above.", video: null, videoNeed: "Not needed.", diagram: "move-points" }
},
{
  slug: "movement-points-and-terrain",
  name: "Movement Points and Terrain",
  family: "move",
  alsoCalled: ["Terrain cost", "Movement allowance"],
  blurb: "You get a movement budget, and rough ground costs more to cross.",
  complexity: "Medium",
  components: ["Board or grid"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "Each piece has a number of movement points. Every space you enter costs some of them.",
    "Open grass might cost one. A hill or a forest might cost two. A swamp might cost three, which eats a whole turn.",
    "Now the map itself makes decisions for the player. The short route through the swamp and the long route around it become a real choice."
  ],
  howItWorks: [
    "Give each piece a movement number. Four is a good starting point.",
    "Give each type of ground a cost. Keep it to three types at first.",
    "A piece may enter a space only if it has enough points left to pay for it.",
    "Points do not carry over to the next turn.",
    "Mark the costs on the board itself, or on a small key players can see."
  ],
  games: [
    { title: "Civilization VI", note: "Units spend movement crossing hills and forests, so the land shapes where wars actually happen." },
    { title: "Memoir '44", note: "Terrain slows units down and protects them, so the same hill is both hard to reach and hard to take." },
    { title: "Gloomhaven", note: "Difficult ground costs extra movement, which turns a room layout into a puzzle." }
  ],
  watchOut: [
    "Counting costs slows the game down. If players use their fingers to count every move, your numbers are too big.",
    "Terrain that only slows movement is boring. Give it a second effect, such as cover or a scoring bonus."
  ],
  tryThis: "Add one type of slow ground to your board. Give it a cost of two. Play a game and watch whether anyone ever chooses to cross it. If nobody does, the cost is too high.",
  links: [
    { label: "Memoir '44 and its terrain rules", url: "https://en.wikipedia.org/wiki/Memoir_%2744", kind: "Article", vpn: true },
    { label: "How movement cost works in games", url: "https://www.redblobgames.com/pathfinding/a-star/introduction.html", kind: "Article", vpn: false }
  ],
  media: { image: null, imageNeed: "Photo of a hex map with clearly different terrain types and a unit part way across.", video: null, videoNeed: "Not needed.", diagram: "move-terrain" }
},
{
  slug: "blocking-and-control-zones",
  name: "Blocking and Control Zones",
  family: "move",
  alsoCalled: ["Zone of control", "Blocking"],
  blurb: "Your pieces stop enemies moving freely past them.",
  complexity: "Medium",
  components: ["Board or grid"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "A piece does more than occupy its own space. It also affects the spaces around it.",
    "An enemy who enters one of those spaces has to stop, or pay extra, or cannot pass at all.",
    "This turns a piece into a wall. Standing still becomes a real move, which is a surprising and useful thing for students to discover."
  ],
  howItWorks: [
    "Decide how far the control reaches. One space in every direction is the usual answer.",
    "Decide what happens to an enemy who enters it. Stopping is the simplest rule.",
    "Decide whether two friendly pieces together do something stronger than one alone.",
    "Make sure a player can always escape somehow, or a trapped piece is just a dead piece.",
    "Test whether a defensive player can lock the whole board. If they can, weaken the effect."
  ],
  games: [
    { title: "Hive", note: "A piece may not move if doing so would split the hive, so every piece is holding the others in place." },
    { title: "Blokus", note: "Placed pieces block the shapes that can still fit, so the board slowly closes." },
    { title: "Chess", note: "A pinned piece cannot legally move, so a bishop can freeze a knight without touching it." }
  ],
  watchOut: [
    "Blocking rules reward defensive play. If it is too strong, both players build walls and the game stops.",
    "Players forget invisible zones. Consider showing the effect with a token rather than asking them to remember."
  ],
  tryThis: "Add one rule: an enemy piece must stop as soon as it moves next to yours. Play a game and count how often anyone gets past a defended line.",
  links: [
    { label: "Hive and its one-hive rule", url: "https://en.wikipedia.org/wiki/Hive_(game)", kind: "Article", vpn: true },
    { label: "Blokus and shape blocking", url: "https://en.wikipedia.org/wiki/Blokus", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a board position where two pieces close a lane, with the blocked route marked.", video: null, videoNeed: "Not needed.", diagram: "move-blocking" }
},
{
  slug: "tile-laying",
  name: "Tile Laying",
  family: "move",
  alsoCalled: ["Modular board", "Board building"],
  blurb: "There is no board at the start. Players build it while they play.",
  complexity: "Medium",
  components: ["Tokens", "Board or grid"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Instead of printing a board, you print tiles. Players draw them and add them to the table as the game goes on.",
    "Every game is played on a different map, so a strategy that won last time may not fit this time.",
    "It also means players are building the problem they then have to solve, which is a strange and interesting kind of decision."
  ],
  howItWorks: [
    "Design your tiles so that the edges match. Roads meet roads, rivers meet rivers.",
    "Write one placement rule. Touching an existing tile is the usual one.",
    "Decide what a player gains by placing well, or placing badly costs nothing and the choice is empty.",
    "Check that the map cannot grow so large that players cannot reach across it.",
    "Test what happens when a tile cannot legally be placed anywhere."
  ],
  games: [
    { title: "Carcassonne", note: "Players draw one tile and must place it, so a bad tile becomes a problem to solve rather than a card to discard." },
    { title: "Kingdomino", note: "Tiles are dominoes, and choosing a good one costs you your place in next round's order." },
    { title: "Betrayal at House on the Hill", note: "The house is built room by room as players explore it, so nobody knows the map until it exists." }
  ],
  watchOut: [
    "Tiles need a lot of table space. Measure your classroom desks before you design a big one.",
    "Matching edges is harder to design than it looks. Make a paper prototype and try to place thirty tiles in a row."
  ],
  tryThis: "Cut twenty square tiles from card. Draw a road on each one entering from one to four sides. Play a game where players must place a tile so at least one road connects. See how quickly a map with dead ends appears.",
  links: [
    { label: "Carcassonne and its tile rules", url: "https://en.wikipedia.org/wiki/Carcassonne_(board_game)", kind: "Article", vpn: true },
    { label: "Kingdomino, tile laying with dominoes", url: "https://en.wikipedia.org/wiki/Kingdomino", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a Carcassonne map part way through a game, showing how uneven it grows.", video: null, videoNeed: "Time lapse of a tile-laying map being built over a full game.", diagram: "move-tiles" }
}

,
{
  slug: "rolling-dice",
  name: "Rolling Dice",
  family: "chance",
  alsoCalled: ["Dice rolling", "Random number"],
  blurb: "The oldest randomiser. Every face is as likely as every other.",
  complexity: "Simple",
  components: ["Dice"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "A six-sided die gives six results, and each one happens as often as the others. Rolling a 1 is exactly as likely as rolling a 6.",
    "This is called a flat distribution. It produces wild swings, which is fine for a party game and terrible for anything a player is meant to plan around.",
    "Almost every tabletop game reaches for dice first. Knowing when not to is the more useful skill."
  ],
  howItWorks: [
    "Decide what the roll is for. Deciding an outcome, or deciding an amount, are different jobs.",
    "Pick the number of faces. Six is familiar. Twenty gives finer steps but bigger swings.",
    "Write down what each result does. If a player has to do arithmetic, keep the numbers small.",
    "Decide whether the player can change the result at all, or has to accept it.",
    "Play twenty rounds and check that no result makes the game unplayable."
  ],
  games: [
    { title: "Monopoly", note: "Movement comes entirely from dice, which is why players feel the game happens to them." },
    { title: "Yahtzee", note: "The dice are the whole game, but the player chooses what to keep, which is where the skill lives." },
    { title: "Warhammer 40,000", note: "Uses fistfuls of six-sided dice, so the swings even out and the result feels earned." }
  ],
  watchOut: [
    "A single die roll deciding who wins will make the loser feel cheated. Save big rolls for small decisions.",
    "Players remember bad luck far longer than good luck. If your game is 80 percent dice, expect complaints."
  ],
  tryThis: "Take a decision in your game that is currently a die roll. Replace it with a choice the player makes. Play both versions and ask your testers which one they wanted to talk about afterwards.",
  links: [
    { label: "Dice, and the many shapes they come in", url: "https://en.wikipedia.org/wiki/Dice", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of several dice types side by side, d6 through d20, with a ruler for scale.", video: null, videoNeed: "Not needed.", diagram: "chance-dice" }
},
{
  slug: "dice-pools",
  name: "Dice Pools",
  family: "chance",
  alsoCalled: ["Success counting", "Handful of dice"],
  blurb: "Roll a handful at once and count how many beat a target.",
  complexity: "Medium",
  components: ["Dice"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "Instead of rolling one die and reading the number, you roll several and count how many came up high enough.",
    "Roll six dice, count every 4 or higher, and you will usually get two or three hits. Almost never zero, almost never six.",
    "This is the quiet advantage of pools. More dice makes the result steadier, not just bigger. A strong unit feels reliable instead of lucky."
  ],
  howItWorks: [
    "Give each thing a pool size. A weak unit rolls two dice, a strong one rolls six.",
    "Set the target number. Four or higher on a six-sided die means each die is a coin flip.",
    "Roll the whole pool at once and count the successes.",
    "Turn successes into an effect. One success per point of damage is the simplest rule.",
    "Test the biggest pool in your game. If rolling it takes longer than ten seconds, the pool is too big."
  ],
  games: [
    { title: "Warhammer 40,000", note: "Attacks, wounds, and saves are all pools, so a big unit produces a predictable amount of damage." },
    { title: "Shadowrun", note: "Skills and gear all add dice to the same pool, so getting better means rolling more." },
    { title: "King of Tokyo", note: "Six dice rolled together, with the player choosing which to keep and reroll." }
  ],
  watchOut: [
    "Big pools take real time to roll and count. Give students a dice tray and a target number they can read at a glance.",
    "Adding one die to a small pool changes the odds much more than adding one to a big pool. Balance the small end carefully."
  ],
  tryThis: "Roll two dice and count hits on 4 or higher. Do it ten times and write down the results. Now do the same with six dice. Compare how spread out the two sets of results are.",
  links: [
    { label: "Dice pools and how they behave", url: "https://en.wikipedia.org/wiki/Dice_notation", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a rolled pool of six dice with the successes physically separated from the misses.", video: null, videoNeed: "Not needed.", diagram: "chance-pools" }
},
{
  slug: "one-die-or-two",
  name: "One Die or Two",
  family: "chance",
  alsoCalled: ["Bell curve", "Probability curve"],
  blurb: "Adding two dice together makes middle numbers far more common.",
  complexity: "Simple",
  components: ["Dice"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "One die is flat. Every number happens as often as every other number.",
    "Two dice added together are not flat at all. There is only one way to roll a 12, but six different ways to roll a 7.",
    "This means a 7 comes up six times as often as a 12. Catan is built on this fact, which is why the best land sits on 6 and 8 and the desert sits next to 2 and 12."
  ],
  howItWorks: [
    "Decide whether you want your result to be unpredictable or fairly reliable.",
    "For unpredictable, roll one die. Any result is as likely as any other.",
    "For reliable, roll two or three dice and add them. The result will cluster in the middle.",
    "Write out every possible total and count how many ways there are to make it. Do this before you balance anything.",
    "Put your rewards where the numbers actually land, not where they look nice."
  ],
  games: [
    { title: "Catan", note: "Resource numbers sit on a two dice curve, so a tile marked 8 pays out far more often than one marked 3." },
    { title: "Dungeons & Dragons", note: "Uses a flat twenty-sided die on purpose, so a weak character always has a real chance." },
    { title: "Backgammon", note: "Two dice, but read separately rather than added, which gives a different shape again." }
  ],
  watchOut: [
    "Students almost always assume two dice are flat. Make them count the combinations by hand once.",
    "A curve makes extreme results rare, which means when they do happen players remember them as unfair."
  ],
  tryThis: "Write out all 36 ways two dice can land. Count how many give each total from 2 to 12. Draw the shape. Then look at a Catan board and see whether the number placement now makes sense.",
  links: [
    { label: "Why two dice make a curve", url: "https://en.wikipedia.org/wiki/Dice#Probability", kind: "Article", vpn: true },
    { label: "Catan and its number placement", url: "https://en.wikipedia.org/wiki/Catan", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a Catan board with the number tokens clearly readable, to compare against the curve.", video: null, videoNeed: "Not needed.", diagram: "chance-curve" }
},
{
  slug: "push-your-luck",
  name: "Push Your Luck",
  family: "chance",
  alsoCalled: ["Press your luck", "Bust"],
  blurb: "Stop now and keep your points, or roll again and risk them all.",
  complexity: "Simple",
  components: ["Dice"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "You have gathered something valuable. You may stop and keep it, or continue and try for more.",
    "If you continue and fail, you lose everything you gathered this turn.",
    "The player decides where the line is, and that decision is the entire game. Watching someone else push one roll too far is half the fun."
  ],
  howItWorks: [
    "Give the player something that grows as they continue. Points, distance, or loot all work.",
    "Write a clear failure condition. Rolling a 1, or repeating a number already rolled, are both easy to check.",
    "Failing must lose the whole turn's gains, not just the last step. Anything gentler kills the tension.",
    "Let the player stop at any moment and bank what they have.",
    "Tune the odds so stopping early is sometimes correct. If pushing is always right, the choice is fake."
  ],
  games: [
    { title: "Can't Stop", note: "The purest version. You keep rolling until you cannot make a legal move, and then you lose the whole turn." },
    { title: "Blackjack", note: "Hit or stand is exactly this decision, with the added information of what the dealer is showing." },
    { title: "Deep Sea Adventure", note: "Every treasure you pick up slows you down, so greed literally costs you the air you need to get home." }
  ],
  watchOut: [
    "The turn belongs to one player while everyone else watches. Keep turns short or give the table something to do.",
    "If busting is too likely, players stop early every time and the mechanic disappears."
  ],
  tryThis: "Add a push your luck moment to one action in your game. Let a player repeat the action for more reward, losing everything on a roll of 1. Watch how long it takes before someone gets greedy.",
  links: [
    { label: "Push your luck as a game mechanic", url: "https://en.wikipedia.org/wiki/Press_Your_Luck", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a player's growing pile of gathered points, mid-decision.", video: null, videoNeed: "Clip of a player pushing one roll too far and losing everything.", diagram: "chance-push" }
},
{
  slug: "rerolls",
  name: "Rerolls and Second Chances",
  family: "chance",
  alsoCalled: ["Reroll", "Luck mitigation"],
  blurb: "A limited chance to try a bad roll again, which changes the odds a lot.",
  complexity: "Simple",
  components: ["Dice", "Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "The player rolls, dislikes the result, and spends something to roll again.",
    "This sounds small. It is not. Your chance of rolling at least one 5 or 6 on a single die is 33 percent. With one reroll it jumps to 55 percent.",
    "Rerolls also give the player something to do about bad luck, which changes how losing feels even when the result is the same."
  ],
  howItWorks: [
    "Decide what a reroll costs. A token, a card, or a once per game limit all work.",
    "Decide whether the player must accept the second result. Almost always yes.",
    "Decide whether they reroll everything or only the dice they choose.",
    "Give players a physical reminder, such as a token they hand back, or they will forget they have one.",
    "Work out the new odds before you price it. Rerolls are worth more than they look."
  ],
  games: [
    { title: "Yahtzee", note: "Two rerolls per turn, and choosing which dice to keep is the only skill in the game." },
    { title: "Warhammer 40,000", note: "Reroll abilities are among the most valuable things a unit can have, precisely because players underrate them." },
    { title: "XCOM", note: "Does the opposite. There are no rerolls, so a missed 90 percent shot has to be lived with, and players remember it for years." }
  ],
  watchOut: [
    "Students consistently price rerolls too cheaply. Make them calculate the change in odds first.",
    "Unlimited rerolls remove randomness entirely. There must be a hard limit."
  ],
  tryThis: "Roll one die twenty times and record how often you get a 5 or 6. Now roll again, allowing yourself one reroll each time. Compare. The difference is bigger than most people expect.",
  links: [
    { label: "Yahtzee and its two rerolls", url: "https://en.wikipedia.org/wiki/Yahtzee", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of reroll tokens next to a dice tray, showing the physical limit.", video: null, videoNeed: "Not needed.", diagram: "chance-reroll" }
},
{
  slug: "variable-setup",
  name: "Variable Setup",
  family: "chance",
  alsoCalled: ["Random setup", "Modular start"],
  blurb: "The board is arranged differently every game, so old plans stop working.",
  complexity: "Simple",
  components: ["Board or grid", "Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "The randomness happens once, before anyone has played a card. After that the game can be as skilful as you like.",
    "Catan looks like a fixed board but is not. The land tiles and the number tokens are laid out fresh each time.",
    "This is the cheapest way to make a game worth playing twice. One box becomes many different games without a single extra rule."
  ],
  howItWorks: [
    "Find the part of your board that shapes strategy most. Usually it is where the good resources sit.",
    "Turn that part into pieces that can be arranged differently.",
    "Write setup rules that stop a hopeless arrangement. No three best tiles touching, for example.",
    "Check that every player still starts with a fair position, or the game is decided before it begins.",
    "Play three games with different setups and see whether the winning strategy actually changed."
  ],
  games: [
    { title: "Catan", note: "Tiles and numbers are shuffled each game, so where you place your first settlement is a new problem every time." },
    { title: "Betrayal at House on the Hill", note: "The house is different every game and the ending is drawn from a stack of fifty." },
    { title: "Slay the Spire", note: "A video game version. The map, the cards, and the shops are all different each run." }
  ],
  watchOut: [
    "Random setup can produce a broken start. Write rules that forbid the worst arrangements.",
    "Setting up takes longer when it is not fixed. Time it. Ten minutes of setup for a twenty minute game is a bad trade."
  ],
  tryThis: "Take the fixed board from your game and cut it into six pieces that can be rearranged. Play three games with different arrangements. Note whether players opened the same way each time.",
  links: [
    { label: "Catan and its shuffled board", url: "https://en.wikipedia.org/wiki/Catan", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Two photos of the same game set up differently, shot from the same angle for comparison.", video: null, videoNeed: "Not needed.", diagram: "chance-setup" }
},
{
  slug: "deck-versus-dice",
  name: "A Deck Is Not Dice",
  family: "chance",
  alsoCalled: ["Card randomness", "Deck as randomiser"],
  blurb: "Dice forget every roll. A deck remembers every card already drawn.",
  complexity: "Medium",
  components: ["Cards"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "A die has no memory. Roll a 6 ten times and the chance of a 6 on the next roll is still one in six.",
    "A deck is different. Every card you draw is a card that cannot come again until the deck is shuffled.",
    "That gives a careful player something real to do. They can count what has gone and work out what is left. Randomness becomes something you can think about instead of something you suffer."
  ],
  howItWorks: [
    "Replace a die roll with a deck containing the same spread of results.",
    "Decide when the deck reshuffles. At the end of the deck is normal. Reshuffling early destroys the memory.",
    "Use a face-up discard pile so players can actually see what has gone.",
    "Check the deck size. Too small and players know exactly what is coming, too large and counting is pointless.",
    "Test whether anybody actually counts. If nobody does, the discard pile is probably not visible enough."
  ],
  games: [
    { title: "Gloomhaven", note: "Attack results come from a small deck, so players know when the good cards have already been spent." },
    { title: "Blackjack", note: "Card counting exists only because the deck has a memory. This is why casinos use several decks at once." },
    { title: "Ticket to Ride", note: "Five face-up cards mean the randomness is partly visible, so drawing becomes a decision rather than a gamble." }
  ],
  watchOut: [
    "Counting is a real skill, and it can leave a slower player far behind. Decide whether you want that gap in a classroom game.",
    "Shuffling takes time. A deck reshuffled every round is worse than dice in every way."
  ],
  tryThis: "Build a deck of twelve cards with the same spread as two dice. Play a round of your game with each. Ask your testers which felt more fair, and which felt more exciting.",
  links: [
    { label: "Card counting and deck memory", url: "https://en.wikipedia.org/wiki/Card_counting", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a face-up discard pile next to a shrinking draw deck.", video: null, videoNeed: "Not needed.", diagram: "chance-deck" }
}

,
{
  slug: "hand-management",
  name: "Hand Management",
  family: "cards",
  alsoCalled: ["Hand limit"],
  blurb: "You hold a few cards and never quite have the right one.",
  complexity: "Simple",
  components: ["Cards"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "A player holds a small hand of cards, usually five to eight. Each card does something different.",
    "The tension comes from the gap between what your hand can do and what the game is asking for. You will never have a card for every job.",
    "Choosing which job to leave undone is the actual decision, and a hand limit is what forces it."
  ],
  howItWorks: [
    "Set a hand size. Five is a good place to start, seven is generous.",
    "Enforce the limit at a fixed moment, usually the end of the turn. Excess cards are discarded.",
    "Make sure at least two cards in a typical hand are useful, or the player has no choice to make.",
    "Give players a way to change their hand, by drawing, discarding, or trading.",
    "Watch a playtest for a player holding a card for many turns. That card is probably too situational."
  ],
  games: [
    { title: "Ticket to Ride", note: "Holding train cards for a long route means not claiming short ones, and someone may take your route first." },
    { title: "7 Wonders", note: "Your hand shrinks each turn and passes on, so a card you save is a card you never get." },
    { title: "Uno", note: "The hand limit is the win condition. Getting rid of cards is the whole point." }
  ],
  watchOut: [
    "No hand limit means players hoard, and hoarding kills tension. Set a limit even if it feels generous.",
    "Cards that are useless most of the time make hands feel bad. Every card should be playable somehow."
  ],
  tryThis: "Cut your players' hand size by two. Play a full game. Note whether decisions got sharper or the game just got frustrating, and where the line was.",
  links: [
    { label: "7 Wonders and its shrinking hand", url: "https://en.wikipedia.org/wiki/7_Wonders_(board_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a fanned hand of cards from the holder's point of view.", video: null, videoNeed: "Not needed.", diagram: "cards-hand" }
},
{
  slug: "deck-building",
  name: "Deck Building",
  family: "cards",
  alsoCalled: ["Deckbuilder"],
  blurb: "Everyone starts with the same weak deck and improves it while playing.",
  complexity: "Complex",
  components: ["Cards"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "Every player begins with the same ten boring cards. During the game you buy better ones, and they go into your own deck.",
    "The important part is that bought cards are not played immediately. They get shuffled in, so you draw them later.",
    "This makes buying a bad card genuinely harmful. It will keep coming back into your hand all game and take the place of something good."
  ],
  howItWorks: [
    "Give every player the same small starting deck of weak cards.",
    "Put a shared row of better cards in the middle for players to buy.",
    "Buying puts the card into the buyer's discard pile, not their hand.",
    "When a player's deck runs out, they shuffle their discard pile to make a new deck.",
    "Give players a way to remove starting cards, or the weak ones clog the deck forever."
  ],
  games: [
    { title: "Dominion", note: "The game that started it. The shared row changes every play, so the right strategy changes with it." },
    { title: "Slay the Spire", note: "A video game deckbuilder where refusing a free card is often the strongest move." },
    { title: "Star Realms", note: "A fast two player version that fits in a pocket and teaches the idea in one game." }
  ],
  watchOut: [
    "This is the most complex family on this page. Do not attempt it as your first design.",
    "Without a way to remove cards, decks become bloated and every turn feels the same. Include a trash option."
  ],
  tryThis: "Build a ten card starting deck where eight cards are nearly useless. Offer five good cards to buy. Play and count how many turns pass before a bought card actually appears in hand.",
  links: [
    { label: "Dominion and the deck building idea", url: "https://en.wikipedia.org/wiki/Dominion_(card_game)", kind: "Article", vpn: true },
    { label: "Deck building as a genre", url: "https://en.wikipedia.org/wiki/Deck-building_game", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Two photos of the same player's deck, at turn one and at the end, showing how it changed.", video: null, videoNeed: "Not needed.", diagram: "cards-deckbuild" }
},
{
  slug: "drafting",
  name: "Drafting",
  family: "cards",
  alsoCalled: ["Pick and pass", "Booster draft"],
  blurb: "Take one card from the pack, then pass the rest to your neighbour.",
  complexity: "Medium",
  components: ["Cards"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Everyone gets a pack of cards. You take one and pass the rest along. The pack keeps moving until it is empty.",
    "This means what you pass on matters as much as what you keep. Handing your neighbour exactly what they needed is a real mistake.",
    "It also scales beautifully. Everyone picks at the same time, so a six player draft takes no longer than a three player one."
  ],
  howItWorks: [
    "Deal every player an equal pack. Seven cards is a common size.",
    "Everyone chooses one card at the same time and places it face down.",
    "Everyone passes the rest of their pack in the same direction.",
    "Repeat until the packs are empty, then reverse direction for the next round.",
    "Make sure a card is worth different amounts to different players, or there is nothing to think about."
  ],
  games: [
    { title: "7 Wonders", note: "Three rounds of drafting, with the pass direction reversing, so you learn what your neighbours are building." },
    { title: "Sushi Go", note: "The gentlest introduction. Small cards, simple scoring, and the whole game is one long draft." },
    { title: "Magic: The Gathering", note: "Booster draft is a competitive format in its own right, where reading what other players are taking is a serious skill." }
  ],
  watchOut: [
    "Players must not see each other's face down picks, which is hard around a small classroom desk.",
    "If one card is best for everyone, drafting turns into a race rather than a decision."
  ],
  tryThis: "Make a pack of seven cards where each card helps a different strategy. Draft with four players. Afterwards, ask each player which card they most regretted passing.",
  links: [
    { label: "7 Wonders and its three draft rounds", url: "https://en.wikipedia.org/wiki/7_Wonders_(board_game)", kind: "Article", vpn: true },
    { label: "Booster draft, where the format began", url: "https://en.wikipedia.org/wiki/Booster_draft", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of four players mid-draft, packs held, one card face down in front of each.", video: null, videoNeed: "Clip of a full pass around the table, showing packs shrinking.", diagram: "cards-draft" }
},
{
  slug: "deck-cycling",
  name: "Draw, Discard, Reshuffle",
  family: "cards",
  alsoCalled: ["Deck cycling", "Card economy"],
  blurb: "Cards move from deck to hand to discard, then shuffle back around.",
  complexity: "Medium",
  components: ["Cards"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Cards travel in a loop. They leave the deck, get played, go to the discard pile, and eventually get shuffled back into the deck.",
    "How fast that loop turns is a number you control, and it changes the whole feel of a game.",
    "A fast loop means players see their best card often, so the game feels generous. A slow loop makes every good card feel precious."
  ],
  howItWorks: [
    "Decide how many cards a player draws each turn.",
    "Decide what happens to cards after they are played. Discard, remove, or return to hand are all different games.",
    "Set the deck size. Divide it by the draw rate to find how many turns one full loop takes.",
    "Choose whether the discard pile is face up. Face up lets players plan, face down keeps them guessing.",
    "Count how many turns pass before a specific card comes back. If it is more than eight, players will forget it exists."
  ],
  games: [
    { title: "Dominion", note: "The loop is the game. Players work out exactly which turn their best card will reappear." },
    { title: "Gloomhaven", note: "Played cards are gone until you rest, so the loop is a resource that slowly runs out." },
    { title: "Slay the Spire", note: "A small deck cycles several times per fight, so adding one bad card is felt immediately." }
  ],
  watchOut: [
    "Shuffling is slow and students hate it. Keep decks small enough to shuffle quickly.",
    "If cards are removed from the game permanently, check that a player cannot run out entirely and be stuck."
  ],
  tryThis: "Count your deck size and divide by your draw rate. That is how many turns one loop takes. Now halve the deck and play again. Note how differently the game feels.",
  links: [
    { label: "Dominion and its deck cycle", url: "https://en.wikipedia.org/wiki/Dominion_(card_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo showing deck, hand, and discard pile laid out together as a loop.", video: null, videoNeed: "Not needed.", diagram: "cards-cycle" }
},
{
  slug: "set-collection",
  name: "Set Collection",
  family: "cards",
  alsoCalled: ["Matching sets", "Collections"],
  blurb: "Matching cards are worth much more together than apart.",
  complexity: "Simple",
  components: ["Cards", "Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Players gather cards that go together. Three of the same colour, or one of each of five types.",
    "The reward has to grow faster than the number of cards. Three matching cards being worth twelve, when one is worth one, is what makes a set worth chasing.",
    "This creates a good kind of pain. You can see the set you need, and so can everyone else."
  ],
  howItWorks: [
    "Decide what makes a set. Same type or one of each type are the two main options.",
    "Write a scoring table where the value climbs steeply. One, three, six, twelve is a common shape.",
    "Decide when sets score. At the end keeps things tense, immediately keeps things clear.",
    "Make sure players can see roughly what others are collecting, or nobody can compete for anything.",
    "Test whether an unfinished set is worth anything. If it is worth nothing, near misses will feel cruel."
  ],
  games: [
    { title: "Ticket to Ride", note: "You collect matching train colours, and a longer route needs a bigger matching set." },
    { title: "Sushi Go", note: "Different foods score in different set shapes, so players chase several patterns at once." },
    { title: "Rummy", note: "The classic version, played with a standard deck and no equipment at all." }
  ],
  watchOut: [
    "A steep scoring table means the leader can be far ahead without it being obvious. Keep scores visible.",
    "Collecting nothing but the biggest set is often the best play. Add a bonus for variety if you want spread."
  ],
  tryThis: "Write two scoring tables for the same set: one that climbs gently and one that climbs steeply. Play a game with each. See which one made players take risks.",
  links: [
    { label: "Set collection in games", url: "https://en.wikipedia.org/wiki/Rummy", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a completed set next to an unfinished one, with the score difference shown.", video: null, videoNeed: "Not needed.", diagram: "cards-sets" }
},
{
  slug: "trick-taking",
  name: "Trick Taking",
  family: "cards",
  alsoCalled: ["Tricks", "Following suit"],
  blurb: "Everyone plays one card, and the highest of the first suit wins them all.",
  complexity: "Medium",
  components: ["Cards"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "One player leads a card. Everyone else must play the same suit if they have one. The highest card of the led suit takes the pile.",
    "The rule about following suit is what makes this interesting. A high card of the wrong suit is worth nothing at all.",
    "Because players cannot follow when they run out, everyone learns what everyone else is missing. The game becomes an exercise in reading the table."
  ],
  howItWorks: [
    "Deal every player an equal hand. Deal the whole deck if you can.",
    "The leader plays any card. That card sets the suit for this trick.",
    "Every other player must play the same suit if they hold one. If not, they may play anything.",
    "The highest card of the led suit takes the trick. The winner leads the next one.",
    "Decide what winning tricks is worth. Sometimes taking tricks is good, and sometimes avoiding them is."
  ],
  games: [
    { title: "Hearts", note: "Reverses the goal. Taking tricks is bad, so players try to lose on purpose without being obvious." },
    { title: "The Crew", note: "A cooperative trick taker where players cannot say what is in their hand, only signal it once." },
    { title: "Spades", note: "Players bid how many tricks they will take, so both taking too few and too many hurt." }
  ],
  watchOut: [
    "Following suit is the rule new players forget most often. Print it on the table if you can.",
    "This family needs a full deck and an equal deal, so it does not work with an odd number of players unless you plan for it."
  ],
  tryThis: "Play three hands of Hearts. Notice how quickly you start tracking which suits other players have run out of. That tracking is the mechanic doing its job.",
  links: [
    { label: "How trick taking works", url: "https://en.wikipedia.org/wiki/Trick-taking_game", kind: "Article", vpn: true },
    { label: "Hearts, where taking tricks is bad", url: "https://en.wikipedia.org/wiki/Hearts_(card_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a completed trick with the winning card clearly identifiable.", video: null, videoNeed: "Clip of one trick played out, narrating why the off-suit card lost.", diagram: "cards-trick" }
},
{
  slug: "multi-use-cards",
  name: "Multi-Use Cards",
  family: "cards",
  alsoCalled: ["Multipurpose cards", "Card as resource"],
  blurb: "One card can be spent in several different ways, and you pick one.",
  complexity: "Medium",
  components: ["Cards"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "The same card can be played for its action, or spent as money, or thrown away to move faster. The player chooses which.",
    "This gets you a lot of decisions out of a small deck. Twenty cards with three uses each is a much richer game than sixty single use cards.",
    "It also means every card you play is two things you gave up, which is the feeling most designers are chasing."
  ],
  howItWorks: [
    "Give each card one printed action, its most specific use.",
    "Add one or two generic uses that every card shares, such as spending it as one coin.",
    "Make sure the generic use is genuinely tempting, or players will always play the action.",
    "Print all the uses on the card. Nobody should need the rulebook mid turn.",
    "Test whether any card gets used one way every single time. If so, its other uses are priced wrong."
  ],
  games: [
    { title: "Race for the Galaxy", note: "Cards are worlds to settle, and also the currency you pay with, so building means throwing away options." },
    { title: "Glory to Rome", note: "Every card has four uses, and learning to see all four is most of the difficulty." },
    { title: "Lost Cities", note: "A gentler version. Every card is either played forward or discarded, and both choices hurt." }
  ],
  watchOut: [
    "Cards get crowded. If you cannot fit all the uses legibly, you have too many.",
    "New players see only the printed action. Teach the generic use in the first round or it will be ignored."
  ],
  tryThis: "Take your existing deck and add one rule: any card may be discarded to gain one resource instead of being played. Play a game. Count how often players use the new option.",
  links: [
    { label: "Race for the Galaxy and its card uses", url: "https://en.wikipedia.org/wiki/Race_for_the_Galaxy", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Close photo of a multi-use card with each of its uses labelled on the image.", video: null, videoNeed: "Not needed.", diagram: "cards-multiuse" }
}

,
{
  slug: "resource-gathering",
  name: "Gathering Resources",
  family: "econ",
  alsoCalled: ["Production", "Income"],
  blurb: "Land or buildings you own hand you materials on a schedule.",
  complexity: "Simple",
  components: ["Tokens", "Dice"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Players own something that produces. A field makes wheat, a mine makes ore, a village makes people.",
    "The production happens on a schedule you do not control. Often it is triggered by a dice roll, so income arrives when the game says so.",
    "The real decision happens before any of that, when you chose where to build. After that you are living with it."
  ],
  howItWorks: [
    "Decide what your resources are. Three or four types is plenty.",
    "Decide what produces them, and how often.",
    "Choose a trigger. Every turn is predictable. A dice roll is tense.",
    "Give players a place to keep their resources where the amount is visible to everyone.",
    "Check that no player can be shut out of a resource entirely, or they cannot play at all."
  ],
  games: [
    { title: "Catan", note: "Every settlement pays out when its number is rolled, so placement at the start decides most of the game." },
    { title: "Agricola", note: "Resources accumulate on the board turn by turn, so waiting makes a space more valuable." },
    { title: "Stardew Valley", note: "A video game version. Crops take a set number of days, so planting is a bet on what you will need later." }
  ],
  watchOut: [
    "If income is random, a player can go several turns with nothing. Give them something to do while they wait.",
    "Too many resource types means constant sorting. Four is usually the ceiling for a school game."
  ],
  tryThis: "Give your game three resources and make production happen on a dice roll. Play ten turns and record how much each player received. If one player got half of everything, your placement rules need work.",
  links: [
    { label: "Catan and its production rules", url: "https://en.wikipedia.org/wiki/Catan", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a Catan board mid-production, with resource cards being handed out.", video: null, videoNeed: "Not needed.", diagram: "econ-gather" }
},
{
  slug: "worker-placement",
  name: "Worker Placement",
  family: "econ",
  alsoCalled: ["Action selection", "Placing workers"],
  blurb: "Put a worker on a job to claim it, and nobody else can use it.",
  complexity: "Medium",
  components: ["Tokens", "Board or grid"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "The board shows a set of jobs. Chop wood, build, trade, have a child. Each job has room for one worker.",
    "You place a worker on a job to take it. Once it is taken, nobody else can use it this round.",
    "That blocking is the whole point. The game is not really about which job you want, it is about which job you can take before someone else does."
  ],
  howItWorks: [
    "Draw six to ten job spaces on the board. Each does something clearly different.",
    "Give each player two or three workers to start with.",
    "Players take turns placing one worker at a time onto an empty space and resolving it.",
    "When all workers are placed, the round ends and everyone takes their workers back.",
    "Add a way to gain more workers, so growing your team is itself a strategy."
  ],
  games: [
    { title: "Agricola", note: "The classic. There are always more jobs you need than workers you have, and someone always takes the one you needed." },
    { title: "Lords of Waterdeep", note: "A gentler introduction with clearer icons and shorter turns." },
    { title: "Viticulture", note: "Adds a season structure, so a job available in spring is gone by autumn." }
  ],
  watchOut: [
    "With five or more players, spaces run out fast and the last player can be left with nothing. Add spaces as players are added.",
    "The player who goes first has a real advantage here. Pair this with variable turn order."
  ],
  tryThis: "Draw eight job spaces and give each of three players two workers. Play one round. Ask the last player to place how many of their preferred jobs were still open.",
  links: [
    { label: "Worker placement as a mechanic", url: "https://en.wikipedia.org/wiki/Worker_placement", kind: "Article", vpn: true },
    { label: "Agricola, the game that popularised it", url: "https://en.wikipedia.org/wiki/Agricola_(board_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a worker placement board with most spaces occupied by different coloured workers.", video: null, videoNeed: "Not needed.", diagram: "econ-workers" }
},
{
  slug: "trading",
  name: "Trading and Negotiation",
  family: "econ",
  alsoCalled: ["Bartering", "Player trading"],
  blurb: "Players swap goods directly, and argue about what a fair price is.",
  complexity: "Simple",
  components: ["Tokens", "Cards"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Players hold different things and want different things. A trade lets both of them end up better off.",
    "The rules do not set the price. The players do, by talking. That makes this the most social mechanic on this page.",
    "It also gives the table a way to respond to a runaway leader, because everyone can simply refuse to trade with them."
  ],
  howItWorks: [
    "Give players resources that are unevenly distributed. If everyone has the same things, nobody trades.",
    "Say clearly when trading is allowed. On your turn only is the usual answer, and it keeps games short.",
    "Decide whether promises about future turns count. Most games say they do not, which avoids long arguments.",
    "Decide whether trades must be equal in number. Letting them be unequal is more interesting.",
    "Watch a game for a player nobody will trade with. Decide whether that is a feature or a problem."
  ],
  games: [
    { title: "Catan", note: "Trading is where the game actually lives. Players who negotiate well beat players who roll well." },
    { title: "Monopoly", note: "Property trading is the only real decision in the game, and most players never use it." },
    { title: "Sidereal Confluence", note: "Built entirely around trading, with every faction valuing goods differently." }
  ],
  watchOut: [
    "Confident talkers beat quiet ones, which is a problem in a mixed language classroom. Consider a fixed trade rate as an option.",
    "Negotiation makes turns run long. Set a timer if your lesson is one period."
  ],
  tryThis: "Give four players four different resources and a goal that needs all four. Allow trading only on your own turn. Time the game. Then allow trading at any time and time it again.",
  links: [
    { label: "Catan and player trading", url: "https://en.wikipedia.org/wiki/Catan", kind: "Article", vpn: true },
    { label: "Negotiation games as a family", url: "https://en.wikipedia.org/wiki/Negotiation", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of two players mid-trade, cards held out over the board.", video: null, videoNeed: "Clip of a trade negotiation, showing the back and forth.", diagram: "econ-trade" }
},
{
  slug: "engine-building",
  name: "Engine Building",
  family: "econ",
  alsoCalled: ["Building an engine", "Compounding"],
  blurb: "Each thing you buy makes the next thing cheaper or faster.",
  complexity: "Complex",
  components: ["Cards", "Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "You spend the early game buying things that produce nothing you can score with. They only make you better at buying.",
    "Then those purchases start feeding each other, and your income climbs faster and faster.",
    "This is why an engine game feels like nothing is happening for the first several turns and then feels amazing. The shape of that climb is the design problem."
  ],
  howItWorks: [
    "Make cheap early purchases that increase income rather than score.",
    "Make sure buying two things together is worth more than buying them separately.",
    "Put an end condition on the game, or the engine simply grows forever.",
    "Give a player who ignores the engine some way to compete, or the strategy is forced.",
    "Draw your expected income curve before you playtest, then compare it to what actually happened."
  ],
  games: [
    { title: "Splendor", note: "The gentlest engine game there is. Each gem card you buy permanently discounts every future card." },
    { title: "Wingspan", note: "Birds you play trigger other birds, so a well built board does several things per turn." },
    { title: "Factorio", note: "A video game that is nothing but engine building, where the whole map becomes one machine." }
  ],
  watchOut: [
    "The end condition decides everything. Too late and the biggest engine always wins, too early and building one was a waste.",
    "A player who falls behind early can never catch up here. Pair this with a catch-up rule."
  ],
  tryThis: "Add one card to your game that permanently makes a future action cheaper. Play a game and write down each player's income every turn. Draw the two curves and compare them.",
  links: [
    { label: "Splendor and its discount engine", url: "https://en.wikipedia.org/wiki/Splendor_(game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a built-up Splendor or Wingspan board late in a game, showing the accumulated engine.", video: null, videoNeed: "Not needed.", diagram: "econ-engine" }
},
{
  slug: "changing-prices",
  name: "Markets and Changing Prices",
  family: "econ",
  alsoCalled: ["Supply and demand", "Price track"],
  blurb: "The more people buy something, the more the next one costs.",
  complexity: "Complex",
  components: ["Board or grid", "Tokens"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Prices are not printed on the card. They sit on a track that moves as players buy and sell.",
    "Buying pushes the price up for whoever comes next. Selling pushes it down.",
    "This punishes being slow without any rule saying so, and it teaches supply and demand better than a diagram does."
  ],
  howItWorks: [
    "Draw a price track for each good, with maybe eight steps.",
    "Every purchase moves that good's marker one step up.",
    "Decide whether prices drift back down over time, and how fast.",
    "Keep the track large and public so players can see a price rising before they commit.",
    "Test whether one good becomes worthless. If a price hits the bottom and stays, you need a floor."
  ],
  games: [
    { title: "Power Grid", note: "Fuel prices rise as players buy, so the leader pays the most for everything." },
    { title: "Stockpile", note: "Share prices move from player actions and hidden information, so guessing the market is the game." },
    { title: "Container", note: "Players set their own prices, and the whole economy is built by the table." }
  ],
  watchOut: [
    "This is genuinely complicated to balance. Do not use it unless your game is otherwise simple.",
    "Moving markers every purchase slows turns. Consider adjusting prices once per round instead."
  ],
  tryThis: "Give one resource a price track from one to eight. Move it up every time anyone buys. Play a game and see whether players start racing to buy first.",
  links: [
    { label: "Power Grid and its rising fuel costs", url: "https://en.wikipedia.org/wiki/Power_Grid", kind: "Article", vpn: true },
    { label: "Supply and demand, plainly", url: "https://en.wikipedia.org/wiki/Supply_and_demand", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a price track partway through a game, with markers at different heights.", video: null, videoNeed: "Not needed.", diagram: "econ-market" }
},
{
  slug: "upkeep-costs",
  name: "Upkeep Costs",
  family: "econ",
  alsoCalled: ["Maintenance", "Feeding your people"],
  blurb: "Everything you own has to be paid for again next turn.",
  complexity: "Medium",
  components: ["Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "Owning something is not free. Every building, soldier, or worker costs you a small amount each round to keep.",
    "This changes what growth means. Expanding fast is no longer obviously good, because a big empire can starve.",
    "It also solves the runaway leader problem quietly. The player in front is paying the largest bill."
  ],
  howItWorks: [
    "Give each owned thing a small recurring cost. One coin or one food per round is enough.",
    "Collect upkeep at the same moment every round, before players spend on anything else.",
    "Decide what happens when a player cannot pay. Losing a building is the usual answer.",
    "Make sure income can outgrow upkeep, or the game only shrinks.",
    "Chart income and upkeep across a test game. Find the turn where the lines cross."
  ],
  games: [
    { title: "Agricola", note: "You must feed your family every harvest, so having more people is both the goal and the danger." },
    { title: "Scythe", note: "Popularity and resources both cost to maintain, so overextending is a real risk." },
    { title: "Civilization VI", note: "Units and buildings cost gold every turn, so a huge army can bankrupt a strong empire." }
  ],
  watchOut: [
    "Upkeep is bookkeeping. Keep the numbers tiny or players will resent the arithmetic.",
    "A player who cannot pay can enter a death spiral they never escape. Put a floor under the punishment."
  ],
  tryThis: "Add a rule that each building costs one resource per round to keep. Play a game and note whether anyone chose not to build something they could afford.",
  links: [
    { label: "Agricola and feeding your family", url: "https://en.wikipedia.org/wiki/Agricola_(board_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a player paying upkeep, with the cost visibly larger than their income.", video: null, videoNeed: "Not needed.", diagram: "econ-upkeep" }
},
{
  slug: "conversion-chains",
  name: "Conversion Chains",
  family: "econ",
  alsoCalled: ["Production chain", "Refining"],
  blurb: "Raw goods become useful goods become points, one step at a time.",
  complexity: "Medium",
  components: ["Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Wood is worth almost nothing. Three wood becomes a plank. Two planks become a house. The house is worth points.",
    "Each step costs a turn, so the thing at the end of the chain is expensive in time, not only in materials.",
    "Short chains make a fast, clear game. Long chains reward players who plan several turns ahead, and punish players who do not."
  ],
  howItWorks: [
    "Draw your chain on paper before you build anything. Raw good, middle good, final good.",
    "Decide the exchange rate at each step. Three to one is a common shape.",
    "Decide whether converting costs an action, or happens automatically.",
    "Count the turns needed to go from raw to final. That number is how long your game will feel.",
    "Check that a player can start the chain from more than one place, or the first step becomes a bottleneck everyone fights over."
  ],
  games: [
    { title: "Splendor", note: "Gems buy cards, cards act as permanent gems, and those buy the cards that score. A three step chain in a fifteen minute game." },
    { title: "Puerto Rico", note: "You grow crops, ship them, and turn them into points, and every step needs a different role." },
    { title: "Factorio", note: "The video game version taken to its extreme, with chains dozens of steps long." }
  ],
  watchOut: [
    "Each extra step adds a turn to the game. A four step chain in a classroom period is usually too many.",
    "If one step is much slower than the others, everything backs up behind it. Watch for the pile that keeps growing."
  ],
  tryThis: "Draw your chain and mark how many turns each step takes. Add them up. If the total is more than a third of your game length, cut a step out.",
  links: [
    { label: "Splendor and its gem chain", url: "https://en.wikipedia.org/wiki/Splendor_(game)", kind: "Article", vpn: true },
    { label: "Puerto Rico, growing and shipping", url: "https://en.wikipedia.org/wiki/Puerto_Rico_(board_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of physical components laid out as a chain, raw goods on the left through to points on the right.", video: null, videoNeed: "Not needed.", diagram: "econ-chain" }
}

,
{
  slug: "attack-rolls",
  name: "Attack Rolls and Defence",
  family: "combat",
  alsoCalled: ["To hit roll", "Armour saves"],
  blurb: "Roll to hit, then the defender rolls to survive it.",
  complexity: "Medium",
  components: ["Dice"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "An attack is not one roll. It is a small sequence. Did you hit, did it hurt, and did their armour stop it.",
    "Each step throws away some of the attacks. Ten shots might become seven hits, then three wounds, then two casualties.",
    "This gives you a lot of dials to balance with. It also makes combat slow, so every extra roll needs to earn its place."
  ],
  howItWorks: [
    "Decide how many steps your attack has. Two is fast, three is the usual wargame answer.",
    "Give the attacker a target number to hit. Four or higher on a six sided die is an even chance.",
    "Give the defender a saving roll based on their armour.",
    "Work out the chance of a hit surviving all the steps. Multiply the chances together.",
    "Time one full round of combat. If it takes more than two minutes, remove a step."
  ],
  games: [
    { title: "Warhammer 40,000", note: "Three rolls per attack, which is why a big battle takes an afternoon and feels satisfying." },
    { title: "Dungeons & Dragons", note: "One roll to hit against an armour number, then a separate damage roll. Faster, and the tension sits in one roll." },
    { title: "Risk", note: "Attacker and defender roll at once and compare, which is the fastest version of the same idea." }
  ],
  watchOut: [
    "Each step you add multiplies the rolling. Three steps for twenty attackers is sixty dice.",
    "Students often make hits too likely. If almost everything hits, the rolls are just a slow way of subtracting."
  ],
  tryThis: "Work out the chance of a wound surviving your whole attack sequence by multiplying the chances. If the answer is under 15 percent, your combat will feel like nothing ever happens.",
  links: [
    { label: "Kill Team free rules and downloads", url: "https://www.warhammer-community.com/en-gb/downloads/kill-team/", kind: "Rules", vpn: false },
    { label: "Free D&D basic rules", url: "https://media.wizards.com/2018/dnd/downloads/DnD_BasicRules_2018.pdf", kind: "Rules", vpn: false }
  ],
  media: { image: null, imageNeed: "Photo of a full attack sequence laid out, dice grouped by step.", video: null, videoNeed: "Clip of one attack resolved from start to finish, naming each roll.", diagram: "combat-attack" }
},
{
  slug: "hit-points",
  name: "Hit Points and Damage",
  family: "combat",
  alsoCalled: ["HP", "Wounds", "Health"],
  blurb: "A piece can take several hits before it is removed.",
  complexity: "Simple",
  components: ["Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Instead of being destroyed by one hit, a piece has a pool of health that hits chip away at.",
    "The value is that everyone at the table can see how close something is to dying. That visible countdown is what makes people lean in.",
    "It also lets you make some pieces tough and some fragile without changing any other rule."
  ],
  howItWorks: [
    "Give each piece a health number. Keep it small, three to ten, so tracking is easy.",
    "Decide how damage is shown. Dice, cubes, or a dial all work. Do not ask players to remember.",
    "Decide whether damage heals between rounds. Healing makes fights longer and less final.",
    "Remove the piece when it reaches zero.",
    "Test whether a fight ever ends. If two pieces can chip at each other forever, add a way to break the stalemate."
  ],
  games: [
    { title: "Dungeons & Dragons", note: "Hit points grow as characters level, so the same monster stops being frightening." },
    { title: "Hearthstone", note: "Health is printed on every card and updated as it changes, so the whole board state is readable at a glance." },
    { title: "Chess", note: "The opposite choice. One hit removes any piece, which is why every move matters so much." }
  ],
  watchOut: [
    "Tracking damage on twenty pieces is miserable. Either keep health low or keep the number of pieces low.",
    "A piece at one health fights exactly as well as a fresh one, which feels odd. Some games reduce ability as health drops."
  ],
  tryThis: "Play one game where every piece dies to a single hit, then one where each has three health. Ask your testers which game felt more tense and which felt more fair.",
  links: [
    { label: "Health in games", url: "https://en.wikipedia.org/wiki/Health_(game_terminology)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of damage tracked physically with cubes or a dial next to a model.", video: null, videoNeed: "Not needed.", diagram: "combat-hp" }
},
{
  slug: "rock-paper-scissors-balance",
  name: "Rock Paper Scissors Balance",
  family: "combat",
  alsoCalled: ["Unit counters", "Weapon triangle"],
  blurb: "Every unit beats one type and loses to another. Nothing is best.",
  complexity: "Simple",
  components: ["Cards", "Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "Spears beat cavalry. Cavalry beat swords. Swords beat spears. No unit is strongest overall.",
    "This means the mistake a player makes is not building a weak army. It is building the wrong army for who they are facing.",
    "It is the cheapest way to make choices matter, and students understand it immediately because they already know the hand game."
  ],
  howItWorks: [
    "Pick three unit types. Three is genuinely enough, and four gets confusing fast.",
    "Write the loop so each beats exactly one and loses to exactly one.",
    "Decide how big the advantage is. Double damage is clear, instant win is too harsh.",
    "Show the loop on a card at the table. Nobody should have to remember it.",
    "Test whether players can see what they are facing before they commit. If not, the whole system is guesswork."
  ],
  games: [
    { title: "Fire Emblem", note: "The weapon triangle is printed on screen, so players never have to memorise it." },
    { title: "Total War: WARHAMMER", note: "Spearmen counter cavalry, so a cavalry heavy army has a real weakness to plan around." },
    { title: "Rock Paper Scissors", note: "The whole game, with no other rules attached." }
  ],
  watchOut: [
    "If players cannot see what the opponent brought, choosing well becomes pure luck.",
    "Four or more types make the loop hard to remember. Keep it to three unless the chart is always visible."
  ],
  tryThis: "Give your game three unit types in a loop. Play a match where both players choose their army in secret, then one where they choose openly. Note which felt more like a decision.",
  links: [
    { label: "How counter systems work", url: "https://en.wikipedia.org/wiki/Rock_paper_scissors", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a printed counter chart or three unit cards arranged in a loop.", video: null, videoNeed: "Not needed.", diagram: "combat-rps" }
},
{
  slug: "flanking-and-facing",
  name: "Flanking and Facing",
  family: "combat",
  alsoCalled: ["Facing", "Rear attacks"],
  blurb: "Attacking from behind hurts far more than attacking head on.",
  complexity: "Complex",
  components: ["Board or grid"],
  playerFit: ["Works at 2"],
  origin: "tabletop",
  whatItIs: [
    "A piece is not the same in every direction. It has a front, two sides, and a back.",
    "An attack from the front runs into full defence. An attack from the side is harder to stop. An attack from behind often ignores defence entirely.",
    "This turns movement into a weapon. Spending a whole turn to get around behind something becomes worth doing."
  ],
  howItWorks: [
    "Make the facing of every piece obvious. A pointed base or an arrow on the token works.",
    "Divide the space around a piece into arcs. Front, flanks, rear is the standard three.",
    "Give each arc a different defence value. Rear attacks should be clearly, obviously better.",
    "Decide whether a piece can turn freely or must spend movement to do it. Spending is more interesting.",
    "Test whether players actually manoeuvre. If everyone still charges forward, the bonus is too small."
  ],
  games: [
    { title: "Star Wars: X-Wing", note: "Ships have firing arcs and cannot shoot behind themselves, so the whole game is about angles." },
    { title: "BattleTech", note: "Rear armour is much thinner than front armour, which makes getting behind a mech a genuine goal." },
    { title: "Total War: WARHAMMER", note: "Units break when charged in the rear, so cavalry exist mainly to get around the side." }
  ],
  watchOut: [
    "This is the fiddliest mechanic in this family. Arguments about which arc a piece is in will happen constantly.",
    "Round bases make facing hard to see. Use square bases or a clear marker."
  ],
  tryThis: "Mark the front of every piece with a small arrow. Give rear attacks double damage. Play a game and count how many turns players spend moving rather than attacking.",
  links: [
    { label: "Firing arcs and facing in games", url: "https://en.wikipedia.org/wiki/Miniature_wargaming", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Overhead photo of a model on a square base with front, flank, and rear arcs drawn on.", video: null, videoNeed: "Clip of a unit manoeuvring to attack from behind.", diagram: "combat-facing" }
},
{
  slug: "area-of-effect",
  name: "Area of Effect",
  family: "combat",
  alsoCalled: ["AoE", "Blast", "Splash damage"],
  blurb: "One attack covers a patch of board and hits everything inside it.",
  complexity: "Medium",
  components: ["Board or grid"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "Most attacks hit one target. This one covers a shape on the board and damages everything under it, including friends.",
    "The effect on play is bigger than the damage suggests. It punishes players for bunching their pieces together.",
    "That means spreading out stops being a habit and becomes a real tactic, which makes the whole board more interesting."
  ],
  howItWorks: [
    "Choose the shape. A circle, a cone, or a straight line each play very differently.",
    "Decide the size in board terms, such as three spaces across, so nobody needs a ruler.",
    "Decide whether it hits the attacker's own pieces. Saying yes makes the weapon much more interesting.",
    "Decide what partial coverage means. A simple rule beats a fair one here.",
    "Test whether players change how they position pieces. If they do not, the area is too small."
  ],
  games: [
    { title: "XCOM", note: "Grenades destroy cover as well as damaging, so an area attack changes the board itself." },
    { title: "Warhammer 40,000", note: "Blast weapons do more damage against bigger units, which directly punishes clustering." },
    { title: "Gloomhaven", note: "Attack shapes are printed on the ability cards, so an area attack is a puzzle about positioning." }
  ],
  watchOut: [
    "Working out exactly which pieces are covered causes arguments. Use grid spaces rather than measured circles.",
    "If it hits friends too, new players will hurt themselves constantly. Warn them, or they will feel tricked."
  ],
  tryThis: "Add one weapon that hits a three by three square. Play a game and watch whether players start spacing their pieces out. That change in behaviour is the mechanic working.",
  links: [
    { label: "Kill Team free rules and downloads", url: "https://www.warhammer-community.com/en-gb/downloads/kill-team/", kind: "Rules", vpn: false }
  ],
  media: { image: null, imageNeed: "Photo of a blast template placed over several models on a board.", video: null, videoNeed: "Not needed.", diagram: "combat-aoe" }
},
{
  slug: "aggro-and-taunt",
  name: "Aggro and Taunt",
  family: "combat",
  alsoCalled: ["Threat", "Taunt", "Provoke"],
  blurb: "One tough piece forces enemies to attack it instead of your weak ones.",
  complexity: "Medium",
  components: ["Tokens", "Cards"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "video game",
  whatItIs: [
    "Without this rule, every attacker goes straight for the most fragile target. That makes support pieces useless and combat boring.",
    "Taunt fixes it with one sentence. Enemies must attack the taunting piece first, if they can reach it.",
    "Suddenly a tough piece that does no damage is worth having, because standing in the way is a job. Hearthstone puts this on cards, and online role playing games call it threat."
  ],
  howItWorks: [
    "Give some pieces a taunt ability, shown clearly on the piece or its card.",
    "Write the rule as a hard requirement. Enemies must target it, not should.",
    "Give it a way to be got around, such as ranged attacks that ignore taunt, or the rule becomes unbreakable.",
    "Make taunting pieces tough but weak in attack, so taking one is a real trade.",
    "Test a fight with and without it. Without taunt, count how quickly the fragile pieces die."
  ],
  games: [
    { title: "Hearthstone", note: "Taunt minions must be attacked first, so a wall of cheap taunts can hold off a stronger board." },
    { title: "World of Warcraft", note: "The tank builds threat so that monsters keep attacking them instead of the healer." },
    { title: "Gloomhaven", note: "Monsters follow fixed targeting rules, so players can work out and manipulate who gets attacked." }
  ],
  watchOut: [
    "This only matters if your game has fragile pieces worth protecting. In a game where everything is equally tough, it does nothing.",
    "Players forget the rule constantly. Put a physical marker on the taunting piece."
  ],
  tryThis: "Add one piece that enemies must attack first. Play a fight with it and one without. Count how many turns your weakest piece survived each time.",
  links: [
    { label: "Threat and taunt in games", url: "https://en.wikipedia.org/wiki/Tank_(gaming)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Screenshot of a Hearthstone board with a taunt minion shielding weaker ones.", video: null, videoNeed: "Not needed.", diagram: "combat-aggro" }
},
{
  slug: "cooldowns",
  name: "Cooldowns and Recharge",
  family: "combat",
  alsoCalled: ["Cooldown", "Recharge", "Once per game"],
  blurb: "A powerful ability that has to rest for a few turns after use.",
  complexity: "Simple",
  components: ["Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "video game",
  whatItIs: [
    "An ability can be genuinely strong, on the condition that it cannot be used every turn.",
    "After using it, the ability rests for a set number of turns before it becomes available again.",
    "This moves the decision from what to do to when to do it, which is usually the more interesting question."
  ],
  howItWorks: [
    "Pick the abilities that are too strong for every turn.",
    "Give each one a rest period. Two or three turns is enough to matter.",
    "Track it physically. Turn the card sideways, or place a token that is removed each turn.",
    "Decide whether the rest carries across rounds or resets, and write it down.",
    "Test whether players ever hold the ability back for a better moment. If they always fire it immediately, the rest is too short."
  ],
  games: [
    { title: "XCOM", note: "Grenades and special shots have cooldowns, so a soldier's best move is not available every turn." },
    { title: "Hearthstone", note: "Hero powers can be used once per turn, which is the simplest possible version of the rule." },
    { title: "Gloomhaven", note: "Powerful cards are lost for the rest of the scenario, which is a cooldown that never ends." }
  ],
  watchOut: [
    "Tracking cooldowns across several pieces is a memory burden. Use a physical marker for every one.",
    "If the rest is too long, players forget the ability exists. Three turns is usually the practical limit."
  ],
  tryThis: "Take the strongest action in your game and make it usable once every three turns instead of every turn. Play a game and note the moments players chose to save it.",
  links: [
    { label: "Cooldowns in game design", url: "https://en.wikipedia.org/wiki/Cooldown", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of cooldown tracked physically, for example a card turned sideways with tokens on it.", video: null, videoNeed: "Not needed.", diagram: "combat-cooldown" }
}

,
{
  slug: "hidden-hand",
  name: "Hidden Hand",
  family: "hidden",
  alsoCalled: ["Closed hand", "Private cards"],
  blurb: "You can see your own cards. Nobody else can.",
  complexity: "Simple",
  components: ["Cards"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "The simplest hidden information there is, and almost every card game uses it.",
    "Your opponents know how many cards you hold, and they know what has already been played. They do not know what is in your hand.",
    "That card count is information all by itself. A player holding one card is either nearly out or saving something, and everyone at the table starts watching them."
  ],
  howItWorks: [
    "Deal cards face down and let players look at their own.",
    "Decide whether players must say how many cards they hold. Usually yes, because it is visible anyway.",
    "Make the card backs identical, and check they are not see through when held up to a light.",
    "Decide whether played cards go face up. Face up gives careful players something to track.",
    "Test whether hiding actually matters. If every card does the same thing, hiding them changes nothing."
  ],
  games: [
    { title: "Uno", note: "The whole game is about your hidden hand shrinking, and calling out when someone is down to one card." },
    { title: "Poker", note: "Two hidden cards each, and the entire game is built on what other people might be holding." },
    { title: "Ticket to Ride", note: "Route cards stay hidden, so opponents have to guess which lines you are trying to build." }
  ],
  watchOut: [
    "Cheap card stock shows through. Test your prototype under a bright light before you rely on it.",
    "Small hands around a shared desk are hard to hide. Give students card holders or a screen."
  ],
  tryThis: "Play a round of your game with all hands face up, then a round with them hidden. Note which decisions disappeared when everyone could see everything.",
  links: [
    { label: "Hidden information in games", url: "https://en.wikipedia.org/wiki/Perfect_information", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Two photos of the same moment, one from the player's view and one from an opponent's.", video: null, videoNeed: "Not needed.", diagram: "hidden-hand" }
},
{
  slug: "hidden-roles",
  name: "Hidden Roles",
  family: "hidden",
  alsoCalled: ["Traitor", "Social deduction"],
  blurb: "Everyone looks the same, but one player is secretly working against the group.",
  complexity: "Medium",
  components: ["Cards"],
  playerFit: ["Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "At the start of the game every player is dealt a secret role. Most are on the same team. One or two are not.",
    "The traitor knows who everyone is. The rest of the group knows nothing and has to work it out by watching behaviour.",
    "This puts the whole game in the conversation rather than on the board, which is why these games get loud and why they need enough players to hide in."
  ],
  howItWorks: [
    "Deal one secret role card to each player. Keep the backs identical.",
    "Tell the traitor who they are, and if there are several, let them see each other.",
    "Give the group a task that a traitor can quietly ruin without being obvious.",
    "Give the group a way to accuse and vote, with a real cost for being wrong.",
    "Set a clear end. Either the group finishes the task, or the traitor finishes them."
  ],
  games: [
    { title: "Werewolf", note: "The oldest version, playable with nothing but scraps of paper and a group of people." },
    { title: "Among Us", note: "A video game version where the traitor sabotages tasks and the group votes on who to remove." },
    { title: "Betrayal at House on the Hill", note: "Everyone is on the same team until a trigger turns one player into the enemy partway through." }
  ],
  watchOut: [
    "These games need five or more players. With four, the traitor cannot hide.",
    "Players get voted out early and then sit doing nothing. Give removed players a job, or keep rounds short."
  ],
  tryThis: "Play one game where the traitor is chosen secretly, and one where everybody knows who it is. The second game shows you exactly how much work the secret was doing.",
  links: [
    { label: "Social deduction games", url: "https://en.wikipedia.org/wiki/Social_deduction_game", kind: "Article", vpn: true },
    { label: "Werewolf, the original", url: "https://en.wikipedia.org/wiki/Mafia_(party_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of identical role card backs, with one turned over to show the traitor.", video: null, videoNeed: "Not needed.", diagram: "hidden-roles" }
},
{
  slug: "fog-of-war",
  name: "Fog of War",
  family: "hidden",
  alsoCalled: ["Limited vision", "Scouting"],
  blurb: "You only see the part of the map your own pieces are near.",
  complexity: "Complex",
  components: ["Board or grid"],
  playerFit: ["Works at 2"],
  origin: "video game",
  whatItIs: [
    "The map exists, but you cannot see all of it. Only the area around your own pieces is revealed.",
    "This makes scouting worth a turn. Sending a cheap piece out to look becomes a real decision rather than a waste.",
    "Video games do this easily because the computer hides things for you. On a table it takes real work, which is why physical fog of war games are rare and clever."
  ],
  howItWorks: [
    "Decide how far a piece can see. Two spaces is a workable default.",
    "Choose a physical method. A screen between players, a referee, a phone app, or face down tokens all work.",
    "Decide whether the terrain is hidden too, or only the enemy pieces. Hiding only the pieces is far easier.",
    "Give players a cheap scouting piece, or nobody will ever explore.",
    "Test how long a turn takes. Anything involving a screen and a referee gets slow fast."
  ],
  games: [
    { title: "Stratego", note: "You see where enemy pieces are but not what they are, which is fog of war turned inside out." },
    { title: "Battleship", note: "The whole board is hidden, and the game is entirely about narrowing down where things are." },
    { title: "StarCraft", note: "The video game standard. Scouting is a skill players practise on its own." }
  ],
  watchOut: [
    "This is genuinely hard to do on a table. Consider hiding only unit identity, as Stratego does, rather than position.",
    "Screens and referees slow everything down. Budget double the turn time you expect."
  ],
  tryThis: "Play a game where each player can only see two spaces around their pieces, using face down tokens for everything else. Time it. Then decide whether the tension was worth the extra minutes.",
  links: [
    { label: "Fog of war in games", url: "https://en.wikipedia.org/wiki/Fog_of_war", kind: "Article", vpn: true },
    { label: "Stratego and hidden identity", url: "https://en.wikipedia.org/wiki/Stratego", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a board with face down tokens covering unexplored areas.", video: null, videoNeed: "Not needed.", diagram: "hidden-fog" }
},
{
  slug: "bluffing",
  name: "Bluffing",
  family: "hidden",
  alsoCalled: ["Lying", "Betting"],
  blurb: "You act as though you have something strong, and hope nobody checks.",
  complexity: "Medium",
  components: ["Cards", "Tokens"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "You claim something about what you hold. The claim might be true. Nobody can see, so nobody can be sure.",
    "For a bluff to work there has to be a cost to calling it. If checking is free, everyone checks and lying stops working.",
    "The best bluffing games make an honest player and a liar look exactly the same from outside, which is why they get so tense."
  ],
  howItWorks: [
    "Give players information nobody else can see.",
    "Give them a way to make a claim about it, out loud or by betting.",
    "Give other players a way to challenge that claim.",
    "Make challenging risky. A wrong challenge must cost the challenger something real.",
    "Test whether anyone ever bluffs. If nobody does, challenging is too cheap."
  ],
  games: [
    { title: "Coup", note: "You may claim any role card, whether you have it or not, and being caught costs you a card." },
    { title: "Liar's Dice", note: "Players bid on how many dice of a number are on the whole table, so a bid is a claim about hidden dice." },
    { title: "Poker", note: "The most studied bluffing game there is, where the size of a bet is itself the claim." }
  ],
  watchOut: [
    "Bluffing rewards confidence, which is a problem when some students are working in a second language. Written or token based claims level this out.",
    "Some students find lying genuinely uncomfortable. Offer them a role that does not require it."
  ],
  tryThis: "Add a claim and challenge rule to your game. A wrong challenger loses a turn. Play and count how many bluffs happened. If the answer is zero, make challenging more expensive.",
  links: [
    { label: "Bluffing as a mechanic", url: "https://en.wikipedia.org/wiki/Bluff_(poker)", kind: "Article", vpn: true },
    { label: "Liar's Dice and hidden bidding", url: "https://en.wikipedia.org/wiki/Liar%27s_dice", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a player pushing a large bet forward, face obscured or turned away.", video: null, videoNeed: "Clip of a bluff being called, and the reveal.", diagram: "hidden-bluff" }
},
{
  slug: "hidden-movement",
  name: "Hidden Movement",
  family: "hidden",
  alsoCalled: ["The hunted", "One against many"],
  blurb: "One player moves in secret and leaves clues instead of a piece.",
  complexity: "Complex",
  components: ["Board or grid", "Paper and pencil"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "One player is being hunted. They write down their moves in secret instead of moving a piece on the board.",
    "Every so often they must reveal where they are, or leave a clue about how they travelled.",
    "The hunters are not chasing, they are doing detective work. They narrow down where the runner can possibly be, which is a completely different feeling from a normal chase."
  ],
  howItWorks: [
    "Give the hidden player a printed pad to write their route on, so it cannot be changed later.",
    "Decide what clue they must leave. Which transport they used, or which region they are in, both work.",
    "Decide how often they must fully reveal. Every five turns is a common answer.",
    "Give the hunters a way to record what they have ruled out.",
    "Test the balance carefully. Hidden movement games are famously hard to make fair."
  ],
  games: [
    { title: "Scotland Yard", note: "Mister X reveals only the transport used, so the hunters build a map of possibilities." },
    { title: "Fury of Dracula", note: "Dracula leaves a face down trail of where he has been, which the hunters slowly uncover." },
    { title: "Letters from Whitechapel", note: "The hidden player writes a route on a pad, and the hunters close in street by street." }
  ],
  watchOut: [
    "The hidden player has a lonely, high pressure job. It suits some students and not others.",
    "Balancing one against many is difficult. Expect several playtests before it feels fair."
  ],
  tryThis: "Play a simple version on a route map. One player writes their moves on paper, revealing their location every five turns. Ask the hunters afterwards how they narrowed it down.",
  links: [
    { label: "Scotland Yard and Mister X", url: "https://en.wikipedia.org/wiki/Scotland_Yard_(board_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a hidden movement pad with a partly filled route, next to the hunters' board.", video: null, videoNeed: "Not needed.", diagram: "hidden-movement" }
},
{
  slug: "secret-objectives",
  name: "Secret Objectives",
  family: "hidden",
  alsoCalled: ["Hidden goals", "Secret missions"],
  blurb: "Everyone plays the same board, but each has a private goal.",
  complexity: "Simple",
  components: ["Cards"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "The board is shared and everything on it is visible. What is hidden is why each player is doing what they are doing.",
    "This is a cheap way to add depth. You are not adding rules, you are adding reasons.",
    "It also stops the table from ganging up correctly, because nobody is sure who is actually close to winning."
  ],
  howItWorks: [
    "Write a set of goals that all take about the same effort to complete.",
    "Deal one to each player at the start, face down.",
    "Make sure the goals do not all point at the same part of the board, or players will collide by accident.",
    "Decide whether goals are revealed at the end or when completed.",
    "Test whether an observant player can guess a rival's goal from their moves. That guessing is the fun part, so it should be possible but not easy."
  ],
  games: [
    { title: "Risk", note: "Secret mission cards change the whole game, because a player attacking a corner might be one move from winning." },
    { title: "Ticket to Ride", note: "Your route cards are your secret goals, and the whole map is a guess about what others need." },
    { title: "Root", note: "Each faction wins differently, and some have hidden goals on top of that." }
  ],
  watchOut: [
    "Goals that are wildly unequal ruin the game. Test each one by playing towards it deliberately.",
    "A player whose goal is impossible from the start has nothing to do. Allow one swap at the beginning."
  ],
  tryThis: "Write five goal cards for your game and deal one to each player secretly. Play, and at the end ask everyone to guess what the others were chasing. Count how many they got right.",
  links: [
    { label: "Risk and its secret missions", url: "https://en.wikipedia.org/wiki/Risk_(game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of face down objective cards next to a shared board.", video: null, videoNeed: "Not needed.", diagram: "hidden-objectives" }
},
{
  slug: "limited-communication",
  name: "Limited Communication",
  family: "hidden",
  alsoCalled: ["No table talk", "Signalling"],
  blurb: "Teammates must cooperate without being allowed to say much.",
  complexity: "Medium",
  components: ["Cards"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Everyone is on the same team, but the rules cut down what they are allowed to say to each other.",
    "This is what makes a cooperative game hard. Without the limit, the group simply plays as one person.",
    "It also solves a real classroom problem. One confident student cannot run everyone else's turn if they are not allowed to describe what to do."
  ],
  howItWorks: [
    "Decide exactly what may be said. A single number, a single colour, or one point at a card.",
    "Decide what may not be said, and write that down too. Players will test the edges.",
    "Give players a limited supply of signals, so communicating costs something.",
    "Decide whether tone of voice and facial expression count as communication. Most groups need this settled in advance.",
    "Test with a group that knows each other well. They will find the loopholes fastest."
  ],
  games: [
    { title: "Hanabi", note: "You cannot see your own cards, and teammates may only give you limited hints about them." },
    { title: "The Crew", note: "Each player may communicate exactly one card, once, for the whole mission." },
    { title: "Codenames", note: "One player may say a single word and a number, and nothing else at all." }
  ],
  watchOut: [
    "Players will accidentally break the rule constantly. Agree on what happens when they do before you start.",
    "This can be frustrating rather than fun if the limit is too tight. Start generous and tighten it."
  ],
  tryThis: "Take a cooperative game and forbid all talking except pointing. Play one round. Then allow one sentence per player per round. Ask which version the group preferred.",
  links: [
    { label: "Hanabi and its hint rules", url: "https://en.wikipedia.org/wiki/Hanabi_(card_game)", kind: "Article", vpn: true },
    { label: "Codenames, one word and a number", url: "https://en.wikipedia.org/wiki/Codenames_(board_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a Hanabi hand held facing outward, so the holder cannot see it.", video: null, videoNeed: "Not needed.", diagram: "hidden-comms" }
}

,
{
  slug: "i-cut-you-choose",
  name: "I Cut, You Choose",
  family: "fair",
  alsoCalled: ["Divide and choose", "Cake cutting"],
  blurb: "One player splits it, the other picks first. Both end up satisfied.",
  complexity: "Simple",
  components: ["Tokens", "Cards"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "One player divides something into shares. Another player chooses which share to take first.",
    "No rule tells the first player to be fair. The order of the two jobs does it for you. Splitting badly means being left with the worse half.",
    "This is the most elegant fairness rule in games, and it needs no numbers, no balance testing, and no maths."
  ],
  howItWorks: [
    "Find something that has to be shared. Resources, cards, or turn order all work.",
    "One player divides it into as many piles as there are choosers.",
    "Every other player chooses a pile, in some order. The divider takes what is left.",
    "Rotate who does the dividing each round.",
    "Test with a player who tries to split unfairly. If they can still profit, your choosing order is wrong."
  ],
  games: [
    { title: "New York Slice", note: "One player cuts the pizza into slices, and everyone else takes a slice before they do." },
    { title: "San Marco", note: "Cards are divided into piles by one player and picked over by the others, round after round." },
    { title: "Catan", note: "A quieter version. A player proposing a trade is dividing, and the other player choosing to accept is choosing." }
  ],
  watchOut: [
    "With five or more players, the divider gets the last pile and that is a real penalty. Rotate the role every round.",
    "It only works when the thing being divided is worth similar amounts to everyone. If players value things very differently, it stops being fair."
  ],
  tryThis: "Give one player six resource cards to split into two piles, and let the other choose first. Do it three times. Watch how quickly the splitter learns to make the piles even.",
  links: [
    { label: "Divide and choose, the maths behind it", url: "https://en.wikipedia.org/wiki/Divide_and_choose", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of two uneven piles of tokens with a hand reaching for the larger one.", video: null, videoNeed: "Not needed.", diagram: "fair-cut-choose" }
},
{
  slug: "handicap-systems",
  name: "Handicap Systems",
  family: "fair",
  alsoCalled: ["Head start", "Handicap stones"],
  blurb: "A weaker player starts ahead, so both of them can still lose.",
  complexity: "Simple",
  components: ["Tokens"],
  playerFit: ["Works at 2"],
  origin: "tabletop",
  whatItIs: [
    "The gap is not in the rules, it is in the players. One of them has played a hundred times and the other has played twice.",
    "A handicap fixes that outside the game. The weaker player begins with an advantage sized to the gap between them.",
    "Go has done this for centuries. The weaker player places extra stones before the game starts, and the number is adjusted until both players win about half the time."
  ],
  howItWorks: [
    "Find something in your game that can be given away in small amounts. Points, pieces, or an extra turn.",
    "Start with a small handicap and play a few games.",
    "If the stronger player still wins every time, increase it. If they start losing every time, reduce it.",
    "Aim for both players winning about half the time. That is the target, not a feeling of fairness.",
    "Write the handicap down before the game, so nobody argues about it afterwards."
  ],
  games: [
    { title: "Go", note: "The weaker player places two to nine extra stones before play begins, and the number is adjusted after each game." },
    { title: "Golf", note: "Not a tabletop game, but the best known handicap system in the world, and worth showing students." },
    { title: "Mario Kart 8", note: "Includes assist options that steer for less confident players, which is a handicap by another name." }
  ],
  watchOut: [
    "Some players find a handicap insulting. Offer it as a choice, not an assignment.",
    "Handicaps only work between the same two people over several games. They are useless in a one off tournament."
  ],
  tryThis: "Play your game five times against someone much better or much worse. Adjust the starting advantage after each game until you are winning about half. Write down the number you landed on.",
  links: [
    { label: "Handicaps in Go", url: "https://en.wikipedia.org/wiki/Handicapping_in_Go", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a Go board set up with handicap stones already placed.", video: null, videoNeed: "Not needed.", diagram: "fair-handicap" }
},
{
  slug: "randomness-as-equaliser",
  name: "Luck as an Equaliser",
  family: "fair",
  alsoCalled: ["Luck versus skill"],
  blurb: "Adding chance gives a weaker player a real hope of winning.",
  complexity: "Simple",
  components: ["Dice", "Cards"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "In chess there is no luck at all, so a beginner will never beat an expert. Not rarely. Never.",
    "Adding chance changes that. The stronger player still wins more often, but the weaker one now has a real chance in any single game.",
    "This is a trade, and you have to make it on purpose. You are buying hope for the weaker player by taking certainty away from the stronger one."
  ],
  howItWorks: [
    "Decide who your game is for. A club of experienced players wants less luck than a mixed classroom.",
    "Add chance in places where it changes the outcome but not the whole game.",
    "Keep skill in the decisions and put luck in the raw materials. Random cards that a player then plays well is a good shape.",
    "Play many games between an experienced and a new player, and count the wins.",
    "Adjust until the stronger player wins often enough to feel their skill, and rarely enough that the other keeps playing."
  ],
  games: [
    { title: "Chess", note: "Zero luck, which is exactly why it works as a competitive sport and badly as a party game." },
    { title: "Backgammon", note: "Dice give a weaker player real chances in one game, so matches are played over many games." },
    { title: "Mario Kart 8", note: "Items are random and favour the players behind, which is why families can play it together at all." }
  ],
  watchOut: [
    "Too much luck and skilled players stop caring, because their decisions do not matter.",
    "Luck at the very end of a game feels worst. Put your randomness early, where players can still respond to it."
  ],
  tryThis: "Play your game ten times against someone clearly better. Count the wins. Add one random element and play ten more. Compare the two counts before deciding whether the change was right.",
  links: [
    { label: "Luck and skill in games", url: "https://en.wikipedia.org/wiki/Game_of_skill", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Not needed. The diagram carries this one.", video: null, videoNeed: "Not needed.", diagram: "fair-luck" }
},
{
  slug: "asymmetric-balance",
  name: "Asymmetric Balance",
  family: "fair",
  alsoCalled: ["Asymmetry", "Different factions"],
  blurb: "Players have completely different powers and still win as often.",
  complexity: "Complex",
  components: ["Cards", "Board or grid"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "Every player has different abilities, different pieces, and sometimes a different way of winning entirely.",
    "The goal is that none of them is better. Each should win about as often as the others across many games.",
    "This is the hardest kind of balance there is, because you cannot compare two things that do not do the same job. It is also the thing that makes a game worth playing twenty times."
  ],
  howItWorks: [
    "Give each faction one thing it does better than anyone else, and one thing it cannot do at all.",
    "Make sure every faction has an answer to every other faction, even a bad one.",
    "Play many games and record who won and with which faction. You need a lot of games for this.",
    "Adjust the faction with the worst record, not the one that feels weakest.",
    "Print a short summary card for each faction, or new players will drown."
  ],
  games: [
    { title: "Root", note: "Four factions with entirely different rules and win conditions, sharing one board." },
    { title: "Vast: The Crystal Caverns", note: "Takes it further. Each player is effectively playing a different game at the same table." },
    { title: "Street Fighter", note: "A video game where every character has a different move set, balanced across decades of tournament data." }
  ],
  watchOut: [
    "You will not balance this by feel. You need recorded results from many games, which is more testing than a school project usually allows.",
    "New players cannot judge which faction suits them. Recommend one as the starting choice."
  ],
  tryThis: "Give two players clearly different powers in your game. Play ten games and record the winner each time. If one side won eight or more, you have found real evidence rather than a feeling.",
  links: [
    { label: "Asymmetric game design", url: "https://en.wikipedia.org/wiki/Asymmetric_gameplay", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of two faction boards side by side, showing how differently they are laid out.", video: null, videoNeed: "Not needed.", diagram: "fair-asymmetry" }
},
{
  slug: "experience-and-levelling",
  name: "Experience and Levelling",
  family: "growth",
  alsoCalled: ["XP", "Levelling up"],
  blurb: "Doing things earns points that make your piece permanently stronger.",
  complexity: "Medium",
  components: ["Tokens", "Paper and pencil"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "video game",
  whatItIs: [
    "Your piece gets better at the things it does. Fight enough battles and you become a better fighter.",
    "The important design choice is how much each level costs. If every level costs the same, whoever levels first stays ahead forever.",
    "Almost every game makes each level cost more than the last. That slows the leader down without a single rule that says so."
  ],
  howItWorks: [
    "Decide what earns experience. Winning fights, completing tasks, or simply surviving.",
    "Write the cost of each level, and make each one cost more than the last.",
    "Decide what a level gives. One clear improvement is better than three small ones.",
    "Cap the levels, or a long game turns into a walkover.",
    "Track it on a sheet, not in anyone's head."
  ],
  games: [
    { title: "Dungeons & Dragons", note: "The origin of levelling in games. Each level costs far more experience than the last." },
    { title: "Gloomhaven", note: "Characters level between scenarios, and the campaign is built around that slow climb." },
    { title: "Munchkin", note: "A fast, silly version where levelling is the whole game and other players actively stop you." }
  ],
  watchOut: [
    "A player who falls behind in levels falls further behind every turn. Pair this with a catch-up rule.",
    "Levelling needs a written record. In a single lesson that is bookkeeping students will resent."
  ],
  tryThis: "Write a level table where each level costs roughly one and a half times the last. Play a game and check whether the leader was still catchable at the halfway point.",
  links: [
    { label: "Experience points in games", url: "https://en.wikipedia.org/wiki/Experience_point", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a character sheet or level track partway through a campaign.", video: null, videoNeed: "Not needed.", diagram: "growth-xp" }
},
{
  slug: "tech-trees",
  name: "Tech Trees and Unlocks",
  family: "growth",
  alsoCalled: ["Technology tree", "Upgrade tree"],
  blurb: "Each thing you unlock opens the door to two more, so paths split.",
  complexity: "Complex",
  components: ["Cards", "Board or grid"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "video game",
  whatItIs: [
    "Improvements are arranged in a branching chart. You cannot take a late one without first taking the ones leading to it.",
    "Because you cannot afford everything, you have to choose a branch. Two players can finish the same game with completely different abilities.",
    "That is what makes it worth the complexity. The tree is not really a list of upgrades, it is a set of paths that lead to different playstyles."
  ],
  howItWorks: [
    "Draw the tree on paper first. Start with one root and two or three branches.",
    "Make each branch lead somewhere clearly different, not just to bigger numbers.",
    "Give each unlock a cost, and make deeper ones cost more.",
    "Print the tree large enough that players can see the whole thing while choosing.",
    "Test whether anyone takes every branch. If they can, the game is too long or the costs too low."
  ],
  games: [
    { title: "Civilization VI", note: "Two trees, one for science and one for culture, and choosing what to research first shapes the whole game." },
    { title: "Age of Empires", note: "Each age unlocks the next, so rushing forward means skipping upgrades behind you." },
    { title: "Scythe", note: "A tabletop version, where upgrades are physically taken from your board and placed elsewhere on it." }
  ],
  watchOut: [
    "A large tree is a lot of reading. In a classroom, ten nodes is plenty and thirty is too many.",
    "If one branch is clearly best, everyone takes it and the tree becomes a straight line."
  ],
  tryThis: "Draw a tree with one root, two branches, and three nodes on each branch. Play twice, taking a different branch each time. If both games felt the same, your branches are not different enough.",
  links: [
    { label: "Technology trees in games", url: "https://en.wikipedia.org/wiki/Technology_tree", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a printed tech tree with completed nodes physically marked.", video: null, videoNeed: "Not needed.", diagram: "growth-tech" }
},
{
  slug: "upgrades-and-equipment",
  name: "Upgrades and Equipment",
  family: "growth",
  alsoCalled: ["Gear", "Loadout"],
  blurb: "The piece stays the same. What it carries is what improves.",
  complexity: "Simple",
  components: ["Cards", "Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "video game",
  whatItIs: [
    "Rather than the character growing, they pick up better tools. A sharper sword, a faster engine, a bigger gun.",
    "This is much easier to balance than levelling, for one reason. You can take equipment away again.",
    "It also gives players a visible sense of progress, because the gear sits on the table where everyone can see it."
  ],
  howItWorks: [
    "Decide how many slots a piece has. Three or four is a good range.",
    "Make each slot hold a different type of thing, so players cannot stack four of the best item.",
    "Give equipment a downside as well as an upside where you can. Heavy armour that slows you down is more interesting than armour that only helps.",
    "Decide whether equipment can be lost, stolen, or broken.",
    "Test whether one item is taken every time. If so, it needs a cost."
  ],
  games: [
    { title: "Star Wars: X-Wing", note: "Ships are customised with upgrade cards before the game, and building the list is half the hobby." },
    { title: "Gloomhaven", note: "Items are bought between scenarios and take up limited slots, so choosing what to carry matters." },
    { title: "Munchkin", note: "Equipment is worn openly, can be stolen by other players, and is the main source of arguments." }
  ],
  watchOut: [
    "Equipment cards spread across the table and get lost. Give each player a mat with marked slots.",
    "If gear only ever improves, later players cannot catch up. Let some of it break."
  ],
  tryThis: "Give each piece three slots and write nine items, three for each slot. Play a game and see which items nobody ever picked. Those are the ones to rewrite.",
  links: [
    { label: "Item and equipment systems", url: "https://en.wikipedia.org/wiki/Item_(gaming)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a player mat with equipment cards slotted into marked positions.", video: null, videoNeed: "Not needed.", diagram: "growth-gear" }
},
{
  slug: "legacy-and-campaign",
  name: "Legacy and Campaign",
  family: "growth",
  alsoCalled: ["Legacy games", "Campaign play"],
  blurb: "The game remembers the last session, permanently and physically.",
  complexity: "Complex",
  components: ["Cards", "Board or grid"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "tabletop",
  whatItIs: [
    "Changes carry across games. Not on a score sheet, but on the components themselves.",
    "Players put stickers on the board, write on cards, and sometimes tear cards up so they can never be used again.",
    "After ten sessions your copy of the game is different from every other copy in the world. That is a feeling no digital game can quite match."
  ],
  howItWorks: [
    "Design the first session to be playable on its own, in case the group never finishes.",
    "Decide what carries over. Board changes, new rules, or a character who levels.",
    "Give the campaign an ending. Ten to fifteen sessions is the usual length.",
    "Put the permanent changes in sealed envelopes opened at set moments, so the group cannot look ahead.",
    "Accept that a student who misses a session has missed it. Plan for that in a school setting."
  ],
  games: [
    { title: "Pandemic Legacy", note: "The board is physically marked up over twelve sessions, and some cities never recover." },
    { title: "Risk Legacy", note: "The first legacy game. Players name continents and sign the board, and those names stay forever." },
    { title: "Gloomhaven", note: "A long campaign where characters retire permanently and unlock new ones for the next player." }
  ],
  watchOut: [
    "This does not fit a school timetable well. Absent students break the continuity.",
    "Permanent means permanent. Students will destroy something and regret it, so warn them clearly."
  ],
  tryThis: "Design a three session mini campaign. After each session, one thing changes permanently on the board. Play all three and note whether session three felt different from session one.",
  links: [
    { label: "Legacy games as a genre", url: "https://en.wikipedia.org/wiki/Legacy_game", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a marked up legacy board next to a fresh one, showing how far it has drifted.", video: null, videoNeed: "Not needed.", diagram: "growth-legacy" }
},
{
  slug: "escalation",
  name: "Escalation",
  family: "growth",
  alsoCalled: ["Rising threat", "Difficulty ramp"],
  blurb: "The problem gets harder every round, faster than you get stronger.",
  complexity: "Medium",
  components: ["Cards", "Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Players are getting stronger, but the game is getting harder faster. The two lines cross somewhere, and that crossing is when the game ends.",
    "This is what gives cooperative games their pressure. Without it, a good team simply grinds out a win with no tension.",
    "It also gives you an ending for free. You do not need a turn limit if the threat will eventually overtake anyone."
  ],
  howItWorks: [
    "Find one number that represents the threat. Cards drawn per turn, enemies added, or a track that advances.",
    "Make it grow faster than player power. Adding one extra enemy every two rounds is enough.",
    "Show the growth on the table so players can feel it coming.",
    "Give players one way to push the threat back, so they are not simply watching.",
    "Chart threat and player power across a test game. Find the turn where they cross."
  ],
  games: [
    { title: "Pandemic", note: "The infection rate increases as outbreaks happen, so the game speeds up exactly when you are struggling." },
    { title: "Space Hulk", note: "Genestealers arrive faster as the mission goes on, so hesitating is fatal." },
    { title: "Slay the Spire", note: "Each floor is harder than the last, so a deck that stops improving eventually loses." }
  ],
  watchOut: [
    "If it escalates too fast, players feel the loss was decided before they could act. Test the crossing point carefully.",
    "Escalation plus no catch-up rule makes a losing team lose harder every round. Be deliberate about that."
  ],
  tryThis: "Add a rule that one extra enemy appears every second round. Play and write down the round where the players first fell behind. That number is your real game length.",
  links: [
    { label: "Pandemic and its rising infection rate", url: "https://en.wikipedia.org/wiki/Pandemic_(board_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a Pandemic board late in a game, showing how much worse it has become.", video: null, videoNeed: "Not needed.", diagram: "growth-escalation" }
},
{
  slug: "milestones",
  name: "Milestones and Tiers",
  family: "growth",
  alsoCalled: ["Thresholds", "Tiers"],
  blurb: "Crossing a line changes the rules, so players count towards it.",
  complexity: "Simple",
  components: ["Board or grid", "Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Progress is not smooth. Nothing happens for a while, and then you cross a line and something changes.",
    "That gives players something concrete to aim at. Instead of vaguely improving, they are three points from the next tier.",
    "It also lets you change the game's shape partway through, opening new options only once players are ready for them."
  ],
  howItWorks: [
    "Draw a track with two or three clearly marked lines on it.",
    "Decide what crossing each line unlocks. A new action, a better rate, or a rule that changes.",
    "Space the lines so most players cross the first one and only some reach the last.",
    "Make the track public, so players can see who is close to what.",
    "Test whether anyone ever stops just short. If they do, the next tier is priced too high."
  ],
  games: [
    { title: "Catan", note: "Longest road and largest army are milestones. Nothing happens at four roads, and everything happens at five." },
    { title: "Wingspan", note: "End of round goals act as tiers, so players push to cross a threshold before the round ends." },
    { title: "Civilization VI", note: "Entering a new era changes what is available, so the whole game shifts at once." }
  ],
  watchOut: [
    "If a milestone can be taken away, players who lose one feel robbed. Decide whether that is the drama you want.",
    "Milestones that only one player can hold create direct conflict. That is often good, but know you are doing it."
  ],
  tryThis: "Add one milestone to your game that unlocks a new action. Play and watch whether anyone changed their plan to reach it. If nobody did, the reward is too small.",
  links: [
    { label: "Catan and its bonus cards", url: "https://en.wikipedia.org/wiki/Catan", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a progress track with tier markers and player pieces at different points.", video: null, videoNeed: "Not needed.", diagram: "growth-milestones" }
},
{
  slug: "run-based-progress",
  name: "Losing and Keeping Something",
  family: "growth",
  alsoCalled: ["Meta-progression", "Roguelike runs"],
  blurb: "You lose, you start again, but you keep a little from last time.",
  complexity: "Medium",
  components: ["Cards", "Paper and pencil"],
  playerFit: ["Works at 2", "Works at 3 to 4"],
  origin: "video game",
  whatItIs: [
    "The game is played in short attempts. Most of them end in failure, and failure sends you back to the start.",
    "But not all the way back. Something you earned stays with you, so the next attempt begins slightly stronger.",
    "This changes what losing means. A failed run is not wasted time, it is progress, which is why players will try twenty times without getting frustrated."
  ],
  howItWorks: [
    "Design a short game that can be played in fifteen minutes or less.",
    "Decide what is lost when a run ends. Usually everything gained during it.",
    "Decide what is kept. A small permanent unlock, or a currency spent between runs.",
    "Keep what is kept small, or the difficulty disappears after three attempts.",
    "Track the permanent part on a sheet that survives between sessions."
  ],
  games: [
    { title: "Hades", note: "Every failed escape earns currency that permanently improves the next attempt, and the story advances even when you lose." },
    { title: "Slay the Spire", note: "Losing unlocks new cards for future runs, so the pool of possibilities keeps growing." },
    { title: "Dead Cells", note: "Weapons unlocked in one run can appear in later ones, so the game slowly opens up." }
  ],
  watchOut: [
    "Runs have to be short. If losing costs an hour, no student will want to start again.",
    "If the kept progress is too generous, the game becomes easy and stops being interesting. Keep it small."
  ],
  tryThis: "Make a fifteen minute version of your game. When a player loses, let them keep one card for the next attempt. Play four rounds and ask whether losing felt bad by the fourth.",
  links: [
    { label: "Roguelike progression", url: "https://en.wikipedia.org/wiki/Roguelike", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a run tracker sheet with several failed attempts recorded and unlocks marked.", video: null, videoNeed: "Not needed.", diagram: "growth-runs" }
}

,
{
  slug: "victory-points",
  name: "Victory Points",
  family: "goals",
  alsoCalled: ["VP", "Points"],
  blurb: "Everything you do converts into one number, and the highest wins.",
  complexity: "Simple",
  components: ["Tokens", "Paper and pencil"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Buildings, cards, territory, and bonuses all turn into the same currency. At the end you add them up and compare.",
    "This lets you compare two players who did completely different things, which is why almost every modern board game uses it.",
    "The design work is entirely in the exchange rate. What a building is worth compared to a card decides which strategies are worth playing."
  ],
  howItWorks: [
    "List everything a player can gain during the game.",
    "Give each one a point value. Start by guessing, then fix it with playtests.",
    "Decide whether points are public or counted at the end.",
    "Give players a way to track their points, or the final count takes ten minutes.",
    "Play several games and check which source of points won each time. If it is always the same one, your rates are wrong."
  ],
  games: [
    { title: "Catan", note: "Ten points wins, and they come from settlements, cities, cards, and two bonuses." },
    { title: "Wingspan", note: "Points come from five different places, so players can pursue quite different boards." },
    { title: "7 Wonders", note: "Seven separate scoring categories, counted at the very end, which is why the final maths takes a while." }
  ],
  watchOut: [
    "Public points let the table gang up on the leader. Hidden points stop that but leave players guessing.",
    "Adding up at the end is slow. If your game has six scoring categories, print a score pad."
  ],
  tryThis: "List every way to earn points in your game. Play three times and record which source produced the winning margin. If it is the same source every time, cut its value.",
  links: [
    { label: "Victory points as a mechanic", url: "https://en.wikipedia.org/wiki/Victory_point", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a filled in score pad from a game with several scoring categories.", video: null, videoNeed: "Not needed.", diagram: "goals-vp" }
},
{
  slug: "area-majority",
  name: "Area Majority",
  family: "goals",
  alsoCalled: ["Area control", "Majority scoring"],
  blurb: "Whoever has the most pieces in a region takes it, and second place gets little.",
  complexity: "Medium",
  components: ["Board or grid", "Tokens"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "The board is divided into regions. At scoring time, each region is counted separately and the player with the most pieces there wins it.",
    "Second place usually gets very little, and third gets nothing. That steep drop is what makes this tense.",
    "So one extra piece in a region you nearly control is worth more than five pieces spread where you cannot win. Players spend the game deciding which fights to give up."
  ],
  howItWorks: [
    "Divide the board into regions and give each one a point value.",
    "Decide the reward for first, second, and third. Make the drop steep.",
    "Decide when scoring happens. At the end, or at set moments during the game.",
    "Write a tie rule. Ties happen constantly in this family.",
    "Test whether players ever abandon a region. If nobody does, second place is worth too much."
  ],
  games: [
    { title: "Small World", note: "Regions are scored every round, so holding ground matters continuously rather than only at the end." },
    { title: "El Grande", note: "The game that defined the family. Scoring happens three times, so timing is everything." },
    { title: "Risk", note: "A simple version, where holding a whole continent gives bonus armies each turn." }
  ],
  watchOut: [
    "Counting pieces in every region at scoring time is slow. Keep the number of regions manageable.",
    "Two players fighting over one region can both lose to a third who quietly took two others. Warn students about this."
  ],
  tryThis: "Score first place at five points and second at one. Play a game. Then score first at five and second at four, and play again. Note how differently players behaved.",
  links: [
    { label: "El Grande, which defined area majority", url: "https://en.wikipedia.org/wiki/El_Grande", kind: "Article", vpn: true },
    { label: "Small World and its region scoring", url: "https://en.wikipedia.org/wiki/Small_World_(board_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a contested region with two players' pieces mixed, counts visible.", video: null, videoNeed: "Not needed.", diagram: "goals-area" }
},
{
  slug: "race-to-the-end",
  name: "Race to the End",
  family: "goals",
  alsoCalled: ["First past the post", "Track racing"],
  blurb: "No scoring at all. The first player to reach the end wins.",
  complexity: "Simple",
  components: ["Board or grid"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "There is nothing to add up. A track runs from start to finish, and whoever gets there first has won.",
    "This is the clearest goal a game can have. A player who has never seen your game understands it in one sentence.",
    "The cost is that everyone can see exactly who is winning, all the time. That is either useful tension or a reason for the table to gang up, depending on your game."
  ],
  howItWorks: [
    "Draw a track and mark the finish clearly.",
    "Decide what moves a player along it. Dice, cards, or completed tasks all work.",
    "Decide whether players can interfere with each other's progress.",
    "Set the length so the game takes as long as you want. Count the average move and divide.",
    "Test whether a player who falls behind can ever catch up. If not, add a catch-up rule."
  ],
  games: [
    { title: "Snakes and Ladders", note: "The purest race, and a good example of a game with no decisions at all." },
    { title: "Formula D", note: "A racing game where gear choice and cornering turn the race into a real decision." },
    { title: "Mario Kart 8", note: "A race with heavy catch-up rules, precisely because a visible leader is easy to gang up on." }
  ],
  watchOut: [
    "The leader is obvious, which invites everyone to attack them. Decide whether you want that.",
    "A pure race with no decisions is not a game. Make sure there is a choice on every turn."
  ],
  tryThis: "Time a full game and count the average number of spaces moved per turn. Divide your track length by that number. If the answer is more than thirty turns, shorten the track.",
  links: [
    { label: "Race games as a family", url: "https://en.wikipedia.org/wiki/Race_game", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a race track board with player pieces clearly spread along it.", video: null, videoNeed: "Not needed.", diagram: "goals-race" }
},
{
  slug: "multiple-win-conditions",
  name: "Multiple Ways to Win",
  family: "goals",
  alsoCalled: ["Alternate victory", "Win conditions"],
  blurb: "Several different routes to victory, and players pick one.",
  complexity: "Complex",
  components: ["Board or grid", "Cards"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "video game",
  whatItIs: [
    "There is more than one way to win. Conquer everyone, or out-research them, or out-culture them.",
    "This means blocking one player is much harder, because stopping their army does nothing if they were going to win by science.",
    "It also lets very different kinds of player enjoy the same game. Watching all the routes at once is the hard part, and that difficulty is the point."
  ],
  howItWorks: [
    "Write two to four win conditions that require genuinely different actions.",
    "Make each one take roughly the same amount of time to complete.",
    "Make sure players can see how close everyone is to each condition, or they cannot respond.",
    "Give each route at least one way for others to interfere with it.",
    "Play many games and record which condition won. If one never wins, it is too slow."
  ],
  games: [
    { title: "Civilization VI", note: "Five victory types, and part of the skill is noticing which one a rival has quietly been building towards." },
    { title: "Root", note: "Each faction scores differently, so every player is effectively chasing a different condition." },
    { title: "Twilight Imperium", note: "Points come from many objectives, and a military lead does not guarantee a win." }
  ],
  watchOut: [
    "Balancing several win conditions against each other is genuinely hard. Do not attempt more than three for a school project.",
    "If one route is faster, everyone takes it and the others are decoration."
  ],
  tryThis: "Add a second way to win to your game, one that needs completely different actions. Play five games and record which condition ended each one. If it is always the same, the other is too slow.",
  links: [
    { label: "Victory conditions in games", url: "https://en.wikipedia.org/wiki/Win_condition", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a game board or screen showing progress towards several win conditions at once.", video: null, videoNeed: "Not needed.", diagram: "goals-multiwin" }
},
{
  slug: "hidden-scoring",
  name: "Hidden Scoring",
  family: "goals",
  alsoCalled: ["Secret score", "End game reveal"],
  blurb: "Nobody knows who is winning until everything is counted at the end.",
  complexity: "Medium",
  components: ["Cards"],
  playerFit: ["Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Points are earned during the game but kept face down. Nobody adds up until the last turn is over.",
    "This solves a real problem. When scores are public, the table can see the leader and gang up on them, which punishes playing well.",
    "The cost is that players cannot tell how they are doing, which some find tense and others find frustrating."
  ],
  howItWorks: [
    "Keep scoring cards or tokens face down in front of each player.",
    "Let players look at their own at any time.",
    "Give players some public signal of progress, or nobody can plan against anyone.",
    "Reveal and count everything at the end, in one go.",
    "Test the counting time. Hidden scoring makes the end of the game slower."
  ],
  games: [
    { title: "Ticket to Ride", note: "Route cards stay hidden, so a player who looks behind can win by twenty points at the reveal." },
    { title: "7 Wonders", note: "Some scoring is visible and some is not, so players have a rough idea without knowing for certain." },
    { title: "Sushi Go", note: "Hands pass and score at the end of each round, so players guess rather than know." }
  ],
  watchOut: [
    "A player who is far behind cannot tell, so they keep playing. That is usually a feature, but it can waste time in a losing position.",
    "The reveal has to be exciting. If counting takes five minutes, the moment is lost."
  ],
  tryThis: "Play your game once with scores written on a public board, and once with them hidden. Watch whether the table attacked the leader in the first game. That difference is what hiding buys you.",
  links: [
    { label: "Ticket to Ride and hidden routes", url: "https://en.wikipedia.org/wiki/Ticket_to_Ride_(board_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of the moment of reveal, face down cards being turned over at the end of a game.", video: null, videoNeed: "Clip of an end game reveal and count.", diagram: "goals-hidden" }
},
{
  slug: "scoring-multipliers",
  name: "Scoring Multipliers",
  family: "goals",
  alsoCalled: ["Combo scoring", "Exponential scoring"],
  blurb: "Grouping things together is worth far more than spreading them out.",
  complexity: "Medium",
  components: ["Cards", "Tokens"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "Two pieces are worth four points. Three are worth nine. Four are worth sixteen. The reward climbs faster than the effort.",
    "This makes players commit. Spreading your effort across everything produces a low score, so you have to pick something and go all in.",
    "It also creates real drama near the end, when one more piece is worth more than the last three combined."
  ],
  howItWorks: [
    "Choose what gets multiplied. Matching cards, connected spaces, or completed sets.",
    "Write a table where each step is worth more than the last. Squaring the count is a common shape.",
    "Print the table where players can see it, because nobody can do this in their head.",
    "Check the top of the table. A very steep curve means one player can score more than everyone else combined.",
    "Test whether a player who spread out has any chance at all. If not, flatten the curve."
  ],
  games: [
    { title: "Ticket to Ride", note: "A six space route is worth far more than three two space routes, so longer is always better." },
    { title: "Blokus", note: "Placing all your pieces gives a bonus, so the last few placements are worth the most." },
    { title: "Sushi Go", note: "Sets of dumplings score one, three, six, ten, fifteen, which is why players fight over the fifth one." }
  ],
  watchOut: [
    "A steep curve makes the game swing hard at the end. That is exciting once and frustrating if it happens every time.",
    "Players cannot calculate steep scores while playing. Give them a printed table."
  ],
  tryThis: "Change one scoring rule from one point each to the count squared. Play a game and note whether players started chasing one thing instead of collecting a bit of everything.",
  links: [
    { label: "Ticket to Ride route scoring", url: "https://en.wikipedia.org/wiki/Ticket_to_Ride_(board_game)", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a printed scoring table alongside a scored set, showing the jump between steps.", video: null, videoNeed: "Not needed.", diagram: "goals-multiplier" }
},
{
  slug: "player-elimination",
  name: "Player Elimination",
  family: "goals",
  alsoCalled: ["Last one standing", "Knockout"],
  blurb: "Losing players are removed, and the last one left wins.",
  complexity: "Simple",
  components: ["Nothing extra"],
  playerFit: ["Works at 2", "Works at 3 to 4", "Works at 5 or more"],
  origin: "tabletop",
  whatItIs: [
    "There is no score. Players are knocked out one at a time, and whoever is left at the end has won.",
    "This is dramatic and easy to understand. It is also the mechanic most likely to cause a problem in a classroom.",
    "A student eliminated in the first ten minutes has nothing to do for the rest of the lesson. Older games do this constantly, and modern designs mostly avoid it for exactly this reason."
  ],
  howItWorks: [
    "Decide what removes a player from the game.",
    "Work out the earliest possible elimination. That is how long a student might have to sit out.",
    "Give eliminated players a job. Judging, running the timer, or controlling a neutral force all work.",
    "Consider ending the game as soon as one player is out, rather than playing to the last.",
    "Test with a group and watch the eliminated player. Their face will tell you whether this is working."
  ],
  games: [
    { title: "Risk", note: "The classic problem. A player can be knocked out in the first hour of a three hour game." },
    { title: "Monopoly", note: "Players go bankrupt at very different times, which is why the last hour is usually two people." },
    { title: "Werewolf", note: "Elimination is the whole game, which is why good versions give dead players a way to keep watching and reacting." }
  ],
  watchOut: [
    "In a lesson, this is a real problem rather than a design preference. Plan for the eliminated student.",
    "Elimination plus a long game is the worst combination. If you use it, keep the game short."
  ],
  tryThis: "Play your game and write down the exact minute the first player was eliminated. Then work out what that student did for the remaining time. If the answer is nothing, change the rule.",
  links: [
    { label: "Player elimination and why designers avoid it", url: "https://en.wikipedia.org/wiki/Player_elimination", kind: "Article", vpn: true }
  ],
  media: { image: null, imageNeed: "Photo of a game in progress with one player's empty seat and cleared area visible.", video: null, videoNeed: "Not needed.", diagram: "goals-elimination" }
}


];
