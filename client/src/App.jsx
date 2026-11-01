import { Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './pages/user/MenuPage.jsx';
import ItemDetailPage from './pages/user/ItemDetailPage.jsx';
import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Categories from './pages/admin/Categories.jsx';
import MenuItems from './pages/admin/MenuItems.jsx';
import ChatbotAdmin from './pages/admin/Chatbot.jsx';
import QRCodePage from './pages/admin/QRCode.jsx';
import Settings from './pages/admin/Settings.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { DEFAULT_RESTAURANT_ID } from './services/api';

function Home() {
  if (DEFAULT_RESTAURANT_ID) return <Navigate to={`/menu/${DEFAULT_RESTAURANT_ID}`} replace />;
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p className="text-4xl mb-3">🍰</p>
        <h1 className="font-display font-bold text-xl text-gray-800">Digital Bakery Menu</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Scan your bakery's QR code to view its menu, or visit <code className="bg-orange-100 px-1.5 py-0.5 rounded">/admin/login</code> to
          manage it.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* User side */}
      <Route path="/menu/:restaurantId" element={<MenuPage />} />
      <Route path="/menu/:restaurantId/item/:itemId" element={<ItemDetailPage />} />

      {/* Admin side */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute>
            <MenuItems />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/chatbot"
        element={
          <ProtectedRoute>
            <ChatbotAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/qr"
        element={
          <ProtectedRoute>
            <QRCodePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
