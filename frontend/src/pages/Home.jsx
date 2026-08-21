import React from 'react';
import { Link } from 'react-router-dom';
import { baskets, getManager } from '../mock';
import {
  ArrowRight, Star, ShieldCheck, Lock, Repeat, TrendingUp, Layers, Briefcase, Compass,
  CheckCircle2, Landmark,
} from 'lucide-react';

const RATING = 'Rated 4.6/5 · 1 lakh+ investors · ₹100 Cr+ managed';

const offerings = [
  { icon: Layers, title: 'Model Portfolio', text: 'Curated baskets of stocks & ETFs that rebalance with the market.', to: '/model-portfolios', cta: 'Explore portfolios' },
  { icon: Briefcase, title: 'Alternative Investment Fund', text: 'Diversify beyond listed equity with professionally-managed AIFs.', to: '/aif', cta: 'Learn about AIF' },
  { icon: Compass, title: 'Advisory', text: 'Buy / Sell / Hold insights in seconds, tailored to your holdings.', to: '/advisory', cta: 'See advisory' },
];

const trust = [
  { icon: ShieldCheck, title: 'No new accounts', text: 'Invest from your existing broker — no new demat needed.' },
  { icon: Lock, title: 'No lock-ins', text: 'Exit part or all of any portfolio whenever you like.' },
  { icon: CheckCircle2, title: 'Secure', text: 'Your shares stay in your own demat account, always.' },
  { icon: Landmark, title: 'Regulated', text: 'Portfolios built by SEBI-registered research analysts.' },
];

const testimonials = [
  { name: 'Ananya R.', tag: 'Investor, 2 yrs', quote: 'I finally stopped guessing which stocks to buy. Picked a portfolio, connected my broker, done.' },
  { name: 'Vikram S.', tag: 'Investor, 4 yrs', quote: 'The rebalancing nudges are gold. One tap and my portfolio stays aligned to the strategy.' },
  { name: 'Meera K.', tag: 'Investor, 1 yr', quote: 'Everything is transparent — every holding and fee is right there before I commit a rupee.' },
  { name: 'Rahul T.', tag: 'Investor, 3 yrs', quote: 'The AIF and advisory options mean I can keep everything for my money in one place.' },
  { name: 'Sneha P.', tag: 'Investor, 1 yr', quote: 'SIP into a whole model portfolio was so simple. The order review made it feel safe.' },
  { name: 'Arjun M.', tag: 'Investor, 5 yrs', quote: 'Money genuinely at work. My portfolios are managed by real research analysts.' },
];

function FeaturedCard({ b }) {
  const mgr = getManager(b.managerId);
  return (
    <Link to={`/model-portfolios/${b.id}`} className="group surface p-5 hover:shadow-[0_16px_40px_-24px_rgba(37,99,235,0.35)] hover:border-[#C7D2FE] transition-all block">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-xl grad-card text-white grid place-items-center text-sm font-bold">{b.name.slice(0,2).toUpperCase()}</span>
        <div className="min-w-0">
          <div className="text-xs text-[#64748B]">by {mgr?.name}</div>
          <div className="text-sm font-semibold text-[#0F1729] truncate group-hover:text-[#2563EB]">{b.name}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold">3Y Return</div>
          <div className="num text-lg font-bold text-[#0E9F5E] flex items-center gap-1"><TrendingUp className="h-4 w-4" /> {b.returns.y3.toFixed(1)}%</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold">Min.</div>
          <div className="num text-lg font-bold text-[#0F1729]">₹{b.minAmount.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const featured = baskets.slice(0, 6);
  return (
    <div>
      {/* HERO */}
      <section className="grad-hero relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-40 pointer-events-none" />
        <div className="container-x pt-16 pb-20 lg:pt-24 lg:pb-28 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E6E8F0] px-3 py-1 text-xs font-semibold text-[#2563EB]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] animate-pulse" /> Demo build · simulated data
          </div>
          <h1 className="mt-6 font-[Space_Grotesk] text-[44px] sm:text-[60px] lg:text-[72px] font-bold leading-[1.02] tracking-tight max-w-4xl">
            Challenging <span className="text-[#2563EB]">volatility</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-[#475569] max-w-2xl leading-relaxed">
            Money at work — expert-managed model portfolios, AIFs and advisory, invested straight from your own broker account. Transparent, low-cost, and yours to manage.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/signup" className="btn-primary px-6 py-3">Get started <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/model-portfolios" className="btn-outline px-6 py-3">Explore model portfolios</Link>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#475569]">
            <span className="flex items-center gap-0.5 text-[#F59E0B]">{[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-[#F59E0B]" />)}</span>
            {RATING}
          </div>
        </div>
      </section>

      {/* BAND */}
      <section className="grad-band relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 noise-overlay" />
        <div className="container-x py-14 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-2xl">Everything for your money, at one place</h2>
          <p className="mt-3 text-white/75 max-w-xl">Model portfolios, alternative funds and advisory — all working together from a single dashboard.</p>
        </div>
      </section>

      {/* HOW IT WORKS / OFFERINGS */}
      <section className="container-x py-20">
        <div className="eyebrow">How it works</div>
        <h2 className="mt-3 text-4xl font-bold">Three ways to put your money to work</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {offerings.map((o) => (
            <Link key={o.title} to={o.to} className="surface p-7 hover:border-[#C7D2FE] hover:shadow-[0_16px_40px_-25px_rgba(37,99,235,0.35)] transition-all group">
              <div className="h-12 w-12 rounded-xl bg-[#E7EFFF] text-[#2563EB] grid place-items-center"><o.icon className="h-6 w-6" /></div>
              <h3 className="mt-5 text-lg font-semibold group-hover:text-[#2563EB]">{o.title}</h3>
              <p className="mt-2 text-[15px] text-[#64748B] leading-relaxed">{o.text}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB]">{o.cta} <ArrowRight className="h-4 w-4" /></div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED MODEL PORTFOLIOS */}
      <section className="container-x py-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="eyebrow">Model Portfolios</div>
            <h2 className="mt-3 text-4xl font-bold">Popular right now</h2>
            <p className="mt-3 text-[#64748B] max-w-xl">Curated by SEBI-registered managers. Returns update whenever the team republishes.</p>
          </div>
          <Link to="/model-portfolios" className="btn-outline">See more <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((b) => <FeaturedCard key={b.id} b={b} />)}
        </div>
      </section>

      {/* AIF + ADVISORY split */}
      <section className="container-x py-20">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-8 grad-card text-white relative overflow-hidden">
            <Briefcase className="h-8 w-8 opacity-90" />
            <h3 className="mt-5 text-2xl font-bold">Alternative Investment Fund</h3>
            <p className="mt-2 text-white/85 max-w-md">Access professionally-managed AIFs to diversify beyond listed equity. Register your interest and our team will reach out.</p>
            <Link to="/aif" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-[#2563EB] px-5 py-2.5 text-sm font-semibold">Explore AIF <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="rounded-2xl p-8 grad-accent text-white relative overflow-hidden">
            <Compass className="h-8 w-8 opacity-90" />
            <h3 className="mt-5 text-2xl font-bold">Advisory</h3>
            <p className="mt-2 text-white/85 max-w-md">Get Buy / Sell / Hold calls in seconds, tailored to your goals. Subscribe to research-backed advisory.</p>
            <Link to="/advisory" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-[#6C2BD9] px-5 py-2.5 text-sm font-semibold">See advisory <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-[#F5F7FB] border-y border-[#E6E8F0]">
        <div className="container-x py-16">
          <div className="eyebrow">Why Basketly</div>
          <h2 className="mt-3 text-4xl font-bold">Built on trust</h2>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trust.map((t) => (
              <div key={t.title} className="surface p-6">
                <div className="h-11 w-11 rounded-xl bg-[#E7EFFF] text-[#2563EB] grid place-items-center"><t.icon className="h-5 w-5" /></div>
                <h3 className="mt-4 text-base font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-[#64748B]">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x py-20">
        <div className="eyebrow">Loved by investors</div>
        <h2 className="mt-3 text-4xl font-bold">What people are saying</h2>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="surface p-7">
              <div className="flex items-center gap-0.5 text-[#F59E0B]">{[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-[#F59E0B]" />)}</div>
              <div className="mt-4 text-[15px] leading-relaxed text-[#0F1729]">“{t.quote}”</div>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full grad-card text-white grid place-items-center font-bold">{t.name.slice(0,1)}</div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-[#64748B]">{t.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-20">
        <div className="rounded-3xl grad-band text-white p-10 lg:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 noise-overlay opacity-20" />
          <h3 className="relative text-3xl lg:text-4xl font-bold">Put your money to work today</h3>
          <p className="relative mt-3 text-white/80 max-w-xl mx-auto">Create your free account and invest in your first model portfolio in minutes.</p>
          <div className="relative mt-7 flex flex-wrap gap-3 justify-center">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-full bg-white text-[#2563EB] px-6 py-3 text-sm font-semibold">Get started <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/model-portfolios" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Browse portfolios</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
