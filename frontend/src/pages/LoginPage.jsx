import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [broker, setBroker] = useState('');
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    toast.success(mode === 'login' ? 'Welcome back' : 'Account created (simulated)');
    setTimeout(() => nav('/dashboard'), 500);
  };

  return (
    <div className="min-h-[80vh] grad-hero flex items-center">
      <div className="container-x grid lg:grid-cols-2 gap-10 items-center py-12">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="h-10 w-10 rounded-xl grad-card text-white grid place-items-center"><Sparkles className="h-5 w-5" /></span>
            <span className="font-[Space_Grotesk] text-xl font-bold">Basketly</span>
          </Link>
          <h1 className="mt-8 text-4xl lg:text-5xl font-bold max-w-lg">Your curated investing home.</h1>
          <p className="mt-4 text-[#6B6480] max-w-md">Sign in to see your holdings, SIPs, and pending rebalances. Or create an account to get started.</p>
          <div className="mt-8 flex items-center gap-3 text-sm text-[#6B6480]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#12B76A]" /> No KYC needed for the demo
          </div>
        </div>

        <div className="surface p-8 shadow-[0_30px_60px_-30px_rgba(76,29,149,0.35)]">
          <div className="inline-flex bg-[#F7F4FB] rounded-full p-1">
            <button onClick={()=>setMode('login')} className={`px-4 py-2 rounded-full text-sm font-semibold ${mode==='login' ? 'bg-white text-[#6C2BD9] shadow-sm' : 'text-[#6B6480]'}`}>Log in</button>
            <button onClick={()=>setMode('signup')} className={`px-4 py-2 rounded-full text-sm font-semibold ${mode==='signup' ? 'bg-white text-[#6C2BD9] shadow-sm' : 'text-[#6B6480]'}`}>Sign up</button>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === 'signup' && (
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#6B6480]">Full name</Label>
                <Input required className="h-11 mt-1.5" placeholder="Your name" />
              </div>
            )}
            <div>
              <Label className="text-xs uppercase tracking-wider text-[#6B6480]">Email</Label>
              <Input required type="email" className="h-11 mt-1.5" placeholder="you@company.com" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-[#6B6480]">Password</Label>
              <Input required type="password" className="h-11 mt-1.5" placeholder="••••••••" />
            </div>
            {mode === 'signup' && (
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#6B6480]">Connect broker (optional)</Label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {['Zerodha','Groww','Upstox','ICICI Direct','5paisa','Angel One'].map(b => (
                    <button type="button" key={b} onClick={()=>setBroker(b)} className={`text-xs py-2 rounded-lg border font-semibold ${broker===b ? 'border-[#6C2BD9] bg-[#F1E7FE] text-[#5320A8]' : 'border-[#E8E1F0]'}`}>{b}</button>
                  ))}
                </div>
              </div>
            )}
            <button className="btn-primary w-full py-3">{mode === 'login' ? 'Log in' : 'Create account'}</button>
            <div className="text-xs text-center text-[#6B6480]">Demo — simulated, no email is sent.</div>
          </form>
        </div>
      </div>
    </div>
  );
}
