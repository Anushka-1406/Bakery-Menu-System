export default function EmptyState({ title = 'Nothing here yet', subtitle = '', icon = '🍰' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="font-medium text-gray-700">{title}</p>
      {subtitle && <p className="text-sm mt-1 max-w-xs">{subtitle}</p>}
    </div>
  );
}
