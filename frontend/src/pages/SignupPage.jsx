import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { LineChart, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/dashboard';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await signup({ name, email, password });
      toast.success(`Account created — welcome, ${user.name.split(' ')[0]}`);
      nav(next);
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Could not create account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[80vh] grad-hero flex items-center">
      <div className="container-x grid lg:grid-cols-2 gap-10 items-center py-12">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="h-10 w-10 rounded-xl grad-card text-white grid place-items-center"><LineChart className="h-5 w-5" /></span>
            <span className="font-[Space_Grotesk] text-xl font-bold">Basketly</span>
          </Link>
          <h1 className="mt-8 text-4xl lg:text-5xl font-bold max-w-lg">Start investing in minutes.</h1>
          <p className="mt-4 text-[#64748B] max-w-md">Create your free account to invest in expert-managed model portfolios.</p>
          <ul className="mt-8 space-y-3 text-sm text-[#334155]">
            {['No new demat account needed','Stocks stay in your own account','No lock-ins, exit anytime'].map((t) => (
              <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#12B76A]" /> {t}</li>
            ))}
          </ul>
        </div>

        <div className="surface p-8 shadow-[0_30px_60px_-30px_rgba(37,99,235,0.35)]">
          <h2 className="text-lg font-semibold">Create account</h2>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-[#64748B]">Full name</Label>
              <Input required value={name} onChange={(e)=>setName(e.target.value)} className="h-11 mt-1.5" placeholder="Your name" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-[#64748B]">Email</Label>
              <Input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="h-11 mt-1.5" placeholder="you@company.com" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-[#64748B]">Password</Label>
              <Input required type="password" minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} className="h-11 mt-1.5" placeholder="At least 6 characters" />
            </div>
            <button disabled={busy} className="btn-primary w-full py-3 disabled:opacity-60">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Create account</button>
            <div className="text-sm text-center text-[#64748B]">Already have an account? <Link to="/login" className="font-semibold text-[#2563EB]">Log in</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
}
