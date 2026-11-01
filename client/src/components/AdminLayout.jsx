import Sidebar from './Sidebar.jsx';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-orange-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
