import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Gift, Moon, Sun, Volume2, VolumeX, Wind } from 'lucide-react'
import confetti from 'canvas-confetti'
import birthdayMusic from './music/leberch-happy-birthday-581704.mp3'
import BirthdayTree from './BirthdayTree'
import './App.css'

const birthday = {
  name: 'Prasanna',
  age: 28,
  from: 'Your Sweetheart',
  reasons: [
    'Nobody understands me the way you do.',
    'You make even the difficult days feel lighter and brighter.',
    'You are the light for my dark days.',
    'You turn the smallest moments into beautiful memories.',
    'Being yourself is more than enough. Always.',
  ],
  letter: [
    'Today is about you. Your kindness, your beautiful heart, and all the little things that make you so wonderfully you.',
    'I hope this year brings you the kind of happiness that sneaks up on you: unexpected adventures, long conversations, and a hundred tiny reasons to smile.',
    'Thank you for being my favorite part of so many ordinary days. There are still so many memories waiting for us, and I cannot wait to make them with you.',
    'Happy birthday, my special person. You deserve all the love in the world.',
  ],
 photos: Object.entries(import.meta.glob('/public/memories/*.{jpg,jpeg,png,webp,gif,avif,JPG,JPEG,PNG,WEBP,GIF,AVIF}', { eager: true, query: '?url', import: 'default' }))
    .sort(([first], [second]) => first.localeCompare(second, undefined, { numeric: true }))
    .map(([, src], index) => ({ src, caption: `A memory to cherish. No. ${index + 1}` })),
}

const sceneNames = ['A little wish', 'Your day', 'A little love', 'Five reasons', 'Our memories', 'From the heart']
const chapterTransitions = [
  { enter: {}, exit: { scale: 0.98 }, duration: 0.45 },
  { enter: { scale: 0.94, y: 24 }, exit: { scale: 1.025, y: -12 }, duration: 0.65 },
  { enter: { y: 24, clipPath: 'inset(100% 0% 0% 0%)' }, exit: { y: -18, scale: 0.985 }, duration: 0.75 },
  { enter: { x: 64 }, exit: { x: -48 }, duration: 0.6 },
  { enter: { y: 50, scale: 0.97 }, exit: { y: -42 }, duration: 0.7 },
  { enter: { x: 36, scale: 0.96, rotate: 1.5 }, exit: { x: -24, scale: 0.98, rotate: -1 }, duration: 0.7 },
  { enter: { y: 28, rotate: -1.5, clipPath: 'inset(0% 0% 100% 0%)' }, exit: { y: 18, rotate: 1 }, duration: 0.75 },
]

function chapterVariants(scene, reduced) {
  const chapter = chapterTransitions[scene + 1]
  const ease = [0.22, 1, 0.36, 1]
  return {
    hidden: { opacity: 0, ...(reduced ? {} : chapter.enter) },
    visible: {
      opacity: 1,
      ...(reduced ? {} : { x: 0, y: 0, scale: 1, rotate: 0, clipPath: 'inset(0% 0% 0% 0%)' }),
      transition: { duration: reduced ? 0.1 : chapter.duration, ease },
    },
    exit: { opacity: 0, ...(reduced ? {} : chapter.exit), transition: { duration: reduced ? 0.1 : 0.35, ease: 'easeInOut' } },
  }
}

const balloonColors = ['#ef9eaf', '#71d5cc', '#ffbd78', '#a8b8ed', '#f0cf77']
const stars = Array.from({ length: 46 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 23 + 7) % 100}%`,
  delay: `${(index % 8) * -0.7}s`,
}))
const flowerStyles = [
  { name: 'daisy', petals: 12 },
  { name: 'marigold', petals: 18 },
  { name: 'cosmos', petals: 8 },
  { name: 'blossom', petals: 5 },
]
const openingFlowers = Array.from({ length: 160 }, (_, index) => ({
  left: ((0.5 + index * 0.754877666) % 1) * 104 - 2,
  top: ((0.5 + index * 0.569840296) % 1) * 104 - 2,
  size: 30 + (index * 17) % 43,
  rotation: (index * 137.5) % 360,
  color: ['#e8c778', '#bad4c1', '#c8cde0', '#edc7cd', '#e8dfa9', '#eccb9c'][(index * 7 + Math.floor(index / 4)) % 6],
  style: flowerStyles[index % flowerStyles.length],
}))

function celebrate(origin = { x: 0.5, y: 0.6 }, count = 100) {
  confetti({ particleCount: count, spread: 85, origin, colors: balloonColors, disableForReducedMotion: true })
}

function NextButton({ onClick, children = 'Keep going', disabled = false }) {
  return <button className="next-button" onClick={onClick} disabled={disabled}>{children}<ArrowRight size={17} aria-hidden="true" /></button>
}

function IntroScene({ next, onFlowersCleared, onUnwrapReady }) {
  const reduced = useReducedMotion()
  const [cleared, setCleared] = useState(false)
  const [revealed, setRevealed] = useState(false)
  return (
    <>
      {revealed && <motion.div className="scene-content unwrap-scene" initial={{ opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0.01 : 0.6 }} onAnimationComplete={() => document.querySelector('.unwrap-scene h1')?.focus({ preventScroll: true })}>
        <div className="gift-tag">
          <Gift size={46} strokeWidth={1.2} aria-hidden="true" />
          <p className="eyebrow">A SURPRISE FOR</p>
          <h1 tabIndex={-1}>{birthday.name}</h1>
          <p className="scene-copy">{birthday.from} made this,<br />just for you.</p>
        </div>
        <NextButton onClick={next} disabled={!cleared}>Unwrap it</NextButton>
      </motion.div>}
      {cleared && !revealed && <motion.div className="flower-curtain" aria-hidden="true" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: reduced ? 0.01 : 0.7, ease: 'easeInOut' }} onAnimationComplete={() => { setRevealed(true); onUnwrapReady() }} />}
      {!cleared && <motion.div className="flower-curtain" aria-hidden="true" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: reduced ? 0 : 1.8, duration: reduced ? 0.1 : 1.4 }} onAnimationComplete={() => { setCleared(true); onFlowersCleared() }}>
        {openingFlowers.map((flower, index) => (
          <motion.div className={`curtain-flower flower-${flower.style.name}`} key={index} style={{ left: `${flower.left}%`, top: `${flower.top}%`, '--flower-size': `${flower.size}px`, '--flower-color': flower.color }} initial={{ rotate: flower.rotation }} animate={{ x: reduced ? 0 : (flower.left - 50) * 2, y: reduced ? 0 : (flower.top - 50) * 2, rotate: flower.rotation + (reduced ? 0 : 70), scale: reduced ? 1 : 0.4 }} transition={{ delay: reduced ? 0 : 1 + (index % 7) * 0.12, duration: reduced ? 0.1 : 1.9, ease: 'easeInOut' }}>
            <div className="flower-art">
              {Array.from({ length: flower.style.petals }, (_, petalIndex) => <span className="flower-petal" key={petalIndex} style={{ transform: `rotate(${petalIndex * 360 / flower.style.petals}deg)` }} />)}
              <span className="flower-center" />
            </div>
          </motion.div>
        ))}
      </motion.div>}
    </>
  )
}

function splitCake(start, end) {
  const length = Math.hypot(end.x - start.x, end.y - start.y)
  const direction = { x: (end.x - start.x) / length, y: (end.y - start.y) / length }
  const normal = { x: -direction.y, y: direction.x }
  const lineStart = { x: start.x - direction.x * 1000, y: start.y - direction.y * 1000 }
  const lineEnd = { x: end.x + direction.x * 1000, y: end.y + direction.y * 1000 }
  const parts = [-1, 1].map((side) => ({
    side,
    points: [lineStart, lineEnd, { x: lineEnd.x + normal.x * side * 2000, y: lineEnd.y + normal.y * side * 2000 }, { x: lineStart.x + normal.x * side * 2000, y: lineStart.y + normal.y * side * 2000 }].map((point) => `${point.x},${point.y}`).join(' '),
  }))
  return { normal, lineStart, lineEnd, parts }
}

function CakeScene({ next }) {
  const [candleStage, setCandleStage] = useState('lit')
  const [cut, setCut] = useState(false)
  const [complete, setComplete] = useState(false)
  const [cutLine, setCutLine] = useState(null)
  const dragStart = useRef(null)
  const cakeRef = useRef(null)
  const gradientId = useId()
  const reduced = useReducedMotion()
  const split = cut && cutLine ? splitCake(cutLine.start, cutLine.end) : null
  const parts = split?.parts ?? [{ side: 0 }]
  useEffect(() => {
    if (candleStage === 'out') cakeRef.current?.focus({ preventScroll: true })
  }, [candleStage])

  function cakePoint(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: Math.max(80, Math.min(320, (event.clientX - rect.left) / rect.width * 400)), y: Math.max(105, Math.min(240, (event.clientY - rect.top) / rect.height * 290)) }
  }

  function finishCut(start, end) {
    if (cut || candleStage !== 'out') return
    dragStart.current = null
    setCutLine({ start, end })
    setCut(true)
    celebrate()
  }

  function moveKnife(event) {
    if (!dragStart.current || cut) return
    const end = cakePoint(event)
    const start = dragStart.current
    setCutLine({ start, end })
  }

  return (
    <div className="scene-content cake-scene">
      <p className="eyebrow">A LITTLE SOMETHING, JUST FOR YOU</p>
      <h1 tabIndex={-1}>Happy birthday,<br /><em>{birthday.name}.</em></h1>
      <p className="scene-copy">First, a wish. Then, something sweet.</p>
      <button ref={cakeRef} className={`cake-button candle-${candleStage} ${cut ? 'cut' : ''}`} aria-label={candleStage === 'out' ? 'Press and slide across the cake to cut a slice, or press Enter' : 'Birthday cake; blow out the candle before cutting'} disabled={cut || candleStage !== 'out'} onPointerDown={(event) => {
        if (event.button !== 0 || cut || candleStage !== 'out') return
        const rect = event.currentTarget.getBoundingClientRect()
        const pointerX = (event.clientX - rect.left) / rect.width * 400
        const pointerY = (event.clientY - rect.top) / rect.height * 290
        if (pointerX < 80 || pointerX > 320 || pointerY < 105 || pointerY > 240) return
        const point = cakePoint(event)
        event.currentTarget.setPointerCapture(event.pointerId)
        dragStart.current = point
        setCutLine({ start: point, end: point })
      }} onPointerMove={moveKnife} onPointerUp={(event) => {
        if (!dragStart.current || cut) return
        const start = dragStart.current
        const end = cakePoint(event)
        if (Math.hypot(end.x - start.x, end.y - start.y) >= 45) finishCut(start, end)
        else { dragStart.current = null; setCutLine(null) }
      }} onPointerCancel={() => { dragStart.current = null; if (!cut) setCutLine(null) }} onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); finishCut({ x: 205, y: 125 }, { x: 295, y: 190 }) }
      }}>
        <svg className="cake-art" viewBox="0 0 400 290" role="img" aria-label={`Pink birthday cake with ${candleStage === 'out' ? 'an extinguished' : 'a lit'} candle`}>
          <defs>
            <linearGradient id={`${gradientId}-sponge`} x2="0" y2="1"><stop stopColor="#f9c4cb" /><stop offset="1" stopColor="#c57489" /></linearGradient>
            <linearGradient id={`${gradientId}-icing`} x2="0" y2="1"><stop stopColor="#fff0e7" /><stop offset="1" stopColor="#f7c6ce" /></linearGradient>
            <clipPath id={`${gradientId}-silhouette`}><path d="M80 135 A120 30 0 0 1 320 135 L320 230 Q200 256 80 230Z" /></clipPath>
            <clipPath id={`${gradientId}-cream`}><rect x="60" y="179" width="280" height="15" /></clipPath>
            {split && parts.map((part) => <clipPath key={part.side} id={`${gradientId}-part-${part.side}`}><polygon points={part.points} /></clipPath>)}
            <g id={`${gradientId}-body`}>
              <path d="M80 135 L80 230 Q200 256 320 230 L320 135Z" fill={`url(#${gradientId}-sponge)`} />
              <path d="M80 176 Q200 200 320 176 L320 195 Q200 222 80 195Z" fill="#f8d8c5" />
              <ellipse cx="200" cy="135" rx="120" ry="30" fill={`url(#${gradientId}-icing)`} />
              <path d="M80 137 Q96 153 107 148 L107 160 Q115 180 124 158 L124 152 Q143 156 153 151 L153 169 Q164 186 172 165 L172 156 Q205 165 235 155 L235 165 Q245 179 252 160 L252 151 Q290 155 320 138" fill="#ffdfd8" />
              <g className="candle"><rect x="195" y="68" width="10" height="66" rx="3" fill="#f4e9c9" /><path d="M195 83 L205 77 M195 103 L205 97 M195 123 L205 117" stroke="#d97a91" strokeWidth="3" /><path d="M200 68 L200 62" stroke="#67404a" strokeWidth="2" strokeLinecap="round" /><path className={`flame ${candleStage === 'blowing' ? 'flame-extinguishing' : candleStage === 'out' ? 'flame-out' : ''}`} d="M200 38 C179 61 193 72 200 71 C215 70 218 56 200 38" fill="#ffcc70" /></g>
            </g>
          </defs>
          <ellipse cx="200" cy="249" rx="161" ry="15" fill="#c7a880" opacity=".25" />
          <path d="M49 242 Q200 265 351 242" stroke="#f6e9d3" strokeWidth="9" strokeLinecap="round" fill="none" />
          {parts.map((part) => <motion.g key={part.side} initial={{ x: 0, y: 0 }} animate={{ x: split ? split.normal.x * part.side * 26 : 0, y: split ? split.normal.y * part.side * 18 : 0 }} transition={{ duration: reduced ? 0.01 : 1.2, delay: reduced ? 0 : 0.15, ease: [0.2, 0.8, 0.2, 1] }} onAnimationComplete={() => { if (cut && part.side === 1) setComplete(true) }}>
            <g clipPath={split ? `url(#${gradientId}-part-${part.side})` : undefined}>
              <use href={`#${gradientId}-body`} />
              {split && <g clipPath={`url(#${gradientId}-silhouette)`}>
                <path d={`M${split.lineStart.x} ${split.lineStart.y} L${split.lineEnd.x} ${split.lineEnd.y}`} stroke="#d4a17c" strokeWidth="14" />
                <g clipPath={`url(#${gradientId}-cream)`}><path d={`M${split.lineStart.x} ${split.lineStart.y} L${split.lineEnd.x} ${split.lineEnd.y}`} stroke="#fff0dc" strokeWidth="14" /></g>
              </g>}
            </g>
          </motion.g>)}
          {cutLine && !cut && <g clipPath={`url(#${gradientId}-silhouette)`}><path className="cake-cut-line" d={`M${cutLine.start.x} ${cutLine.start.y} L${cutLine.end.x} ${cutLine.end.y}`} stroke="#8d455d" strokeWidth="2.5" strokeLinecap="round" /></g>}
          {cutLine && !cut && <image href="/knife-cursor.svg" x={cutLine.end.x - 5} y={cutLine.end.y - 4} width="36" height="36" pointerEvents="none" />}
          {candleStage === 'blowing' && <g className="candle-air" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {['M42 56 Q88 39 130 54 T196 57', 'M61 73 Q112 61 149 71 T214 68', 'M79 36 Q119 24 161 39 T211 42'].map((path, index) => <motion.path key={path} d={path} initial={{ pathLength: 0, opacity: 0, x: -18 }} animate={{ pathLength: [0, 1, 1], opacity: [0, 0.65, 0], x: reduced ? 0 : [-18, 8, 18] }} transition={{ duration: reduced ? 0.1 : 1.05, delay: reduced ? 0 : index * 0.1, ease: 'easeOut' }} onAnimationComplete={() => { if (index === 2) setCandleStage('out') }} />)}
          </g>}
          {candleStage !== 'lit' && !cut && <g className="candle-smoke" fill="none" stroke="var(--muted)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            {['M200 63 C190 51 212 45 201 32 C194 24 207 20 204 12', 'M204 63 C219 50 201 41 213 29'].map((path, index) => <motion.path key={path} d={path} initial={{ opacity: 0, y: 0, pathLength: 0 }} animate={{ opacity: [0, 0.55, 0], y: reduced ? 0 : -24, pathLength: [0, 1, 1] }} transition={{ duration: reduced ? 0.1 : 1.6, delay: reduced ? 0 : 0.6 + index * 0.12, ease: 'easeOut' }} />)}
          </g>}
        </svg>
      </button>
      <p className="moment-caption" aria-live="polite">{cut ? 'A slice of happiness. A sweet year ahead.' : candleStage === 'lit' ? 'Close your eyes. Make a wish.' : candleStage === 'blowing' ? 'Sending your wish into the world...' : 'Your wish is on its way. A little sweetness next.'}</p>
      <div className="cake-actions">
        {candleStage !== 'out' && <button type="button" className="next-button blow-button" disabled={candleStage === 'blowing'} onClick={() => setCandleStage('blowing')}><Wind size={19} aria-hidden="true" />{candleStage === 'blowing' ? 'Blowing...' : 'Blow'}</button>}
        {candleStage === 'out' && !cut && <motion.img className="ready-knife" src="/knife-cursor.svg" width="48" height="48" alt="" aria-hidden="true" initial={{ opacity: 0, y: reduced ? 0 : 10, rotate: reduced ? 0 : -20 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: reduced ? 0.1 : 0.45 }} />}
        {cut && <NextButton onClick={next} disabled={!complete}>{complete ? 'There is more to celebrate' : 'Serving your slice...'}</NextButton>}
      </div>
    </div>
  )
}

function WishScene({ next, theme }) {
  const [grown, setGrown] = useState(false)
  return (
    <div className="scene-content tree-wish-scene">
      <div className="tree-wish-copy">
        <p className="script-note">It is officially your day</p>
        <h1 tabIndex={-1}>Happy Birthday,<br /><em>{birthday.name}.</em></h1>
        <p className="birthday-milestone"><span className="milestone-age">{birthday.age}</span><span className="milestone-copy"><strong>years of you</strong><span>A beautiful new chapter.</span></span></p>
        <p className="scene-copy">A little love, taking root.<br />A whole world of wishes, just for you.</p>
        <NextButton onClick={next} disabled={!grown}>There is more for you</NextButton>
      </div>
      <BirthdayTree theme={theme} onComplete={() => setGrown(true)} />
    </div>
  )
}

function HeartBalloon() {
  const gradientId = useId()
  return (
    <svg className="heart-balloon-art" viewBox="0 0 120 140" role="img" aria-label="Red heart-shaped balloon">
      <defs><radialGradient id={gradientId} cx="30%" cy="22%" r="85%"><stop offset="0" stopColor="#ffc6cf" /><stop offset=".38" stopColor="#f36a80" /><stop offset=".78" stopColor="#d93054" /><stop offset="1" stopColor="#a8193d" /></radialGradient></defs>
      <path d="M60 101 C48 91 8 65 8 35 C8 7 43 2 60 24 C77 2 112 7 112 35 C112 65 72 91 60 101Z" fill={`url(#${gradientId})`} stroke="#c33b55" strokeWidth=".8" />
      <ellipse cx="33" cy="29" rx="13" ry="7" fill="#fff" opacity=".48" transform="rotate(-22 33 29)" />
      <path d="M60 101 L56 107 L64 107Z" fill="#c33b55" />
      <path d="M60 107 Q52 116 61 124 Q68 132 60 140" fill="none" stroke="#d9b493" strokeWidth="1" />
    </svg>
  )
}

function ArrowScene({ next }) {
  const stage = useRef(null)
  const target = useRef(null)
  const launcher = useRef(null)
  const dragStart = useRef(null)
  const dragging = useRef(false)
  const latestPull = useRef({ x: 0, y: 0 })
  const [pull, setPull] = useState({ x: 0, y: 0 })
  const [flight, setFlight] = useState(null)
  const [hit, setHit] = useState(false)
  const [hint, setHint] = useState('A little love, headed your way.')
  const reduced = useReducedMotion()

  function release(keyboard = false) {
    if (flight || hit) return
    dragging.current = false
    const stageRect = stage.current.getBoundingClientRect()
    const bowRect = launcher.current.getBoundingClientRect()
    const targetRect = target.current.getBoundingClientRect()
    const start = { x: bowRect.left + bowRect.width / 2 - stageRect.left, y: bowRect.top + bowRect.height / 2 - stageRect.top }
    const center = { x: targetRect.left + targetRect.width / 2 - stageRect.left, y: targetRect.top + targetRect.height / 2 - stageRect.top }
    const direction = keyboard ? { x: center.x - start.x, y: center.y - start.y } : { x: -latestPull.current.x, y: -latestPull.current.y }
    const length = Math.hypot(direction.x, direction.y)
    setPull({ x: 0, y: 0 })
    latestPull.current = { x: 0, y: 0 }
    if (length < 12) { setHint('A little further back, then let it fly.'); return }
    const unit = { x: direction.x / length, y: direction.y / length }
    const projection = (center.x - start.x) * unit.x + (center.y - start.y) * unit.y
    const distance = Math.hypot(start.x + projection * unit.x - center.x, start.y + projection * unit.y - center.y)
    const isHit = projection > 0 && distance < targetRect.width * 0.43
    const travel = isHit ? projection : Math.hypot(stageRect.width, stageRect.height)
    setFlight({ start, end: { x: start.x + unit.x * travel, y: start.y + unit.y * travel }, angle: Math.atan2(unit.y, unit.x) * 180 / Math.PI, isHit })
  }

  return (
    <div className="scene-content arrow-scene">
      <p className="eyebrow">STRAIGHT FROM THE HEART</p>
      <h1 tabIndex={-1}>A little something,<br /><em>for you.</em></h1>
      <div className="archery-stage" ref={stage}>
        <AnimatePresence>{!hit && <motion.div className="heart-target" ref={target} exit={{ scale: 1.5, opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.35 }}><HeartBalloon /></motion.div>}</AnimatePresence>
        {flight && <motion.div className="flying-arrow" initial={{ left: flight.start.x, top: flight.start.y, rotate: flight.angle }} animate={{ left: flight.end.x, top: flight.end.y }} transition={{ duration: reduced ? 0.01 : 0.6, ease: 'linear' }} onAnimationComplete={() => {
          if (flight.isHit) { setHit(true); setHint('You had my heart all along.'); const rect = target.current?.getBoundingClientRect(); celebrate(rect ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight } : undefined) }
          else setHint('Almost! Another little love arrow?')
          setFlight(null)
        }}><svg viewBox="0 0 120 24"><path d="M10 12 H110 M100 3 L113 12 L100 21 M21 12 L9 2 M21 12 L9 22" fill="none" stroke="currentColor" strokeWidth="3" /></svg></motion.div>}
        <button ref={launcher} className={`bow-control ${hit ? 'bow-done' : ''}`} aria-label="Pull the bow back and release to shoot; press Enter to shoot at the heart" disabled={hit || Boolean(flight)} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); dragging.current = true; dragStart.current = { x: event.clientX, y: event.clientY } }} onPointerMove={(event) => {
          if (!dragging.current) return
          const updated = { x: Math.max(-110, Math.min(90, event.clientX - dragStart.current.x)), y: Math.max(-90, Math.min(110, event.clientY - dragStart.current.y)) }
          latestPull.current = updated
          setPull(updated)
        }} onPointerUp={() => release()} onPointerCancel={() => { dragging.current = false; latestPull.current = { x: 0, y: 0 }; setPull({ x: 0, y: 0 }) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); release(true) } }}>
          <svg viewBox="-120 -120 240 240" style={{ transform: `rotate(${Math.atan2(-pull.y || -1, -pull.x || 1) * 180 / Math.PI + 45}deg)` }} aria-hidden="true">
            <path d="M-41 -70 Q65 -40 70 41" fill="none" stroke="#8b503c" strokeWidth="7" strokeLinecap="round" />
            <path d={`M-41 -70 L${pull.x * 0.35} ${pull.y * 0.35} L70 41`} fill="none" stroke="#ead6b2" strokeWidth="2" />
            <path d="M-45 45 L66 -66 M49 -64 L69 -69 L64 -49" fill="none" stroke="#d7b76e" strokeWidth="4" />
            <path d="M-45 45 L-45 28 M-45 45 L-28 45" stroke="#b74964" strokeWidth="9" />
          </svg>
        </button>
      </div>
      <p className="moment-caption" aria-live="polite">{hint}</p>
      {hit ? <NextButton onClick={next}>A few reasons why</NextButton> : <p className="gesture-label">PULL BACK & RELEASE</p>}
    </div>
  )
}

function BalloonsScene({ next }) {
  const [popped, setPopped] = useState([])
  return (
    <div className="scene-content balloons-scene">
      <p className="eyebrow">LITTLE REASONS. BIG LOVE.</p>
      <h1 tabIndex={-1}>You are loved.<br /><em>Here is why.</em></h1>
      <div className="balloon-sky">
        <AnimatePresence>{birthday.reasons.map((reason, index) => !popped.includes(index) && <motion.button key={index} className={`floating-balloon balloon-${index}`} style={{ '--balloon-color': balloonColors[index], '--delay': `${index * -0.7}s` }} aria-label={`Pop balloon ${index + 1}`} exit={{ scale: [1, 1.25, 0], opacity: 0 }} transition={{ duration: 0.25 }} onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setPopped((previous) => previous.includes(index) ? previous : [...previous, index]); celebrate({ x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }, 45) }}><span className="balloon-body" /><span className="balloon-string" /></motion.button>)}</AnimatePresence>
      </div>
      <div className="reasons-list" aria-live="polite">{popped.map((index) => <motion.article className="reason" key={index} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}><span>REASON NO. {index + 1}</span><p>{birthday.reasons[index]}</p><span className="reason-star" aria-hidden="true">✦</span></motion.article>)}</div>
      {popped.length === birthday.reasons.length ? <NextButton onClick={next}>Our little memory lane</NextButton> : <p className="moment-caption">{popped.length} / {birthday.reasons.length}</p>}
    </div>
  )
}

function LetterScene({ restart }) {
  const [opened, setOpened] = useState(false)
  const [ready, setReady] = useState(false)
  const [finished, setFinished] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const paragraphs = birthday.letter.map((paragraph) => paragraph.split(/\s+/))
  const total = paragraphs.reduce((count, paragraph) => count + paragraph.length, 0)
  useEffect(() => {
    if (!ready || wordCount >= total) return
    const timer = setInterval(() => setWordCount((count) => Math.min(total, count + 1)), 150)
    return () => clearInterval(timer)
  }, [ready, total, wordCount])
  return (
    <div className={`scene-content letter-scene ${opened ? 'letter-open' : ''}`}>
      <p className="eyebrow">SEALED WITH A LITTLE LOVE</p>
      <h1 tabIndex={-1}>One last thing,<br /><em>{birthday.name}...</em></h1>
      <p className="scene-copy">{birthday.from} wrote you a letter.</p>
      {!ready && <motion.button className={`envelope ${opened ? 'opening' : ''}`} aria-label="Open your letter" disabled={opened} onClick={() => setOpened(true)} animate={opened ? { y: 115, opacity: 0 } : { y: 0, opacity: 1 }} transition={{ delay: opened ? 1.15 : 0, duration: 0.75, ease: 'easeInOut' }} onAnimationComplete={() => { if (opened) setReady(true) }}><span className="envelope-paper" /><span className="envelope-front" /><span className="envelope-flap" /><span className="envelope-seal">{birthday.name.charAt(0)}</span></motion.button>}
      {ready && <motion.article className="letter-paper" initial={{ opacity: 0, y: 95, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}><h2>Dear {birthday.name},</h2><div className="letter-body">{paragraphs.map((words, index) => { const start = paragraphs.slice(0, index).reduce((count, paragraph) => count + paragraph.length, 0); return <p key={index}>{words.map((word, wordIndex) => <span className={start + wordIndex < wordCount ? 'word visible' : 'word'} key={wordIndex}>{word} </span>)}</p> })}</div><p className={`signature ${wordCount >= total ? 'visible' : ''}`}>With all my love,<br />{birthday.from}</p><span className="paper-heart" aria-hidden="true">♡</span></motion.article>}
      {ready ? <>
        <button className="text-button" onClick={() => setWordCount(total)} disabled={wordCount >= total}>Read it all</button>
        {finished ? <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="closing-wish"><p>Here is to a thousand more memories.<br />Happy birthday, {birthday.name}.</p><NextButton onClick={restart}>Live it all again</NextButton></motion.div> : <NextButton disabled={wordCount < total} onClick={() => { setFinished(true); celebrate() }}>One more wish</NextButton>}
      </> : <p className="moment-caption">{opened ? 'Some words are worth keeping.' : 'Just for you.'}</p>}
    </div>
  )
}

function GalleryScene({ next }) {
  const [index, setIndex] = useState(0)
  const swipeStart = useRef(null)
 const changePhoto = (delta) => setIndex((current) => (current + delta + birthday.photos.length) % birthday.photos.length)
  useEffect(() => {
    if (birthday.photos.length < 2) return
    const timer = setTimeout(() => setIndex((current) => (current + 1) % birthday.photos.length), 5000)
    return () => clearTimeout(timer)
  }, [index])
  if (birthday.photos.length === 0) return (
    <div className="scene-content gallery-scene">
      <h1 tabIndex={-1}>So many memories<br /><em>still to come.</em></h1>
      <NextButton onClick={next}>One last little secret</NextButton>
    </div>
  )
  return (
    <div className="scene-content gallery-scene">
      <p className="eyebrow">THE MOMENTS THAT STAY</p>
      <h1 tabIndex={-1}>A walk down<br /><em>memory lane.</em></h1>
      <div className="photo-line" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="photo-gallery" onPointerDown={(event) => { swipeStart.current = event.clientX }} onPointerUp={(event) => { if (swipeStart.current !== null && Math.abs(event.clientX - swipeStart.current) > 40) changePhoto(event.clientX < swipeStart.current ? 1 : -1); swipeStart.current = null }} onPointerCancel={() => { swipeStart.current = null }}>
        <div className="polaroid ghost left-photo" aria-hidden="true"><img src={birthday.photos[(index + birthday.photos.length - 1) % birthday.photos.length].src} alt="" draggable={false} /><p>A day to remember</p></div>
        <AnimatePresence mode="wait"><motion.figure className="polaroid main-photo" key={index} initial={{ opacity: 0, x: 35, rotate: 3 }} animate={{ opacity: 1, x: 0, rotate: -2 }} exit={{ opacity: 0, x: -35, rotate: -4 }} transition={{ duration: 0.45 }}><span className="photo-clip" /><img src={birthday.photos[index].src} alt={birthday.photos[index].caption} draggable={false} onError={(event) => { event.currentTarget.style.opacity = '0'; event.currentTarget.parentElement.classList.add('image-unavailable') }} /><figcaption>{birthday.photos[index].caption}</figcaption></motion.figure></AnimatePresence>
        <div className="polaroid ghost right-photo" aria-hidden="true"><img src={birthday.photos[(index + 1) % birthday.photos.length].src} alt="" draggable={false} /><p>And so many more</p></div>
      </div>
      <div className="gallery-controls"><button className="icon-button" aria-label="Previous photo" title="Previous photo" onClick={() => changePhoto(-1)}><ArrowLeft size={17} /></button><div className="photo-dots">{birthday.photos.map((photo, photoIndex) => <button key={photo.src} className={index === photoIndex ? 'selected' : ''} aria-label={`Photo ${photoIndex + 1}`} aria-current={index === photoIndex ? 'true' : undefined} onClick={() => setIndex(photoIndex)} />)}</div><button className="icon-button" aria-label="Next photo" title="Next photo" onClick={() => changePhoto(1)}><ArrowRight size={17} /></button></div>
      <NextButton onClick={next}>One last little secret</NextButton>
    </div>
  )
}

function BackgroundMusic({ theme, onToggleTheme, showControls }) {
  const audioRef = useRef(null)
  const enabled = useRef(true)
  const [playing, setPlaying] = useState(true)
  const [failed, setFailed] = useState(false)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    let active = true
    audio.volume = 0.35
    audio.muted = false

    function startMusic(event) {
      if (event?.target instanceof Element && event.target.closest('.music-toggle')) return
      if (active && enabled.current && audio.paused) {
        audio.play().catch((error) => {
          if (!active) return
          if (error.name === 'NotAllowedError') setBlocked(true)
          else if (error.name === 'NotSupportedError') setFailed(true)
        })
      }
    }

    audio.addEventListener('canplay', startMusic)
    document.addEventListener('pointerdown', startMusic)
    document.addEventListener('pointerup', startMusic)
    document.addEventListener('click', startMusic)
    document.addEventListener('keydown', startMusic)
    queueMicrotask(() => { if (active) startMusic() })
    return () => {
      active = false
      audio.removeEventListener('canplay', startMusic)
      document.removeEventListener('pointerdown', startMusic)
      document.removeEventListener('pointerup', startMusic)
      document.removeEventListener('click', startMusic)
      document.removeEventListener('keydown', startMusic)
      audio.pause()
    }
  }, [])

  function toggleMusic() {
    const audio = audioRef.current
    if (playing) {
      enabled.current = false
      audio.pause()
    } else {
      enabled.current = true
      audio.play().catch((error) => {
        if (error.name === 'NotAllowedError') setBlocked(true)
        else if (error.name === 'NotSupportedError') setFailed(true)
      })
    }
  }

  const label = failed ? 'Music unavailable' : playing ? 'Mute music' : blocked ? 'Play music (browser blocked autoplay)' : 'Play music'
  return (
    <>
      <audio ref={audioRef} src={birthdayMusic} autoPlay loop preload="auto" onPlay={() => { setPlaying(true); setBlocked(false) }} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
      {showControls && <div className="story-controls">
        <button className="theme-toggle icon-button" type="button" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
        <button className="music-toggle icon-button" type="button" aria-label={label} title={label} aria-pressed={playing} disabled={failed} onClick={toggleMusic}>
          {playing ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
        </button>
      </div>}
    </>
  )
}

function App() {
  const [scene, setScene] = useState(-1)
  const [transitioning, setTransitioning] = useState(true)
  const [flowersCleared, setFlowersCleared] = useState(false)
  const [unwrapReady, setUnwrapReady] = useState(false)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('birthday-theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' }
  })
  const reduced = useReducedMotion()
  const displayTheme = scene === -1 && !flowersCleared ? 'light' : theme
  useEffect(() => {
    document.documentElement.dataset.theme = displayTheme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', displayTheme === 'dark' ? '#451622' : '#f5f3ee')
    try { localStorage.setItem('birthday-theme', theme) } catch { return }
  }, [displayTheme, theme])
  useEffect(() => {
    if (!transitioning) document.querySelector('.scene h1')?.focus({ preventScroll: true })
  }, [transitioning])
  function next() { if (transitioning) return; setTransitioning(true); setScene((current) => Math.min(current + 1, sceneNames.length - 1)); window.scrollTo({ top: 0 }) }
  return (
    <main className={`birthday-story scene-${scene}`} data-theme={displayTheme}>
      <BackgroundMusic theme={theme} showControls={scene !== -1 || unwrapReady} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />
      <div className="star-field" aria-hidden="true">{stars.map((star, index) => <span className={index % 11 === 0 ? 'star sparkle' : 'star'} key={index} style={{ left: star.left, top: star.top, animationDelay: star.delay }}>{index % 11 === 0 ? '✦' : ''}</span>)}</div>
      {(scene !== -1 || unwrapReady) && <header className="story-header"><span>FOR {birthday.name.toUpperCase()}</span><span>A BIRTHDAY STORY</span></header>}
      <div inert={transitioning}>
        <AnimatePresence mode="wait" onExitComplete={() => { if (scene === -1) { setFlowersCleared(false); setUnwrapReady(false) } }}><motion.section className="scene" key={scene} aria-label={sceneNames[scene] ?? 'A surprise for you'} variants={chapterVariants(scene, reduced)} initial="hidden" animate="visible" exit="exit" onAnimationComplete={(phase) => { if (phase === 'visible') setTransitioning(false) }}>
          {scene === -1 && <IntroScene next={next} onFlowersCleared={() => setFlowersCleared(true)} onUnwrapReady={() => setUnwrapReady(true)} />}
          {scene === 0 && <CakeScene next={next} />}
          {scene === 1 && <WishScene next={next} theme={theme} />}
          {scene === 2 && <ArrowScene next={next} />}
          {scene === 3 && <BalloonsScene next={next} />}
          {scene === 4 && <GalleryScene next={next} />}
          {scene === 5 && <LetterScene restart={() => { setTransitioning(true); setScene(-1); window.scrollTo({ top: 0 }) }} />}
        </motion.section></AnimatePresence>
      </div>
      {/* <footer className="story-footer"><div className="scene-progress" aria-label={`Chapter ${scene + 1} of ${sceneNames.length}`}>{sceneNames.map((name, index) => <span key={name} className={index === scene ? 'active' : index < scene ? 'complete' : ''} />)}</div><span>{String(scene + 1).padStart(2, '0')} / 06</span></footer> */}
    </main>
  )
}

export default App
