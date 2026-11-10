export default function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
