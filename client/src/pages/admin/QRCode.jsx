import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import Loader from '../../components/Loader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getQrCode } from '../../services/api';

export default function QRCodePage() {
  const { admin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = () => {
    setLoading(true);
    getQrCode(admin.restaurantId)
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (admin?.restaurantId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  const copyUrl = () => {
    navigator.clipboard.writeText(data.menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadQr = () => {
    const a = document.createElement('a');
    a.href = data.qrCode;
    a.download = 'menu-qr-code.png';
    a.click();
  };

  return (
    <AdminLayout>
      <h1 className="font-display font-bold text-2xl text-gray-800">QR Code</h1>
      <p className="text-sm text-gray-500 mt-1">Print this and place it on tables — scanning it opens your public menu only.</p>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-2xl border border-orange-100 p-6 mt-6 max-w-md text-center">
          <img src={data?.qrCode} alt="Menu QR code" className="mx-auto w-56 h-56 rounded-xl border border-orange-100" />
          <p className="text-xs text-gray-500 mt-4 break-all">{data?.menuUrl}</p>
          <div className="flex gap-2 justify-center mt-5">
            <button onClick={downloadQr} className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl">
              Download QR
            </button>
            <button onClick={copyUrl} className="border border-orange-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl">
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          <button onClick={load} className="text-xs text-brand-600 mt-4 hover:underline">
            Regenerate QR code
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
