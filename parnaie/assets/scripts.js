// Setup -----------------------------------------------------------------------
const nodes = {
  container: document.getElementById('container'),
  wrapper: document.querySelector('#stripe-holder .wrapper'),
  title: document.getElementById('title'),
  word: document.getElementById('word'),
  type: document.getElementById('type'),
  def: document.getElementById('definition'),
  dice: document.getElementById('next')
};
// Data
const data = {
  words: ['poraliu, poralii', 'verzişor, verzişori', 'părui, păruiesc', 'brichetar, brichetari',
          'chitros, chitroşi', 'mătrăşi, mătrăşesc', 'baracă, barăci', 'diamant, diamante',
          'radio tam-tam', 'urechist, urechişti'],
  types: ['s.m.', 'adj', 'adv', 's.f.', 's.m. v.', 'vb.', 's.n.', 'expr.'],
  defs: [
    'ofiţer.',
    'verdeaţă.',
    'a (se) bate.',
    'instigator.',
    'cârnăţar.',
    '1. a trăda pe cineva prin mijloace necinstite. 2. a ucide.',
    '1. cameră de deţinere într-o construcţie provizorie din scândură. 2. cameră mare de deţinere cu zeci de deţinuţi.',
    '1. deţinut descurcăreţ care se adaptează repede la orice situaţie. 2. deţinut care iese mereu cu un câştig din combinaţiile pe care le face.',
    'deţinut bine informat cu evenimentele din',
    'umplutură.'
  ]
}

let state = {
  current: {},
  status: 'ok'
}

const stripesToMove = 5
let stripeH = document.querySelector('.stripe').offsetHeight

// Stylers
const textEls = Array
  .from(nodes.title.children)
  .map(popmotion.styler)

const wrapperStyler = popmotion.styler(nodes.wrapper)
const dice = popmotion.styler(nodes.dice)

let diceAnim = popmotion.tween({
  from: {
    rotate: 0,
    borderColor: 'rgba(216, 28, 35, 0.3)'
  },
  to: {
    rotate: 360,
    borderColor: 'rgba(255, 252, 250, 0)'
  },
  duration: 600,
  ease: popmotion.easing.anticipate
})




// Logic -----------------------------------------------------------------------
// Update html text
function updateDef (obj) {
  nodes.word.innerText = obj.word
  nodes.type.innerText = obj.type
  nodes.def.innerText = obj.def
  state.current = obj
}

// Random array element
function randEl (arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
// Add stripes
function addStripes () {
  for (let i = 0; i < stripesToMove; i++) {
    let newStripe = document.createElement('div')
    newStripe.classList.add('stripe')
    nodes.wrapper.appendChild(newStripe)
  }
}

// Remove stripes
function removeStripes () {
  let outgoing = nodes.wrapper.children

  for (let i = 0; i < stripesToMove; i++) {
    nodes.wrapper.removeChild(outgoing[i]);
  }
}

// Animate
function animateContent () {
  addStripes()

  // Move stripes
  popmotion.spring({
    from: 0,
    velocity: 300,
    to: { y: -(4 * stripeH) + 1 },
    stiffness: 150,
    mass: 1,
    damping: 30
  }).start({
    update: wrapperStyler.set,
    complete: () => {
      removeStripes()
      wrapperStyler.set('y', 0)
    }
  })
}

// Update render with a random definition
// Mimic an ajax call
function getRandom () {
  if (state.status === 'ok') {
    // Mark busy and update dice
    state.status = 'busy'
    let diceInstance = diceAnim.start({
      update: dice.set,
      complete: () => {
        // Trigger fake ajax get and update with response
        let time = Math.floor(Math.random() * 1000)
        let newData = {
          word: randEl(data.words),
          type: randEl(data.types),
          def: randEl(data.defs)
        }

        setTimeout(() => {
          updateDef(newData)

          // Start animations
          animateContent()

          // Mark ready
          state.status = 'ok'
        }, time)
      }
    })
  }
}

// Document Ready --------------------------------------------------------------
(function () {
  nodes.dice.onclick = getRandom
}())