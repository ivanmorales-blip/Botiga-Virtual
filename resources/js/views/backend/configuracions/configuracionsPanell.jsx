import React, { useEffect, useState } from "react";

const HEADERS = {
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

const LABELS = {
  enviament:    'Despeses d\'enviament (Espanya)',
  install_0:    'Instal·lació fins a 250€',
  install_250:  'Instal·lació de 250€ a 500€',
  install_500:  'Instal·lació de 500€ a 1.000€',
  install_1000: 'Instal·lació més de 1.000€',
};

export default function ConfiguracionsPanel() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToastVisible(true), 10);
    setTimeout(() => setToastVisible(false), 2500);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch('/api/configuracions', { headers: HEADERS })
      .then(res => res.json())
      .then(data => { setConfigs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (clau, valor) => {
    setConfigs(prev => prev.map(c => c.clau === clau ? { ...c, valor } : c));
  };

  const handleSave = async (clau) => {
    setSaving(clau);
    const config = configs.find(c => c.clau === clau);
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const res = await fetch(`/api/configuracions/${clau}`, {
        method: 'PUT',
        headers: {
          ...HEADERS,
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken || ''),
        },
        body: JSON.stringify({ valor: config.valor }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Configuració guardada');
    } catch {
      showToast('error', 'Error al guardar');
    } finally {
      setSaving(null);
    }
  };

  const isSuccess = toast?.type === 'success';

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '12px',
          background: '#1a1a1a', color: '#fff', padding: '14px 20px',
          borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          minWidth: '260px', transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: toastVisible ? 1 : 0,
          transform: toastVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        }}>
          <div style={{ background: isSuccess ? '#22c55e' : '#ef4444', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isSuccess
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            }
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '14px', margin: 0 }}>{isSuccess ? 'Guardat!' : 'Error'}</p>
            <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>{toast.message}</p>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-6">Configuració de preus</h3>

      {loading ? (
        <p className="text-gray-400">Carregant...</p>
      ) : (
        <div className="space-y-4">
          {configs.map(c => (
            <div key={c.clau} className="flex items-center gap-4 p-4 border rounded-xl">
              <div className="flex-1">
                <p className="font-semibold text-gray-700">{LABELS[c.clau] || c.clau}</p>
                <p className="text-xs text-gray-400">{c.descripcio}</p>
              </div>
              {c.clau === 'install_1000' ? (
                <span className="text-sm text-orange-500 font-semibold">A consultar</span>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={c.valor ?? ''}
                    onChange={e => handleChange(c.clau, e.target.value)}
                    className="border rounded-lg p-2 w-28 text-right"
                  />
                  <span className="text-gray-500">€</span>
                  <button
                    onClick={() => handleSave(c.clau)}
                    disabled={saving === c.clau}
                    style={{ background: '#f97316', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                  >
                    {saving === c.clau ? '...' : 'Guardar'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}