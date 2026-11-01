export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
      <button
        onClick={() => onChange('')}
        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
          active === ''
            ? 'bg-brand-600 text-white border-brand-600'
            : 'bg-white text-gray-600 border-orange-200'
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c._id}
          onClick={() => onChange(c._id)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
            active === c._id
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white text-gray-600 border-orange-200'
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
