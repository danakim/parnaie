// Setup -----------------------------------------------------------------------
const nodes = {
  container: document.getElementById("container"),
  title: document.getElementById("title"),
  word: document.getElementById("word"),
  type: document.getElementById("type"),
  def: document.getElementById("definition")
};

const data = [
  {
    word: 'Lyft taiyaki',
    type: 's.m.',
    definition: 'Master cleanse deep v direct trade four loko succulents'
  },
  {
    word: 'Synth',
    type: 'adj',
    definition: 'Helvetica viral shaman, pok pok distillery butcher tumblr wolf church-key. Fashion axe VHS kombucha slow-carb forage lomo everyday carry brooklyn meggings wayfarers cronut gentrify authentic.'
  },
  {
    word: 'Hoodie',
    type: 'adv',
    definition: 'Tofu yr twee etsy, gastropub air plant brunch YOLO VHS distillery actually.'
  },
  {
    word: 'Chia',
    type: 's.f.',
    definition: 'Lomo street art gastropub, direct trade knausgaard austin poutine taxidermy XOXO viral.'
  },
  {
    word: 'Activated charcoal',
    type: 's.f.',
    definition: 'Chambray franzen tote bag meggings vice meh literally pour-over tumblr everyday carry kickstarter flannel.'
  }
]

let current = {}

// Logic -----------------------------------------------------------------------
// Update html text
function updateDef (obj) {
  nodes.word.innerText = obj.word
  nodes.type.innerText = obj.type
  nodes.def.innerText = obj.definition
  current = obj
}

// Update render with a random definition
function getRandom () {
  let def = data[Math.floor(Math.random() * data.length)]
  updateDef(def)
}

// Document Ready --------------------------------------------------------------
(function () {
  getRandom()
}())