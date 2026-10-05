"use client";

import { useState, useEffect } from "react";
import React from "react";
import {
  FaHandsHelping,
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaSync,
  FaHeart,
  FaStar,
  FaUserAlt,
  FaBrain,
  FaComments,
  FaLightbulb,
  FaStethoscope,
  FaBalanceScale,
  FaWheelchair,
  FaGavel,
  FaHospitalAlt,
} from "react-icons/fa";

interface MemoryCard {
  id: number;
  content: string;
  icon: React.ReactElement;
  matchId: number;
  textColor: string;
  isMatched: boolean;
  isSelected: boolean;
}

interface Scenario {
  id: number;
  emoji: string;
  situation: string;
  optionA: string;
  optionB: string;
  correct: "A" | "B";
  explanation: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const CARD_COLORS = [
  "text-teal-600 dark:text-teal-400",
  "text-sky-600 dark:text-sky-400",
  "text-violet-600 dark:text-violet-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-rose-600 dark:text-rose-400",
  "text-amber-600 dark:text-amber-400",
  "text-cyan-600 dark:text-cyan-400",
  "text-indigo-600 dark:text-indigo-400",
  "text-pink-600 dark:text-pink-400",
  "text-lime-600 dark:text-lime-400",
  "text-orange-600 dark:text-orange-400",
  "text-blue-600 dark:text-blue-400",
  "text-green-600 dark:text-green-400",
  "text-red-600 dark:text-red-400",
  "text-purple-600 dark:text-purple-400",
  "text-yellow-600 dark:text-yellow-400",
  "text-fuchsia-600 dark:text-fuchsia-400",
  "text-slate-500 dark:text-slate-400",
  "text-zinc-600 dark:text-zinc-400",
  "text-stone-600 dark:text-stone-400",
];

const RAW_CARDS = [
  { id: 1,  content: "Glidlakan",                icon: <FaHandsHelping className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[0]  },
  { id: 2,  content: "Minskar friktion i sängen", icon: <FaStar         className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[10] },
  { id: 3,  content: "Lyftsele",                 icon: <FaWheelchair    className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[5]  },
  { id: 4,  content: "Används med lyftkran",     icon: <FaShieldAlt     className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[15] },
  { id: 5,  content: "Ergonomi",                 icon: <FaHeart         className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[2]  },
  { id: 6,  content: "Rätt arbetsteknik skyddar ryggen", icon: <FaComments className="text-2xl" />, matchId: 3, textColor: CARD_COLORS[12] },
  { id: 7,  content: "Transfer",                 icon: <FaEye           className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[8]  },
  { id: 8,  content: "Flytta från säng till stol", icon: <FaStethoscope className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[3]  },
  { id: 9,  content: "Böj knäna",                icon: <FaGavel         className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[14] },
  { id: 10, content: "Aldrig böj ryggen vid lyft", icon: <FaCheck       className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[7]  },
  { id: 11, content: "Lyftkran",                 icon: <FaHospitalAlt   className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[1]  },
  { id: 12, content: "Maskin för tunga lyft",    icon: <FaBrain         className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[11] },
  { id: 13, content: "Patientens delaktighet",   icon: <FaUserAlt       className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[6]  },
  { id: 14, content: "Låt patienten hjälpa till", icon: <FaLightbulb   className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[16] },
  { id: 15, content: "Belastningsskada",         icon: <FaTimes         className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[13] },
  { id: 16, content: "Ryggskada av tungt lyft",  icon: <FaBalanceScale  className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[4]  },
  { id: 17, content: "Stå upp",                  icon: <FaComments      className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[9]  },
  { id: 18, content: "Förflyttning till stående", icon: <FaCheck        className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[17] },
  { id: 19, content: "Vändlakan",                icon: <FaHandsHelping  className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[18] },
  { id: 20, content: "Flytta patient uppåt i säng", icon: <FaHeart      className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[19] },
];

const SNABBFAKTA = [
  { emoji: "🦴", text: "Böj alltid knäna — inte ryggen — när du hjälper en patient." },
  { emoji: "🛠️", text: "Använd alltid hjälpmedel. Du ska aldrig lyfta en patient ensam utan dem." },
  { emoji: "🗣️", text: "Informera patienten om vad du ska göra — räkna till tre tillsammans." },
  { emoji: "👥", text: "Be om hjälp av en kollega om förflyttningen är för tung." },
  { emoji: "⚖️", text: "Anpassa hjälpmedel efter patienten — inte tvärtom." },
  { emoji: "🏋️", text: "Glidlakan minskar friktionen och gör förflyttning i sängen enklare." },
  { emoji: "🚨", text: "Stoppa om patienten säger att det gör ont — anpassa teknik." },
  { emoji: "📝", text: "Dokumentera hur förflyttningen gick och om det uppstod problem." },
];

const BEGREPP = [
  { term: "Ergonomi",           def: "Rätt arbetsteknik för att skydda kroppen — böj knäna, inte ryggen." },
  { term: "Glidlakan",          def: "Plastlakan som minskar friktion och gör det lättare att flytta patienten i sängen." },
  { term: "Lyftsele",           def: "Sele som fästs runt patienten och kopplas till lyftkran för säkert lyft." },
  { term: "Lyftkran",           def: "Maskin som lyfter patienter med hjälp av lyftsele — skyddar both patient och personal." },
  { term: "Transfer",           def: "Att flytta patienten från en plats till en annan, t.ex. från säng till stol." },
  { term: "Belastningsskada",   def: "Rygg- eller ledskada som uppstår av felaktigt lyft eller upprepade tunga rörelser." },
  { term: "Vändlakan",          def: "Lakan som används för att vända och flytta patienten uppåt i sängen." },
  { term: "Delaktighet",        def: "Patienten ska delta i förflyttningen så mycket de klarar — det stärker förmågan." },
  { term: "Förflyttningsbälte", def: "Bälte runt patientens midja som ger dig ett säkert grepp vid hjälp att stå upp." },
  { term: "Glidmatta",          def: "Hjälpmedel som placeras under patienten för att underlätta sidoförflyttning." },
];

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: "🛏️",
    situation: "Du ska flytta en tung patient från sängen till rullstolen.\nDu är ensam på avdelningen.",
    optionA: "Du lyfter patienten utan hjälpmedel — det går snabbt.",
    optionB: "Du hämtar lyftkran och sele och ber om en kollegas hjälp.",
    correct: "B",
    explanation: "Du ska aldrig lyfta en tung patient utan hjälpmedel.\nDet skyddar både dig och patienten från skador.",
  },
  {
    id: 2,
    emoji: "👨",
    situation: "En patient ska resa sig upp från stolen.\nHan vill försöka själv men du är orolig.",
    optionA: "Du lyfter upp honom direkt utan att han behöver anstränga sig.",
    optionB: "Du stöttar med bälte och låter honom göra jobbet med din hjälp.",
    correct: "B",
    explanation: "Patientens delaktighet stärker musklerna och självständigheten.\nStötta — men låt patienten anstränga sig.",
  },
  {
    id: 3,
    emoji: "😣",
    situation: "Mitt i en förflyttning säger patienten att det gör ont i höften.",
    optionA: "Du fortsätter — det är snart klart.",
    optionB: "Du stannar direkt och utvärderar situationen.",
    correct: "B",
    explanation: "Smärta under förflyttning kan tyda på skada eller felaktig teknik.\nStoppa alltid och bedöm situationen.",
  },
  {
    id: 4,
    emoji: "🔄",
    situation: "Du ska vända en sängliggande patient.\nDu har inga hjälpmedel nära till hands.",
    optionA: "Du drar i patienten med händerna direkt.",
    optionB: "Du hämtar vändlakan och glidlakan innan du börjar.",
    correct: "B",
    explanation: "Hjälpmedel skyddar patientens hud och din rygg.\nTa alltid fram rätt utrustning innan du börjar.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Hur ska du lyfta för att skydda ryggen?",
    options: ["Böj ryggen och sträck på benen.", "Böj knäna och håll ryggen rak.", "Använd bara armstyrka.", "Lyft snabbt så det tar kortare tid."],
    correct: 1,
    explanation: "Böj alltid knäna och håll ryggen rak — det är grundläggande ergonomi.",
  },
  {
    id: 2,
    question: "Vad används ett glidlakan till?",
    options: ["Täcka patienten på natten.", "Minska friktion vid förflyttning i sängen.", "Lyfta patienten med kran.", "Skydda madrassen."],
    correct: 1,
    explanation: "Glidlakanet minskar friktionen och gör det lättare att flytta patienten utan att dra.",
  },
  {
    id: 3,
    question: "Vad är en lyftsele?",
    options: ["Ett bälte runt midjan.", "En sele som används med lyftkran för att lyfta patienter.", "En typ av rullstol.", "En halskrage."],
    correct: 1,
    explanation: "Lyftselen fästs runt patientens kropp och kopplas till lyftkranen för ett säkert, skonsamt lyft.",
  },
  {
    id: 4,
    question: "Varför ska patienten delta i förflyttningen?",
    options: ["Det sparar tid.", "Det stärker patientens förmåga och självständighet.", "Det är enklare för personalen.", "Det är ett krav i lagen."],
    correct: 1,
    explanation: "Delaktighet stärker musklerna och motivationen — och är grundläggande för rehabilitering.",
  },
  {
    id: 5,
    question: "Vad ska du alltid göra innan du förflyttar en patient?",
    options: ["Vänta tills patienten somnat.", "Informera patienten om vad som ska hända.", "Stänga dörren.", "Ta av dig skorna."],
    correct: 1,
    explanation: "Berätta alltid vad du ska göra. Det minskar patientens oro och ökar samarbetet.",
  },
  {
    id: 6,
    question: "Vad är en belastningsskada?",
    options: ["En infektion i ryggen.", "Skada orsakad av felaktiga lyft eller upprepade tunga rörelser.", "En typ av trycksår.", "Skada efter fall."],
    correct: 1,
    explanation: "Belastningsskador är vanliga i vården och kan förebyggas med rätt teknik och hjälpmedel.",
  },
  {
    id: 7,
    question: "Vad gör du om patienten säger att det gör ont under förflyttningen?",
    options: ["Fortsätter snabbt.", "Stannar och utvärderar.", "Ger smärtstillande och fortsätter.", "Ignorerar — det är vanligt."],
    correct: 1,
    explanation: "Smärta är ett varningstecken. Stoppa alltid och bedöm situationen.",
  },
  {
    id: 8,
    question: "Vad används ett förflyttningsbälte till?",
    options: ["Hålla madrassen på plats.", "Ge ett säkert grepp runt patientens midja vid resning.", "Hålla patienten i sängen.", "Fixera patientens armar."],
    correct: 1,
    explanation: "Förflyttningsbältet ger dig ett stabilt grepp utan att du drar i patientens kläder eller kropp.",
  },
  {
    id: 9,
    question: "Hur många personal behövs vid förflyttning med lyftkran?",
    options: ["En person räcker alltid.", "Minst två personer.", "Tre eller fler.", "Det bestämmer patienten."],
    correct: 1,
    explanation: "Vid lyftkran bör minst två personer vara med — en hanterar kranen, en stöttar patienten.",
  },
  {
    id: 10,
    question: "Vad ska du göra om du inte vet hur ett hjälpmedel fungerar?",
    options: ["Prova och se hur det går.", "Fråga en erfaren kollega eller läs instruktionerna.", "Skippa hjälpmedlet.", "Ringa tillverkaren."],
    correct: 1,
    explanation: "Använd aldrig ett hjälpmedel du inte är utbildad på — det kan skada patienten och dig.",
  },
];

const SAMMANFATTNING = [
  { emoji: "🦴", text: "Böj alltid knäna — håll ryggen rak vid alla lyft." },
  { emoji: "🛠️", text: "Använd alltid hjälpmedel — glidlakan, lyftsele och lyftkran." },
  { emoji: "🗣️", text: "Informera patienten och räkna till tre — förflyttning sker tillsammans." },
  { emoji: "👥", text: "Be om hjälp av kollega om det är för tungt." },
  { emoji: "🙋", text: "Låt patienten delta aktivt — det stärker självständigheten." },
  { emoji: "🚨", text: "Stoppa direkt om patienten känner smärta." },
  { emoji: "📋", text: "Välj rätt hjälpmedel för varje situation." },
  { emoji: "📝", text: "Dokumentera hur förflyttningen gick." },
];

const FAKTARUTOR = [
  {
    id: "ergonomi",
    emoji: "🦴",
    title: "Ergonomi — rätt teknik",
    short: "Skydda ryggen med rätt kroppsteknik.",
    bullets: [
      "Böj alltid knäna — håll ryggen rak.",
      "Håll patienten nära kroppen när du hjälper.",
      "Undvik att vrida ryggen — vänd med fötterna.",
      "Breda fötter ger stabilitet.",
      "Ta pauser — upprepad belastning ger skada.",
    ],
  },
  {
    id: "hjälpmedel",
    emoji: "🛠️",
    title: "Hjälpmedel vid förflyttning",
    short: "Rätt utrustning skyddar patienten och dig.",
    bullets: [
      "Glidlakan — minskar friktion vid rörelse i sängen.",
      "Vändlakan — hjälper att vända och flytta patienten uppåt.",
      "Glidmatta — för sidoförflyttningar.",
      "Lyftsele + lyftkran — för tunga lyft.",
      "Förflyttningsbälte — grepp runt midjan vid resning.",
    ],
  },
  {
    id: "säng-till-stol",
    emoji: "🪑",
    title: "Från säng till stol",
    short: "Steg-för-steg transfer.",
    bullets: [
      "Höj sängen till lämplig höjd — minskar belastning.",
      "Placera stolen nära sängen.",
      "Hjälp patienten att sitta upp på sängkanten.",
      "Kontrollera att patienten är stabil innan de reser sig.",
      "Stöd med bälte och låt patienten resa sig med hjälp.",
    ],
  },
  {
    id: "uppåt-i-säng",
    emoji: "🛏️",
    title: "Flytta uppåt i sängen",
    short: "Använd glidlakan och vändlakan.",
    bullets: [
      "Lägg glidlakan under patienten.",
      "Låt patienten böja knäna och trycka med fötterna.",
      "Du och kollegan drar lakan uppåt — inte patienten.",
      "Räkna till tre och rör er samtidigt.",
      "Ta bort glidlakanet efteråt.",
    ],
  },
  {
    id: "delaktighet",
    emoji: "🤝",
    title: "Patientens delaktighet",
    short: "Låt patienten göra det de kan.",
    bullets: [
      "Berätta alltid vad du ska göra och vad patienten ska göra.",
      "Stötta — ta inte över det patienten klarar.",
      "Uppmuntra och ge positiv feedback.",
      "Anpassa tempot efter patienten — inte efter dig.",
      "Delaktighet är rehabilitering — varje rörelse räknas.",
    ],
  },
  {
    id: "säkerhet",
    emoji: "🚨",
    title: "Säkerhet vid förflyttning",
    short: "Förebygg fall och skador.",
    bullets: [
      "Kontrollera att hjälpmedel är rätt monterade innan du börjar.",
      "Se till att golvet är torrt och hinder är borta.",
      "Lås rullstolen och sängen innan förflyttning.",
      "Stoppa om patienten säger att det gör ont.",
      "Dokumentera och rapportera om något gick fel.",
    ],
  },
];

function SectionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-foreground">
        <span className="text-4xl">{emoji}</span>
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-muted-foreground text-base leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative bg-linear-to-br from-primary/90 to-primary py-16 sm:py-24 text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="relative container mx-auto px-6 max-w-3xl">
        <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium mb-6">Vård och omsorg</span>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
          Förflyttnings-
          <br />
          <span className="text-white/80">teknik</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl mb-8">
          Lär dig flytta patienter på ett säkert sätt. Rätt teknik skyddar din rygg och patientens välmående.
        </p>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          {["🎮 Memory-spel", "📋 Snabbfakta", "📖 Begrepp", "💬 Scenariofrågor", "🧠 Quiz"].map((tag) => (
            <span key={tag} className="rounded-full bg-white/20 px-4 py-2">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function MemoryGameSection() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => { initGame(); }, []);

  function initGame() {
    const shuffled = [...RAW_CARDS].map((c) => ({ ...c, isMatched: false, isSelected: false })).sort(() => Math.random() - 0.5);
    setCards(shuffled); setSelected([]); setMatches(0); setMoves(0); setDone(false);
  }

  function pickCard(id: number) {
    if (selected.length === 2) return;
    if (selected.includes(id)) return;
    if (cards.find((c) => c.id === id)?.isMatched) return;
    const next = [...selected, id];
    setSelected(next);
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isSelected: true } : c)));
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const cardA = cards.find((c) => c.id === next[0])!;
      const cardB = cards.find((c) => c.id === next[1])!;
      if (cardA.matchId === cardB.matchId) {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => next.includes(c.id) ? { ...c, isMatched: true, isSelected: false } : { ...c, isSelected: false }));
          setMatches((m) => { const nm = m + 1; if (nm === 10) setTimeout(() => setDone(true), 600); return nm; });
          setSelected([]);
        }, 700);
      } else {
        setTimeout(() => { setCards((prev) => prev.map((c) => ({ ...c, isSelected: false }))); setSelected([]); }, 900);
      }
    }
  }

  const accuracy = moves > 0 ? Math.round((matches / moves) * 100) : 0;

  return (
    <section>
      <SectionHeader emoji="🎮" title="Memory-spel" subtitle="Klicka på två kort som hör ihop. Matchade par försvinner." />
      <div className="rounded-xl border border-border bg-card p-4 mb-6 flex flex-wrap gap-6 items-center justify-between">
        <div className="flex gap-6 text-sm">
          {[{ label: "Matchningar", value: matches, color: "text-emerald-600 dark:text-emerald-400" }, { label: "Drag", value: moves, color: "text-primary" }, { label: "Träffsäkerhet", value: `${accuracy}%`, color: "text-amber-600 dark:text-amber-400" }, { label: "Kvar", value: 10 - matches, color: "text-muted-foreground" }].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        <button onClick={initGame} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><FaSync className="text-xs" /> Nytt spel</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {cards.map((card) => (
          <div key={card.id} onClick={() => pickCard(card.id)} className={["relative h-28 sm:h-32 rounded-xl border transition-all duration-500", card.isMatched ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100 cursor-pointer hover:scale-105", card.isSelected ? "ring-2 ring-primary border-primary shadow-lg shadow-primary/20" : "border-border bg-card hover:border-primary/50"].join(" ")}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-2">
              <span className={card.textColor}>{card.icon}</span>
              <span className={`text-xs text-center font-medium leading-tight ${card.textColor}`}>{card.content}</span>
            </div>
          </div>
        ))}
      </div>
      {done && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Bra jobbat!</h3>
            <p className="text-muted-foreground mb-6">Du klarade det på <strong>{moves} drag</strong> med <strong>{accuracy}% träffsäkerhet</strong>.</p>
            <button onClick={initGame} className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">Spela igen</button>
          </div>
        </div>
      )}
    </section>
  );
}

function SnabbfaktaSection() {
  return (
    <section>
      <SectionHeader emoji="📋" title="Snabbfakta" subtitle="Viktiga saker att komma ihåg." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SNABBFAKTA.map(({ emoji, text }) => (
          <div key={text} className="rounded-xl border border-border bg-card p-4 flex gap-3 items-start">
            <span className="text-2xl shrink-0 mt-0.5">{emoji}</span>
            <p className="text-sm leading-relaxed text-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaktaruterSection() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="space-y-8">
      <SectionHeader emoji="🩺" title="Faktarutor" subtitle="Klicka för att läsa mer om varje ämne." />
      <div className="space-y-2">
        {FAKTARUTOR.map((f) => {
          const isOpen = open === f.id;
          return (
            <div key={f.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : f.id)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl shrink-0">{f.emoji}</span>
                  <div>
                    <p className="font-semibold text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.short}</p>
                  </div>
                </div>
                {isOpen ? <FaChevronUp className="text-primary shrink-0" /> : <FaChevronDown className="text-muted-foreground shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-3 border-t border-border">
                  <ul className="space-y-2">
                    {f.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                        <span className="text-primary shrink-0 mt-1">•</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function BegreppSection() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section>
      <SectionHeader emoji="📖" title="Begrepp och förklaringar" subtitle="Klicka på ett ord för att se vad det betyder." />
      <div className="space-y-2">
        {BEGREPP.map(({ term, def }) => {
          const isOpen = open === term;
          return (
            <div key={term} className="rounded-xl border border-border bg-card overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : term)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/50 transition-colors">
                <span className="font-semibold text-foreground">{term}</span>
                {isOpen ? <FaChevronUp className="text-primary shrink-0" /> : <FaChevronDown className="text-muted-foreground shrink-0" />}
              </button>
              {isOpen && <p className="px-5 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground border-t border-border">{def}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ScenarierSection() {
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  function pick(id: number, choice: "A" | "B") { if (revealed[id]) return; setAnswers((prev) => ({ ...prev, [id]: choice })); }
  function reveal(id: number) { if (!answers[id]) return; setRevealed((prev) => ({ ...prev, [id]: true })); }
  return (
    <section>
      <SectionHeader emoji="💬" title="Scenariofrågor" subtitle="Vad gör du? Välj A eller B. Klicka sedan på Visa svar." />
      <div className="grid sm:grid-cols-2 gap-6">
        {SCENARIOS.map((s) => {
          const chosen = answers[s.id] ?? null;
          const isRevealed = !!revealed[s.id];
          const isCorrect = chosen === s.correct;
          return (
            <div key={s.id} className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
              <div>
                <span className="text-4xl">{s.emoji}</span>
                <p className="mt-3 font-medium text-foreground leading-relaxed whitespace-pre-line text-sm">{s.situation}</p>
              </div>
              <div className="space-y-2">
                {(["A", "B"] as const).map((opt) => {
                  const text = opt === "A" ? s.optionA : s.optionB;
                  const isChosen = chosen === opt;
                  const isRight = opt === s.correct;
                  let cls = "border-border bg-background text-foreground hover:border-primary/60";
                  if (isRevealed) { cls = isRight ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300" : isChosen ? "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400" : "border-border bg-background text-muted-foreground opacity-50"; }
                  else if (isChosen) { cls = "border-primary bg-primary/10 text-foreground"; }
                  return (
                    <button key={opt} onClick={() => pick(s.id, opt)} disabled={isRevealed} className={`w-full rounded-lg border px-4 py-3 text-left text-sm leading-relaxed transition-colors ${cls}`}>
                      <span className="font-bold mr-2">{opt})</span>{text}
                      {isRevealed && isRight && <FaCheck className="inline ml-2 text-emerald-500" />}
                      {isRevealed && isChosen && !isRight && <FaTimes className="inline ml-2 text-red-500" />}
                    </button>
                  );
                })}
              </div>
              {!isRevealed && <button onClick={() => reveal(s.id)} disabled={!chosen} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Visa svar</button>}
              {isRevealed && (
                <div className={`rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line border ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300" : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"}`}>
                  <p className="font-bold mb-1">{isCorrect ? "✅ Rätt!" : "❌ Fel — men bra försök!"}</p>
                  <p className="font-semibold mb-1">Förklaring:</p><p>{s.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function QuizSection() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? QUIZ.filter((q) => answers[q.id] === q.correct).length : 0;
  function reset() { setAnswers({}); setSubmitted(false); }
  return (
    <section>
      <SectionHeader emoji="🧠" title="Quiz — 10 frågor" subtitle="Välj ett svar på varje fråga. Klicka på Rätta när du är klar." />
      <div className="space-y-6">
        {QUIZ.map((q, qi) => {
          const chosen = answers[q.id];
          const isCorrect = chosen === q.correct;
          return (
            <div key={q.id} className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold text-foreground mb-4 text-base leading-relaxed"><span className="text-primary font-bold mr-2">{qi + 1}.</span>{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi; const isRight = oi === q.correct;
                  let cls = "border-border bg-background text-foreground hover:border-primary/60";
                  if (submitted) { cls = isRight ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300" : isChosen ? "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400" : "border-border opacity-50 text-muted-foreground bg-background"; }
                  else if (isChosen) { cls = "border-primary bg-primary/10 text-foreground"; }
                  return (
                    <button key={oi} onClick={() => !submitted && setAnswers((prev) => ({ ...prev, [q.id]: oi }))} disabled={submitted} className={`w-full rounded-lg border px-4 py-3 text-left text-sm leading-relaxed transition-colors ${cls}`}>
                      <span className="font-bold mr-2">{String.fromCharCode(65 + oi)})</span>{opt}
                    </button>
                  );
                })}
              </div>
              {submitted && <div className={`mt-3 rounded-lg px-4 py-3 text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"}`}>{isCorrect ? "✅" : "❌"} <strong>{q.explanation}</strong></div>}
            </div>
          );
        })}
      </div>
      <div className="mt-8 rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {submitted ? (
          <>
            <div className="text-center sm:text-left">
              <div className={`text-4xl font-bold ${score >= 8 ? "text-emerald-600 dark:text-emerald-400" : score >= 5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{score} / 10</div>
              <div className="text-muted-foreground text-sm mt-1">{score === 10 ? "Perfekt! 🏆" : score >= 8 ? "Bra jobbat! 🌟" : score >= 5 ? "Bra försök! Läs igenom igen." : "Försök igen! Du lär dig mer för varje gång."}</div>
            </div>
            <button onClick={reset} className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">Gör om quizet</button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground text-sm">{Object.keys(answers).length} av 10 frågor besvarade.</p>
            <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < 10} className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Rätta svaren</button>
          </>
        )}
      </div>
    </section>
  );
}

function SammanfattningSection() {
  return (
    <section>
      <SectionHeader emoji="✅" title="Sammanfattning" subtitle="Det här är det viktigaste att komma ihåg." />
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
        <ul className="space-y-4">
          {SAMMANFATTNING.map(({ emoji, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{emoji}</span>
              <p className="text-foreground leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Forflyttningsteknik() {
  return (
    <div>
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 pb-20 space-y-20 mt-12">
        <MemoryGameSection />
        <SnabbfaktaSection />
        <FaktaruterSection />
        <BegreppSection />
        <ScenarierSection />
        <QuizSection />
        <SammanfattningSection />
      </div>
    </div>
  );
}
