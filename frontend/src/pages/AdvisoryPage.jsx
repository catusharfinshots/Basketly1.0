import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Zap, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

export default function AdvisoryPage() {
  const [email, setEmail] = useState('');
  const submit = (e) => { e.preventDefault(); toast.success('Interest registered — our advisory team will reach out. (Demo)'); setEmail(''); };
  const tiers = [
    { name: 'Starter', price: 'Free', features: ['Weekly market digest','Basic Buy/Sell/Hold list','Community access'] },
    { name: 'Pro', price: '₹499/mo', features: ['Real-time Buy/Sell/Hold calls','Portfolio health checks','Priority support'], highlight: true },
    { name: 'Elite', price: '₹1,499/mo', features: ['1:1 research analyst calls','Custom portfolio review','Everything in Pro'] },
  ];
  return (
    <div>
      <section className="grad-hero border-b border-[#E6E8F0]">
        <div className="container-x py-16">
          <div className="eyebrow">Advisory</div>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl">Buy / Sell / Hold insights in seconds</h1>
          <p className="mt-4 text-lg text-[#64748B] max-w-2xl">Research-backed advisory tailored to your holdings and goals. Subscribe to a plan or register your interest.</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FEF3C7] text-[#B45309] px-3 py-1 text-xs font-semibold">Phase 2 — subscriptions coming soon</span>
        </div>
      </section>

      <section className="container-x py-16 grid lg:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div key={t.name} className={`surface p-7 ${t.highlight ? 'ring-2 ring-[#2563EB]' : ''}`}>
            {t.highlight && <div className="chip-brand mb-3">Most popular</div>}
            <h3 className="text-lg font-semibold">{t.name}</h3>
            <div className="num mt-1 text-3xl font-bold">{t.price}</div>
            <ul className="mt-5 space-y-2 text-sm text-[#334155]">
              {t.features.map(f => <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#12B76A]" /> {f}</li>)}
            </ul>
            <button onClick={()=>toast.info('Subscriptions arrive in Phase 2.')} className={`w-full mt-6 ${t.highlight ? 'btn-primary' : 'btn-outline'} py-3`}>Choose {t.name}</button>
          </div>
        ))}
      </section>

      <section className="container-x pb-20">
        <div className="surface p-8 lg:p-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <Compass className="h-8 w-8 text-[#6C2BD9]" />
            <h2 className="mt-4 text-2xl font-bold">Not sure which plan?</h2>
            <p className="mt-2 text-[#64748B]">Leave your email and our advisory desk will help you pick the right plan.</p>
            <div className="mt-5 flex gap-4 text-sm text-[#334155]">
              <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#2563EB]" /> Fast setup</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#12B76A]" /> SEBI-registered</span>
            </div>
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
