import { Link } from 'react-router-dom';

const unitLabel = (unit) => (unit === 'kg' ? '/kg' : unit === '100g' ? '/100g' : unit === 'glass' ? '/glass' : '');

export default function FoodCard({ item, restaurantId }) {
  return (
    <Link
      to={`/menu/${restaurantId}/item/${item._id}`}
      className={`relative flex bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md transition-shadow ${
        !item.isAvailable ? 'opacity-60' : ''
      }`}
    >
      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-orange-100 flex items-center justify-center text-3xl">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span>🧁</span>
        )}
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block w-3.5 h-3.5 border-2 rounded-sm flex-shrink-0 ${
                item.isVegetarian ? 'border-green-600' : 'border-red-600'
              }`}
            >
              <span
                className={`block w-1.5 h-1.5 m-auto mt-0.5 rounded-full ${
                  item.isVegetarian ? 'bg-green-600' : 'bg-red-600'
                }`}
              />
            </span>
            <h3 className="font-semibold text-sm sm:text-base text-gray-800 truncate">{item.name}</h3>
          </div>
          {item.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-brand-700 text-sm sm:text-base">
            ₹{item.price}
            <span className="text-xs font-normal text-gray-400">{unitLabel(item.unit)}</span>
          </span>
          <div className="flex gap-1 flex-wrap justify-end">
            {item.isPopular && <Tag label="Popular" color="bg-amber-100 text-amber-700" />}
            {item.isSpicy && <Tag label="Spicy" color="bg-red-100 text-red-700" />}
            {item.isChefSpecial && <Tag label="Chef's Special" color="bg-purple-100 text-purple-700" />}
          </div>
        </div>
        {!item.isAvailable && (
          <span className="absolute top-2 right-2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full">
            Unavailable
          </span>
        )}
      </div>
    </Link>
  );
}

function Tag({ label, color }) {
  return <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${color}`}>{label}</span>;
}
