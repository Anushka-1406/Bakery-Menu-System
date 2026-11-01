import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurant, getCategories, getMenuItems } from '../../services/api';
import SearchBar from '../../components/SearchBar.jsx';
import CategoryTabs from '../../components/CategoryTabs.jsx';
import FoodCard from '../../components/FoodCard.jsx';
import Chatbot from '../../components/Chatbot.jsx';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function MenuPage() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      getRestaurant(restaurantId),
      getCategories(restaurantId),
      getMenuItems({ restaurantId }),
    ])
      .then(([r, c, m]) => {
        if (cancelled) return;
        setRestaurant(r.data.data);
        setCategories(c.data.data);
        setItems(m.data.data);
      })
      .catch(() => !cancelled && setError('Could not load this menu. Please check the link and try again.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      if (activeCategory && it.categoryId?._id !== activeCategory && it.categoryId !== activeCategory) return false;
      if (vegOnly && !it.isVegetarian) return false;
      if (search && !`${it.name} ${it.description}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, activeCategory, vegOnly, search]);

  const groupedByCategory = useMemo(() => {
    const map = {};
    for (const it of filteredItems) {
      const cid = it.categoryId?._id || it.categoryId;
      if (!map[cid]) map[cid] = [];
      map[cid].push(it);
    }
    return map;
  }, [filteredItems]);

  if (loading) return <Loader label="Loading menu..." />;
  if (error) return <EmptyState icon="⚠️" title={error} />;

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-brand-700 text-white px-5 pt-8 pb-6 rounded-b-3xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl overflow-hidden">
            {restaurant?.logo ? (
              <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
            ) : (
              '🍰'
            )}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">{restaurant?.name}</h1>
            <p className="text-xs text-white/80">{restaurant?.openingHours}</p>
          </div>
        </div>
        {restaurant?.description && <p className="text-sm text-white/90 mt-3">{restaurant.description}</p>}
      </div>

      {/* Search + filters */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-md p-3 space-y-3">
          <SearchBar value={search} onChange={setSearch} />
          <div className="flex items-center justify-between">
            <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 pt-1">
            <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} className="accent-green-600" />
            Vegetarian only
          </label>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 mt-5 space-y-6">
        {filteredItems.length === 0 && (
          <EmptyState icon="🔍" title="No items found" subtitle="Try a different search or category." />
        )}

        {activeCategory === '' && !search && !vegOnly
          ? categories
              .filter((c) => groupedByCategory[c._id]?.length)
              .map((c) => (
                <div key={c._id}>
                  <h2 className="font-display font-bold text-lg text-gray-800 mb-2">{c.name}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {groupedByCategory[c._id].map((item) => (
                      <FoodCard key={item._id} item={item} restaurantId={restaurantId} />
                    ))}
                  </div>
                </div>
              ))
          : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredItems.map((item) => (
                  <FoodCard key={item._id} item={item} restaurantId={restaurantId} />
                ))}
              </div>
            )}
      </div>

      <Chatbot restaurantId={restaurantId} />
    </div>
  );
}
