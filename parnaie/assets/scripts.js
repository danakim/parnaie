// Setup -----------------------------------------------------------------------
const nodes = {
  container: document.getElementById('container'),
  wrapper: document.querySelector('#stripe-holder .wrapper'),
  title: document.getElementById('title'),
  word: document.getElementById('word'),
  type: document.getElementById('type'),
  def: document.getElementById('definition'),
  dice: document.getElementById('next')
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

  // Type
  let type = ''
  for (let i in obj.props) {
    type += obj.props[i] + ' '
  }
  nodes.type.innerText = type

  // Definition
  while (nodes.def.hasChildNodes()) {
    nodes.def.removeChild(nodes.def.lastChild)
  }
  for (let i of obj.defs) {
    if (i.length > 0) {
      let elem = document.createElement('li')
      let text = document.createTextNode(i)
      elem.appendChild(text)
      nodes.def.appendChild(elem)
    }
  }

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
    nodes.wrapper.removeChild(outgoing[i])
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

// GET next word
let reqNext = new XMLHttpRequest()

reqNext.onload = function() {
  if (reqNext.status >= 200 && reqNext.status < 400) {
    // Success!
    updateDef(JSON.parse(reqNext.responseText))
  } else {
    console.log('Server error')
  }
}

reqNext.onerror = function() {
  console.log('Connection error')
}

let getNext = function () {
  reqNext.open('GET', '/random', true)
  reqNext.send()
}



// Document Ready --------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function(event) { 
  updateDef(state.current)
  nodes.dice.onclick = getNext
})