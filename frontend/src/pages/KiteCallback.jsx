import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { getStoredUserId } from '../context/BrokerContext';
import { CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function KiteCallback() {
  const [params] = useSearchParams();
  const [state, setState] = useState('processing'); // processing | success | error
  const [detail, setDetail] = useState('');

  useEffect(() => {
    const status = params.get('status');
    const requestToken = params.get('request_token');
    const userId = getStoredUserId();

    const notifyParent = (payload) => {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ source: 'basketly-kite-callback', ...payload }, '*');
        }
      } catch (_) {}
    };

    if (status !== 'success' || !requestToken) {
      setState('error');
      setDetail('Kite returned status: ' + (status || 'unknown'));
      notifyParent({ status: 'error', detail: status });
      return;
    }
    if (!userId) {
      setState('error');
      setDetail('No session found. Please open this from the Basketly window.');
      return;
    }

    axios
      .post(`${API}/broker/kite/exchange`, { user_id: userId, request_token: requestToken })
      .then((res) => {
        setState('success');
        setDetail(res.data?.profile?.user_name || 'Connected');
        notifyParent({ status: 'success', profile: res.data.profile });
        setTimeout(() => window.close(), 1200);
      })
      .catch((err) => {
        setState('error');
        setDetail(err?.response?.data?.detail || err.message);
        notifyParent({ status: 'error', detail: err?.response?.data?.detail });
      });
  }, [params]);

  return (
    <div className="min-h-screen grad-hero grid place-items-center px-6">
      <div className="surface p-8 max-w-md w-full text-center">
        <div className="h-12 w-12 rounded-2xl grad-card text-white grid place-items-center mx-auto"><Sparkles className="h-5 w-5" /></div>
        <div className="mt-4 font-[Space_Grotesk] text-xl font-bold">Basketly · Kite Connect</div>

        {state === 'processing' && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-[#6C2BD9] animate-spin" />
            <div className="text-sm text-[#6B6480]">Exchanging your Kite request token…</div>
          </div>
        )}
        {state === 'success' && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <CheckCircle2 className="h-10 w-10 text-[#12B76A]" />
            <div className="font-semibold">Zerodha connected</div>
            <div className="text-sm text-[#6B6480]">{detail}</div>
            <div className="text-xs text-[#6B6480] mt-2">Closing this window…</div>
          </div>
        )}
        {state === 'error' && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <XCircle className="h-10 w-10 text-[#F04438]" />
            <div className="font-semibold">Connection failed</div>
            <div className="text-xs text-[#6B6480] max-w-xs break-words">{detail}</div>
            <button onClick={() => window.close()} className="btn-outline mt-3">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
