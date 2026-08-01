export function WaterBg() {
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 900"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="g1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd8f0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#7dd8f0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Орби */}
      <ellipse cx="200" cy="200" rx="320" ry="320" fill="url(#g1)" />
      <ellipse cx="1240" cy="700" rx="280" ry="280" fill="url(#g1)" />
      <ellipse cx="1100" cy="150" rx="200" ry="200" fill="url(#g2)" />

      {/* Рябь зліва внизу */}
      {[60, 90, 120, 150, 180].map((r, i) => (
        <circle key={i} cx="180" cy="780" r={r} fill="none"
          stroke="rgba(100,210,235,0.15)" strokeWidth="0.7" />
      ))}

      {/* Рябь справа вгорі */}
      {[40, 65, 90, 115].map((r, i) => (
        <circle key={i} cx="1300" cy="120" r={r} fill="none"
          stroke="rgba(120,220,240,0.12)" strokeWidth="0.6" />
      ))}

      {/* Підводна квітка зліва */}
      <g opacity="0.22">
        <ellipse cx="320" cy="200" rx="20" ry="30" fill="rgba(200,235,245,0.8)"
          transform="rotate(-20 320 200)" />
        <ellipse cx="305" cy="210" rx="16" ry="26" fill="rgba(215,242,250,0.7)"
          transform="rotate(10 305 210)" />
        <ellipse cx="335" cy="193" rx="14" ry="24" fill="rgba(200,235,245,0.65)"
          transform="rotate(-38 335 193)" />
        <ellipse cx="315" cy="222" rx="12" ry="20" fill="rgba(215,242,250,0.6)"
          transform="rotate(28 315 222)" />
        <circle cx="320" cy="204" r="5" fill="rgba(240,252,255,0.9)" />
      </g>

      {/* Маленька квітка справа */}
      <g opacity="0.18">
        <ellipse cx="1160" cy="680" rx="13" ry="19" fill="rgba(200,235,245,0.8)"
          transform="rotate(-15 1160 680)" />
        <ellipse cx="1150" cy="688" rx="10" ry="16" fill="rgba(215,242,250,0.7)"
          transform="rotate(18 1150 688)" />
        <ellipse cx="1170" cy="675" rx="9" ry="15" fill="rgba(200,235,245,0.65)"
          transform="rotate(-32 1170 675)" />
        <circle cx="1160" cy="682" r="3" fill="rgba(240,252,255,0.9)" />
      </g>

      {/* Горизонтальні хвилі */}
      <line x1="0" y1="420" x2="1440" y2="415" stroke="rgba(150,215,235,0.1)" strokeWidth="0.5" />
      <line x1="0" y1="600" x2="1440" y2="606" stroke="rgba(150,215,235,0.08)" strokeWidth="0.5" />
    </svg>
  );
}
