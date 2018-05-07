// Setup -----------------------------------------------------------------------
const nodes = {
  container: document.getElementById('container'),
  wrapper: document.querySelector('#stripe-holder .wrapper'),
  content: document.getElementById('content'),
  title: document.getElementById('title'),
  word: document.getElementById('word'),
  type: document.getElementById('type'),
  def: document.getElementById('definition'),
  dice: document.getElementById('next'),
  modal: document.getElementById('modal'),
  aboutBtn: document.getElementById('about-bttn'),
  aboutContent:document.getElementById('about-content'),
  shareBtn: document.getElementById('share-bttn'),
  shareContent:document.getElementById('share-content'),
  shareWord: document.getElementById('share-word'),
  fbLink: document.getElementById('fb-link'),
  twLink: document.getElementById('tw-link'),
  gpLink: document.getElementById('gp-link')
}

const stripesToMove = 5
let stripeH = document.querySelector('.stripe').offsetHeight

// Stylers
const textEls = Array
  .from(nodes.title.children)
  .map(popmotion.styler)

const wrapperStyler = popmotion.styler(nodes.wrapper)
const contentStyler = popmotion.styler(nodes.content)
const titleStyler = popmotion.styler(nodes.title)
const defStyler = popmotion.styler(nodes.def)
const dice = popmotion.styler(nodes.dice)
const modalStyler = popmotion.styler(nodes.modal)
const shareStyler = popmotion.styler(nodes.shareBtn)
const aboutStyler = popmotion.styler(nodes.aboutBtn)
const shareContentStyler = popmotion.styler(nodes.shareContent)
const aboutContentStyler = popmotion.styler(nodes.aboutContent)


const setModalStylers = function (v) {
    modalStyler.set(v.modal)
    aboutContentStyler.set(v.about)
    shareContentStyler.set(v.share)
}

// Animations
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

let btnsAnim = popmotion.tween({
  from: { borderColor: 'rgba(216, 28, 35, 0.3)' },
  to: { borderColor: 'rgba(255, 252, 250, 0)' },
  duration: 600,
  ease: popmotion.easing.anticipate
})


// Logic -----------------------------------------------------------------------
// Update html text
function updateDef (obj) {
  if (obj.id === state.current.id) {
    return
  }

  document.title = 'Dicționar de pușcărie - ' + obj.word
  nodes.word.innerText = obj.word
  nodes.shareWord.innerText = obj.word

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
  updateShareInfo()
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
function animateContent (data) {
  addStripes()

  const setStylers = function (v) {
    if (v.posY.y === 0 && data.id !== state.current.id) {
      updateDef(data)
    }

    contentStyler.set(v.posY)
    wrapperStyler.set(v.stripesY)
  }

  popmotion.timeline([
    {
      track: 'posY',
      from: { y: 0, opacity: 1 },
      to: { y: -(2 * stripeH), opacity: 0 },
      duration: 300,
      ease: {y: popmotion.easing.easeIn, opacity: popmotion.easing.circOut}
    },
    '-600',
    {
      track: 'stripesY',
      from: { y: 0 },
      to: { y: -(2 * stripeH) - 1},
      duration: 1000,
      ease: popmotion.easing.backInOut
    },
    '-1000',
    {
      track: 'posY',
      from: { y: titleStyler.get().translateY, opacity: 0 },
      to: { y: (4 * stripeH), opacity: 0 },
      ease: popmotion.easing.easeIn,
      duration: 200
    },
    '200',
    {
      track: 'posY',
      from: { y: titleStyler.get().translateY, opacity: 0 },
      to: { y: 0, opacity: 1 },
      duration: 200,
      ease: popmotion.easing.easeIn
    },
  ]).start({
    update: setStylers,
    complete: () => {
      removeStripes()
      wrapperStyler.set('y', 0)
      window.history.pushState(data.id, null, '/' + data.id)
      // Mark ready
      state.status = 'ok'
    }
  })
}

// GET next word
let reqNext = new XMLHttpRequest()

reqNext.onload = function() {
  if (reqNext.status >= 200 && reqNext.status < 400) {
    state.status = 'busy'
    let diceInstance = diceAnim.start({
      update: dice.set,
      complete: () => {
        // Start animations
        animateContent(JSON.parse(reqNext.responseText))
      }
    })
  } else {
    console.log('Server error')
  }
}

reqNext.onerror = function() {
  console.log('Connection error')
}

let getNext = function () {
  if (state.status === 'ok') {
    reqNext.open('GET', '/random', true)
    reqNext.send()
  }
}

let toggleAbout = function () {
  btnsAnim.start({
    update: aboutStyler.set,
    complete: () => {
      popmotion.timeline([
      {
        track: 'modal',
        from: { y: +32, opacity: 0, scaleY: 0},
        to: { y: 0, opacity: 1, scaleY: 1},
        duration: 250,
        ease: popmotion.easing.easeInOut
      },
      '-100',
      {
        track: 'about',
        from: { y: +64, opacity: 0, scaleY: 0},
        to: { y: 0, opacity: 1, scaleY: 1},
        duration: 400,
        ease: popmotion.easing.backInOut
      }
      ]).start({
        update: setModalStylers,
        complete: () => {
        }
      })
    }
  })
}

let toggleShare = function () {
  btnsAnim.start({
    update: shareStyler.set,
    complete: () => {
      popmotion.timeline([
      {
        track: 'modal',
        from: { y: +32, opacity: 0, scaleY: 0},
        to: { y: 0, opacity: 1, scaleY: 1},
        duration: 250,
        ease: popmotion.easing.easeInOut
      },
      '-100',
      {
        track: 'share',
        from: { y: +64, opacity: 0, scaleY: 0},
        to: { y: 0, opacity: 1, scaleY: 1},
        duration: 400,
        ease: popmotion.easing.backInOut
      }
      ]).start({
        update: setModalStylers,
        complete: () => {
        }
      })
    }
  })
}

let closeModal = function () {
  popmotion.timeline([
  {
    track: 'share',
    from: { y: 0, opacity: shareStyler.get().opacity, scaleY: shareStyler.get().scaleY},
    to: { y: +64, opacity: 0, scaleY: 0},
    duration: 400,
    ease: popmotion.easing.backInOut
  },
  '-400',
  {
    track: 'about',
    from: { y: 0, opacity: aboutStyler.get().opacity, aboutStyler: shareStyler.get().scaleY},
    to: { y: +64, opacity: 0, scaleY: 0},
    duration: 400,
    ease: popmotion.easing.backInOut
  },
  '-200',
  {
    track: 'modal',
    from: { y: 0, opacity: 1, scaleY: 1},
    to: { y: 32, opacity: 0, scaleY: 0},
    duration: 250,
    ease: popmotion.easing.easeInOut
  },
  ]).start({
    update: setModalStylers
  })
}

let updateShareInfo = function () {
  let link = 'http://' + window.location.host + '/' + state.current.id

  nodes.fbLink.setAttribute('href', 'https://facebook.com/sharer/sharer.php?u=' + link)
  nodes.twLink.setAttribute('href', 'https://twitter.com/intent/tweet/?text=Dictionar%20de%20puscarie%20-%20' + state.current.word + '&amp;url=' + link)
  nodes.gpLink.setAttribute('href', 'https://plus.google.com/share?url=' + link)
}

// Document Ready --------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function(event) {
  nodes.dice.onclick = getNext
  nodes.aboutBtn.onclick = toggleAbout
  nodes.shareBtn.onclick = toggleShare
  nodes.modal.onclick = closeModal
})