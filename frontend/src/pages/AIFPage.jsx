import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, TrendingUp, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

export default function AIFPage() {
  const [email, setEmail] = useState('');
  const submit = (e) => { e.preventDefault(); toast.success('Interest registered — our team will reach out. (Demo)'); setEmail(''); };
  return (
    <div>
      <section className="grad-hero border-b border-[#E6E8F0]">
        <div className="container-x py-16">
          <div className="eyebrow">Alternative Investment Fund</div>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl">Diversify beyond listed equity</h1>
          <p className="mt-4 text-lg text-[#64748B] max-w-2xl">Access professionally-managed AIFs across categories. Register your interest and our team will guide you through eligibility and onboarding.</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FEF3C7] text-[#B45309] px-3 py-1 text-xs font-semibold">Phase 2 — full flow coming soon</span>
        </div>
      </section>

      <section className="container-x py-16 grid lg:grid-cols-3 gap-6">
        {[
          { icon: Layers, t: 'Category I, II & III', d: 'From venture and infrastructure to long-short strategies.' },
          { icon: TrendingUp, t: 'Professional management', d: 'Managed by experienced fund managers with defined mandates.' },
          { icon: ShieldCheck, t: 'SEBI regulated', d: 'AIFs are registered and regulated under SEBI AIF regulations.' },
        ].map((c) => (
          <div key={c.t} className="surface p-7">
            <div className="h-12 w-12 rounded-xl bg-[#E7EFFF] text-[#2563EB] grid place-items-center"><c.icon className="h-6 w-6" /></div>
            <h3 className="mt-5 text-lg font-semibold">{c.t}</h3>
            <p className="mt-2 text-[15px] text-[#64748B]">{c.d}</p>
          </div>
        ))}
      </section>

      <section className="container-x pb-20">
        <div className="surface p-8 lg:p-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <Briefcase className="h-8 w-8 text-[#2563EB]" />
            <h2 className="mt-4 text-2xl font-bold">Register your interest</h2>
            <p className="mt-2 text-[#64748B]">Leave your email and our AIF desk will reach out with suitable options. (Lead capture is a Phase 2 feature.)</p>
            <ul className="mt-5 space-y-2 text-sm text-[#334155]">
              {['Minimum investment typically ₹1 Cr','Suitable for accredited investors','Dedicated relationship manager'].map(t => (
                <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#12B76A]" /> {t}</li>
              ))}
            </ul>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <Input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="h-12" placeholder="you@company.com" />
            <button className="btn-primary w-full py-3">Register interest <ArrowRight className="h-4 w-4" /></button>
            <div className="text-center text-xs text-[#94A3B8]">Or explore <Link to="/model-portfolios" className="text-[#2563EB] font-semibold">model portfolios</Link></div>
          </form>
        </div>
      </section>
    </div>
  );
}
