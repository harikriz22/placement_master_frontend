export default function CellSelect({
  value,
  options,
  onChange,
  disabled,
  label,
}) {
  return (
    <select
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      className="border border-slate-300 rounded px-1 py-1 text-xs bg-white disabled:bg-slate-100 disabled:text-slate-500"
    >
      {options.map(cell => (
        <option key={cell.value} value={cell.value}>
          {cell.label}
        </option>
      ))}
    </select>
  );
}
