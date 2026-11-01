import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import StatCard from '../../components/StatCard.jsx';
import Loader from '../../components/Loader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboardStats, getRestaurant } from '../../services/api';

export default function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin?.restaurantId) return;
    Promise.all([getDashboardStats(admin.restaurantId), getRestaurant(admin.restaurantId)])
      .then(([s, r]) => {
        setStats(s.data.data);
        setRestaurant(r.data.data);
      })
      .finally(() => setLoading(false));
  }, [admin]);

  return (
    <AdminLayout>
      <h1 className="font-display font-bold text-2xl text-gray-800">Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1">Welcome back, {admin?.name}. Here's how {restaurant?.name || 'your bakery'} is doing.</p>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <StatCard label="Total Menu Items" value={stats?.totalItems ?? 0} icon="🍰" />
          <StatCard label="Total Categories" value={stats?.totalCategories ?? 0} icon="🗂️" color="bg-blue-100 text-blue-700" />
          <StatCard label="Available Items" value={stats?.availableItems ?? 0} icon="✅" color="bg-green-100 text-green-700" />
          <StatCard label="Unavailable Items" value={stats?.unavailableItems ?? 0} icon="🚫" color="bg-red-100 text-red-700" />
          <StatCard label="Chatbot Questions" value={stats?.totalQuestions ?? 0} icon="💬" color="bg-purple-100 text-purple-700" />
        </div>
      )}
    </AdminLayout>
  );
}
