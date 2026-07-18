import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { baskets, getBasket } from '../mock';
import { TrendingUp, TrendingDown, CalendarClock, ShoppingBag, Heart } from 'lucide-react';

export default function DashboardPage() {
  const { investments, sips, watchlist } = usePortfolio();

  const enriched = useMemo(() => investments.map(inv => {
    const b = getBasket(inv.basketId);
    // simulate current value by applying monthly return since createdAt
    const cagr = b ? b.returns.cagr/100 : 0.12;
    const monthly = Math.pow(1+cagr, 1/12) - 1;
    const days = (Date.now() - new Date(inv.createdAt).getTime()) / (1000*3600*24);
    const months = Math.max(0.1, days/30);
    const current = inv.amount * Math.pow(1 + monthly, months);
    return { ...inv, currentValue: current, gain: current - inv.amount, gainPct: ((current - inv.amount)/inv.amount)*100 };
  }), [investments]);

  const totals = enriched.reduce((acc, i) => {
    acc.invested += i.amount; acc.current += i.currentValue; return acc;
  }, { invested: 0, current: 0 });
  const returns = totals.current - totals.invested;
  const returnPct = totals.invested ? (returns/totals.invested)*100 : 0;

  return (
    <div className="container-x py-10 lg:py-14">
      <div className="eyebrow">Portfolio</div>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">Your dashboard</h1>
      <p className="mt-3 text-[#6B6480]">Simulated portfolio — invest from any basket to see it here.</p>

      <div className="mt-8 grid md:grid-cols-4 gap-4">
        <div className="surface p-5">
          <div className="text-xs text-[#6B6480] uppercase tracking-wider font-semibold">Current value</div>
          <div className="num mt-1 text-2xl font-bold">₹{Math.round(totals.current).toLocaleString('en-IN')}</div>
        </div>
        <div className="surface p-5">
          <div className="text-xs text-[#6B6480] uppercase tracking-wider font-semibold">Invested</div>
          <div className="num mt-1 text-2xl font-bold">₹{Math.round(totals.invested).toLocaleString('en-IN')}</div>
        </div>
        <div className="surface p-5">
          <div className="text-xs text-[#6B6480] uppercase tracking-wider font-semibold">Returns</div>
          <div className={`num mt-1 text-2xl font-bold flex items-center gap-1 ${returns>=0?'text-[#12B76A]':'text-[#F04438]'}`}>
            {returns>=0?<TrendingUp className="h-5 w-5" />:<TrendingDown className="h-5 w-5" />}
            ₹{Math.round(returns).toLocaleString('en-IN')}
          </div>
          <div className={`text-xs mt-0.5 ${returns>=0?'text-[#12B76A]':'text-[#F04438]'}`}>{returns>=0?'+':''}{returnPct.toFixed(2)}%</div>
        </div>
        <div className="surface p-5">
          <div className="text-xs text-[#6B6480] uppercase tracking-wider font-semibold">Active SIPs</div>
          <div className="num mt-1 text-2xl font-bold">{sips.length}</div>
        </div>
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-[#6C2BD9]" /> Holdings</h2>
            <Link to="/explore/smallcases" className="text-sm font-semibold text-[#6C2BD9]">Invest more →</Link>
          </div>
          <div className="mt-4 divide-y divide-[#F1E7FE]">
            {enriched.length === 0 && <div className="py-8 text-center text-sm text-[#6B6480]">No holdings yet. <Link to="/explore/smallcases" className="text-[#6C2BD9] font-semibold">Explore baskets</Link></div>}
            {enriched.map(i => (
              <Link key={i.id} to={`/smallcase/${i.basketId}`} className="py-4 flex items-center justify-between text-sm hover:bg-[#FBF8FF] px-2 -mx-2 rounded-lg transition-colors">
                <div>
                  <div className="font-semibold">{i.basketName}</div>
                  <div className="text-xs text-[#6B6480] num">Invested ₹{i.amount.toLocaleString('en-IN')}</div>
                </div>
                <div className="text-right">
                  <div className="num font-semibold">₹{Math.round(i.currentValue).toLocaleString('en-IN')}</div>
                  <div className={`text-xs font-semibold ${i.gain>=0?'text-[#12B76A]':'text-[#F04438]'}`}>{i.gain>=0?'+':''}{i.gainPct.toFixed(2)}%</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2"><CalendarClock className="h-4 w-4 text-[#6C2BD9]" /> Active SIPs</h2>
          <div className="mt-4 divide-y divide-[#F1E7FE]">
            {sips.length === 0 && <div className="py-8 text-center text-sm text-[#6B6480]">No active SIPs yet.</div>}
            {sips.map(s => (
              <div key={s.id} className="py-4 flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold">{s.basketName}</div>
                  <div className="text-xs text-[#6B6480]">{s.frequency} · {s.mode}</div>
                </div>
                <div className="num font-semibold">₹{s.amount.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {watchlist.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Heart className="h-4 w-4 text-[#E23FA0]" /> Watchlist</h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map(id => {
              const b = baskets.find(x => x.id === id); if (!b) return null;
              return (
                <Link key={id} to={`/smallcase/${id}`} className="surface p-4 hover:border-[#D8C7F1] transition-colors">
                  <div className="font-semibold text-sm">{b.name}</div>
                  <div className="text-xs text-[#6B6480]">{b.risk} risk · {b.strategy.replace('-',' ')}</div>
                  <div className="mt-2 num text-lg font-bold text-[#12B76A]">+{b.returns.y3.toFixed(1)}%</div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
