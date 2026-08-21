import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="bk-home">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <h1>Challenging <span className="accent">volatility</span></h1>
          <p className="lead">Money at work — expert-managed model portfolios, alternative investment funds and SEBI-registered advisory, all in one place.</p>
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary">Get started →</Link>
            <Link to="/model-portfolios" className="btn btn-outline">▢ Explore portfolios</Link>
          </div>
          <div className="ratings">
            <span>Rated <b>4.6/5</b></span>
            <span><b>1 lakh+</b> investors</span>
            <span><b>₹100 Cr+</b> managed</span>
          </div>
          <div className="stage">
            <div className="pedestal l"></div><div className="pedestal r"></div>
            <div className="coin l">₹</div><div className="coin r">₹</div>
            <div className="h-phone"><div className="h-screen">
              <div className="tag">MODEL PORTFOLIO</div>
              <div className="logo-c grad">✦</div>
              <h4>All Weather Portfolio</h4>
              <div className="st">Steady multi-asset mix</div>
              <div className="ret">3Y CAGR · +18.4%</div>
              <div className="pill">Low risk · Rebalanced quarterly</div>
              <div className="rows">
                <div className="rw"><span>Nifty BeES</span><b>34%</b></div><div className="h-bar"><i style={{ width: '34%' }}></i></div>
                <div className="rw"><span>Liquid BeES</span><b>28%</b></div><div className="h-bar"><i style={{ width: '28%' }}></i></div>
                <div className="rw"><span>Gold BeES</span><b>22%</b></div><div className="h-bar"><i style={{ width: '22%' }}></i></div>
              </div>
            </div></div>
            <div className="grass"></div>
          </div>
        </div>
      </section>

      {/* BAND */}
      <section className="band">
        <div className="container"><h2>Everything for your money,<br /><span className="accent">at one place</span></h2></div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="hiw-head">
          <div className="e">How it works</div>
          <h2>Daily investing,<br /><span className="accent">made easy</span></h2>
        </div>
        <div className="hiw-stack">

          <div className="hiw-card c0" style={{ '--i': 0 }}>
            <div className="hiw-strip"><span className="n">1</span> Model Portfolio</div>
            <div className="hiw-body">
              <div className="hiw-copy">
                <div className="k">Model Portfolio</div>
                <h3>Curated portfolios that rebalance for you</h3>
                <ul>
                  <li>Ready-made baskets of stocks &amp; ETFs around themes and strategies</li>
                  <li>Professionally managed and rebalanced on a fixed schedule</li>
                  <li>Full methodology, holdings &amp; weights — transparent by design</li>
                </ul>
                <Link to="/model-portfolios" className="hiw-btn">Explore portfolios →</Link>
              </div>
              <div className="hiw-visual"><div className="hiw-phone"><div className="hiw-screen">
                <div className="hiw-stop"><span>Basketly</span><span>All Weather</span></div>
                <div className="hiw-mini">
                  <div className="t">Model portfolio</div><div className="v">All Weather Portfolio</div>
                  <div className="hiw-row"><span>Nifty BeES</span><b>34%</b></div><div className="hiw-bar"><i style={{ width: '34%', background: 'linear-gradient(90deg,var(--brand),var(--brand-2))' }}></i></div>
                  <div className="hiw-row"><span>Liquid BeES</span><b>28%</b></div><div className="hiw-bar"><i style={{ width: '28%', background: 'linear-gradient(90deg,var(--brand),var(--brand-2))' }}></i></div>
                  <div className="hiw-row"><span>Gold BeES</span><b>22%</b></div><div className="hiw-bar"><i style={{ width: '22%', background: 'linear-gradient(90deg,var(--brand),var(--brand-2))' }}></i></div>
                  <div className="hiw-row"><span>NASDAQ 100 ETF</span><b>16%</b></div><div className="hiw-bar"><i style={{ width: '16%', background: 'linear-gradient(90deg,var(--brand),var(--brand-2))' }}></i></div>
                </div>
                <div className="hiw-mini"><div className="t">3Y CAGR</div><div className="v" style={{ color: 'var(--brand)' }}>+18.4%</div></div>
              </div></div></div>
            </div>
          </div>

          <div className="hiw-card c1" style={{ '--i': 1 }}>
            <div className="hiw-strip"><span className="n">2</span> Alternative Investment Fund</div>
            <div className="hiw-body">
              <div className="hiw-copy">
                <div className="k">Alternative Investment Fund</div>
                <h3>Diversify beyond the listed markets</h3>
                <ul>
                  <li>Professionally managed AIF strategies with clear mandates</li>
                  <li>Access curated alternatives built for scale and diversification</li>
                  <li>Structured, regulated and transparent reporting</li>
                </ul>
                <Link to="/aif" className="hiw-btn">Explore AIF →</Link>
              </div>
              <div className="hiw-visual"><div className="hiw-phone"><div className="hiw-screen">
                <div className="hiw-stop"><span>Basketly</span><span>AIF</span></div>
                <div className="hiw-mini"><div className="t">AIF strategy</div><div className="v">Long-Short Alpha</div></div>
                <div className="hiw-mini"><div className="t">Target IRR</div><div className="v" style={{ color: 'var(--teal)' }}>14–18%</div></div>
                <div className="hiw-mini"><div className="t">Min. commitment</div><div className="v">₹1 Cr</div></div>
                <div className="hiw-mini"><div className="t">Structure</div><div className="v">Category III</div></div>
              </div></div></div>
            </div>
          </div>

          <div className="hiw-card c2" style={{ '--i': 2 }}>
            <div className="hiw-strip"><span className="n">3</span> Advisory</div>
            <div className="hiw-body">
              <div className="hiw-copy">
                <div className="k">Advisory</div>
                <h3>Buy / Sell / Hold insights in seconds</h3>
                <ul>
                  <li>Clear entry, target &amp; stop-loss on every pick and idea</li>
                  <li>Covers stocks, F&amp;O, commodities &amp; stock baskets</li>
                  <li>SEBI-registered. Analyst-validated. Always.</li>
                </ul>
                <Link to="/advisory" className="hiw-btn">Get advisory →</Link>
              </div>
              <div className="hiw-visual"><div className="hiw-phone"><div className="hiw-screen">
                <div className="hiw-stop"><span>Basketly</span><span>Advisory</span></div>
                <div className="hiw-mini"><div className="t">Expert verdict · Long term</div>
                  <div className="hiw-verdict" style={{ color: 'var(--green)' }}><span className="hiw-dot" style={{ background: 'var(--green)' }}></span> Maintain a “Buy”</div></div>
                <div className="hiw-mini"><div className="t">Expert verdict · Short term</div>
                  <div className="hiw-verdict" style={{ color: 'var(--amber)' }}><span className="hiw-dot" style={{ background: 'var(--amber)' }}></span> Maintain a “Hold”</div></div>
                <div className="hiw-mini"><div className="t">Entry / Target / SL</div><div className="v" style={{ fontSize: 14 }}>₹310 · ₹360 · ₹295</div></div>
              </div></div></div>
            </div>
          </div>

        </div>
      </section>

      {/* MODEL PORTFOLIO FEATURE */}
      <section className="feat" id="model">
        <div className="container">
          <div className="eyebrow">Model Portfolio</div>
          <h2 style={{ maxWidth: 640 }}>Curated portfolios that rebalance for you</h2>
          <div className="pcards">
            <div className="pcard">
              <h4>Stock Portfolios</h4>
              <div className="d">Curated stock playlists that rebalance for you</div>
              <div className="tags"><span className="tag">Thematic</span><span className="tag">Fundamental</span><span className="tag">Quant</span></div>
              <div className="prow"><span className="ic grad">▤</span><span><div className="nm">Capital Markets Tracker</div><div className="sub">16 Stocks</div></span></div>
              <div className="prow"><span className="ic" style={{ background: '#7A5AF8' }}>◑</span><span><div className="nm">Cyclical Opportunities</div><div className="sub">24 Stocks</div></span></div>
              <div className="prow"><span className="ic" style={{ background: '#2E90FA' }}>◆</span><span><div className="nm">Quality Bluechips — Quant</div><div className="sub">10 Stocks</div></span></div>
              <Link to="/model-portfolios" className="seemore">See more →</Link>
            </div>
            <div className="pcard">
              <h4>ETF Portfolios</h4>
              <div className="d">Diversified strategies with low-cost ETFs</div>
              <div className="tags"><span className="tag">Asset Allocation</span><span className="tag">Target Date</span><span className="tag">Commodities</span></div>
              <div className="prow"><span className="ic" style={{ background: '#12B79A' }}>🌐</span><span><div className="nm">Timeless Asset Allocation</div><div className="sub">4 ETFs</div></span></div>
              <div className="prow"><span className="ic" style={{ background: '#F79009' }}>☀</span><span><div className="nm">Horizon 2040 Target Date</div><div className="sub">3 ETFs</div></span></div>
              <div className="prow"><span className="ic" style={{ background: '#1A1030' }}>◈</span><span><div className="nm">Precious Metals Tracker</div><div className="sub">2 ETFs</div></span></div>
              <Link to="/model-portfolios" className="seemore">See more →</Link>
            </div>
            <div className="pcard">
              <h4>Mutual Fund Portfolios</h4>
              <div className="d">Collections of direct MFs from multiple AMCs</div>
              <div className="tags"><span className="tag">Largecap</span><span className="tag">Midcap</span><span className="tag">Smallcap</span></div>
              <div className="prow"><span className="ic grad">▲</span><span><div className="nm">Largecap MF Picks</div><div className="sub">3 Funds</div></span></div>
              <div className="prow"><span className="ic" style={{ background: '#7A5AF8' }}>⛰</span><span><div className="nm">Midcap MF Picks</div><div className="sub">3 Funds</div></span></div>
              <div className="prow"><span className="ic" style={{ background: '#2E90FA' }}>⛰</span><span><div className="nm">Smallcap MF Picks</div><div className="sub">4 Funds</div></span></div>
              <Link to="/mutual-funds" className="seemore">See more →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* AIF FEATURE */}
      <section className="feat rev" id="aif">
        <div className="container"><div className="feat-inner">
          <div className="feat-copy">
            <div className="eyebrow">Alternative Investment Fund</div>
            <h2>Investing. Diversifying.<br />All in one place</h2>
            <ul>
              <li>Professionally managed AIF strategies beyond listed equity</li>
              <li>Access to curated alternatives with transparent mandates</li>
              <li>Built for investors seeking diversification and scale</li>
            </ul>
            <Link to="/aif" className="btn btn-primary">Explore AIF →</Link>
          </div>
          <div className="feat-visual"><div className="fphone"><div className="fs">
            <div className="fmini"><div className="t">AIF Strategy</div><div className="v">Long-Short Alpha</div></div>
            <div className="fmini"><div className="t">Target IRR</div><div className="v" style={{ color: 'var(--brand)' }}>14–18%</div></div>
            <div className="fmini"><div className="t">Min. commitment</div><div className="v">₹1 Cr</div></div>
            <div className="fmini"><div className="t">Structure</div><div className="v">Category III</div></div>
          </div></div></div>
        </div></div>
      </section>

      {/* ADVISORY FEATURE */}
      <section className="feat" id="advisory">
        <div className="container"><div className="feat-inner">
          <div className="feat-copy">
            <div className="eyebrow">Advisory</div>
            <h2>Buy / Sell / Hold insights<br />on your portfolio in seconds</h2>
            <ul>
              <li>Clear entry, target &amp; stop-loss on every pick and idea</li>
              <li>Covers stocks, F&amp;O, commodities &amp; stock baskets</li>
              <li>SEBI-registered. Analyst-validated. Always.</li>
            </ul>
            <Link to="/advisory" className="btn btn-primary">Get advisory →</Link>
          </div>
          <div className="feat-visual"><div className="fphone"><div className="fs">
            <div className="fmini"><div className="t">Expert verdict · Long term</div>
              <div className="fverdict" style={{ color: 'var(--green)' }}><span className="fdot" style={{ background: 'var(--green)' }}></span> Experts maintain a “Buy”</div></div>
            <div className="fmini"><div className="t">Expert verdict · Short term</div>
              <div className="fverdict" style={{ color: 'var(--amber)' }}><span className="fdot" style={{ background: 'var(--amber)' }}></span> Experts maintain a “Hold”</div></div>
            <div className="fmini"><div className="t">Entry / Target / SL</div><div className="v" style={{ fontSize: 13 }}>₹310 · ₹360 · ₹295</div></div>
          </div></div></div>
        </div></div>
      </section>

      {/* TRUST */}
      <section className="trust">
        <div className="container">
          <div className="head"><div className="e">Your money deserves the best</div><h2>Trust built at every step</h2></div>
          <div className="shield">🛡</div>
          <div className="trust-grid">
            <div className="tc"><h4>✓ No new accounts</h4><p>Hold your stocks &amp; ETFs in your existing demat account — no separate account needed.</p></div>
            <div className="tc"><h4>🔓 Invest without lock-ins</h4><p>Exit your investments whenever you like. Model portfolios can be liquidated anytime.</p></div>
            <div className="tc"><h4>🔐 Secure by design</h4><p>Financial-grade security with encryption in transit and at rest, built for trust.</p></div>
            <div className="tc"><h4>🏛 Regulated products only</h4><p>Products &amp; services regulated by SEBI &amp; RBI, from licensed providers &amp; platforms.</p></div>
          </div>
        </div>
      </section>

      {/* LOVE / TESTIMONIALS */}
      <section className="love">
        <div className="container">
          <div className="eyebrow">Award-winning customer experience</div>
          <h2>Loved by investors</h2>
          <div className="tscroll">
            <div className="tcard"><p>“One of the best finance products in recent times. The UI is clean and investing is effortless.”</p><div className="who"><span className="av grad">S</span><span><div className="nm">Saurabh</div><div className="rl">Reviewed on Play Store</div></span></div></div>
            <div className="tcard"><p>“The best investment-tech experience I’ve used in India today. Genuinely well built.”</p><div className="who"><span className="av" style={{ background: '#7A5AF8' }}>N</span><span><div className="nm">Nithin</div><div className="rl">Posted on X</div></span></div></div>
            <div className="tcard"><p>“Best app for investing with multiple choices of portfolios and clear methodology.”</p><div className="who"><span className="av" style={{ background: '#2E90FA' }}>A</span><span><div className="nm">Asma</div><div className="rl">Reviewed on Play Store</div></span></div></div>
            <div className="tcard"><p>“Fallen in love with Basketly — such a smooth, smooth product from end to end.”</p><div className="who"><span className="av" style={{ background: '#12B79A' }}>T</span><span><div className="nm">Tanmay</div><div className="rl">Posted on X</div></span></div></div>
            <div className="tcard"><p>“A smart app blending tech and finance — I can track and invest in one place.”</p><div className="who"><span className="av" style={{ background: '#F79009' }}>R</span><span><div className="nm">Ravi</div><div className="rl">Reviewed on Play Store</div></span></div></div>
            <div className="tcard"><p>“Excellent platform for beginners, especially those who don’t have time to analyse.”</p><div className="who"><span className="av" style={{ background: '#EE46BC' }}>J</span><span><div className="nm">Jonathan</div><div className="rl">Reviewed on App Store</div></span></div></div>
          </div>
        </div>
      </section>
    </div>
  );
}
