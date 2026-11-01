import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';

const emptyForm = { name: '', description: '', displayOrder: 0 };

export default function Categories() {
  const { admin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const load = () => {
    setLoading(true);
    getCategories(admin.restaurantId)
      .then((res) => setCategories(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (admin?.restaurantId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (c) => {
    setForm({ name: c.name, description: c.description || '', displayOrder: c.displayOrder || 0 });
    setEditingId(c._id);
    setError('');
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory({ ...form, restaurantId: admin.restaurantId });
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const confirmDelete = async () => {
    setDeleteError('');
    try {
      await deleteCategory(deleteTarget._id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Could not delete category.');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-gray-800">Categories</h1>
        <button onClick={openCreate} className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl">
          + Add Category
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : categories.length === 0 ? (
        <EmptyState icon="🗂️" title="No categories yet" subtitle="Create your first menu category to get started." />
      ) : (
        <div className="bg-white rounded-2xl border border-orange-100 mt-6 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-orange-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Description</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-t border-orange-50">
                  <td className="px-4 py-3 text-gray-500">{c.displayOrder}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{c.description}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(c)} className="text-brand-600 hover:underline text-xs font-medium">
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget(c)} className="text-red-600 hover:underline text-xs font-medium">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <form onSubmit={submit} className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-semibold text-gray-800">{editingId ? 'Edit Category' : 'Add Category'}</h3>
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>}
            <div>
              <label className="text-xs font-medium text-gray-600">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Display Order</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm"
              />
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
        title="Delete category?"
        message={deleteError || `Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError('');
        }}
      />
    </AdminLayout>
  );
}
