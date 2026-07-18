import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { managers, baskets } from '../mock';
import BasketCard from '../components/BasketCard';
import { BadgeCheck, Users } from 'lucide-react';

export function ManagersPage() {
  return (
    <div className="container-x py-10 lg:py-14">
      <div className="eyebrow">Managers</div>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">SEBI-registered basket managers</h1>
      <p className="mt-3 text-[#6B6480] max-w-xl">Follow the research houses that design and rebalance baskets.</p>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {managers.map(m => (
          <Link key={m.id} to={`/manager/${m.id}`} className="surface p-6 hover:border-[#D8C7F1] transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl grad-card text-white grid place-items-center font-bold">{m.logo}</div>
              <div>
                <div className="flex items-center gap-1 text-sm font-semibold">{m.name} <BadgeCheck className="h-4 w-4 text-[#12B76A]" /></div>
                <div className="text-xs text-[#6B6480]">{m.sebiReg}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#6B6480]">{m.philosophy}</p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-[#6B6480]"><Users className="h-3.5 w-3.5" /> {m.subscribers} subscribers</div>
              <div className="chip-brand">{m.baskets} baskets</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ManagerDetail() {
  const { id } = useParams();
  const m = managers.find(x => x.id === id);
  if (!m) return <div className="container-x py-20 text-center"><h1 className="text-3xl font-bold">Manager not found</h1></div>;
  const mgrBaskets = baskets.filter(b => b.managerId === m.id);

  return (
    <div>
      <div className="grad-hero">
        <div className="container-x py-12 flex items-center gap-6">
          <div className="h-20 w-20 rounded-2xl grad-card text-white grid place-items-center text-2xl font-bold">{m.logo}</div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold">{m.name}</h1>
              <BadgeCheck className="h-6 w-6 text-[#12B76A]" />
            </div>
            <div className="text-sm text-[#6B6480] mt-1">SEBI Reg: {m.sebiReg} · {m.subscribers} subscribers</div>
            <p className="text-[#6B6480] mt-2 max-w-2xl">{m.description}</p>
          </div>
        </div>
      </div>
      <div className="container-x py-10">
        <h2 className="text-2xl font-bold">Baskets by {m.name}</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mgrBaskets.map(b => <BasketCard key={b.id} basket={b} />)}
        </div>
      </div>
    </div>
  );
}

export default ManagersPage;
