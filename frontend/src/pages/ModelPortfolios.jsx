import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { baskets, getManager } from '../mock';
import { TrendingUp, Users, Search } from 'lucide-react';

const FILTERS = [
  { key: 'all', label: 'All', match: () => true },
  { key: 'asset-allocation', label: 'Asset allocation', match: (b) => b.strategy === 'asset-allocation' },
  { key: 'sectoral', label: 'Sectoral', match: (b) => b.strategy === 'sectoral' },
  { key: 'thematic', label: 'Thematic', match: (b) => b.strategy === 'thematic' },
  { key: 'smart-beta', label: 'Smart beta', match: (b) => b.strategy === 'smart-beta' || b.strategy === 'model-based' },
];

const riskColor = (risk) => risk === 'Low' ? 'text-[#0E9F5E] bg-[#DCFCE7]' : risk === 'High' ? 'text-[#DC2626] bg-[#FEE2E2]' : 'text-[#B45309] bg-[#FEF3C7]';

function PortfolioCard({ b }) {
  const mgr = getManager(b.managerId);
  return (
    <Link to={`/model-portfolios/${b.id}`}
      className="group surface p-5 hover:shadow-[0_16px_40px_-24px_rgba(37,99,235,0.35)] hover:border-[#C7D2FE] transition-all block">
      <div className="flex items-start gap-3">
        <span className="h-11 w-11 shrink-0 rounded-xl grad-card text-white grid place-items-center text-sm font-bold">
          {b.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <div className="text-xs text-[#64748B]">by {mgr?.name}</div>
          <h3 className="text-[16px] font-semibold text-[#0F1729] leading-snug group-hover:text-[#2563EB]">{b.name}</h3>
        </div>
      </div>
      <p className="mt-3 text-sm text-[#64748B] line-clamp-2 min-h-[40px]">{b.subtitle}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${riskColor(b.risk)}`}>{b.risk} volatility</span>
        <span className="chip-brand">{b.strategy.replace('-', ' ')}</span>
        <span className="chip">{b.constituents.length} stocks</span>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EEF1F6] grid grid-cols-2 gap-3">
        <div>
          <div className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">3Y Return</div>
          <div className="num mt-0.5 text-[17px] font-semibold text-[#0E9F5E] flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> {b.returns.y3.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">Min. amount</div>
          <div className="num mt-0.5 text-[17px] font-semibold text-[#0F1729]">₹{b.minAmount.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </Link>
  );
}

export default function ModelPortfolios() {
  const [params, setParams] = useSearchParams();
  const active = params.get('filter') || 'all';
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const f = FILTERS.find((x) => x.key === active) || FILTERS[0];
    return baskets.filter(f.match).filter((b) =>
      !q || b.name.toLowerCase().includes(q.toLowerCase()) || b.subtitle.toLowerCase().includes(q.toLowerCase())
    );
  }, [active, q]);

  return (
    <div>
      {/* Hero */}
      <section className="grad-hero border-b border-[#E6E8F0]">
        <div className="container-x py-14">
          <div className="eyebrow">Model Portfolios</div>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Invest in ideas, <span className="text-[#2563EB]">not just stocks</span>
          </h1>
          <p className="mt-4 text-lg text-[#64748B] max-w-2xl">
            Curated baskets of stocks & ETFs, built and rebalanced by SEBI-registered managers. Buy the whole idea in one click.
          </p>

          <div className="mt-6 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search model portfolios…"
              className="w-full rounded-full border border-[#E6E8F0] bg-white pl-10 pr-4 py-3 text-sm outline-none focus:border-[#2563EB]" />
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="container-x py-10">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f.key}
              onClick={() => setParams(f.key === 'all' ? {} : { filter: f.key })}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active === f.key ? 'bg-[#2563EB] text-white' : 'bg-white border border-[#E6E8F0] text-[#334155] hover:border-[#2563EB] hover:text-[#2563EB]'}`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-[#64748B]">
          <Users className="h-4 w-4" /> {list.length} model portfolio{list.length !== 1 ? 's' : ''}
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((b) => <PortfolioCard key={b.id} b={b} />)}
        </div>

        {list.length === 0 && (
          <div className="mt-16 text-center text-[#64748B]">No model portfolios match your search.</div>
        )}
      </section>
    </div>
  );
}
