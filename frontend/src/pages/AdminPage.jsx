import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AnalystConsole from '../components/AnalystConsole';
import { baskets as seedBaskets, managers as seedManagers, collections as seedCollections, mutualFunds as seedMF, testimonials as seedT, faqs as seedFaqs } from '../mock';
import { Sparkles, LayoutGrid, Users, Package, LineChart, Landmark, MessageSquare, HelpCircle, Settings, Plus, Trash2, ExternalLink, LogOut, Inbox, ClipboardCheck } from 'lucide-react';
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
  { key: 'leads', label: 'Leads', icon: Inbox },
  { key: 'listings', label: 'Listings (approve)', icon: ClipboardCheck },
  { key: 'settings', label: 'Site settings', icon: Settings },
];

const LEADS_API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CONTENT_DEFAULTS = {
  hero: { headline: 'Challenging', highlight: 'volatility', sub: 'Money at work — expert-managed model portfolios, alternative investment funds and SEBI-registered advisory, all in one place.', primaryCta: 'Get started', secondaryCta: 'Explore portfolios' },
  stats: { rating: '4.6/5', investors: '1 lakh+', managed: '₹100 Cr+' },
  trust: [
    { title: 'No new accounts', text: 'Hold your stocks & ETFs in your existing demat account — no separate account needed.' },
    { title: 'Invest without lock-ins', text: 'Exit your investments whenever you like.' },
    { title: 'Secure by design', text: 'Financial-grade security with encryption in transit and at rest.' },
    { title: 'Regulated products only', text: 'Products & services regulated by SEBI & RBI.' },
  ],
  testimonials: [
    { name: 'Saurabh', tag: 'Reviewed on Play Store', quote: 'One of the best finance products in recent times.' },
    { name: 'Nithin', tag: 'Posted on X', quote: 'The best investment-tech experience I’ve used in India today.' },
    { name: 'Asma', tag: 'Reviewed on Play Store', quote: 'Best app for investing with multiple choices of portfolios.' },
    { name: 'Tanmay', tag: 'Posted on X', quote: 'Fallen in love with Basketly — such a smooth product.' },
    { name: 'Ravi', tag: 'Reviewed on Play Store', quote: 'A smart app blending tech and finance.' },
    { name: 'Jonathan', tag: 'Reviewed on App Store', quote: 'Excellent platform for beginners.' },
  ],
};

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

  const { user, token, isAuthed, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const [content, setContent] = useState(CONTENT_DEFAULTS);
  const [baskets, setBaskets] = useState(seedBaskets);
  const [managers, setManagers] = useState(seedManagers);
  const [collections, setCollections] = useState(seedCollections);
  const [funds, setFunds] = useState(seedMF);
  const [testimonials, setTestimonials] = useState(seedT);
  const [faqs, setFaqs] = useState(seedFaqs);

  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const { data } = await axios.get(`${LEADS_API}/leads`);
      setLeads(data.leads || []);
    } catch {
      toast.error('Could not load leads');
    } finally {
      setLeadsLoading(false);
    }
  };
  useEffect(() => {
    if (tab === 'leads') fetchLeads();
  }, [tab]);

  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const fetchListings = async () => {
    setListingsLoading(true);
    try {
      const { data } = await axios.get(`${LEADS_API}/admin/portfolios`, { headers: { Authorization: `Bearer ${token}` } });
      setListings(data.portfolios || []);
    } catch { toast.error('Could not load listings'); }
    finally { setListingsLoading(false); }
  };
  useEffect(() => {
    if (tab === 'listings') fetchListings();
  }, [tab]);
  const reviewListing = async (id, action) => {
    try {
      await axios.post(`${LEADS_API}/admin/portfolios/${id}/review`, { action, note: '' }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(action === 'approve' ? 'Approved — now live on the site' : 'Rejected');
      fetchListings();
    } catch (e) { toast.error(e?.response?.data?.detail || 'Could not update'); }
  };

  useEffect(() => {
    axios.get(`${LEADS_API}/content`).then(({ data }) => {
      if (data) setContent({ ...CONTENT_DEFAULTS, ...data });
    }).catch(() => {});
  }, []);

  const markDirty = () => setDirty(true);
  const patchContent = (section, value) => { setContent((c) => ({ ...c, [section]: value })); markDirty(); };

  const publish = async () => {
    try {
      await axios.put(`${LEADS_API}/content`, {
        hero: content.hero, stats: content.stats, trust: content.trust, testimonials: content.testimonials,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Published', { description: 'Home page content is now live on the site.' });
      setDirty(false);
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Could not publish. Are you logged in as an admin?');
    }
  };
  const discard = async () => {
    try {
      const { data } = await axios.get(`${LEADS_API}/content`);
      setContent({ ...CONTENT_DEFAULTS, ...data });
    } catch { /* noop */ }
    toast.info('Changes discarded');
    setDirty(false);
  };

  if (authLoading) {
    return <div className="min-h-screen grid place-items-center text-[#6B6480]">Loading console…</div>;
  }
  if (!isAuthed) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#F7F4FB] p-6">
        <div className="surface p-8 text-center max-w-sm">
          <span className="h-12 w-12 mx-auto rounded-xl grad-card text-white grid place-items-center"><Sparkles className="h-5 w-5" /></span>
          <h1 className="mt-4 text-xl font-bold">Owner console</h1>
          <p className="mt-2 text-sm text-[#6B6480]">Please log in with an admin account to manage the site.</p>
          <button onClick={() => navigate('/login?next=/admin')} className="btn-primary mt-5 w-full">Log in</button>
        </div>
      </div>
    );
  }
  if (!isAdmin) {
    if (user.role === 'analyst') {
      return <AnalystConsole />;
    }
    return (
      <div className="min-h-screen grid place-items-center bg-[#F7F4FB] p-6">
        <div className="surface p-8 text-center max-w-sm">
          <h1 className="text-xl font-bold">No console access</h1>
          <p className="mt-2 text-sm text-[#6B6480]">Hi {user.name}. This area is for platform admins and research analysts.</p>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-outline mt-5 w-full">Sign out</button>
        </div>
      </div>
    );
  }

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
            <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost inline-flex items-center gap-1 text-xs"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
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
                <div className="space-y-6">
                  <section className="surface p-6">
                    <div className="text-sm font-semibold">Hero</div>
                    <div className="text-xs text-[#6B6480]">The top of the homepage.</div>
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <div><Label>Headline</Label><Input value={content.hero.headline} onChange={(e)=>patchContent('hero',{...content.hero, headline:e.target.value})} className="mt-1.5 h-10" /></div>
                      <div><Label>Highlighted word</Label><Input value={content.hero.highlight} onChange={(e)=>patchContent('hero',{...content.hero, highlight:e.target.value})} className="mt-1.5 h-10" /></div>
                      <div className="md:col-span-2"><Label>Sub-headline</Label><Textarea value={content.hero.sub} onChange={(e)=>patchContent('hero',{...content.hero, sub:e.target.value})} className="mt-1.5" /></div>
                      <div><Label>Primary button</Label><Input value={content.hero.primaryCta} onChange={(e)=>patchContent('hero',{...content.hero, primaryCta:e.target.value})} className="mt-1.5 h-10" /></div>
                      <div><Label>Secondary button</Label><Input value={content.hero.secondaryCta} onChange={(e)=>patchContent('hero',{...content.hero, secondaryCta:e.target.value})} className="mt-1.5 h-10" /></div>
                    </div>
                  </section>

                  <section className="surface p-6">
                    <div className="text-sm font-semibold">Rating stats</div>
                    <div className="text-xs text-[#6B6480]">Shown just under the hero buttons.</div>
                    <div className="mt-4 grid md:grid-cols-3 gap-4">
                      <div><Label>Rating</Label><Input value={content.stats.rating} onChange={(e)=>patchContent('stats',{...content.stats, rating:e.target.value})} className="mt-1.5 h-10" /></div>
                      <div><Label>Investors</Label><Input value={content.stats.investors} onChange={(e)=>patchContent('stats',{...content.stats, investors:e.target.value})} className="mt-1.5 h-10" /></div>
                      <div><Label>Managed</Label><Input value={content.stats.managed} onChange={(e)=>patchContent('stats',{...content.stats, managed:e.target.value})} className="mt-1.5 h-10" /></div>
                    </div>
                  </section>

                  <section className="surface p-6">
                    <div className="text-sm font-semibold">Trust points</div>
                    <div className="text-xs text-[#6B6480]">The four cards in the dark “Trust” section.</div>
                    <div className="mt-4 space-y-3">
                      {content.trust.map((t, i) => (
                        <div key={i} className="grid md:grid-cols-[1fr_2fr] gap-3">
                          <Input value={t.title} onChange={(e)=>{const a=[...content.trust]; a[i]={...a[i], title:e.target.value}; patchContent('trust', a);}} className="h-10" placeholder="Title" />
                          <Input value={t.text} onChange={(e)=>{const a=[...content.trust]; a[i]={...a[i], text:e.target.value}; patchContent('trust', a);}} className="h-10" placeholder="Description" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="surface p-6">
                    <div className="flex items-center justify-between">
                      <div><div className="text-sm font-semibold">Testimonials</div><div className="text-xs text-[#6B6480]">The “Loved by investors” cards.</div></div>
                      <button onClick={()=>patchContent('testimonials',[...content.testimonials,{name:'New reviewer', tag:'', quote:''}])} className="btn-outline"><Plus className="h-4 w-4" /> Add</button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {content.testimonials.map((t, i) => (
                        <div key={i} className="flex items-start gap-3 border-b border-[#F1E7FE] pb-3 last:border-0">
                          <div className="flex-1 grid md:grid-cols-2 gap-3">
                            <Input value={t.name} onChange={(e)=>{const a=[...content.testimonials]; a[i]={...a[i], name:e.target.value}; patchContent('testimonials', a);}} className="h-9" placeholder="Name" />
                            <Input value={t.tag} onChange={(e)=>{const a=[...content.testimonials]; a[i]={...a[i], tag:e.target.value}; patchContent('testimonials', a);}} className="h-9" placeholder="Source (e.g. Posted on X)" />
                            <Textarea value={t.quote} onChange={(e)=>{const a=[...content.testimonials]; a[i]={...a[i], quote:e.target.value}; patchContent('testimonials', a);}} className="md:col-span-2" placeholder="Quote" />
                          </div>
                          <button onClick={()=>patchContent('testimonials', content.testimonials.filter((_,j)=>j!==i))} className="h-8 w-8 grid place-items-center rounded-lg text-[#F04438] hover:bg-[#FEF3F2]"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {tab === 'leads' && (
                <section className="surface p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Leads</div>
                      <div className="text-xs text-[#6B6480]">People who registered interest via the AIF &amp; Advisory pages.</div>
                    </div>
                    <button onClick={fetchLeads} className="btn-outline">Refresh</button>
                  </div>
                  {leadsLoading ? (
                    <div className="mt-6 text-sm text-[#6B6480]">Loading leads…</div>
                  ) : leads.length === 0 ? (
                    <div className="mt-6 text-sm text-[#6B6480]">No leads yet. Submit the form on the AIF or Advisory page to see it here.</div>
                  ) : (
                    <div className="mt-4 overflow-hidden rounded-xl border border-[#E8E1F0]">
                      <table className="w-full text-sm">
                        <thead className="bg-[#F7F4FB] text-[#6B6480]"><tr className="text-left">
                          <th className="px-4 py-3 font-medium">Type</th>
                          <th className="px-4 py-3 font-medium">Email</th>
                          <th className="px-4 py-3 font-medium">Plan</th>
                          <th className="px-4 py-3 font-medium">Received</th>
                        </tr></thead>
                        <tbody>
                          {leads.map((l) => (
                            <tr key={l.id} className="border-t border-[#F1E7FE]">
                              <td className="px-4 py-3"><span className={l.type === 'aif' ? 'chip-brand' : 'chip-accent'}>{l.type.toUpperCase()}</span></td>
                              <td className="px-4 py-3 font-medium text-[#1A1030]">{l.email}</td>
                              <td className="px-4 py-3 text-[#6B6480]">{l.plan || '—'}</td>
                              <td className="px-4 py-3 text-[#6B6480]">{new Date(l.created_at).toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}

              {tab === 'listings' && (
                <section className="surface p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Research-analyst listings</div>
                      <div className="text-xs text-[#6B6480]">Approve submissions to publish them on the public Model Portfolio pages.</div>
                    </div>
                    <button onClick={fetchListings} className="btn-outline">Refresh</button>
                  </div>
                  {listingsLoading ? (
                    <div className="mt-6 text-sm text-[#6B6480]">Loading…</div>
                  ) : listings.length === 0 ? (
                    <div className="mt-6 text-sm text-[#6B6480]">No analyst submissions yet.</div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {listings.map((p) => (
                        <div key={p.id} className="border border-[#E8E1F0] rounded-xl p-4 flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#1A1030] truncate">{p.name}</span>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.status === 'approved' ? 'bg-[#DCFCE7] text-[#0E9F5E]' : p.status === 'pending' ? 'bg-[#FEF3C7] text-[#B45309]' : p.status === 'rejected' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#F1F1F4] text-[#6B6480]'}`}>{p.status}</span>
                            </div>
                            <div className="text-xs text-[#6B6480] mt-0.5">by {p.owner_name || '—'} · {p.subtitle || 'No subtitle'} · {p.constituents?.length || 0} holdings · min ₹{Number(p.minAmount).toLocaleString('en-IN')} · {p.strategy}</div>
                            <div className="text-xs text-[#6B6480] mt-1 line-clamp-2">{p.methodology || 'No methodology provided.'}</div>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            <button type="button" onClick={() => reviewListing(p.id, 'approve')} disabled={p.status === 'approved'} className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#12B76A] text-white text-xs font-semibold px-4 py-2 hover:bg-[#0E9F5E] disabled:opacity-40">Approve</button>
                            <button type="button" onClick={() => reviewListing(p.id, 'reject')} disabled={p.status === 'rejected'} className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#E8E1F0] text-[#DC2626] text-xs font-semibold px-4 py-2 hover:bg-[#FEF2F2] disabled:opacity-40">Reject</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
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
