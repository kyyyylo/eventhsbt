"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Activity, ArrowDown, ArrowLeft, ArrowRight, BarChart3, Bell, Check,
  ChevronDown, ChevronRight, CircleHelp, Clock3, Flame, Heart, LayoutGrid,
  Menu, Radio, Search, ShieldCheck, Star, Ticket, Trophy, UserRound,
  Wallet, Waves, X, Zap
} from "lucide-react";

const FIXTURES = [
  { id:"ars-bha", sport:"Football", league:"Premier League", flag:"🏴", time:"52′", live:true, home:"Arsenal", away:"Brighton & Hove Albion", abbr:["ARS","BHA"], score:[1,0], featured:true, odds:[{label:"Arsenal",value:"1.30",status:"active"},{label:"Draw",value:"4.60",status:"active"},{label:"Brighton",value:"11.00",status:"active"}] },
  { id:"liv-mun", sport:"Football", league:"Premier League", flag:"🏴", time:"20:45", live:false, home:"Liverpool", away:"Manchester United", abbr:["LIV","MUN"], score:null, featured:true, odds:[{label:"Liverpool",value:"1.68",status:"changed",previous:"1.74"},{label:"Draw",value:"3.90",status:"active"},{label:"Man United",value:"5.10",status:"active"}] },
  { id:"mci-ast", sport:"Football", league:"Premier League", flag:"🏴", time:"Tomorrow · 19:30", live:false, home:"Manchester City", away:"Aston Villa", abbr:["MCI","AVL"], score:null, featured:false, odds:[{label:"Man City",value:"1.52",status:"active"},{label:"Draw",value:"4.20",status:"suspended"},{label:"Aston Villa",value:"6.30",status:"active"}] },
  { id:"rma-sev", sport:"Football", league:"La Liga", flag:"🇪🇸", time:"21:00", live:false, home:"Real Madrid", away:"Sevilla", abbr:["RMA","SEV"], score:null, featured:true, odds:[{label:"Real Madrid",value:"1.42",status:"active"},{label:"Draw",value:"4.60",status:"active"},{label:"Sevilla",value:"7.20",status:"failed"}] },
  { id:"int-nap", sport:"Football", league:"Serie A", flag:"🇮🇹", time:"22:45", live:false, home:"Inter", away:"Napoli", abbr:["INT","NAP"], score:null, featured:false, odds:[{label:"Inter",value:"2.10",status:"active"},{label:"Draw",value:"3.20",status:"active"},{label:"Napoli",value:"3.45",status:"changed",previous:"3.60"}] },
  { id:"bar-bay", sport:"Football", league:"Champions League", flag:"🌍", time:"62′", live:true, home:"Barcelona", away:"Bayern Munich", abbr:["BAR","BAY"], score:[2,1], featured:true, odds:[{label:"Barcelona",value:"2.35",status:"active"},{label:"Draw",value:"3.10",status:"active"},{label:"Bayern",value:"2.80",status:"active"}] },
  { id:"lal-gsw", sport:"Basketball", league:"NBA", flag:"🇺🇸", time:"Q3 · 06:21", live:true, home:"Los Angeles Lakers", away:"Golden State Warriors", abbr:["LAL","GSW"], score:[78,72], featured:false, odds:[{label:"Lakers",value:"1.72",status:"active"},{label:"Draw",value:"—",status:"failed"},{label:"Warriors",value:"2.08",status:"active"}] },
  { id:"swi-alc", sport:"Tennis", league:"ATP Finals", flag:"🎾", time:"Set 2 · 4:3", live:true, home:"A. Sinner", away:"C. Alcaraz", abbr:["SIN","ALC"], score:[1,0], featured:false, odds:[{label:"Sinner",value:"1.88",status:"changed",previous:"1.96"},{label:"Retired",value:"—",status:"suspended"},{label:"Alcaraz",value:"1.94",status:"active"}] }
];

const PAGES = [
  { id:"home", label:"Sports home", short:"Home", icon:LayoutGrid },
  { id:"live", label:"Live", short:"Live", icon:Radio },
  { id:"football", label:"Football", short:"Football", icon:Trophy },
  { id:"match", label:"Match page", short:"Match", icon:Activity },
  { id:"bets", label:"Bet slip + My bets", short:"Bets", icon:Ticket }
];
const fmtMoney = (n) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:2 }).format(Number.isFinite(n) ? n : 0);

function Header({ page, setPage, hasPick, slipCount }) {
  return <header className="topbar">
    <button className="brand" onClick={() => setPage("home")} aria-label="Housebets Sports home">
      <Image src="/housebets-sloth-mark.jpg" alt="Housebets Sloth mascot" width={56} height={56} priority className="brand-mark" />
      <span className="brand-wordmark"><b>House<span>bets</span></b><small>SPORTSBOOK</small></span>
      <Waves className="brand-wave" size={24}/>
    </button>
    <nav className="desktop-nav" aria-label="Main sportsbook navigation">
      {PAGES.map((item) => <button key={item.id} onClick={() => setPage(item.id)} className={page===item.id ? "nav-item active" : "nav-item"}>
        {item.label}{item.id === "bets" && hasPick && <i className="nav-counter">{slipCount}</i>}
      </button>)}
    </nav>
    <div className="header-tools"><span className="demo-flag"><i/> SAMPLE MODE</span><button className="wallet-pill" title="Illustrative wallet"><Wallet size={16}/><b>$1,000.00</b><ChevronDown size={13}/></button><button className="profile-pill" aria-label="Guest profile"><UserRound size={17}/></button></div>
  </header>;
}

function MobileNav({ page, setPage, hasPick }) {
  return <nav className="mobile-nav" aria-label="Mobile sportsbook navigation">{PAGES.map((item) => {
    const Icon = item.icon;
    return <button key={item.id} className={page===item.id ? "mobile-nav-item active" : "mobile-nav-item"} onClick={() => setPage(item.id)}>
      <span className="mobile-nav-icon"><Icon size={19}/>{item.id === "bets" && hasPick && <i/>}</span><small>{item.short}</small>
    </button>;
  })}</nav>;
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function MarketState({ status }) {
  if (status === "active") return null;
  const label = status === "changed" ? "Changed" : status === "suspended" ? "Suspended" : "Failed";
  return <span className={`state-badge ${status}`}>{label}</span>;
}

function OddsButton({ outcome, onClick, selected }) {
  const disabled = outcome.status === "suspended" || outcome.status === "failed";
  return <button className={`odds-button ${selected ? "picked" : ""} ${disabled ? "is-disabled" : ""}`} disabled={disabled} onClick={onClick}>
    <span className="odds-label">{outcome.label}</span>
    <strong>{outcome.value}</strong>
    {outcome.status === "changed" && <small>Price updated</small>}
    {outcome.status === "suspended" && <small>Market suspended</small>}
    {outcome.status === "failed" && <small>Unavailable</small>}
    {selected && <Check size={13} className="picked-check"/>}
  </button>;
}

function MatchCard({ match, onPick, onOpen, favoriteIds, toggleFavorite }) {
  return <article className="match-card">
    <div className="match-meta"><div className="league-name"><span>{match.flag}</span><b>{match.league}</b></div><div className="match-actions">
      {match.live ? <span className="live-label"><i/>LIVE · {match.time}</span> : <span className="match-time"><Clock3 size={12}/>{match.time}</span>}
      <button className={favoriteIds.includes(match.id) ? "favorite active" : "favorite"} onClick={() => toggleFavorite(match.id)} aria-label="Toggle favourite"><Heart size={14} fill={favoriteIds.includes(match.id) ? "currentColor" : "none"}/></button>
    </div></div>
    <button className="match-overview" onClick={() => onOpen(match)} aria-label={`Open ${match.home} versus ${match.away}`}>
      <div className="team"><span className="team-badge">{match.abbr[0]}</span><b>{match.home}</b></div>
      <div className="match-score">{match.score ? <><strong>{match.score[0]} : {match.score[1]}</strong><small>{match.live ? "IN PLAY" : "FINAL"}</small></> : <strong className="versus">VS</strong>}</div>
      <div className="team away"><span className="team-badge">{match.abbr[1]}</span><b>{match.away}</b></div>
      <ChevronRight size={15} className="match-arrow"/>
    </button>
    <div className="odds-grid">{match.odds.map((o, index) => <OddsButton key={index} outcome={o} onClick={() => onPick(match,o)}/>)}</div>
  </article>;
}

function HomePage({ fixtures, onPick, onOpen, setPage, search, setSearch, favoriteIds, toggleFavorite }) {
  const [sportFilter, setSportFilter] = useState("All sports");
  const [showFavorites, setShowFavorites] = useState(false);
  const sports = [{name:"All sports",icon:"✦",count:fixtures.length},{name:"Football",icon:"⚽",count:fixtures.filter(m=>m.sport==="Football").length},{name:"Basketball",icon:"🏀",count:fixtures.filter(m=>m.sport==="Basketball").length},{name:"Tennis",icon:"🎾",count:fixtures.filter(m=>m.sport==="Tennis").length}];
  const visible = fixtures.filter(m => (sportFilter === "All sports" || m.sport === sportFilter) && (!showFavorites || favoriteIds.includes(m.id)) && `${m.home} ${m.away} ${m.league}`.toLowerCase().includes(search.toLowerCase()));
  const featured = visible.filter(m => m.featured || sportFilter !== "All sports").slice(0,4);
  return <>
    <section className="hero-panel">
      <div className="hero-copy"><span className="hero-kicker"><Flame size={14}/> YOUR SPORTS, IN FOCUS</span><h1>Every match.<br/><em>One clear view.</em></h1><p>Move from the first whistle to the final market with a calmer, clearer sportsbook experience.</p><div className="hero-actions"><button className="primary-button" onClick={() => setPage("football")}>Explore football <ArrowRight size={16}/></button><button className="quiet-button" onClick={() => setPage("live")}><Radio size={15}/> Watch live board</button></div></div>
      <div className="hero-art"><div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/><div className="hero-sloth hero-logo-lockup"><Image src="/housebets-sloth-logo.png" alt="Housebets Sloth mascot and wordmark" width={520} height={520} priority/></div></div>
      <div className="hero-foot"><span><i/> SAMPLE FIXTURES</span><span>Made for every screen</span></div>
    </section>
    <div className="home-tools"><label className="search-field"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search teams, players or leagues"/><span>⌘ K</span>{search&&<button onClick={()=>setSearch("")} aria-label="Clear search"><X size={14}/></button>}</label><button className={showFavorites?"favorite-filter on":"favorite-filter"} onClick={()=>setShowFavorites(v=>!v)}><Heart size={15} fill={showFavorites?"currentColor":"none"}/> Favourites <b>{favoriteIds.length}</b></button></div>
    <div className="sport-filters">{sports.map(s=><button key={s.name} className={sportFilter===s.name?"sport-filter selected":"sport-filter"} onClick={()=>setSportFilter(s.name)}><span>{s.icon}</span><b>{s.name}</b><small>{s.count}</small></button>)}</div>
    <div className="section-heading"><div><span className="eyebrow">CURATED FOR YOU</span><h2>{showFavorites?"Your favourites":"Featured fixtures"}</h2></div><button className="text-action" onClick={()=>setPage("football")}>View football <ArrowRight size={14}/></button></div>
    {featured.length ? <div className="match-grid">{featured.map(m=><MatchCard key={m.id} match={m} onPick={onPick} onOpen={onOpen} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite}/>)}</div> : <div className="empty-state"><Heart/><b>No favourites yet</b><span>Tap the heart on a match to save it here.</span></div>}
    <div className="home-footnote"><ShieldCheck size={15}/> Sample fixtures and illustrative odds only. Singles only.</div>
  </>;
}

function LivePage({ fixtures, onPick, onOpen, favoriteIds, toggleFavorite }) {
  const [filter, setFilter] = useState("All sports");
  const live = fixtures.filter(m => m.live && (filter === "All sports" || m.sport === filter));
  const upcoming = fixtures.filter(m => !m.live && (filter === "All sports" || m.sport === filter));
  const filters = ["All sports","Football","Basketball","Tennis"];
  return <><PageHeading eyebrow="LIVE CENTRE" title="Live" description="A focused view of matches in progress and what starts next." action={<span className="live-pill"><i/> LIVE BOARD</span>}/>
    <div className="filter-row">{filters.map(f=><button key={f} className={filter===f?"filter-chip active":"filter-chip"} onClick={()=>setFilter(f)}>{f}</button>)}</div>
    <div className="live-summary"><div><span className="pulse-dot"/><b>{live.length} sample events in play</b></div><small>Illustrative scores · Not a live feed</small></div>
    {live.length ? <div className="match-grid">{live.map(m=><MatchCard key={m.id} match={m} onPick={onPick} onOpen={onOpen} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite}/>)}</div> : <div className="empty-state"><Radio/><b>No sample live fixtures in this filter</b><span>Choose another sport to view the example board.</span></div>}
    <div className="section-heading compact"><div><span className="eyebrow">UP NEXT</span><h2>Upcoming fixtures</h2></div></div>
    {upcoming.length ? <div className="match-grid">{upcoming.map(m=><MatchCard key={m.id} match={m} onPick={onPick} onOpen={onOpen} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite}/>)}</div> : <div className="empty-state small">No upcoming sample fixtures in this filter.</div>}
  </>;
}

function FootballPage({ fixtures, onPick, onOpen, favoriteIds, toggleFavorite }) {
  const [league, setLeague] = useState("All leagues");
  const [schedule, setSchedule] = useState("All");
  const leagueNames = ["All leagues","Premier League","La Liga","Serie A","Champions League"];
  const rows = fixtures.filter(m => m.sport === "Football" && (league === "All leagues" || m.league === league) && (schedule === "All" || (schedule === "Live" && m.live) || (schedule === "Upcoming" && !m.live)));
  return <><PageHeading eyebrow="SPORTS / FOOTBALL" title="Football" description="Browse competitions, follow the score and open a match in one tap."/>
    <div className="football-toolbar"><div className="league-filters">{leagueNames.map(n=><button key={n} className={league===n?"selected":""} onClick={()=>setLeague(n)}>{n}</button>)}</div><div className="filter-row compact-filters">{["All","Live","Upcoming"].map(n=><button key={n} className={schedule===n?"filter-chip active":"filter-chip"} onClick={()=>setSchedule(n)}>{n}</button>)}</div></div>
    <div className="league-groups">{rows.map(m=><section className="league-group" key={m.id}><div className="league-heading"><span>{m.flag}</span><b>{m.league}</b><Star size={14}/><small>{m.live?"In play":"Fixture"}</small><span className="league-more">Match centre <ChevronRight size={13}/></span></div><MatchCard match={m} onPick={onPick} onOpen={onOpen} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite}/></section>)}</div>
    {!rows.length&&<div className="empty-state"><Trophy/><b>No fixtures match these filters</b><span>Try another league or schedule filter.</span></div>}
    <div className="state-key"><span>Market availability</span><MarketState status="changed"/><MarketState status="suspended"/><MarketState status="failed"/></div>
  </>;
}

function MatchPage({ match, onPick, selected, setPage, favoriteIds, toggleFavorite }) {
  const [tab,setTab]=useState("Markets");
  const [marketFilter,setMarketFilter]=useState("Popular");
  const [expanded,setExpanded]=useState("Match result");
  const groups = [
    {name:"Match result",category:"Popular",outcomes:match.odds},
    {name:"Double chance",category:"Popular",outcomes:[{label:"Home or draw",value:"1.18",status:"active"},{label:"Home or away",value:"1.08",status:"active"},{label:"Draw or away",value:"3.10",status:"active"}]},
    {name:"Total goals",category:"Goals",outcomes:[{label:"Over 2.5",value:"1.82",status:"active"},{label:"Under 2.5",value:"2.00",status:"active"},{label:"Over 3.5",value:"2.65",status:"suspended"}]},
    {name:"Both teams to score",category:"Goals",outcomes:[{label:"Yes",value:"1.72",status:"active"},{label:"No",value:"2.05",status:"failed"}]},
    {name:"Half-time result",category:"More",outcomes:[{label:"Home",value:"2.15",status:"active"},{label:"Draw",value:"2.05",status:"active"},{label:"Away",value:"4.80",status:"active"}]}
  ];
  const visible=groups.filter(g=>marketFilter==="Popular"?g.category==="Popular":marketFilter==="Goals"?g.category==="Goals":g.category==="More");
  if(!match) return <div className="empty-state"><Trophy/><b>Select a match first</b><span>Choose a fixture from Sports home, Live or Football.</span><button className="primary-button" onClick={()=>setPage("football")}>Browse football</button></div>;
  return <><button className="back-link" onClick={()=>setPage("football")}><ArrowLeft size={15}/> Football fixtures</button>
    <section className="match-hero-card"><div className="match-hero-meta"><span>{match.flag} {match.league}</span>{match.live?<span className="live-label"><i/> LIVE · {match.time}</span>:<span><Clock3 size={12}/> {match.time}</span>}</div>
      <div className="match-hero-teams"><div><span className="large-crest">{match.abbr[0]}</span><b>{match.home}</b></div><div className="hero-score">{match.score?`${match.score[0]} : ${match.score[1]}`:"VS"}<small>{match.live?"IN PLAY":"UPCOMING"}</small></div><div><span className="large-crest">{match.abbr[1]}</span><b>{match.away}</b></div></div>
      <div className="match-hero-bottom"><button onClick={()=>toggleFavorite(match.id)} className={favoriteIds.includes(match.id)?"favorite active":"favorite"}><Heart size={14} fill={favoriteIds.includes(match.id)?"currentColor":"none"}/> {favoriteIds.includes(match.id)?"Following":"Follow match"}</button><span>Single markets only</span></div>
    </section>
    <div className="match-tabs">{[{id:"Markets",icon:Ticket},{id:"Stats",icon:BarChart3},{id:"Timeline",icon:Activity}].map(item=>{const Icon=item.icon;return <button key={item.id} className={tab===item.id?"active":""} onClick={()=>setTab(item.id)}><Icon size={14}/>{item.id}</button>;})}</div>
    {tab==="Markets"&&<><div className="market-tools"><div className="filter-row">{["Popular","Goals","More"].map(m=><button key={m} className={marketFilter===m?"filter-chip active":"filter-chip"} onClick={()=>setMarketFilter(m)}>{m}</button>)}</div><span>Sample markets · Decimal odds</span></div><div className="market-groups">{visible.map(g=><section className="market-box" key={g.name}><button className="market-box-title" onClick={()=>setExpanded(expanded===g.name?"":g.name)}><b>{g.name}</b><ChevronDown size={16} className={expanded===g.name?"rotated":""}/></button>{expanded===g.name&&<div className="market-odds">{g.outcomes.map((o,i)=><OddsButton key={i} outcome={o} selected={selected?.matchId===match.id&&selected?.label===o.label} onClick={()=>onPick(match,o)}/>)}</div>}</section>)}</div></>}
    {tab==="Stats"&&<div className="stats-card"><div className="stats-title"><span>{match.home}</span><b>Match statistics</b><span>{match.away}</span></div>{[["Possession","58%","42%",58],["Shots","12","8",60],["Shots on target","5","3",63],["Corners","6","4",60],["Pass accuracy","89%","84%",52]].map(r=><div className="stat-row" key={r[0]}><div><b>{r[1]}</b><span>{r[0]}</span><b>{r[2]}</b></div><div className="stat-bar"><i style={{width:r[3]+"%"}}/><i style={{width:(100-r[3])+"%"}}/></div></div>)}<small>Illustrative match statistics, not a live data feed.</small></div>}
    {tab==="Timeline"&&<div className="timeline-card">{[["52′","⚽",`${match.home} — Match in progress`],["HT","•","Half-time interval"],["1′","•","Kick-off"]].map((r,i)=><div className="timeline-row" key={i}><b>{r[0]}</b><span>{r[1]}</span><p>{r[2]}</p></div>)}<small>Sample event timeline for the prototype.</small></div>}
    <div className="single-note"><ShieldCheck size={16}/><span><b>Singles only.</b> Choose one outcome. A new selection replaces the previous one.</span></div>
  </>;
}

function BetsPage({ selected, fixtures, stake, setStake, removeSelection, bets, addBet }) {
  const [tab,setTab]=useState("Bet slip");
  const [message,setMessage]=useState("");
  const match=fixtures.find(m=>m.id===selected?.matchId);
  const amount=Math.max(0,Number(stake)||0);
  const odds=Number(selected?.value||0);
  const potential=amount*odds;
  const saveDemoBet=()=>{
    if(!selected||!match){setMessage("Choose one active outcome before continuing.");return;}
    if(!Number.isFinite(amount)||amount<=0){setMessage("Enter a stake greater than zero.");return;}
    addBet({id:Date.now(),match:`${match.home} vs ${match.away}`,pick:selected.label,odds,stake:amount,potential,status:"Open"});
    setMessage("Demo selection saved to My bets.");
    setTab("My bets");
  };
  return <><PageHeading eyebrow="YOUR ACTIVITY" title="Bet slip & My bets" description="One selection, one clear summary. This page combines slip review and demo history."/>
    <div className="segmented-tabs"><button className={tab==="Bet slip"?"active":""} onClick={()=>setTab("Bet slip")}>Bet slip {selected&&<i>1</i>}</button><button className={tab==="My bets"?"active":""} onClick={()=>setTab("My bets")}>My bets <i>{bets.length}</i></button></div>
    {tab==="Bet slip"?(selected&&match?<div className="bets-layout"><section className="slip-card"><div className="slip-top"><span className="eyebrow">SINGLE SELECTION · {match.league}</span><button onClick={removeSelection} aria-label="Remove selection"><X size={16}/></button></div><h3>{match.home}<span>vs</span>{match.away}</h3><div className="slip-pick"><span>{selected.label}</span><b>{selected.value}</b></div>{selected.status==="changed"&&<p className="changed-note">The sample price has changed. The currently displayed price is used in this demo calculation.</p>}</section>
      <aside className="stake-card"><div className="stake-title">STAKE <span>DEMO ONLY</span></div><label className="stake-input">$<input type="number" inputMode="decimal" min="0" value={stake} onChange={e=>setStake(e.target.value)} aria-label="Stake amount"/></label><div className="quick-stakes">{[5,10,25,50].map(n=><button key={n} onClick={()=>setStake(String(n))}>${n}</button>)}</div><div className="calc-row"><span>Odds</span><b>{odds.toFixed(2)}</b></div><div className="calc-row"><span>Potential return</span><b className="aqua-value">{fmtMoney(potential)}</b></div><div className="calc-row total"><span>Potential profit</span><b>{fmtMoney(Math.max(0,potential-amount))}</b></div><button className="primary-button full" onClick={saveDemoBet}>Save demo entry <ArrowRight size={15}/></button><p className="demo-disclaimer">Illustrative calculation only. No wager, payment or transfer takes place.</p></aside></div>:<div className="empty-state tall"><Ticket/><b>Your bet slip is empty</b><span>Select one active outcome from any match to add a single.</span></div>):(bets.length?<div className="bet-history">{bets.map(b=><article className="bet-record" key={b.id}><div><span className="eyebrow">SINGLE · DEMO</span><b>{b.match}</b><p>{b.pick}</p></div><div className="bet-record-right"><strong>{Number(b.odds).toFixed(2)}</strong><span>{fmtMoney(b.stake)} stake</span><small>{b.status}</small></div></article>)}</div>:<div className="empty-state tall"><Activity/><b>No demo entries yet</b><span>Saved demo entries will appear here.</span><button className="quiet-button" onClick={()=>setTab("Bet slip")}>Back to bet slip</button></div>)}
    {message&&<div className="inline-message"><Check size={14}/>{message}</div>}
    <div className="single-note"><ShieldCheck size={16}/><span>Prototype only. My Bets and favourites are stored in this browser. No real money or sportsbook account is connected.</span></div>
  </>;
}

export default function Home() {
  const [page,setPage]=useState("home");
  const [selectedMatch,setSelectedMatch]=useState(FIXTURES[0]);
  const [selected,setSelected]=useState(null);
  const [stake,setStake]=useState("10");
  const [bets,setBets]=useState([]);
  const [favorites,setFavorites]=useState([]);
  const [search,setSearch]=useState("");
  const [hydrated,setHydrated]=useState(false);
  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("housebets-final-prototype")||"{}");setBets(Array.isArray(saved.bets)?saved.bets:[]);setFavorites(Array.isArray(saved.favorites)?saved.favorites:[]);}catch{}setHydrated(true);},[]);
  useEffect(()=>{if(hydrated){try{localStorage.setItem("housebets-final-prototype",JSON.stringify({bets,favorites}));}catch{}}},[bets,favorites,hydrated]);
  const toggleFavorite=(id)=>setFavorites(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
  const filtered=useMemo(()=>FIXTURES.filter(m=>`${m.home} ${m.away} ${m.league} ${m.sport}`.toLowerCase().includes(search.toLowerCase())),[search]);
  const onPick=(match,outcome)=>{if(outcome.status==="suspended"||outcome.status==="failed")return;setSelectedMatch(match);setSelected({matchId:match.id,label:outcome.label,value:outcome.value,status:outcome.status});};
  const onOpen=(match)=>{setSelectedMatch(match);setPage("match");};
  const addBet=(bet)=>{setBets(old=>[bet,...old]);setSelected(null);};
  return <main className="app-shell">
    <Header page={page} setPage={setPage} hasPick={!!selected} slipCount={selected?1:0}/>
    <div className="page-wrap"><div className="page-context"><span>HOUSEBETS SPORTSBOOK</span><span>DESIGN PROTOTYPE <i/></span></div>
      <div className="main-layout"><main className="main-content">
        {page==="home"&&<HomePage fixtures={filtered} onPick={onPick} onOpen={onOpen} setPage={setPage} search={search} setSearch={setSearch} favoriteIds={favorites} toggleFavorite={toggleFavorite}/>}
        {page==="live"&&<LivePage fixtures={FIXTURES} onPick={onPick} onOpen={onOpen} favoriteIds={favorites} toggleFavorite={toggleFavorite}/>}
        {page==="football"&&<FootballPage fixtures={FIXTURES} onPick={onPick} onOpen={onOpen} favoriteIds={favorites} toggleFavorite={toggleFavorite}/>}
        {page==="match"&&<MatchPage match={selectedMatch} onPick={onPick} selected={selected} setPage={setPage} favoriteIds={favorites} toggleFavorite={toggleFavorite}/>}
        {page==="bets"&&<BetsPage selected={selected} fixtures={FIXTURES} stake={stake} setStake={setStake} removeSelection={()=>setSelected(null)} bets={bets} addBet={addBet}/>}
      </main>
      <aside className="right-rail"><section className="rail-card"><div className="rail-title"><span>YOUR BET SLIP</span><Ticket size={16}/></div>{selected?<><b className="rail-match">{FIXTURES.find(m=>m.id===selected.matchId)?.home} vs {FIXTURES.find(m=>m.id===selected.matchId)?.away}</b><span className="rail-pick">{selected.label}</span><div className="rail-odds"><span>Single odds</span><b>{selected.value}</b></div><button className="rail-button" onClick={()=>setPage("bets")}>Review selection <ArrowRight size={14}/></button></>:<div className="rail-empty"><Ticket size={23}/><b>Your slip is clear</b><span>Choose an active price to add one single selection.</span></div>}</section>
        <section className="rail-card quick-guide"><div className="rail-title"><span>MARKET GUIDE</span><CircleHelp size={16}/></div><div className="guide-row"><i className="guide-dot active"/><span>Active</span><small>Available to select</small></div><div className="guide-row"><i className="guide-dot changed"/><span>Changed</span><small>Price updated</small></div><div className="guide-row"><i className="guide-dot suspended"/><span>Suspended</span><small>Temporarily paused</small></div><div className="guide-row"><i className="guide-dot failed"/><span>Failed</span><small>Unavailable</small></div></section>
        <section className="rail-note"><ShieldCheck size={17}/><div><b>Built for clarity</b><p>One selection per slip. Sample fixtures and odds only.</p></div></section>
      </aside></div>
    </div>
    {selected&&page!=="bets"&&<button className="sticky-slip" onClick={()=>setPage("bets")}><span className="sticky-icon"><Ticket size={16}/></span><span className="sticky-copy"><b>Bet slip · 1 selection</b><small>{selected.label} · {selected.value}</small></span><span className="sticky-action">Review <ArrowRight size={14}/></span></button>}
    <footer className="footer"><span>HOUSEBETS · SPORTSBOOK CONCEPT</span><span>Illustrative fixtures & odds · No real wagers</span><span>Minimal by design.</span></footer>
    <MobileNav page={page} setPage={setPage} hasPick={!!selected}/>
  </main>;
}
