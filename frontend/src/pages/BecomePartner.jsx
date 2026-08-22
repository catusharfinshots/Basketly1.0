import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Loader2, LineChart, CheckCircle2, ShieldCheck, Users, TrendingUp } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BecomePartner() {
  const [form, setForm] = useState({ name: '', phone: '+91', email: '', firm: '', sebi_reg: '', note: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await axios.post(`${API}/partners/apply`, { ...form, email: form.email || undefined });
      setDone(true);
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Could not submit your application');
    } finally { setBusy(false); }
  };

  if (done) {
    return (
      <div className="min-h-[70vh] grid place-items-center bg-[#F7F4FB] p-6">
        <div className="surface p-10 text-center max-w-md" data-testid="partner-success">
          <span className="h-14 w-14 mx-auto rounded-2xl bg-[#DCFCE7] text-[#0E9F5E] grid place-items-center"><CheckCircle2 className="h-7 w-7" /></span>
          <h1 className="mt-5 text-2xl font-bold">Application received</h1>
          <p className="mt-2 text-sm text-[#64748B]">Thanks for applying to become a research analyst on Basketly. Our team will review your application. Once approved, just tap <b>Get started</b> and log in with this mobile number to access your analyst console.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F4FB]">
      <div className="container-x py-14 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EDE9FE] text-[#5320A8] text-xs font-semibold px-3 py-1.5"><LineChart className="h-3.5 w-3.5" /> For research analysts</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-tight">Become a partner</h1>
          <p className="mt-4 text-base text-[#475569] max-w-lg">List your model portfolios on Basketly and reach investors across India. Apply below — once our team approves you, you'll get your own analyst console to build and publish baskets.</p>
          <div className="mt-8 space-y-4 max-w-md">
            {[
              { icon: TrendingUp, t: 'Publish model portfolios', d: 'Design baskets with stocks, weights, methodology, rebalancing and a factsheet.' },
              { icon: Users, t: 'Reach real investors', d: 'Approved baskets appear live on the Model Portfolios page.' },
              { icon: ShieldCheck, t: 'Admin-reviewed & trusted', d: 'Every listing is reviewed before it goes live.' },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="h-9 w-9 shrink-0 rounded-xl bg-white text-[#6C2BD9] grid place-items-center border border-[#E8E1F0]"><b.icon className="h-4 w-4" /></span>
                <div><div className="text-sm font-semibold text-[#1A1030]">{b.t}</div><div className="text-xs text-[#64748B]">{b.d}</div></div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="surface p-6 sm:p-8" data-testid="partner-form">
          <h2 className="text-lg font-semibold">Apply as a research analyst</h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label>Full name *</Label>
              <Input data-testid="partner-name" required value={form.name} onChange={set('name')} className="h-11 mt-1.5" placeholder="Your name" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Mobile number *</Label>
                <Input data-testid="partner-phone" required value={form.phone} onChange={set('phone')} className="h-11 mt-1.5" placeholder="+91 98765 43210" />
              </div>
              <div>
                <Label>Email</Label>
                <Input data-testid="partner-email" type="email" value={form.email} onChange={set('email')} className="h-11 mt-1.5" placeholder="you@firm.com" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Firm / experience</Label>
                <Input data-testid="partner-firm" value={form.firm} onChange={set('firm')} className="h-11 mt-1.5" placeholder="e.g. 8 yrs, XYZ Capital" />
              </div>
              <div>
                <Label>SEBI reg. no. (optional)</Label>
                <Input data-testid="partner-sebi" value={form.sebi_reg} onChange={set('sebi_reg')} className="h-11 mt-1.5" placeholder="INHXXXXXXXXX" />
              </div>
            </div>
            <div>
              <Label>Tell us about your strategy</Label>
              <Textarea data-testid="partner-note" value={form.note} onChange={set('note')} rows={4} className="mt-1.5" placeholder="What kind of portfolios do you want to publish?" />
            </div>
            <button data-testid="partner-submit" disabled={busy} className="btn-primary w-full py-3 disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Submit application
            </button>
            <p className="text-xs text-center text-[#94A3B8]">We'll review and get back to you. Approval unlocks your analyst console.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
