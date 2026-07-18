import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { baskets as seedBaskets, managers as seedManagers, collections as seedCollections, mutualFunds as seedMF, testimonials as seedT, faqs as seedFaqs, trustStats as seedStats } from '../mock';
import { Sparkles, LayoutGrid, Users, Package, LineChart, Landmark, MessageSquare, HelpCircle, Settings, Plus, Trash2, ExternalLink, LogOut } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const NAV = [
  { key: 'home', label: 'Home content', icon: LayoutGrid },
  { key: 'baskets', label: 'Baskets', icon: Package },
  { key: 'managers', label: 'Managers', icon: Users },
  { key: 'collections', label: 'Collections', icon: LineChart },
  { key: 'mutual-funds', label: 'Mutual funds', icon: LineChart },
  { key: 'fds', label: 'Fixed deposits', icon: Landmark },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { key: 'faqs', label: 'FAQ', icon: HelpCircle },
  { key: 'settings', label: 'Site settings', icon: Settings },
];

function Row({ children }) {
  return <div className="flex items-center gap-3 py-3 border-b border-[#F1E7FE] last:border-0">{children}</div>;
}

function EmptyState({ title, desc, onAdd }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#E8E1F0] p-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-[#F1E7FE] text-[#6C2BD9] grid place-items-center"><Plus className="h-5 w-5" /></div>
      <div className="mt-4 font-semibold">{title}</div>
      <div className="text-sm text-[#6B6480]">{desc}</div>
      <button onClick={onAdd} className="btn-primary mt-4">Add entry</button>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState('home');
  const [dirty, setDirty] = useState(false);

  const [hero, setHero] = useState({ brand: 'Basketly', headline: 'Invest in ideas, *not just stocks.*', sub: 'Buy expert-built baskets of stocks and ETFs around a single theme.' });
  const [stats, setStats] = useState(seedStats);
  const [baskets, setBaskets] = useState(seedBaskets);
  const [managers, setManagers] = useState(seedManagers);
  const [collections, setCollections] = useState(seedCollections);
  const [funds, setFunds] = useState(seedMF);
  const [testimonials, setTestimonials] = useState(seedT);
  const [faqs, setFaqs] = useState(seedFaqs);

  const markDirty = () => setDirty(true);

  const publish = () => {
    toast.success('Published', { description: 'Changes are now live on the site.' });
    setDirty(false);
  };
  const discard = () => {
    toast.info('Changes discarded');
    setDirty(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F4FB]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E8E1F0]">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-lg grad-card text-white grid place-items-center"><Sparkles className="h-4 w-4" /></span>
            <div>
              <div className="font-[Space_Grotesk] text-sm font-bold">Basketly</div>
              <div className="text-[10px] uppercase tracking-widest text-[#6C2BD9] font-bold">Owner console</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-ghost inline-flex items-center gap-1 text-xs"><ExternalLink className="h-3.5 w-3.5" /> View site</Link>
            <Link to="/" className="btn-ghost inline-flex items-center gap-1 text-xs"><LogOut className="h-3.5 w-3.5" /> Sign out</Link>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-[240px_1fr] min-h-[calc(100vh-3.5rem)]">
        <aside className="bg-white border-r border-[#E8E1F0] p-4">
          <nav className="space-y-1">
            {NAV.map(n => (
              <button key={n.key} onClick={()=>setTab(n.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${tab===n.key ? 'bg-[#F1E7FE] text-[#5320A8]' : 'text-[#1A1030] hover:bg-[#F7F4FB]'}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="p-8">
          <div className="max-w-5xl">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold">Content manager</h1>
                <p className="text-sm text-[#6B6480]">Edit what investors see across every page, then hit <span className="font-semibold text-[#1A1030]">Publish changes</span> to push it live.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={discard} disabled={!dirty} className={`btn-outline ${!dirty ? 'opacity-50 cursor-not-allowed' : ''}`}>Discard</button>
                <button onClick={publish} className="btn-primary">Publish changes</button>
              </div>
            </div>
            {dirty && <div className="mt-3 text-xs text-[#B45309] bg-[#FFFAEB] border border-[#FDE68A] rounded-lg px-3 py-1.5 inline-block">You have unpublished changes.</div>}

            <div className="mt-8 space-y-6">
              {tab === 'home' && (
                <>
                  <section className="surface p-6">
                    <div className="text-sm font-semibold">Hero & branding</div>
                    <div className="text-xs text-[#6B6480]">Top of the homepage.</div>
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Brand name</Label>
                        <Input value={hero.brand} onChange={(e)=>{setHero({...hero, brand: e.target.value}); markDirty();}} className="mt-1.5 h-10" />
                      </div>
                      <div>
                        <Label>Headline (wrap highlight in *asterisks*)</Label>
                        <Input value={hero.headline} onChange={(e)=>{setHero({...hero, headline: e.target.value}); markDirty();}} className="mt-1.5 h-10" />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Sub-headline</Label>
                        <Textarea value={hero.sub} onChange={(e)=>{setHero({...hero, sub: e.target.value}); markDirty();}} className="mt-1.5" />
                      </div>
                    </div>
                  </section>
                  <section className="surface p-6">
                    <div className="text-sm font-semibold">Trust stats</div>
                    <div className="text-xs text-[#6B6480]">The four numbers on the purple band.</div>
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      {stats.map((s, i) => (
                        <div key={i} className="grid grid-cols-2 gap-3">
                          <Input value={s.value} onChange={(e)=>{const c=[...stats]; c[i]={...c[i], value: e.target.value}; setStats(c); markDirty();}} className="h-10" />
                          <Input value={s.label} onChange={(e)=>{const c=[...stats]; c[i]={...c[i], label: e.target.value}; setStats(c); markDirty();}} className="h-10" />
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {tab === 'baskets' && (
                <section className="surface p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Baskets</div>
                      <div className="text-xs text-[#6B6480]">Powers the home rail, Explore page, and each basket detail page.</div>
                    </div>
                    <button onClick={()=>{setBaskets([{id:`b_${Date.now()}`, name:'New basket', subtitle:'', managerId:'windmill', risk:'Low', strategy:'thematic', returns:{y3:0}, minAmount:1000, subscription:'Free', constituents:[]}, ...baskets]); markDirty();}} className="btn-outline"><Plus className="h-4 w-4" /> Add basket</button>
                  </div>
                  <div className="mt-4">
                    {baskets.map((b, i) => (
                      <Row key={b.id}>
                        <div className="h-9 w-9 rounded-lg grad-card text-white grid place-items-center text-xs font-bold">{b.name.slice(0,2).toUpperCase()}</div>
                        <div className="flex-1 grid md:grid-cols-3 gap-3">
                          <Input value={b.name} onChange={(e)=>{const c=[...baskets]; c[i]={...c[i], name: e.target.value}; setBaskets(c); markDirty();}} className="h-9" />
                          <Input value={b.subtitle} onChange={(e)=>{const c=[...baskets]; c[i]={...c[i], subtitle: e.target.value}; setBaskets(c); markDirty();}} className="h-9" placeholder="Subtitle" />
                          <div className="grid grid-cols-2 gap-2">
                            <Input value={b.minAmount} onChange={(e)=>{const c=[...baskets]; c[i]={...c[i], minAmount: Number(e.target.value)}; setBaskets(c); markDirty();}} className="h-9 num" placeholder="Min amount" />
                            <Input value={b.returns.y3} onChange={(e)=>{const c=[...baskets]; c[i]={...c[i], returns: {...c[i].returns, y3: Number(e.target.value)}}; setBaskets(c); markDirty();}} className="h-9 num" placeholder="3Y CAGR" />
                          </div>
                        </div>
                        <button onClick={()=>{setBaskets(baskets.filter((_,j)=>j!==i)); markDirty();}} className="h-8 w-8 grid place-items-center rounded-lg text-[#F04438] hover:bg-[#FEF3F2]"><Trash2 className="h-4 w-4" /></button>
                      </Row>
                    ))}
                  </div>
                </section>
              )}

              {tab === 'managers' && (
                <section className="surface p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Managers</div>
                      <div className="text-xs text-[#6B6480]">SEBI-registered basket managers.</div>
                    </div>
                    <button onClick={()=>{setManagers([{id:`m_${Date.now()}`, name:'New manager', logo:'NM', sebiReg:'', philosophy:'', description:'', subscribers:'0', baskets:0}, ...managers]); markDirty();}} className="btn-outline"><Plus className="h-4 w-4" /> Add manager</button>
                  </div>
                  <div className="mt-4">
                    {managers.map((m, i) => (
                      <Row key={m.id}>
                        <div className="h-9 w-9 rounded-lg grad-card text-white grid place-items-center text-xs font-bold">{m.logo}</div>
                        <div className="flex-1 grid md:grid-cols-3 gap-3">
                          <Input value={m.name} onChange={(e)=>{const c=[...managers]; c[i]={...c[i], name: e.target.value}; setManagers(c); markDirty();}} className="h-9" />
                          <Input value={m.sebiReg} onChange={(e)=>{const c=[...managers]; c[i]={...c[i], sebiReg: e.target.value}; setManagers(c); markDirty();}} className="h-9" placeholder="SEBI Reg" />
                          <Input value={m.philosophy} onChange={(e)=>{const c=[...managers]; c[i]={...c[i], philosophy: e.target.value}; setManagers(c); markDirty();}} className="h-9" placeholder="Philosophy" />
                        </div>
                        <button onClick={()=>{setManagers(managers.filter((_,j)=>j!==i)); markDirty();}} className="h-8 w-8 grid place-items-center rounded-lg text-[#F04438] hover:bg-[#FEF3F2]"><Trash2 className="h-4 w-4" /></button>
                      </Row>
                    ))}
                  </div>
                </section>
              )}

              {tab === 'collections' && (
                <section className="surface p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Collections</div>
                      <div className="text-xs text-[#6B6480]">Emoji + label tiles.</div>
                    </div>
                    <button onClick={()=>{setCollections([{id:`c_${Date.now()}`, slug:'new-collection', title:'New collection', type:'stock', description:'', icon:'Sparkles'}, ...collections]); markDirty();}} className="btn-outline"><Plus className="h-4 w-4" /> Add collection</button>
                  </div>
                  <div className="mt-4">
                    {collections.map((c, i) => (
                      <Row key={c.id}>
                        <div className="h-9 w-9 rounded-lg bg-[#F1E7FE] text-[#6C2BD9] grid place-items-center text-xs font-bold">{c.title.slice(0,2).toUpperCase()}</div>
                        <div className="flex-1 grid md:grid-cols-3 gap-3">
                          <Input value={c.title} onChange={(e)=>{const x=[...collections]; x[i]={...x[i], title: e.target.value}; setCollections(x); markDirty();}} className="h-9" />
                          <Input value={c.description} onChange={(e)=>{const x=[...collections]; x[i]={...x[i], description: e.target.value}; setCollections(x); markDirty();}} className="h-9" placeholder="Description" />
                          <Input value={c.type} onChange={(e)=>{const x=[...collections]; x[i]={...x[i], type: e.target.value}; setCollections(x); markDirty();}} className="h-9" placeholder="stock or mf" />
                        </div>
                        <button onClick={()=>{setCollections(collections.filter((_,j)=>j!==i)); markDirty();}} className="h-8 w-8 grid place-items-center rounded-lg text-[#F04438] hover:bg-[#FEF3F2]"><Trash2 className="h-4 w-4" /></button>
                      </Row>
                    ))}
                  </div>
                </section>
              )}

              {tab === 'mutual-funds' && (
                <section className="surface p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Mutual funds</div>
                      <div className="text-xs text-[#6B6480]">Shown on the Mutual Funds page.</div>
                    </div>
                    <button onClick={()=>{setFunds([{id:`f_${Date.now()}`, name:'New fund', category:'equity', amc:'', nav:0, returns:{y1:0,y3:0,y5:0}, expenseRatio:0}, ...funds]); markDirty();}} className="btn-outline"><Plus className="h-4 w-4" /> Add fund</button>
                  </div>
                  <div className="mt-4">
                    {funds.map((f, i) => (
                      <Row key={f.id}>
                        <div className="flex-1 grid md:grid-cols-3 gap-3">
                          <Input value={f.name} onChange={(e)=>{const x=[...funds]; x[i]={...x[i], name: e.target.value}; setFunds(x); markDirty();}} className="h-9" />
                          <Input value={f.amc} onChange={(e)=>{const x=[...funds]; x[i]={...x[i], amc: e.target.value}; setFunds(x); markDirty();}} className="h-9" placeholder="AMC" />
                          <div className="grid grid-cols-2 gap-2">
                            <Input value={f.nav} onChange={(e)=>{const x=[...funds]; x[i]={...x[i], nav: Number(e.target.value)}; setFunds(x); markDirty();}} className="h-9 num" placeholder="NAV" />
                            <Input value={f.expenseRatio} onChange={(e)=>{const x=[...funds]; x[i]={...x[i], expenseRatio: Number(e.target.value)}; setFunds(x); markDirty();}} className="h-9 num" placeholder="Expense" />
                          </div>
                        </div>
                        <button onClick={()=>{setFunds(funds.filter((_,j)=>j!==i)); markDirty();}} className="h-8 w-8 grid place-items-center rounded-lg text-[#F04438] hover:bg-[#FEF3F2]"><Trash2 className="h-4 w-4" /></button>
                      </Row>
                    ))}
                  </div>
                </section>
              )}

              {tab === 'testimonials' && (
                <section className="surface p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Testimonials</div>
                    </div>
                    <button onClick={()=>{setTestimonials([{name:'New', initial:'N', tag:'Investor', quote:''}, ...testimonials]); markDirty();}} className="btn-outline"><Plus className="h-4 w-4" /> Add testimonial</button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {testimonials.map((t, i) => (
                      <div key={i} className="grid md:grid-cols-3 gap-3 items-start pb-3 border-b border-[#F1E7FE] last:border-0">
                        <Input value={t.name} onChange={(e)=>{const x=[...testimonials]; x[i]={...x[i], name: e.target.value, initial: e.target.value.charAt(0)}; setTestimonials(x); markDirty();}} className="h-9" placeholder="Name" />
                        <Input value={t.tag} onChange={(e)=>{const x=[...testimonials]; x[i]={...x[i], tag: e.target.value}; setTestimonials(x); markDirty();}} className="h-9" placeholder="Tag" />
                        <div className="flex gap-2">
                          <Textarea value={t.quote} onChange={(e)=>{const x=[...testimonials]; x[i]={...x[i], quote: e.target.value}; setTestimonials(x); markDirty();}} className="min-h-[36px]" placeholder="Quote" />
                          <button onClick={()=>{setTestimonials(testimonials.filter((_,j)=>j!==i)); markDirty();}} className="h-8 w-8 grid place-items-center rounded-lg text-[#F04438] hover:bg-[#FEF3F2] shrink-0"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {tab === 'faqs' && (
                <section className="surface p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">FAQ</div>
                    </div>
                    <button onClick={()=>{setFaqs([{q:'New question', a:''}, ...faqs]); markDirty();}} className="btn-outline"><Plus className="h-4 w-4" /> Add question</button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {faqs.map((f, i) => (
                      <div key={i} className="pb-3 border-b border-[#F1E7FE] last:border-0 grid md:grid-cols-2 gap-3">
                        <Input value={f.q} onChange={(e)=>{const x=[...faqs]; x[i]={...x[i], q: e.target.value}; setFaqs(x); markDirty();}} className="h-9" placeholder="Question" />
                        <div className="flex gap-2">
                          <Textarea value={f.a} onChange={(e)=>{const x=[...faqs]; x[i]={...x[i], a: e.target.value}; setFaqs(x); markDirty();}} className="min-h-[36px]" placeholder="Answer" />
                          <button onClick={()=>{setFaqs(faqs.filter((_,j)=>j!==i)); markDirty();}} className="h-8 w-8 grid place-items-center rounded-lg text-[#F04438] hover:bg-[#FEF3F2] shrink-0"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {tab === 'fds' && <EmptyState title="Manage fixed deposits" desc="Add providers, rates, and tenures shown on the FD page." onAdd={()=>{toast.success('New FD row added (mock)'); markDirty();}} />}
              {tab === 'settings' && (
                <section className="surface p-6 space-y-4">
                  <div className="text-sm font-semibold">Site settings</div>
                  <div>
                    <Label>Legal disclaimer</Label>
                    <Textarea defaultValue="Investments in securities are subject to market risks..." className="mt-1.5" onChange={markDirty} />
                  </div>
                  <div>
                    <Label>Contact email</Label>
                    <Input defaultValue="hello@basketly.demo" className="mt-1.5 h-10" onChange={markDirty} />
                  </div>
                </section>
              )}
            </div>

            <div className="mt-8 text-xs text-[#6B6480]">Changes are staged until you publish.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
