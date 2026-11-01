import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  getCategories,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
} from '../../services/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  unit: 'piece',
  categoryId: '',
  image: '',
  isVegetarian: true,
  isAvailable: true,
  isPopular: false,
  isSpicy: false,
  isChefSpecial: false,
};

export default function MenuItems() {
  const { admin } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      getCategories(admin.restaurantId),
      getMenuItems({ restaurantId: admin.restaurantId }),
    ])
      .then(([c, m]) => {
        setCategories(c.data.data);
        setItems(m.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (admin?.restaurantId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  const filtered = items.filter((it) => {
    if (categoryFilter && (it.categoryId?._id || it.categoryId) !== categoryFilter) return false;
    if (search && !it.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCreate = () => {
    setForm({ ...emptyForm, categoryId: categories[0]?._id || '' });
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (it) => {
    setForm({
      name: it.name,
      description: it.description || '',
      price: it.price,
      unit: it.unit,
      categoryId: it.categoryId?._id || it.categoryId,
      image: it.image || '',
      isVegetarian: it.isVegetarian,
      isAvailable: it.isAvailable,
      isPopular: it.isPopular,
      isSpicy: it.isSpicy,
      isChefSpecial: it.isChefSpecial,
    });
    setEditingId(it._id);
    setError('');
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await updateMenuItem(editingId, payload);
      } else {
        await createMenuItem({ ...payload, restaurantId: admin.restaurantId });
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const quickToggle = async (it) => {
    await toggleMenuItemAvailability(it._id, !it.isAvailable);
    load();
  };

  const confirmDelete = async () => {
    await deleteMenuItem(deleteTarget._id);
    setDeleteTarget(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-bold text-2xl text-gray-800">Menu Items</h1>
        <button onClick={openCreate} className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl">
          + Add Item
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search items..." />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-orange-200 text-sm bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🍰" title="No menu items found" />
      ) : (
        <div className="bg-white rounded-2xl border border-orange-100 mt-5 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-orange-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Veg</th>
                <th className="text-left px-4 py-3">Availability</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => (
                <tr key={it._id} className="border-t border-orange-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{it.name}</td>
                  <td className="px-4 py-3 text-gray-500">{it.categoryId?.name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    ₹{it.price}
                    <span className="text-gray-400">/{it.unit}</span>
                  </td>
                  <td className="px-4 py-3">{it.isVegetarian ? '🟢' : '🔴'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => quickToggle(it)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        it.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {it.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(it)} className="text-brand-600 hover:underline text-xs font-medium">
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget(it)} className="text-red-600 hover:underline text-xs font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <form onSubmit={submit} className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 my-auto">
            <h3 className="font-semibold text-gray-800">{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm" rows={2} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Price (₹)</label>
                <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Unit</label>
                <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm">
                  <option value="piece">piece</option>
                  <option value="kg">kg</option>
                  <option value="100g">100g</option>
                  <option value="glass">glass</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Category</label>
                <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm">
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Image URL (optional)</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm" placeholder="https://..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isVegetarian} onChange={(e) => setForm({ ...form, isVegetarian: e.target.checked })} className="accent-green-600" />
                Vegetarian
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-brand-600" />
                Available
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} className="accent-amber-600" />
                Popular
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isSpicy} onChange={(e) => setForm({ ...form, isSpicy: e.target.checked })} className="accent-red-600" />
                Spicy
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isChefSpecial} onChange={(e) => setForm({ ...form, isChefSpecial: e.target.checked })} className="accent-purple-600" />
                Chef's Special
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-brand-600 text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete menu item?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
