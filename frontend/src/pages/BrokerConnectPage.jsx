import React from 'react';
import { Link } from 'react-router-dom';
import { useBroker } from '../context/BrokerContext';
import { toast } from 'sonner';
import { ArrowLeft, ShieldCheck, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const BROKERS = [
  {
    key: 'kite',
    name: 'Zerodha (Kite)',
    tagline: 'Full API access · trading + holdings',
    color: 'from-[#FF9F0A] to-[#F04438]',
    logo: 'Z',
    active: true,
    features: ['Live holdings & margins', 'Order placement (Kite Connect)', 'Auto-SIP mandate support'],
  },
  { key: 'groww', name: 'Groww', tagline: 'Coming soon', color: 'from-[#00B386] to-[#12B76A]', logo: 'G', active: false, features: ['Investor login', 'Holdings pull', 'Deep-linked orders'] },
  { key: 'upstox', name: 'Upstox', tagline: 'Coming soon', color: 'from-[#6C2BD9] to-[#B15CFF]', logo: 'U', active: false, features: ['OAuth login', 'Positions + margins', 'Order flow'] },
  { key: 'angelone', name: 'Angel One', tagline: 'Coming soon', color: 'from-[#E23FA0] to-[#B15CFF]', logo: 'A', active: false, features: ['SmartAPI', 'Holdings pull', 'Live prices'] },
  { key: 'icici', name: 'ICICI Direct', tagline: 'Coming soon', color: 'from-[#F04438] to-[#E23FA0]', logo: 'I', active: false, features: ['Breeze API', 'Holdings', 'Deep-linked baskets'] },
  { key: '5paisa', name: '5paisa', tagline: 'Coming soon', color: 'from-[#3B1671] to-[#6C2BD9]', logo: '5', active: false, features: ['Trade API', 'Portfolio sync', 'SIP execution'] },
];

export default function BrokerConnectPage() {
  const { connections, loading, connectKite, disconnectKite, refreshKite } = useBroker();
  const kite = connections.kite;

  const onConnectKite = async () => {
    try {
      const popup = await connectKite();
      if (!popup) {
        toast.error('Popup blocked. Allow popups and try again.');
        return;
      }
      toast.info('Complete login on Kite in the popup window.');
      // fallback: poll for close and refresh status
      const interval = setInterval(async () => {
        if (popup.closed) {
          clearInterval(interval);
          const status = await refreshKite();
          if (status && status.connected) {
            toast.success('Zerodha connected', { description: status.profile?.user_name });
          }
        }
      }, 800);
    } catch (e) {
      toast.error('Failed to start Kite login', { description: e?.message });
    }
  };

  const onDisconnect = async () => {
    try {
      await disconnectKite();
      toast.success('Zerodha disconnected');
    } catch (e) {
      toast.error('Disconnect failed');
    }
  };

  return (
    <div className="container-x py-10 lg:py-14">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-[#6C2BD9]"><ArrowLeft className="h-4 w-4" /> Back to dashboard</Link>

      <div className="mt-4 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow">Broker connect</div>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold">Link a broker to invest</h1>
          <p className="mt-3 text-[#6B6480] max-w-xl">Baskets execute in your own demat account. Connect once, invest anywhere.</p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-[#6B6480]">
          <ShieldCheck className="h-4 w-4 text-[#12B76A]" /> OAuth-secured · we never see your password
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {BROKERS.map((b) => {
          const isKite = b.key === 'kite';
          const isConnected = isKite && kite;
          return (
            <div key={b.key} className={`surface p-6 relative overflow-hidden ${!b.active ? 'opacity-80' : ''}`}>
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${b.color} text-white grid place-items-center text-lg font-bold shadow-md`}>{b.logo}</div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <div className="text-lg font-semibold">{b.name}</div>
                  <div className="text-xs text-[#6B6480]">{b.tagline}</div>
                </div>
                {isConnected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] text-[#12B76A] px-2 py-1 text-[11px] font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Connected
                  </span>
                )}
                {!b.active && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F7F4FB] text-[#6B6480] px-2 py-1 text-[11px] font-semibold">Soon</span>
                )}
              </div>

              <ul className="mt-4 space-y-1.5 text-sm text-[#6B6480]">
                {b.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#6C2BD9]" />{f}</li>
                ))}
              </ul>

              {isKite && isConnected && (
                <div className="mt-4 rounded-xl bg-[#F7F4FB] p-3 text-sm">
                  <div className="font-semibold">{kite.profile?.user_name}</div>
                  <div className="text-xs text-[#6B6480]">Kite ID: {kite.profile?.user_id_kite} · {kite.profile?.email}</div>
                </div>
              )}

              <div className="mt-5 flex gap-2">
                {isKite ? (
                  isConnected ? (
                    <>
                      <Link to="/dashboard" className="btn-outline flex-1">View holdings</Link>
                      <button onClick={onDisconnect} className="btn-outline text-[#F04438] border-[#FCA5A5] hover:border-[#F04438]"><XCircle className="h-4 w-4" /> Disconnect</button>
                    </>
                  ) : (
                    <button disabled={loading} onClick={onConnectKite} className="btn-primary w-full">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />} Connect {b.name.split(' ')[0]}
                    </button>
                  )
                ) : (
                  <button disabled className="btn-outline w-full cursor-not-allowed">Coming soon</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl bg-[#F7F4FB] border border-[#E8E1F0] p-6 text-sm text-[#6B6480]">
        <div className="font-semibold text-[#1A1030]">How the connection works</div>
        <ol className="mt-3 list-decimal ml-5 space-y-1.5">
          <li>You click Connect and a Kite login popup opens on kite.zerodha.com.</li>
          <li>After you log in, Kite redirects the popup back to Basketly with a short-lived <code>request_token</code>.</li>
          <li>Our server exchanges that token for an <code>access_token</code> using the app secret and stores it securely.</li>
          <li>Your holdings & margins are pulled live into your dashboard. You can disconnect anytime.</li>
        </ol>
      </div>
    </div>
  );
}
