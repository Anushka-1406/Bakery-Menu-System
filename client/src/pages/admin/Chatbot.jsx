import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  getChatbotQuestions,
  createChatbotQuestion,
  updateChatbotQuestion,
  deleteChatbotQuestion,
} from '../../services/api';

const emptyForm = { question: '', answer: '', category: 'general', isActive: true };

export default function ChatbotAdmin() {
  const { admin } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    getChatbotQuestions({ restaurantId: admin.restaurantId })
      .then((res) => setQuestions(res.data.data))
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

  const openEdit = (q) => {
    setForm({ question: q.question, answer: q.answer, category: q.category, isActive: q.isActive });
    setEditingId(q._id);
    setError('');
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateChatbotQuestion(editingId, form);
      } else {
        await createChatbotQuestion({ ...form, restaurantId: admin.restaurantId });
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const confirmDelete = async () => {
    await deleteChatbotQuestion(deleteTarget._id);
    setDeleteTarget(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-gray-800">Chatbot Questions</h1>
        <button onClick={openCreate} className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl">
          + Add Question
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-1">These predefined Q&A pairs power the "Menu Assistant" chatbot on the public menu.</p>

      {loading ? (
        <Loader />
      ) : questions.length === 0 ? (
        <EmptyState icon="💬" title="No chatbot questions yet" />
      ) : (
        <div className="space-y-3 mt-6">
          {questions.map((q) => (
            <div key={q._id} className="bg-white rounded-2xl border border-orange-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{q.question}</p>
                  <p className="text-sm text-gray-500 mt-1">{q.answer}</p>
                  <span
                    className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      q.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {q.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-right flex-shrink-0">
                  <button onClick={() => openEdit(q)} className="text-brand-600 hover:underline text-xs font-medium">
                    Edit
                  </button>
                  <button onClick={() => setDeleteTarget(q)} className="text-red-600 hover:underline text-xs font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <form onSubmit={submit} className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-semibold text-gray-800">{editingId ? 'Edit Question' : 'Add Question'}</h3>
            {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>}
            <div>
              <label className="text-xs font-medium text-gray-600">Question</label>
              <input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Answer</label>
              <textarea required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm" rows={3} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl border border-orange-200 text-sm" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-brand-600" />
              Active
            </label>
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
        title="Delete question?"
        message={`Are you sure you want to delete "${deleteTarget?.question}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
