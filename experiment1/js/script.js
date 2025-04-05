const fillers = {
  intro: [
    "Welcome, $adventurer!",
    "Whoa there, $adventurer!",
    "Leave this place, $adventurer.",
    "$adventurer....",
  ],
  adventurer: ["Spaceteam", "Dave", "Wanderer", "Monkey"],
  welcome: [
    "welcome here",
    "not welcome here",
    "my dinner",
    "full of yourself to come here",
  ],
  retort: ["", "whoa", "bro", "uwu", "my dude", "fella", "ripe old one"],
  digit: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  pre: [
    "Zaga",
    "Za",
    "Ran",
    "Rava",
    "O",
    "$digit$digit$digit-",
    "$digit$digit$digit$digit$digit-",
    "$digit$digit",
  ],
  post: ["rava", "$digit$digit$digit", "da", "dae", "uwu"],
  arrive: ["teleport", "crash", "land", "warp", "holo-port", "astral project"],
  location: [
    "crater",
    "valley",
    "mountain",
    "cave",
    "asteroid",
    "$location by the $location",
    "city",
  ],
  status: [
    "tired",
    "weary",
    "thirsty",
    "delicious",
    "delicious... I mean hungry",
    "discomboulated",
  ],
  gift: [
    "water",
    "ambrosia",
    "batteries",
    "$gift in $gift",
    "food",
    "cookies",
    "$gift_adj $gift",
  ],
  gift_adj: [
    "wonderous",
    "delicious",
    "enormous",
    "third rate",
    "discount",
    "fresh baked",
    "$gift-like",
  ],
  farewell: ["please stay", "good bye", "welcome welcome"],
};

const template = `$intro
You are $welcome on my planet: $pre$post. How could you $arrive here in this $location? You must be $status.
Let me fetch you some $gift_adj $gift.
$farewell $adventurer.
`;

// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();
