import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Search, Sparkles } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const navItems = [
  {
    label: 'Baskets',
    to: '/explore/smallcases',
    mega: {
      cols: [
        { title: 'Explore', links: [
          { name: 'All baskets', to: '/explore/smallcases' },
          { name: 'New launches', to: '/explore/smallcases?filter=new' },
          { name: 'Managers', to: '/managers' },
        ]},
        { title: 'By strategy', links: [
          { name: 'Thematic', to: '/explore/smallcases?strategy=thematic' },
          { name: 'Sectoral', to: '/explore/smallcases?strategy=sectoral' },
          { name: 'Model based', to: '/explore/smallcases?strategy=model-based' },
          { name: 'Asset allocation', to: '/explore/smallcases?strategy=asset-allocation' },
        ]},
        { title: 'By goal', links: [
          { name: 'Wealth creation', to: '/explore/smallcases?goal=wealth' },
          { name: 'Regular income', to: '/explore/smallcases?goal=income' },
          { name: 'Retirement', to: '/explore/smallcases?goal=retirement' },
        ]},
      ],
    },
  },
  { label: 'Stocks', to: '/stocks' },
  { label: 'Mutual Funds', to: '/mutual-funds' },
  { label: 'Fixed Deposits', to: '/fixed-deposits' },
  { label: 'Learn', to: '/learn' },
  { label: 'For Businesses', to: '/business' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E1F0] bg-white/85 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg grad-card text-white shadow-md">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-[Space_Grotesk] text-lg font-bold tracking-tight">Basketly</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            item.mega ? (
              <Popover key={item.label}>
                <PopoverTrigger asChild>
                  <button className="btn-ghost flex items-center gap-1">
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[560px] p-6 grid grid-cols-3 gap-6 rounded-2xl border-[#E8E1F0]">
                  {item.mega.cols.map((col) => (
                    <div key={col.title}>
                      <div className="eyebrow mb-3">{col.title}</div>
                      <ul className="space-y-2">
                        {col.links.map((l) => (
                          <li key={l.name}>
                            <Link to={l.to} className="text-sm font-medium text-[#1A1030] hover:text-[#6C2BD9]">
                              {l.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            ) : (
              <NavLink key={item.label} to={item.to}
                className={({isActive}) => `btn-ghost ${isActive ? 'text-[#6C2BD9]' : ''}`}>
                {item.label}
              </NavLink>
            )
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button className="h-9 w-9 grid place-items-center rounded-full hover:bg-[#F7F4FB]" onClick={() => navigate('/explore/smallcases')} aria-label="Search">
            <Search className="h-4 w-4 text-[#1A1030]" />
          </button>
          <Link to="/login" className="btn-ghost">Login</Link>
          <Link to="/explore/smallcases" className="btn-primary">Start investing</Link>
        </div>

        <button className="lg:hidden h-10 w-10 grid place-items-center rounded-lg hover:bg-[#F7F4FB]" onClick={() => setOpen(v => !v)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#E8E1F0] bg-white">
          <div className="container-x py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className="py-2 text-sm font-medium">
                {item.label}
              </Link>
            ))}
            <div className="pt-3 flex gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1">Login</Link>
              <Link to="/explore/smallcases" onClick={() => setOpen(false)} className="btn-primary flex-1">Start investing</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
