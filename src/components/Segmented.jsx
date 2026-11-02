// Pill-style switch, e.g. "vs Computer | vs Friend". options: [[id, label], ...]
const Segmented = ({ options, value, onChange, className = "" }) => (
  <div className={`segmented ${className}`}>
    {options.map(([id, label]) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        className={`segment ${value === id ? "segment-active" : ""}`}
      >
        {label}
      </button>
    ))}
  </div>
)

export default Segmented
