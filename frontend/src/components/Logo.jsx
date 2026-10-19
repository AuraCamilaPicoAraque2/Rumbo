export default function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <polygon
        points="16,2 28,9 28,23 16,30 4,23 4,9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polygon points="16,9 20,16 16,23 12,16" fill="var(--p1)" />
    </svg>
  )
}
