import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMenuItem } from '../../services/api';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';

const unitLabel = (unit) => (unit === 'kg' ? 'per kg' : unit === '100g' ? 'per 100g' : unit === 'glass' ? 'per glass' : 'per piece');

export default function ItemDetailPage() {
  const { restaurantId, itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getMenuItem(itemId)
      .then((res) => setItem(res.data.data))
      .catch(() => setError('Item not found.'))
      .finally(() => setLoading(false));
  }, [itemId]);

  if (loading) return <Loader label="Loading item..." />;
  if (error || !item) return <EmptyState icon="⚠️" title={error || 'Item not found'} />;

  return (
    <div className="min-h-screen pb-16">
      <div className="px-4 pt-4">
        <Link to={`/menu/${restaurantId}`} className="text-brand-700 text-sm font-medium">
          ← Back to menu
        </Link>
      </div>

      <div className="px-4 mt-3">
        <div className="w-full aspect-square max-w-md mx-auto rounded-3xl bg-orange-100 flex items-center justify-center text-6xl overflow-hidden">
          {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : '🧁'}
        </div>
      </div>

      <div className="px-5 mt-5 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-4 h-4 border-2 rounded-sm flex-shrink-0 ${
              item.isVegetarian ? 'border-green-600' : 'border-red-600'
            }`}
          >
            <span className={`block w-2 h-2 m-auto mt-0.5 rounded-full ${item.isVegetarian ? 'bg-green-600' : 'bg-red-600'}`} />
          </span>
          <h1 className="font-display text-2xl font-bold text-gray-800">{item.name}</h1>
        </div>

        <p className="text-gray-500 mt-2 text-sm">{item.description}</p>

        <div className="flex items-center justify-between mt-4">
          <p className="text-2xl font-bold text-brand-700">
            ₹{item.price} <span className="text-sm font-normal text-gray-400">{unitLabel(item.unit)}</span>
          </p>
          {!item.isAvailable ? (
            <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full">Currently Unavailable</span>
          ) : (
            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">Available</span>
          )}
        </div>

        <div className="flex gap-2 flex-wrap mt-4">
          {item.categoryId?.name && (
            <span className="text-xs bg-orange-100 text-brand-800 px-3 py-1 rounded-full">{item.categoryId.name}</span>
          )}
          {item.isPopular && <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">⭐ Popular</span>}
          {item.isSpicy && <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">🌶️ Spicy</span>}
          {item.isChefSpecial && (
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">👨‍🍳 Chef's Special</span>
          )}
        </div>
      </div>
    </div>
  );
}
