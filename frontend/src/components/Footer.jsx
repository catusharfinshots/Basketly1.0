import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const cols = [
  {
    title: 'Company',
    links: [
      { name: 'About', to: '/about' },
      { name: 'Careers', to: '/careers' },
      { name: 'Press', to: '/press' },
      { name: 'Contact', to: '/help' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Learn', to: '/learn' },
      { name: 'Blog', to: '/learn' },
      { name: 'Calculators', to: '/calculators' },
      { name: 'Help centre', to: '/help' },
    ],
  },
  {
    title: 'Offerings',
    links: [
      { name: 'Baskets', to: '/explore/smallcases' },
      { name: 'Stocks', to: '/stocks' },
      { name: 'Mutual funds', to: '/mutual-funds' },
      { name: 'Fixed deposits', to: '/fixed-deposits' },
      { name: 'Loan against MF', to: '/loan-against-mutual-funds' },
    ],
  },
  {
    title: 'For Businesses',
    links: [
      { name: 'Gateway', to: '/business' },
      { name: 'Publisher', to: '/business' },
      { name: 'Brokers', to: '/business' },
      { name: 'Tickertape', to: '/business' },
    ],
  },
  {
    title: 'Fine print',
    links: [
      { name: 'Terms', to: '/terms' },
      { name: 'Privacy', to: '/privacy' },
      { name: 'Disclosures', to: '/disclosures' },
      { name: 'Investment tools', to: '/investment-tools' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[#E8E1F0] bg-[#F7F4FB]">
      <div className="container-x py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg grad-card text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="font-[Space_Grotesk] text-lg font-bold">Basketly</span>
            </div>
            <p className="mt-4 text-sm text-[#6B6480] max-w-xs">
              A curated-investing platform. Baskets are model portfolios built by SEBI-registered managers. Demo build — simulated data, not financial advice.
            </p>
            <div className="mt-5 flex items-center gap-3 text-[#6B6480]">
              <a href="#" aria-label="Twitter" className="hover:text-[#6C2BD9]"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-[#6C2BD9]"><Linkedin className="h-4 w-4" /></a>
              <a href="#" aria-label="Instagram" className="hover:text-[#6C2BD9]"><Instagram className="h-4 w-4" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-[#6C2BD9]"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1A1030] mb-3">{col.title}</div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.name}><Link to={l.to} className="text-sm text-[#6B6480] hover:text-[#1A1030]">{l.name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8E1F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-[#6B6480] max-w-3xl">
            Investments in securities are subject to market risks. Read all scheme related documents carefully before investing. Past performance is not indicative of future returns. Basketly is a demo build — no real trades are placed.
          </p>
          <Link to="/admin" className="text-xs font-semibold text-[#6C2BD9] hover:text-[#5320A8]">Platform owner login →</Link>
        </div>
      </div>
    </footer>
  );
}
