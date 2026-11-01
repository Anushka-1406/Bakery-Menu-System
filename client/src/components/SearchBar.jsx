export default function SearchBar({ value, onChange, placeholder = 'Search menu items...' }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
    </div>
  );
}
