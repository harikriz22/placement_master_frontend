export default function FormField({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
      {label}
      {children}
      {error && <span className="text-red-500 font-normal">{error}</span>}
    </label>
  );
}
