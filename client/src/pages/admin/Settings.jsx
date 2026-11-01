import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import Loader from '../../components/Loader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRestaurant, updateRestaurant } from '../../services/api';

export default function Settings() {
  const { admin } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!admin?.restaurantId) return;
    getRestaurant(admin.restaurantId)
      .then((res) => {
        const r = res.data.data;
        setForm({ name: r.name, logo: r.logo || '', description: r.description || '', openingHours: r.openingHours || '' });
      })
      .finally(() => setLoading(false));
  }, [admin]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateRestaurant(admin.restaurantId, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="font-display font-bold text-2xl text-gray-800">Restaurant Settings</h1>
      <p className="text-sm text-gray-500 mt-1">These details appear on the public menu header.</p>

      <form onSubmit={submit} className="bg-white rounded-2xl border border-orange-100 p-6 mt-6 max-w-lg space-y-4">
        {saved && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2">Saved successfully!</div>}
        <div>
          <label className="text-xs font-medium text-gray-600">Bakery / Restaurant Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Logo URL</label>
          <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm" placeholder="https://..." />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm" rows={3} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Opening Hours</label>
          <input value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm" placeholder="9:00 AM - 9:00 PM" />
        </div>
        <button type="submit" disabled={saving} className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-xl">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </AdminLayout>
  );
}
