import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, Trash2, Save, Send, ArrowLeft, Pencil, LogOut, LineChart, Upload, FileText } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BLANK = {
  name: '', subtitle: '', strategy: 'thematic', risk: 'Medium', minAmount: 5000,
  subscription: 'Free', feeAmount: 0, feeCycle: 'monthly', methodology: '', rebalanceFreq: 'Quarterly',
  constituents: [{ symbol: '', name: '', type: 'Stock', weight: 0 }],
  returns: { cagr: 0, y1: 0, y3: 0, y5: 0 },
  factsheet: { objective: '', whoShouldInvest: '', riskFactors: '', pdfName: '' },
  factsheet_pdf: null,
};

const STATUS_STYLES = {
  draft: 'bg-[#F1F1F4] text-[#6B6480]',
  pending: 'bg-[#FEF3C7] text-[#B45309]',
  approved: 'bg-[#DCFCE7] text-[#0E9F5E]',
  rejected: 'bg-[#FEE2E2] text-[#DC2626]',
};

export default function AnalystConsole() {
  const { user, token, logout } = useAuth();
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const [view, setView] = useState('list'); // list | form | profile
  const [portfolios, setPortfolios] = useState([]);
  const [profile, setProfile] = useState({ displayName: user?.name || '', sebiReg: '', philosophy: '', description: '', logo: '' });
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, pr] = await Promise.all([
        axios.get(`${API}/analyst/portfolios`, auth),
        axios.get(`${API}/analyst/profile`, auth),
      ]);
      setPortfolios(p.data.portfolios || []);
      if (pr.data.profile) setProfile(pr.data.profile);
    } catch {
      toast.error('Could not load your listings');
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const saveProfile = async () => {
    setBusy(true);
    try {
      await axios.put(`${API}/analyst/profile`, profile, auth);
      toast.success('Profile saved');
      setView('list');
    } catch { toast.error('Could not save profile'); } finally { setBusy(false); }
  };

  const startNew = () => { setForm(BLANK); setEditingId(null); setView('form'); };
  const startEdit = (p) => {
    setForm({ ...BLANK, ...p, returns: { ...BLANK.returns, ...(p.returns || {}) }, factsheet: { ...BLANK.factsheet, ...(p.factsheet || {}) }, constituents: p.constituents?.length ? p.constituents : BLANK.constituents });
    setEditingId(p.id);
    setView('form');
  };

  const saveForm = async () => {
    if (!form.name.trim()) { toast.error('Please give the portfolio a name'); return; }
    setBusy(true);
    const payload = { ...form, minAmount: Number(form.minAmount) || 0, feeAmount: Number(form.feeAmount) || 0,
      returns: { cagr: Number(form.returns.cagr) || 0, y1: Number(form.returns.y1) || 0, y3: Number(form.returns.y3) || 0, y5: Number(form.returns.y5) || 0 },
      constituents: form.constituents.map((c) => ({ ...c, weight: Number(c.weight) || 0 })) };
    try {
      let saved;
      if (editingId) {
        const { data } = await axios.put(`${API}/analyst/portfolios/${editingId}`, payload, auth);
        saved = data.portfolio;
      } else {
        const { data } = await axios.post(`${API}/analyst/portfolios`, payload, auth);
        saved = data.portfolio;
        setEditingId(saved.id);
      }
      toast.success('Saved as draft');
      await load();
      return saved;
    } catch (e) { toast.error(e?.response?.data?.detail || 'Could not save'); }
    finally { setBusy(false); }
  };

  const submitForReview = async (id) => {
    try {
      await axios.post(`${API}/analyst/portfolios/${id}/submit`, {}, auth);
      toast.success('Submitted for admin approval');
      await load();
    } catch { toast.error('Could not submit'); }
  };

  const saveAndSubmit = async () => {
    const saved = await saveForm();
    const id = editingId || saved?.id;
    if (id) { await submitForReview(id); setView('list'); }
  };

  const remove = async (id) => {
    try { await axios.delete(`${API}/analyst/portfolios/${id}`, auth); toast.success('Deleted'); await load(); }
    catch { toast.error('Could not delete'); }
  };

  const onFactsheetPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please choose a PDF file'); return;
    }
    let id = editingId;
    if (!id) { const saved = await saveForm(); id = saved?.id; if (!id) return; }
    setUploadingPdf(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await axios.post(`${API}/analyst/portfolios/${id}/factsheet`, fd, auth);
      setForm((f) => ({ ...f, factsheet_pdf: data.factsheet_pdf }));
      toast.success('Factsheet PDF uploaded');
      await load();
    } catch (err) { toast.error(err?.response?.data?.detail || 'Upload failed'); }
    finally { setUploadingPdf(false); }
  };

  const removeFactsheet = async () => {
    if (!editingId) { setForm((f) => ({ ...f, factsheet_pdf: null })); return; }
    try {
      await axios.delete(`${API}/analyst/portfolios/${editingId}/factsheet`, auth);
      setForm((f) => ({ ...f, factsheet_pdf: null }));
      toast.success('Factsheet removed');
      await load();
    } catch { toast.error('Could not remove'); }
  };

  const setC = (i, key, val) => setForm((f) => { const a = [...f.constituents]; a[i] = { ...a[i], [key]: val }; return { ...f, constituents: a }; });
  const totalWeight = form.constituents.reduce((s, c) => s + (Number(c.weight) || 0), 0);

  return (
    <div className="min-h-screen bg-[#F7F4FB]">
      <header className="sticky top-0 z-30 bg-white border-b border-[#E8E1F0]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg grad-card text-white grid place-items-center"><LineChart className="h-4 w-4" /></span>
            <div><div className="font-[Space_Grotesk] font-bold leading-none">Basketly</div><div className="text-[10px] uppercase tracking-widest text-[#6B6480]">Analyst console</div></div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[#6B6480] hidden sm:inline">{user?.name}</span>
            <button onClick={() => setView('profile')} className="btn-ghost text-xs">My profile</button>
            <button onClick={logout} className="btn-ghost text-xs"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* PROFILE */}
        {view === 'profile' && (
          <div className="surface p-6 max-w-2xl">
            <button onClick={() => setView('list')} className="btn-ghost text-xs mb-3"><ArrowLeft className="h-3.5 w-3.5" /> Back</button>
            <h2 className="text-lg font-semibold">My profile</h2>
            <p className="text-xs text-[#6B6480]">This is shown as the manager on your portfolio pages.</p>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div><Label>Display name</Label><Input value={profile.displayName} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} className="mt-1.5 h-10" /></div>
              <div><Label>SEBI Reg. no.</Label><Input value={profile.sebiReg} onChange={(e) => setProfile({ ...profile, sebiReg: e.target.value })} className="mt-1.5 h-10" placeholder="INH000000000" /></div>
              <div><Label>Logo initials</Label><Input value={profile.logo} onChange={(e) => setProfile({ ...profile, logo: e.target.value.slice(0, 3) })} className="mt-1.5 h-10" placeholder="AB" /></div>
              <div><Label>Philosophy (one line)</Label><Input value={profile.philosophy} onChange={(e) => setProfile({ ...profile, philosophy: e.target.value })} className="mt-1.5 h-10" /></div>
              <div className="md:col-span-2"><Label>About you</Label><Textarea value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} className="mt-1.5" /></div>
            </div>
            <button onClick={saveProfile} disabled={busy} className="btn-primary mt-5"><Save className="h-4 w-4" /> Save profile</button>
          </div>
        )}

        {/* LIST */}
        {view === 'list' && (
          <>
            <div className="flex items-center justify-between">
              <div><h1 className="text-2xl font-bold">My model portfolios</h1><p className="text-sm text-[#6B6480]">Create listings, then submit them for admin approval to go live.</p></div>
              <button onClick={startNew} className="btn-primary"><Plus className="h-4 w-4" /> New portfolio</button>
            </div>
            <div className="mt-6 space-y-3">
              {portfolios.length === 0 && <div className="surface p-10 text-center text-[#6B6480]">No portfolios yet. Click “New portfolio” to create your first listing.</div>}
              {portfolios.map((p) => (
                <div key={p.id} className="surface p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#1A1030] truncate">{p.name}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_STYLES[p.status] || STATUS_STYLES.draft}`}>{p.status}</span>
                    </div>
                    <div className="text-xs text-[#6B6480] truncate">{p.subtitle || '—'} · {p.constituents?.length || 0} holdings · min ₹{Number(p.minAmount).toLocaleString('en-IN')}</div>
                    {p.status === 'rejected' && p.review_note && <div className="text-xs text-[#DC2626] mt-1">Admin note: {p.review_note}</div>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {(p.status === 'draft' || p.status === 'rejected') && <button onClick={() => submitForReview(p.id)} className="btn-outline text-xs"><Send className="h-3.5 w-3.5" /> Submit</button>}
                    <button onClick={() => startEdit(p)} className="btn-ghost text-xs"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                    <button onClick={() => remove(p.id)} className="h-8 w-8 grid place-items-center rounded-lg text-[#DC2626] hover:bg-[#FEF2F2]"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* FORM */}
        {view === 'form' && (
          <div className="max-w-3xl">
            <button onClick={() => setView('list')} className="btn-ghost text-xs mb-3"><ArrowLeft className="h-3.5 w-3.5" /> Back to list</button>
            <h1 className="text-2xl font-bold">{editingId ? 'Edit portfolio' : 'New portfolio'}</h1>

            <section className="surface p-6 mt-5">
              <div className="text-sm font-semibold mb-3">Basics</div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 h-10" /></div>
                <div><Label>One-line subtitle</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="mt-1.5 h-10" /></div>
                <div><Label>Strategy</Label>
                  <select value={form.strategy} onChange={(e) => setForm({ ...form, strategy: e.target.value })} className="mt-1.5 h-10 w-full rounded-lg border border-[#E8E1F0] px-3 text-sm">
                    {['asset-allocation', 'sectoral', 'thematic', 'smart-beta', 'model-based'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><Label>Risk / volatility</Label>
                  <select value={form.risk} onChange={(e) => setForm({ ...form, risk: e.target.value })} className="mt-1.5 h-10 w-full rounded-lg border border-[#E8E1F0] px-3 text-sm">
                    {['Low', 'Medium', 'High'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><Label>Min. investment (₹)</Label><Input type="number" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} className="mt-1.5 h-10" /></div>
                <div><Label>Rebalance frequency</Label>
                  <select value={form.rebalanceFreq} onChange={(e) => setForm({ ...form, rebalanceFreq: e.target.value })} className="mt-1.5 h-10 w-full rounded-lg border border-[#E8E1F0] px-3 text-sm">
                    {['Monthly', 'Quarterly', 'Half-yearly', 'Yearly'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><Label>Subscription</Label>
                  <select value={form.subscription} onChange={(e) => setForm({ ...form, subscription: e.target.value })} className="mt-1.5 h-10 w-full rounded-lg border border-[#E8E1F0] px-3 text-sm">
                    {['Free', 'Paid'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {form.subscription === 'Paid' && <div><Label>Fee (₹ / {form.feeCycle})</Label><Input type="number" value={form.feeAmount} onChange={(e) => setForm({ ...form, feeAmount: e.target.value })} className="mt-1.5 h-10" /></div>}
              </div>
            </section>

            <section className="surface p-6 mt-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-semibold">Constituents & weights</div>
                <span className={`text-xs font-semibold ${Math.round(totalWeight) === 100 ? 'text-[#0E9F5E]' : 'text-[#B45309]'}`}>Total: {totalWeight}%</span>
              </div>
              <div className="space-y-2 mt-2">
                {form.constituents.map((c, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1.4fr_0.9fr_0.7fr_auto] gap-2 items-center">
                    <Input value={c.symbol} onChange={(e) => setC(i, 'symbol', e.target.value)} className="h-9" placeholder="Symbol" />
                    <Input value={c.name} onChange={(e) => setC(i, 'name', e.target.value)} className="h-9" placeholder="Name" />
                    <select value={c.type} onChange={(e) => setC(i, 'type', e.target.value)} className="h-9 rounded-lg border border-[#E8E1F0] px-2 text-sm"><option>Stock</option><option>ETF</option></select>
                    <Input type="number" value={c.weight} onChange={(e) => setC(i, 'weight', e.target.value)} className="h-9" placeholder="Wt%" />
                    <button onClick={() => setForm({ ...form, constituents: form.constituents.filter((_, j) => j !== i) })} className="h-8 w-8 grid place-items-center rounded-lg text-[#DC2626] hover:bg-[#FEF2F2]"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => setForm({ ...form, constituents: [...form.constituents, { symbol: '', name: '', type: 'Stock', weight: 0 }] })} className="btn-outline text-xs mt-3"><Plus className="h-3.5 w-3.5" /> Add constituent</button>
            </section>

            <section className="surface p-6 mt-4">
              <div className="text-sm font-semibold mb-3">Returns (%)</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['cagr', 'y1', 'y3', 'y5'].map((k) => (
                  <div key={k}><Label>{k === 'cagr' ? 'CAGR' : k.toUpperCase()}</Label><Input type="number" value={form.returns[k]} onChange={(e) => setForm({ ...form, returns: { ...form.returns, [k]: e.target.value } })} className="mt-1.5 h-10" /></div>
                ))}
              </div>
            </section>

            <section className="surface p-6 mt-4">
              <div className="text-sm font-semibold mb-3">Methodology & factsheet</div>
              <div className="space-y-4">
                <div><Label>Methodology</Label><Textarea value={form.methodology} onChange={(e) => setForm({ ...form, methodology: e.target.value })} className="mt-1.5" placeholder="How is this portfolio built and rebalanced?" /></div>
                <div><Label>Factsheet — objective</Label><Textarea value={form.factsheet.objective} onChange={(e) => setForm({ ...form, factsheet: { ...form.factsheet, objective: e.target.value } })} className="mt-1.5" /></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>Who should invest</Label><Textarea value={form.factsheet.whoShouldInvest} onChange={(e) => setForm({ ...form, factsheet: { ...form.factsheet, whoShouldInvest: e.target.value } })} className="mt-1.5" /></div>
                  <div><Label>Risk factors</Label><Textarea value={form.factsheet.riskFactors} onChange={(e) => setForm({ ...form, factsheet: { ...form.factsheet, riskFactors: e.target.value } })} className="mt-1.5" /></div>
                </div>
                <div>
                  <Label>Factsheet PDF</Label>
                  {form.factsheet_pdf ? (
                    <div data-testid="factsheet-pdf-row" className="mt-1.5 flex items-center justify-between gap-3 rounded-xl border border-[#E8E1F0] bg-white px-3 py-2.5">
                      <a data-testid="factsheet-pdf-link" href={`${API}/portfolios/${editingId}/factsheet?auth=${token}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-[#5320A8] hover:underline min-w-0">
                        <FileText className="h-4 w-4 shrink-0" /> <span className="truncate">{form.factsheet_pdf.filename}</span>
                      </a>
                      <button type="button" data-testid="factsheet-pdf-remove" onClick={removeFactsheet} className="h-8 w-8 grid place-items-center rounded-lg text-[#DC2626] hover:bg-[#FEF2F2] shrink-0"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <label data-testid="factsheet-pdf-upload" className="mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-[#D8C7F1] bg-[#F7F4FB] px-3 py-3 text-sm text-[#5320A8] cursor-pointer hover:bg-[#F1E7FE] transition-colors w-fit">
                      <Upload className="h-4 w-4" /> {uploadingPdf ? 'Uploading…' : 'Upload factsheet PDF'}
                      <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={onFactsheetPick} disabled={uploadingPdf} />
                    </label>
                  )}
                  <div className="mt-1.5 text-xs text-[#6B6480]">Investors can download this PDF from your live portfolio page. Max 10 MB.</div>
                </div>
              </div>
            </section>

            <div className="sticky bottom-0 bg-[#F7F4FB] py-4 mt-2 flex items-center gap-3">
              <button onClick={saveForm} disabled={busy} className="btn-outline"><Save className="h-4 w-4" /> Save draft</button>
              <button onClick={saveAndSubmit} disabled={busy} className="btn-primary"><Send className="h-4 w-4" /> Save & submit for approval</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
