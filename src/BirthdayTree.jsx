import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const colors = [
  { color: '#e98cad', highlight: '#ffe6f0', shade: '#b44e77' },
  { color: '#f19b80', highlight: '#ffeadc', shade: '#bf604c' },
  { color: '#f3ce70', highlight: '#fff4cb', shade: '#bf8839' },
  { color: '#73c9bd', highlight: '#dcfff3', shade: '#308d87' },
  { color: '#85b9ed', highlight: '#e2f3ff', shade: '#487eba' },
  { color: '#b59cdb', highlight: '#f1e9ff', shade: '#8564ad' },
  { color: '#a1cb8d', highlight: '#edfadd', shade: '#538754' },
  { color: '#ed8290', highlight: '#ffe8e9', shade: '#b74452' },
]
const branches = [
  [264, 585, 289, 455, 258, 310, 15, 0.5],
  [263, 390, 209, 302, 155, 204, 9, 1.1],
  [264, 357, 326, 277, 376, 186, 9, 1.2],
  [259, 322, 240, 210, 247, 105, 7, 1.5],
  [211, 301, 125, 284, 74, 202, 6, 1.6],
  [186, 261, 192, 166, 158, 92, 5, 1.8],
  [154, 206, 94, 169, 79, 107, 4, 2.0],
  [319, 286, 403, 268, 450, 183, 6, 1.7],
  [345, 237, 330, 152, 364, 85, 5, 1.9],
  [378, 185, 424, 141, 436, 89, 4, 2.1],
  [247, 194, 204, 139, 203, 59, 4, 2.0],
  [247, 165, 284, 116, 280, 51, 4, 2.1],
  [128, 264, 99, 271, 48, 243, 3, 2.2],
  [115, 165, 109, 131, 121, 95, 3, 2.3],
  [178, 152, 152, 133, 137, 54, 3, 2.4],
  [334, 161, 303, 132, 317, 72, 3, 2.3],
  [413, 253, 466, 239, 481, 210, 3, 2.4],
  [419, 146, 391, 104, 400, 57, 3, 2.5],
]
const branchAnchors = branches.slice(1).flatMap((branch) => Array.from({ length: 21 }, (_, index) => {
  const position = index / 20
  const inverse = 1 - position
  return {
    x: inverse ** 2 * branch[0] + 2 * inverse * position * branch[2] + position ** 2 * branch[4],
    y: inverse ** 2 * branch[1] + 2 * inverse * position * branch[3] + position ** 2 * branch[5],
    delay: branch[7] + 1.2,
  }
}))
const canopyLobes = [[255, 185, 185, 150], [130, 170, 105, 110], [377, 160, 100, 110], [257, 282, 128, 95]]
const balloons = Array.from({ length: 420 }, (_, index) => {
  const x = 25 + ((0.5 + index * 0.754877666) % 1) * 460
  const y = 35 + ((0.5 + index * 0.569840296) % 1) * 345
  if (!canopyLobes.some(([centerX, centerY, radiusX, radiusY]) => ((x - centerX) / radiusX) ** 2 + ((y - centerY) / radiusY) ** 2 <= 1)) return null
  const size = 12 + (index * 13) % 9
  const anchor = branchAnchors.reduce((nearest, point) => Math.hypot(point.x - x, point.y - y - size) < Math.hypot(nearest.x - x, nearest.y - y - size) ? point : nearest)
  return {
    anchorX: anchor.x,
    anchorY: anchor.y,
    x,
    y,
    size,
    ...colors[(index * 7 + Math.floor(index / 5)) % colors.length],
    delay: Math.max(anchor.delay, 2 + (380 - y) / 345 * 2.4) + (index % 5) * 0.08,
    tilt: Math.sin(index * 11) * 0.2,
  }
}).filter(Boolean).sort((first, second) => first.y - second.y)

function progress(time, start, duration) {
  return Math.max(0, Math.min(1, (time - start) / duration))
}

function drawBranch(context, branch, amount, bark) {
  const [startX, startY, controlX, controlY, endX, endY, width] = branch
  context.beginPath()
  context.moveTo(startX, startY)
  for (let step = 1; step <= 40; step++) {
    const position = step / 40 * amount
    const inverse = 1 - position
    context.lineTo(inverse ** 2 * startX + 2 * inverse * position * controlX + position ** 2 * endX, inverse ** 2 * startY + 2 * inverse * position * controlY + position ** 2 * endY)
  }
  context.strokeStyle = bark
  context.lineWidth = width
  context.lineCap = 'round'
  context.stroke()
}

function drawBalloon(context, balloon, time, tether = false) {
  const amount = progress(time, balloon.delay, 1.3)
  if (amount === 0) return
  const eased = 1 - (1 - amount) ** 3
  const tilt = balloon.tilt + Math.sin(time * 1.2 + balloon.delay) * 0.03
  const size = balloon.size * (0.2 + eased * 0.8)
  const height = balloon.y + (1 - eased) * 80
  context.save()
  context.globalAlpha = Math.min(1, amount * 3)
  if (tether) {
    context.beginPath()
    context.moveTo(balloon.anchorX, balloon.anchorY)
    context.quadraticCurveTo((balloon.anchorX + balloon.x) / 2 + 5, balloon.anchorY, balloon.x - Math.sin(tilt) * size * 1.16, height + Math.cos(tilt) * size * 1.16)
    context.strokeStyle = '#d4aa8460'
    context.lineWidth = 0.7
    context.stroke()
    context.restore()
    return
  }
  context.translate(balloon.x, height)
  context.rotate(tilt)
  context.scale(size, size)
  const fill = context.createRadialGradient(-0.35, -0.35, 0.05, 0.1, 0.25, 1.4)
  fill.addColorStop(0, balloon.highlight)
  fill.addColorStop(0.35, balloon.color)
  fill.addColorStop(1, balloon.shade)
  context.fillStyle = fill
  context.beginPath()
  context.ellipse(0, 0, 0.82, 1, 0, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.moveTo(0, 0.96)
  context.lineTo(-0.12, 1.16)
  context.lineTo(0.12, 1.16)
  context.closePath()
  context.fill()
  context.fillStyle = '#ffffff70'
  context.beginPath()
  context.ellipse(-0.3, -0.45, 0.14, 0.26, 0.4, 0, Math.PI * 2)
  context.fill()
  context.restore()
}

export default function BirthdayTree({ onComplete, theme = 'dark' }) {
  const canvasRef = useRef(null)
  const completion = useRef(onComplete)
  const bark = useRef('#d7a5a1')
  const repaint = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => { completion.current = onComplete }, [onComplete])
  useEffect(() => { bark.current = theme === 'light' ? '#77404c' : '#d7a5a1'; repaint.current?.() }, [theme])
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) { completion.current(); return }
    let frame
    let completed = false
    const start = performance.now()
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
      repaint.current?.()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    function paint(now, schedule = true) {
      const time = reduced ? 8 : (now - start) / 1000
      context.resetTransform()
      context.clearRect(0, 0, canvas.width, canvas.height)
      const scale = Math.min(canvas.width / 520, canvas.height / 640)
      context.setTransform(scale, 0, 0, scale, (canvas.width - 520 * scale) / 2, (canvas.height - 640 * scale) / 2)
      context.fillStyle = '#c9988b24'
      context.beginPath()
      context.ellipse(264, 591, 112, 10, 0, 0, Math.PI * 2)
      context.fill()
      const rootAmount = progress(time, 0, 0.9)
      for (const root of [[264, 584, 235, 594, 205, 609, 5], [264, 584, 290, 594, 320, 610, 5], [264, 584, 263, 607, 272, 619, 4]]) drawBranch(context, root, rootAmount, bark.current)
      for (const branch of branches) drawBranch(context, branch, progress(time, branch[7], 1.2), bark.current)
      for (const balloon of balloons) drawBalloon(context, balloon, time, true)
      for (const balloon of balloons) drawBalloon(context, balloon, time)
      if (time >= 6.8 && !completed) { completed = true; completion.current() }
      if (!reduced && schedule) frame = requestAnimationFrame(paint)
    }
    repaint.current = () => paint(performance.now(), false)
    frame = requestAnimationFrame(paint)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); repaint.current = null }
  }, [reduced])
  return <canvas className="birthday-tree" ref={canvasRef} role="img" aria-label="A growing tree with a rounded canopy of multicolored balloons" />
}