export default function StatCard({ label, value, icon, color = 'bg-brand-100 text-brand-700' }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-4 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
