 "use client";
import {useMemo,useState} from "react";
import {
  Activity, ArrowLeft, ArrowRight, Bell, Check, ChevronDown, ChevronRight,
  CircleHelp, Clock3, Compass, Flame, Menu, Search, ShieldCheck, Star,
  Ticket, Trophy, UserRound, Wallet, X, Zap, Plus, Minus, Trash2
} from "lucide-react";

const matches=[
 {id:1,league:"ENGLISH PREMIER LEAGUE",country:"England",time:"Today · 19:30",home:"Arsenal",away:"Chelsea",abbr:["ARS","CHE"],score:null,live:false,hot:true,odds:[1.82,3.65,4.20]},
 {id:2,league:"LA LIGA",country:"Spain",time:"Today · 21:00",home:"Real Madrid",away:"Sevilla",abbr:["RMA","SEV"],score:null,live:false,hot:true,odds:[1.42,4.60,7.20]},
 {id:3,league:"SERIE A",country:"Italy",time:"Today · 22:45",home:"Inter",away:"Napoli",abbr:["INT","NAP"],score:null,live:false,hot:false,odds:[2.10,3.20,3.45]},
 {id:4,league:"UEFA CHAMPIONS LEAGUE",country:"Europe",time:"LIVE · 62′",home:"Barcelona",away:"Bayern Munich",abbr:["BAR","BAY"],score:"2 - 1",live:true,hot:true,odds:[2.35,3.10,2.80]},
 {id:5,league:"NBA",country:"USA",time:"Tomorrow · 08:30",home:"Lakers",away:"Warriors",abbr:["LAL","GSW"],score:null,live:false,hot:false,odds:[1.90,0,1.90]}
];
const sports=[["Football","⚽","248"],["Basketball","🏀","86"],["Tennis","🎾","54"],["Cricket","🏏","32"],["Esports","🎮","18"]];
const markets=["Match Winner","Double Chance","Total Goals","Both Teams to Score"];
const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(n);

export default function Home(){
 const [page,setPage]=useState("Home"),[sport,setSport]=useState("Football"),[selected,setSelected]=useState(null);
 const [stake,setStake]=useState("10"),[search,setSearch]=useState(""),[market,setMarket]=useState("Match Winner");
 const [filter,setFilter]=useState("All"),[notice,setNotice]=useState(""),[showMenu,setShowMenu]=useState(false);
 const [myBets,setMyBets]=useState([]),[showRules,setShowRules]=useState(false);
 const current=matches.find(m=>m.id===selected?.matchId);
 const chosenLabel=selected?.label||"";
 const odds=selected?.odds||0;
 const amount=Math.max(0,Number(stake)||0);
 const potential=amount*odds;
 const visible=matches.filter(m=>(filter==="All"|| (filter==="Live"&&m.live)||(filter==="Upcoming"&&!m.live))&&(`${m.home} ${m.away} ${m.league}`).toLowerCase().includes(search.toLowerCase()));
 const choose=(m,index,label,customOdds)=>{setSelected({matchId:m.id,label,odds:customOdds ?? m.odds[index]});setPage("Match");setNotice("");};
 const go=(p)=>{setPage(p);setShowMenu(false);};
 const placeDemoBet=()=>{if(!selected||amount<=0){setNotice("Enter a valid stake to continue.");return;}setMyBets(b=>[{id:Date.now(),match:current.home+" vs "+current.away,pick:chosenLabel,odds,stake:amount,return:potential,status:"Pending"} ,...b]);setNotice("Demo bet added to My Bets.");setPage("My Bets");setSelected(null);};
 const nav=[["Home",Compass],["Sports",Trophy],["Match",Zap],["Bet Slip",Ticket],["My Bets",Activity]];
 return <main className="app">
  <header className="topbar">
   <button className="mobile-menu" onClick={()=>setShowMenu(!showMenu)}><Menu/></button>
   <button className="logo" onClick={()=>go("Home")}><span className="logo-h">H</span><span className="logo-wave">〰</span><span className="logo-name">HOUSEBETS</span></button>
   <div className="top-links"><button onClick={()=>go("Sports")}>Sports</button><button onClick={()=>go("My Bets")}>My Bets</button><button onClick={()=>setShowRules(true)}>How to play</button></div>
   <div className="top-right"><span className="demo-pill"><i/> DEMO MODE</span><button className="icon-button" aria-label="Notifications"><Bell/></button><button className="profile-button" onClick={()=>go("My Bets")}><UserRound size={17}/><span>Guest</span></button></div>
  </header>
  {showMenu&&<div className="mobile-drawer">{nav.map(([n,I])=><button key={n} onClick={()=>go(n)}><I size={18}/>{n}</button>)}</div>}
  <div className="layout">
   <aside className="sidebar">
    <div className="side-label">MENU</div>
    {nav.map(([n,I])=><button key={n} className={"side-link "+(page===n?"active":"")} onClick={()=>go(n)}><I size={18}/>{n}{n==="Bet Slip"&&selected&&<b className="count">1</b>}</button>)}
    <div className="side-divider"/>
    <div className="side-label">SPORTS</div>
    {sports.map(([n,e,c])=><button key={n} className={"sport-link "+(sport===n?"sport-active":"")} onClick={()=>{setSport(n);go("Sports")}}><span>{e}</span>{n}<small>{c}</small></button>)}
    <div className="side-promo"><div className="promo-icon"><ShieldCheck/></div><b>Play with clarity.</b><p>Know the market. Understand the odds.</p><button onClick={()=>setShowRules(true)}>Learn more <ArrowRight size={14}/></button></div>
   </aside>
   <section className="content">
    <div className="mobile-breadcrumb"><span>Housebets</span><ChevronRight size={14}/>{page}</div>
    {page==="Home"&&<HomePage matches={matches} choose={choose} go={go} setFilter={setFilter}/>}
    {page==="Sports"&&<SportsPage sport={sport} setSport={setSport} visible={visible} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} choose={choose}/>}
    {page==="Match"&&<MatchPage match={current||matches[0]} market={market} setMarket={setMarket} choose={choose} selected={selected} go={go}/>}
    {page==="Bet Slip"&&<SlipPage selected={selected} match={current} stake={stake} setStake={setStake} amount={amount} potential={potential} go={go} placeDemoBet={placeDemoBet} notice={notice} setNotice={setNotice} onRemove={()=>setSelected(null)}/>}
    {page==="My Bets"&&<BetsPage bets={myBets} go={go}/>}
    
   </section>
   <aside className="right-rail">
    <div className="rail-card balance-card"><div className="rail-heading">WALLET <Wallet size={16}/></div><div className="balance-amount">$1,000.00</div><span className="demo-note">Demo balance · no real funds</span><button onClick={()=>setShowRules(true)}>About demo mode <ArrowRight size={14}/></button></div>
    <div className="rail-card"><div className="rail-heading">YOUR BET SLIP <Ticket size={16}/></div>{selected?<><div className="rail-selection"><b>{current?.home} vs {current?.away}</b><span>{chosenLabel}</span><strong>{odds.toFixed(2)}</strong></div><button className="rail-cta" onClick={()=>go("Bet Slip")}>Review selection <ArrowRight size={15}/></button></>:<div className="empty-mini"><Ticket size={24}/><p>Your bet slip is empty</p><span>Choose one outcome to get started.</span></div>}</div>
    <div className="rail-card responsible"><ShieldCheck/><div><b>Keep it in control</b><p>This is a design prototype. No real wagers or payments.</p><button onClick={()=>setShowRules(true)}>Read information</button></div></div>
   </aside>
  </div>
  <nav className="mobile-nav">{nav.slice(0,5).map(([n,I])=><button key={n} className={page===n?"on":""} onClick={()=>go(n)}><I/><span>{n==="Bet Slip"?"Slip":n}</span>{n==="Bet Slip"&&selected&&<i/>}</button>)}</nav>
  <footer className="footer"><span>© 2026 HOUSEBETS · SPORTSBOOK CONCEPT</span><span>Prototype only · No real-money betting</span><button onClick={()=>setShowRules(true)}>About this prototype</button></footer>
  {showRules&&<div className="modal-scrim" onClick={()=>setShowRules(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setShowRules(false)}><X/></button><div className="modal-icon"><ShieldCheck/></div><h2>About this prototype</h2><p>This is a fictional, front-end sportsbook design concept. All events, odds, wallet balances and bet records are illustrative only.</p><ul><li>Five core screens with responsive navigation.</li><li>Singles only: one selection per bet slip.</li><li>No deposits, withdrawals, payments or real wagers.</li><li>Demo bet records stay in this browser session only.</li></ul><button className="btn-primary" onClick={()=>setShowRules(false)}>Got it</button></div></div>}
 </main>
}

function PageTitle({eyebrow,title,sub,children}){return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{sub}</p></div>{children}</div>}
function HomePage({matches,choose,go,setFilter}){
 return <><div className="welcome-strip"><div><span className="live-dot"/> THE GAME, REIMAGINED</div><span>DESIGNED FOR EVERY SCREEN</span></div>
 <section className="hero"><div className="hero-content"><span className="hero-tag"><Flame size={14}/> MATCHDAY SPOTLIGHT</span><h1>Every moment.<br/><em>One clear view.</em></h1><p>Follow the action, explore the markets, and keep every selection simple.</p><button className="btn-primary" onClick={()=>go("Sports")}>Explore sports <ArrowRight size={17}/></button></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="ball">⚽</div><div className="float-card"><span>FEATURED MATCH</span><b>ARS <i>vs</i> CHE</b><small>Premier League · 19:30</small></div></div></section>
 <div className="section-head"><div><span className="eyebrow">DON'T MISS A MOMENT</span><h2>Top matches</h2></div><button className="text-link" onClick={()=>go("Sports")}>View all matches <ArrowRight size={15}/></button></div>
 <div className="match-list">{matches.filter(m=>m.hot).slice(0,3).map(m=><MatchCard key={m.id} m={m} choose={choose}/>)}</div>
 <div className="section-head sports-head"><div><span className="eyebrow">PICK YOUR GAME</span><h2>Explore sports</h2></div></div>
 <div className="sport-tiles">{sports.slice(0,4).map(([n,e,c])=><button key={n} onClick={()=>go("Sports")}><span>{e}</span><b>{n}</b><small>{c} events</small><ChevronRight size={16}/></button>)}</div>
 </>
}
function MatchCard({m,choose}){
 return <article className="match-card"><div className="match-top"><span>{m.league}</span>{m.live?<b className="live-label"><i/> LIVE {m.time.split("·")[1]}</b>:<span className="match-time"><Clock3 size={13}/>{m.time}</span>}</div><div className="match-main"><div className="team"><div className="team-badge">{m.abbr[0]}</div><b>{m.home}</b></div><div className="versus">{m.score||"VS"}</div><div className="team"><div className="team-badge">{m.abbr[1]}</div><b>{m.away}</b></div></div><div className="odds-row">{["1","X","2"].map((label,i)=><button key={label} disabled={!m.odds[i]} onClick={()=>choose(m,i,`${label} · ${i===0?m.home:i===1?"Draw":m.away}`)}><span>{label}</span><b>{m.odds[i]?m.odds[i].toFixed(2):"—"}</b></button>)}</div></article>
}
function SportsPage({sport,setSport,visible,search,setSearch,filter,setFilter,choose}){
 return <><PageTitle eyebrow="FIND YOUR GAME" title="Sports & events" sub="Browse upcoming fixtures and live action."/><div className="sport-tabs">{sports.map(([n,e])=><button className={sport===n?"chosen":""} key={n} onClick={()=>setSport(n)}><span>{e}</span>{n}</button>)}</div><div className="tools-row"><div className="search-box"><Search/><input placeholder="Search teams or competitions" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button onClick={()=>setSearch("")}><X/></button>}</div><div className="filter-pills">{["All","Live","Upcoming"].map(f=><button className={filter===f?"chosen":""} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div></div><div className="section-head compact"><div><span className="eyebrow">{sport.toUpperCase()} · TODAY</span><h2>Popular fixtures</h2></div><span className="result-count">{visible.length} events</span></div><div className="match-list">{visible.length?visible.map(m=><MatchCard key={m.id} m={m} choose={choose}/>):<div className="empty-state">No events match your search. Try another team or filter.</div>}</div></>
}
function MatchPage({match,market,setMarket,choose,selected,go}){
 const options=market==="Match Winner"?match.odds.map((o,i)=>({label:["1 · "+match.home,"X · Draw","2 · "+match.away][i],odds:o})):market==="Double Chance"?[{label:"1X · Home or Draw",odds:1.25},{label:"X2 · Draw or Away",odds:1.55},{label:"12 · No Draw",odds:1.32}]:market==="Total Goals"?[{label:"Over 2.5 goals",odds:1.80},{label:"Under 2.5 goals",odds:2.02}]:[{label:"Yes",odds:1.72},{label:"No",odds:2.05}];
 return <><button className="back-link" onClick={()=>go("Sports")}><ArrowLeft size={16}/> All sports</button><div className="match-detail-hero"><span className="eyebrow">{match.league}</span><div className="detail-teams"><div><div className="team-badge large">{match.abbr[0]}</div><h2>{match.home}</h2></div><div className="detail-vs">{match.score||"VS"}<small>{match.time}</small></div><div><div className="team-badge large">{match.abbr[1]}</div><h2>{match.away}</h2></div></div></div><div className="section-head compact"><div><span className="eyebrow">MARKETS</span><h2>Match markets</h2></div><span className="single-tag">SINGLES ONLY</span></div><div className="market-select">{markets.map(x=><button key={x} className={market===x?"chosen":""} onClick={()=>setMarket(x)}>{x}</button>)}</div><div className="market-panel"><div className="market-head"><b>{market}</b><span>Match result</span></div>{options.map((o,i)=><button className={"market-option "+(selected?.label===o.label?"picked":"")} key={o.label} onClick={()=>choose(match, i, o.label, o.odds)}><span>{o.label}</span><b>{o.odds.toFixed(2)}</b>{selected?.label===o.label&&<Check size={16}/>}</button>)}</div><div className="singles-note"><ShieldCheck/><span><b>One selection per slip.</b> This prototype supports singles only. Adding a new outcome replaces the previous selection.</span></div><button className="btn-primary full" onClick={()=>go("Bet Slip")}>Review bet slip <ArrowRight size={17}/></button></>
}
function SlipPage({selected,match,stake,setStake,amount,potential,go,placeDemoBet,notice,setNotice,onRemove}){
 return <><PageTitle eyebrow="YOUR SELECTION" title="Bet slip" sub="Review one selection before continuing."/><div className="slip-layout"><div className="slip-main">{selected&&match?<div className="slip-selection"><div className="slip-select-top"><span className="eyebrow">SINGLE · {match.league}</span><button className="remove" onClick={onRemove}><Trash2 size={16}/></button></div><b className="slip-match">{match.home} <span>vs</span> {match.away}</b><div className="slip-pick"><span>{selected.label}</span><strong>{selected.odds.toFixed(2)}</strong></div></div>:<div className="empty-state big-empty"><Ticket/><h3>Your slip is waiting</h3><p>Choose one outcome from a match to add a single selection.</p><button className="btn-primary" onClick={()=>go("Sports")}>Browse matches <ArrowRight size={16}/></button></div>}</div>{selected&&match&&<div className="stake-card"><div className="stake-heading">STAKE AMOUNT <span>DEMO ONLY</span></div><div className="stake-input"><span>$</span><input type="number" min="0" step="0.01" value={stake} onChange={e=>setStake(e.target.value)}/></div><div className="quick-stakes">{[5,10,25,50].map(n=><button key={n} onClick={()=>setStake(String(n))}>${n}</button>)}</div><div className="calc-row"><span>Odds</span><b>{selected.odds.toFixed(2)}</b></div><div className="calc-row"><span>Potential return</span><b className="return">{money(potential)}</b></div><div className="calc-row total"><span>Potential profit</span><b>{money(Math.max(0,potential-amount))}</b></div><p className="demo-warning">Illustrative calculation only. No funds are taken and no wager is placed.</p><button className="btn-primary full" onClick={placeDemoBet}>Add demo bet <ArrowRight size={16}/></button></div>}</div>{notice&&<div className="inline-notice">{notice}</div>}<div className="singles-note"><ShieldCheck/><span>Singles only. Multiple selections and accumulators are not supported in this prototype.</span></div></>
}
function BetsPage({bets,go}){
 return <><PageTitle eyebrow="YOUR ACTIVITY" title="My bets" sub="A simple overview of your demo selections."/><div className="bet-summary"><div><span>OPEN DEMO BETS</span><b>{bets.length}</b></div><div><span>SETTLED</span><b>0</b></div><div><span>MODE</span><b className="demo-text">DEMO</b></div></div><div className="section-head compact"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Bet history</h2></div></div>{bets.length?<div className="history-list">{bets.map(b=><article className="history-card" key={b.id}><div><span className="eyebrow">SINGLE · DEMO</span><b>{b.match}</b><p>{b.pick}</p></div><div className="history-right"><b>{b.odds.toFixed(2)}</b><span>{money(b.stake)} stake</span><small>{b.status}</small></div></article>)}</div>:<div className="empty-state big-empty"><Activity/><h3>No activity yet</h3><p>Your demo selections will appear here after you add one to your slip.</p><button className="btn-primary" onClick={()=>go("Sports")}>Explore events <ArrowRight size={16}/></button></div>}</>
}
function ProfilePage({go}){return <><PageTitle eyebrow="YOUR SPACE" title="Welcome, Guest" sub="Your profile and preferences for this prototype."/><div className="profile-card"><div className="avatar"><UserRound/></div><div><h2>Guest player</h2><p>Demo account · No sign-in required</p></div><span className="demo-pill"><i/> DEMO</span></div><div className="settings-list"><button><Bell/> Notifications <ChevronRight/></button><button><ShieldCheck/> Responsible play information <ChevronRight/></button><button><CircleHelp/> Help & support <ChevronRight/></button></div><div className="singles-note"><ShieldCheck/><span>This prototype does not create user accounts, collect payment details, or connect to betting services.</span></div><button className="btn-primary" onClick={()=>go("Home")}>Back to home <ArrowRight size={16}/></button></>}
