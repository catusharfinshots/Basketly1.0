import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, TrendingUp, Repeat, LayoutGrid, ChevronRight } from 'lucide-react';
import { baskets, brokers, trustStats, strategies, testimonials, faqs, learnPosts, collections } from '../mock';
import BasketCard, { Sparkline } from '../components/BasketCard';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import * as Icons from 'lucide-react';

function Icon({ name, className }) {
  const C = Icons[name] || Icons.Circle;
  return <C className={className} />;
}

export default function Home() {
  const featured = baskets.slice(0, 6);
  const heroBasket = baskets[0];

  return (
    <div>
      {/* HERO */}
      <section className="grad-hero relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-40 pointer-events-none" />
        <div className="container-x pt-14 pb-16 lg:pt-20 lg:pb-24">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#E8E1F0] px-3 py-1 text-xs font-semibold text-[#5320A8] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6C2BD9] animate-pulse" />
            Demo build · simulated data
          </div>
          <div className="mt-6 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h1 className="font-[Space_Grotesk] text-[42px] sm:text-[56px] lg:text-[68px] font-bold leading-[1.02] tracking-tight">
                Invest in ideas,{' '}
                <span className="bg-gradient-to-r from-[#6C2BD9] via-[#B15CFF] to-[#E23FA0] bg-clip-text text-transparent italic">not just stocks.</span>
              </h1>
              <p className="mt-5 text-lg text-[#6B6480] max-w-xl leading-relaxed">
                Buy expert-built baskets of stocks and ETFs around a single theme — in one click, from your own broker account. Transparent, low-cost, and yours to manage.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/explore/smallcases" className="btn-primary px-6 py-3">
                  Explore baskets <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#how-it-works" className="btn-outline px-6 py-3">See how it works</a>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-sm text-[#6B6480]">
                <Lock className="h-4 w-4 text-[#12B76A]" />
                Your stocks stay in your own demat account
              </div>
            </div>

            {/* Hero basket card */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-[#B15CFF]/30 to-[#E23FA0]/20 blur-2xl" />
                <div className="relative surface p-6 shadow-[0_30px_60px_-30px_rgba(76,29,149,0.35)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl grad-card text-white grid place-items-center font-bold text-sm">AW</div>
                      <div>
                        <div className="text-xs text-[#6B6480]">All Weather</div>
                        <div className="font-semibold text-[#1A1030]">{heroBasket.name}</div>
                      </div>
                    </div>
                    <span className="chip-brand">Featured</span>
                  </div>

                  <div className="mt-4">
                    <Sparkline seed={7} positive />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <div className="num text-3xl font-bold text-[#12B76A]">+18.4%</div>
                    <div className="text-xs text-[#6B6480] font-medium">3Y CAGR</div>
                  </div>

                  <div className="mt-5 space-y-2">
                    {heroBasket.constituents.map((c) => (
                      <div key={c.symbol} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-[#F1E7FE] text-[#5320A8] grid place-items-center text-[10px] font-bold">{c.symbol.slice(0,2)}</div>
                          <span className="font-medium text-[#1A1030]">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-20 rounded-full bg-[#F1E7FE] overflow-hidden">
                            <div className="h-full grad-card" style={{ width: `${c.weight * 2.5}%` }} />
                          </div>
                          <span className="num font-semibold text-[#1A1030] w-9 text-right">{c.weight}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to={`/smallcase/${heroBasket.id}`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#6C2BD9] hover:text-[#5320A8]">
                    View basket <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust stats band */}
      <section className="grad-band relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 noise-overlay" />
        <div className="container-x py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
            {trustStats.map((s) => (
              <div key={s.label}>
                <div className="num text-3xl md:text-4xl font-bold">{s.value}</div>
                <div className="mt-1 text-sm text-white/75">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Broker wall */}
      <section className="border-y border-[#E8E1F0] bg-white">
        <div className="container-x py-8">
          <div className="flex items-center gap-6 overflow-hidden">
            <div className="text-xs font-semibold text-[#6B6480] uppercase tracking-widest whitespace-nowrap">Works with</div>
            <div className="flex-1 flex flex-wrap items-center gap-x-8 gap-y-4">
              {brokers.map((b) => (
                <div key={b.name} className="flex items-center gap-2 text-[#1A1030]">
                  <div className="h-8 w-8 rounded-lg bg-[#F7F4FB] text-[#5320A8] grid place-items-center text-[11px] font-bold border border-[#E8E1F0]">{b.logo}</div>
                  <span className="text-sm font-medium">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The idea */}
      <section className="container-x py-20">
        <div className="max-w-2xl">
          <div className="eyebrow">The idea</div>
          <h2 className="mt-3 text-4xl font-bold">A basket is a portfolio with a purpose</h2>
          <p className="mt-4 text-lg text-[#6B6480]">Each one is built and rebalanced by professionals around a clear strategy — you own the thinking, not just the tickers.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: 'Brain', title: 'Built by experts', text: 'Registered managers research, weight, and maintain every basket so you don\'t pick stocks alone.' },
            { icon: 'Repeat', title: 'Auto-rebalanced', text: 'Get notified when a strategy shifts and apply the update in one tap to stay on track.' },
            { icon: 'ShieldCheck', title: 'Fully transparent', text: 'See every holding, weight, and fee up front. Your shares sit safely in your own demat.' },
          ].map((f) => (
            <div key={f.title} className="surface p-7 hover:border-[#D8C7F1] hover:shadow-[0_16px_40px_-25px_rgba(76,29,149,0.35)] transition-all">
              <div className="h-11 w-11 rounded-xl bg-[#F1E7FE] text-[#6C2BD9] grid place-items-center">
                <Icon name={f.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-[15px] text-[#6B6480] leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured baskets */}
      <section className="container-x py-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="eyebrow">Featured</div>
            <h2 className="mt-3 text-4xl font-bold">Popular baskets right now</h2>
            <p className="mt-3 text-[#6B6480] max-w-xl">A live selection curated by the platform team — returns update whenever the team republishes.</p>
          </div>
          <Link to="/explore/smallcases" className="btn-outline">See all baskets <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((b) => <BasketCard key={b.id} basket={b} />)}
        </div>
      </section>

      {/* Explore by strategy */}
      <section className="container-x py-20">
        <div className="eyebrow">Browse</div>
        <h2 className="mt-3 text-4xl font-bold">Explore by strategy</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {strategies.map((s) => (
            <Link key={s.key} to={`/explore/smallcases?strategy=${s.key}`}
              className="surface p-5 flex flex-col items-start gap-3 hover:border-[#D8C7F1] hover:-translate-y-0.5 transition-all">
              <div className="h-10 w-10 rounded-xl grad-card text-white grid place-items-center"><Icon name={s.icon} className="h-4 w-4" /></div>
              <div className="text-sm font-semibold text-[#1A1030]">{s.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[#F7F4FB] border-y border-[#E8E1F0]">
        <div className="container-x py-20">
          <div className="eyebrow">How it works</div>
          <h2 className="mt-3 text-4xl font-bold max-w-2xl">From idea to invested in three steps</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { n: '01', t: 'Pick a basket', d: 'Browse by theme, risk, or returns and open the one that matches your goals.', icon: 'LayoutGrid' },
              { n: '02', t: 'Connect your broker', d: 'Link your existing broker in seconds. No new account, no transfers.', icon: 'Link' },
              { n: '03', t: 'Invest & track', d: 'Buy the whole basket in one click and manage it from a single dashboard.', icon: 'LineChart' },
            ].map((s) => (
              <div key={s.n} className="surface p-7 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 text-8xl font-bold text-[#F1E7FE]">{s.n}</div>
                <div className="relative">
                  <div className="h-11 w-11 rounded-xl bg-[#F1E7FE] text-[#6C2BD9] grid place-items-center"><Icon name={s.icon} className="h-5 w-5" /></div>
                  <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
                  <p className="mt-2 text-[15px] text-[#6B6480]">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections grid */}
      <section className="container-x py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="eyebrow">Collections</div>
            <h2 className="mt-3 text-4xl font-bold">Curated for how you think</h2>
          </div>
          <Link to="/collections" className="btn-outline">All collections <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {collections.map((c) => (
            <Link key={c.id} to={`/collections/${c.slug}`} className="surface p-5 hover:border-[#D8C7F1] hover:-translate-y-0.5 transition-all">
              <div className="h-10 w-10 rounded-xl bg-[#F1E7FE] text-[#6C2BD9] grid place-items-center"><Icon name={c.icon} className="h-5 w-5" /></div>
              <div className="mt-4 text-sm font-semibold text-[#1A1030]">{c.title}</div>
              <div className="text-xs text-[#6B6480] mt-1">{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Asset classes */}
      <section className="container-x py-8">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { title: 'Direct stocks', desc: 'Search, screen, and build custom baskets.', to: '/stocks', icon: 'LineChart', color: 'from-[#6C2BD9] to-[#B15CFF]' },
            { title: 'Mutual funds', desc: 'Direct funds across equity, debt & hybrid.', to: '/mutual-funds', icon: 'PieChart', color: 'from-[#B15CFF] to-[#E23FA0]' },
            { title: 'Fixed deposits', desc: 'Book RBI-insured FDs at attractive rates.', to: '/fixed-deposits', icon: 'Landmark', color: 'from-[#5320A8] to-[#6C2BD9]' },
          ].map((c) => (
            <Link key={c.title} to={c.to} className={`rounded-2xl p-6 bg-gradient-to-br ${c.color} text-white relative overflow-hidden group`}>
              <Icon name={c.icon} className="h-8 w-8 opacity-90" />
              <div className="mt-6 text-xl font-semibold">{c.title}</div>
              <div className="mt-1 text-sm text-white/85 max-w-xs">{c.desc}</div>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">Explore <ArrowRight className="h-4 w-4" /></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-x py-20">
        <div className="eyebrow">Loved by investors</div>
        <h2 className="mt-3 text-4xl font-bold">What people are saying</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="surface p-7">
              <div className="text-[15px] leading-relaxed text-[#1A1030]">“{t.quote}”</div>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full grad-card text-white grid place-items-center font-bold">{t.initial}</div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-[#6B6480]">{t.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile app promo */}
      <section className="container-x pb-4">
        <div className="relative overflow-hidden rounded-3xl grad-band text-white p-10 lg:p-14">
          <div className="absolute inset-0 noise-overlay opacity-20" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold">Your portfolio, in your pocket</h3>
              <p className="mt-3 text-white/80 max-w-md">Track baskets, apply rebalances, and invest on the go. Available on iOS and Android.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/20 px-4 py-2.5 text-sm backdrop-blur hover:bg-black/50"><Icons.Apple className="h-5 w-5" /> App Store</button>
                <button className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/20 px-4 py-2.5 text-sm backdrop-blur hover:bg-black/50"><Icons.Play className="h-5 w-5" /> Google Play</button>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="w-48 h-96 rounded-[2rem] bg-white/10 border border-white/25 backdrop-blur p-2 shadow-xl">
                <div className="h-full w-full rounded-[1.6rem] bg-white text-[#1A1030] p-4 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="font-[Space_Grotesk] font-bold text-sm">Basketly</div>
                    <Icons.Bell className="h-4 w-4 text-[#6B6480]" />
                  </div>
                  <div className="mt-4 rounded-xl grad-card text-white p-3">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">Portfolio</div>
                    <div className="num text-xl font-bold">₹2,84,120</div>
                    <div className="text-[11px] mt-1">+18.4% · 3Y</div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {baskets.slice(0,3).map(b => (
                      <div key={b.id} className="flex items-center justify-between text-[11px]">
                        <span className="font-medium truncate">{b.name}</span>
                        <span className="text-[#12B76A] font-semibold">+{b.returns.y1.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn preview */}
      <section className="container-x py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="eyebrow">Learn</div>
            <h2 className="mt-3 text-4xl font-bold">Guides for smarter investors</h2>
          </div>
          <Link to="/learn" className="btn-outline">All guides <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {learnPosts.slice(0,3).map((p, i) => (
            <Link key={p.slug} to={`/learn/${p.slug}`} className="surface overflow-hidden hover:border-[#D8C7F1] transition-all group">
              <div className={`h-40 bg-gradient-to-br ${i===0?'from-[#6C2BD9] to-[#B15CFF]':i===1?'from-[#E23FA0] to-[#B15CFF]':'from-[#3B1671] to-[#6C2BD9]'}`}></div>
              <div className="p-5">
                <div className="chip-brand">{p.category}</div>
                <h3 className="mt-3 text-[17px] font-semibold group-hover:text-[#6C2BD9]">{p.title}</h3>
                <p className="mt-1 text-sm text-[#6B6480]">{p.excerpt}</p>
                <div className="mt-4 text-xs text-[#6B6480]">{p.readTime}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="eyebrow">Questions</div>
            <h2 className="mt-3 text-4xl font-bold">Frequently asked</h2>
            <p className="mt-4 text-[#6B6480]">Everything about how baskets work, fees, and safety of your holdings.</p>
          </div>
          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="surface divide-y divide-[#E8E1F0]">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`f-${i}`} className="px-5 border-0">
                  <AccordionTrigger className="text-left text-[15px] font-semibold py-4 hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-[15px] text-[#6B6480] pb-5">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
