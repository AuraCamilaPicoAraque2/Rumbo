import { useTranslation } from 'react-i18next'

// Hexágono de Holland (RIASEC): los seis tipos de interés vocacional
const TYPES = ['R', 'I', 'A', 'S', 'E', 'C']
const CX = 280
const CY = 220
const RADIUS = 120
const LABEL_RADIUS = 160

export default function HexMap() {
  const { t } = useTranslation()

  const points = TYPES.map((key, i) => {
    const angle = ((-90 + i * 60) * Math.PI) / 180
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      key,
      color: `var(--p${i + 1})`,
      x: CX + RADIUS * cos,
      y: CY + RADIUS * sin,
      lx: CX + LABEL_RADIUS * cos,
      ly: CY + LABEL_RADIUS * sin,
      anchor: cos > 0.2 ? 'start' : cos < -0.2 ? 'end' : 'middle',
      dx: cos > 0.2 ? 6 : cos < -0.2 ? -6 : 0,
      dy: sin < -0.9 ? -4 : sin > 0.9 ? 16 : 5,
    }
  })

  return (
    <svg className="hex" viewBox="0 0 560 440" role="img" aria-label={t('hex.alt')}>
      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="var(--line)"
        strokeWidth="2"
      />
      {points.map((p) => (
        <line key={p.key} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="var(--line)" strokeWidth="1.5" />
      ))}

      <circle cx={CX} cy={CY} r="30" fill="var(--surface)" stroke="var(--line)" strokeWidth="2" />
      <text x={CX} y={CY + 5} textAnchor="middle" className="hex__center">
        {t('hex.center')}
      </text>

      {points.map((p, i) => (
        <g key={p.key} className="hex__dot" style={{ animationDelay: `${i * 90}ms` }}>
          <circle cx={p.x} cy={p.y} r="21" fill={p.color} />
          <text x={p.x} y={p.y + 6} textAnchor="middle" className="hex__letter">
            {p.key}
          </text>
          <text x={p.lx + p.dx} y={p.ly + p.dy} textAnchor={p.anchor} className="hex__label">
            {t(`hex.${p.key}`)}
          </text>
        </g>
      ))}
    </svg>
  )
}
