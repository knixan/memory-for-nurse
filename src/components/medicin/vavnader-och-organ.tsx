"use client";

import { useState, useEffect } from "react";
import React from "react";
import {
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSync,
  FaHeart,
  FaBrain,
  FaStethoscope,
  FaShieldAlt,
  FaBone,
  FaTint,
  FaRunning,
  FaLungs,
  FaLayerGroup,
  FaFlask,
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
  "text-teal-600 dark:text-teal-400", "text-sky-600 dark:text-sky-400", "text-violet-600 dark:text-violet-400",
  "text-emerald-600 dark:text-emerald-400", "text-rose-600 dark:text-rose-400", "text-amber-600 dark:text-amber-400",
  "text-cyan-600 dark:text-cyan-400", "text-indigo-600 dark:text-indigo-400", "text-pink-600 dark:text-pink-400",
  "text-lime-600 dark:text-lime-400", "text-orange-600 dark:text-orange-400", "text-blue-600 dark:text-blue-400",
  "text-green-600 dark:text-green-400", "text-red-600 dark:text-red-400", "text-purple-600 dark:text-purple-400",
  "text-yellow-600 dark:text-yellow-400", "text-fuchsia-600 dark:text-fuchsia-400", "text-slate-500 dark:text-slate-400",
  "text-zinc-600 dark:text-zinc-400", "text-stone-600 dark:text-stone-400",
];

const RAW_CARDS = [
  { id: 1,  content: "Epitelvävnad",              icon: <FaShieldAlt     className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[0]  },
  { id: 2,  content: "Täcker och skyddar",        icon: <FaLayerGroup    className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[10] },
  { id: 3,  content: "Körtelepitel",              icon: <FaFlask         className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[5]  },
  { id: 4,  content: "Tillverkar svett och spott", icon: <FaTint         className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[15] },
  { id: 5,  content: "Bindväv",                   icon: <FaLayerGroup    className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[2]  },
  { id: 6,  content: "Senor och ledband",         icon: <FaRunning       className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[12] },
  { id: 7,  content: "Fettvävnad",                icon: <FaLayerGroup    className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[8]  },
  { id: 8,  content: "Skydd och energireserv",    icon: <FaShieldAlt     className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[3]  },
  { id: 9,  content: "Broskvävnad",               icon: <FaLayerGroup    className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[14] },
  { id: 10, content: "Skyddar lederna",           icon: <FaRunning       className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[7]  },
  { id: 11, content: "Benvävnad",                 icon: <FaBone          className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[1]  },
  { id: 12, content: "Bygger upp skelettet",      icon: <FaBone          className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[11] },
  { id: 13, content: "Skelettmuskel",             icon: <FaRunning       className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[6]  },
  { id: 14, content: "Viljestyrd – du styr den",  icon: <FaCheck         className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[16] },
  { id: 15, content: "Hjärtmuskel",               icon: <FaHeart         className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[13] },
  { id: 16, content: "Tvärstrimmig, jobbar själv", icon: <FaHeart        className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[4]  },
  { id: 17, content: "Blod och lymfa",            icon: <FaTint          className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[9]  },
  { id: 18, content: "Flytande vävnad",           icon: <FaTint          className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[17] },
  { id: 19, content: "Organsystem",               icon: <FaLungs         className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[18] },
  { id: 20, content: "Flera organ som samarbetar", icon: <FaStethoscope  className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[19] },
];

const STEG = [
  { nr: 1, word: "Cell", desc: "Det minsta. Kroppens små byggstenar.", example: "Muskelcell" },
  { nr: 2, word: "Vävnad", desc: "Många lika celler som jobbar ihop.", example: "Muskelvävnad" },
  { nr: 3, word: "Organ", desc: "Flera vävnader som gör ett jobb.", example: "Hjärtat" },
  { nr: 4, word: "Organsystem", desc: "Flera organ som samarbetar.", example: "Blodomloppet" },
];

const SNABBFAKTA = [
  { emoji: "🧱", text: "Celler bildar vävnader. Vävnader bildar organ. Organ bildar organsystem." },
  { emoji: "🛡️", text: "Epitel = skydd. Ytepitel täcker. Körtelepitel tillverkar." },
  { emoji: "🔗", text: "Bindväv binder. Fett = skydd och energi. Brosk skyddar leder. Ben bygger skelettet." },
  { emoji: "💪", text: "Bara skelettmuskeln kan du styra själv." },
  { emoji: "❤️", text: "Hjärtmuskel och glatt muskel styrs inte. Kroppen sköter dem." },
  { emoji: "🩸", text: "Flytande vävnad = blod och lymfa." },
  { emoji: "🔢", text: "Det finns 7 sorters vävnad i 4 grupper." },
  { emoji: "🫁", text: "Ett organ har flera sorters celler och ett jobb som inget annat organ kan göra." },
];

const BEGREPP = [
  { term: "Cell",           def: "Kroppens minsta byggsten." },
  { term: "Vävnad",         def: "Många lika celler som gör samma jobb." },
  { term: "Organ",          def: "Flera vävnader som gör ett jobb." },
  { term: "Organsystem",    def: "Flera organ som samarbetar." },
  { term: "Epitel",         def: "Vävnad som täcker och skyddar." },
  { term: "Slemhinna",      def: "Fuktigt skydd inuti kroppen, till exempel i munnen." },
  { term: "Körtel",         def: "Ett organ som tillverkar vätska, till exempel svett." },
  { term: "Brosk",          def: "Mjuk, seg vävnad som skyddar leder." },
  { term: "Viljestyrd",     def: "Du bestämmer själv." },
  { term: "Ej viljestyrd",  def: "Kroppen sköter det själv." },
  { term: "Tvärstrimmig",   def: "Muskel med ränder. Hjärtmuskeln är det." },
  { term: "Lymfa",          def: "Vätska som flyter i lymfkärl." },
];

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: "💪",
    situation: "En patient frågar: 'Kan jag bestämma själv när hjärtat ska slå?'",
    optionA: "Nej. Hjärtmuskeln är inte viljestyrd. Den jobbar av sig själv.",
    optionB: "Ja. Alla muskler kan man styra själv.",
    correct: "A",
    explanation: "Bara skelettmuskeln är viljestyrd.\nHjärtmuskel och glatt muskel styrs inte av dig.",
  },
  {
    id: 2,
    emoji: "🦴",
    situation: "En patient har ont i knät.\nDu vill förklara vad som skyddar leden.",
    optionA: "Broskvävnad. Den är mjuk och seg och skyddar lederna.",
    optionB: "Fettvävnad. Den håller ihop leden.",
    correct: "A",
    explanation: "Brosk sitter i lederna och skyddar dem.\nFett är skydd och energireserv.",
  },
  {
    id: 3,
    emoji: "🩸",
    situation: "Du ska förklara vilken vävnad blod och lymfa är.",
    optionA: "Muskelvävnad.",
    optionB: "Flytande vävnad.",
    correct: "B",
    explanation: "Blod och lymfa är vätskor som transporterar saker i kroppen.\nDe kallas flytande vävnad.",
  },
  {
    id: 4,
    emoji: "🫀",
    situation: "En elev frågar: 'Vad är ett organsystem?'",
    optionA: "Flera organ som samarbetar kring ett jobb, till exempel blodomloppet.",
    optionB: "En enda cell som jobbar själv.",
    correct: "A",
    explanation: "Organsystem = flera organ som samarbetar.\nEn cell är det minsta steget.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Vilken vävnad täcker och skyddar huden?",
    options: ["Epitelvävnad", "Benvävnad", "Blod"],
    correct: 0,
    explanation: "Epitel täcker och skyddar. Det finns i huden och i slemhinnor.",
  },
  {
    id: 2,
    question: "Vad gör broskvävnad?",
    options: ["Skyddar leder", "Tillverkar svett", "Transporterar syre"],
    correct: 0,
    explanation: "Brosk sitter i lederna och skyddar dem.",
  },
  {
    id: 3,
    question: "Vilken muskel kan du styra själv?",
    options: ["Hjärtmuskel", "Skelettmuskel", "Glatt muskel"],
    correct: 1,
    explanation: "Skelettmuskeln är viljestyrd.",
  },
  {
    id: 4,
    question: "Blod och lymfa är …",
    options: ["stödjevävnad", "flytande vävnad", "muskelvävnad"],
    correct: 1,
    explanation: "Blod och lymfa är vätskor. De kallas flytande vävnad.",
  },
  {
    id: 5,
    question: "Vad är ett organsystem?",
    options: ["En cell", "Flera organ som samarbetar", "En sorts fett"],
    correct: 1,
    explanation: "Flera organ som samarbetar kallas organsystem.",
  },
  {
    id: 6,
    question: "Vad tillverkar körtelepitel?",
    options: ["Vätskor och hormoner", "Ben", "Senor"],
    correct: 0,
    explanation: "Körtelepitel tillverkar vätskor och hormoner, till exempel svett, spott och bröstmjölk.",
  },
  {
    id: 7,
    question: "Hur många sorters vävnad finns det?",
    options: ["3", "7", "12"],
    correct: 1,
    explanation: "Det finns 7 sorters vävnad i 4 grupper.",
  },
  {
    id: 8,
    question: "Vad är bindväv bra på?",
    options: ["Binder ihop delar i kroppen", "Transporterar blod", "Tillverkar spott"],
    correct: 0,
    explanation: "Bindväv binder ihop. Exempel är senor och ledband.",
  },
  {
    id: 9,
    question: "Vad betyder tvärstrimmig?",
    options: ["Muskel med ränder", "Vätska i lymfkärl", "Mjuk och seg vävnad"],
    correct: 0,
    explanation: "Tvärstrimmig är en muskel med ränder. Hjärtmuskeln är det.",
  },
  {
    id: 10,
    question: "Vilken ordning är rätt?",
    options: [
      "Organ → cell → vävnad → organsystem",
      "Cell → vävnad → organ → organsystem",
      "Vävnad → organsystem → cell → organ",
    ],
    correct: 1,
    explanation: "Små delar bildar större delar: cell, vävnad, organ, organsystem.",
  },
];

const SAMMANFATTNING = [
  { emoji: "🧱", text: "Cell → vävnad → organ → organsystem. Små delar bildar större delar." },
  { emoji: "🛡️", text: "Epitelvävnad täcker och skyddar. Körtelepitel tillverkar vätskor." },
  { emoji: "🔗", text: "Stödjevävnad är bindväv, fett, brosk och ben." },
  { emoji: "💪", text: "Bara skelettmuskeln är viljestyrd." },
  { emoji: "🩸", text: "Flytande vävnad är blod och lymfa." },
  { emoji: "🫁", text: "Ett organ har flera sorters celler och ett eget jobb." },
  { emoji: "🧠", text: "Organsystem är flera organ som samarbetar, till exempel blodomloppet." },
];

const FAKTARUTOR = [
  {
    id: "epitel",
    emoji: "🛡️",
    title: "Epitelvävnad",
    short: "Kroppens skydd.",
    bullets: [
      "Täcker utsidan och insidan av kroppen.",
      "Finns i huden, slemhinnor och körtlar.",
      "Ytepitel täcker och skyddar.",
      "Körtelepitel tillverkar vätskor och hormoner. Exempel: svett, spott, bröstmjölk.",
      "Cellernas form ger namnet: platt, kubiskt, cylindriskt och skiktat epitel.",
    ],
  },
  {
    id: "stod",
    emoji: "🔗",
    title: "Stödjevävnad",
    short: "Skyddar kroppen och håller ihop den.",
    bullets: [
      "Bindväv binder ihop delar. Exempel: senor och ledband.",
      "Fettvävnad skyddar och är en energireserv.",
      "Broskvävnad skyddar lederna. Den är mjuk och seg.",
      "Benvävnad bygger upp skelettet. Den är hård och stark.",
    ],
  },
  {
    id: "muskel",
    emoji: "💪",
    title: "Muskelvävnad",
    short: "Får kroppen att röra sig.",
    bullets: [
      "Skelettmuskel: du styr den själv. Finns i armar och ben.",
      "Hjärtmuskel: styrs inte. Är tvärstrimmig och jobbar hela tiden.",
      "I hjärtat kan vissa celler leda elektriska signaler.",
      "Glatt muskel: styrs inte. Finns i blodkärl, luftrör och mage-tarm.",
      "Fråga dig: Kan jag styra den själv?",
    ],
  },
  {
    id: "flytande",
    emoji: "🩸",
    title: "Flytande vävnad",
    short: "Transporterar saker i kroppen.",
    bullets: [
      "Blod flyter runt i blodkärlen och transporterar saker.",
      "Lymfa flyter i lymfkärl.",
      "Lymfan går genom lymfkörtlar.",
    ],
  },
  {
    id: "organ",
    emoji: "🫀",
    title: "Organ och organsystem",
    short: "Från ett organ till många som samarbetar.",
    bullets: [
      "Ett organ har flera sorters celler. Exempel: hjärtat, lungorna, magsäcken.",
      "Ett organ har jobb som inget annat organ kan göra.",
      "Organsystem är flera organ som samarbetar.",
      "Exempel: blodomloppet, nervsystemet, andningssystemet.",
      "Fler exempel: matspjälkningen, skelettet och musklerna.",
    ],
  },
];

function SectionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-foreground">
        <span className="text-4xl">{emoji}</span>{title}
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
        <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium mb-6">Medicin</span>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
          Vävnader<br /><span className="text-white/80">och organ</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl mb-8">
          Så är kroppen uppbyggd. Lär dig vad en vävnad, ett organ och ett organsystem är.
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

function StegVisual() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STEG.map((s) => (
        <div key={s.nr} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground text-xl font-bold shrink-0">{s.nr}</span>
            <div>
              <p className="font-bold text-foreground">{s.word}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic leading-relaxed">Exempel: {s.example}</p>
        </div>
      ))}
    </div>
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
      } else { setTimeout(() => { setCards((prev) => prev.map((c) => ({ ...c, isSelected: false }))); setSelected([]); }, 900); }
    }
  }
  const accuracy = moves > 0 ? Math.round((matches / moves) * 100) : 0;
  return (
    <section>
      <SectionHeader emoji="🎮" title="Memory-spel" subtitle="Klicka på två kort som hör ihop. Matchade par försvinner." />
      <div className="rounded-xl border border-border bg-card p-4 mb-6 flex flex-wrap gap-6 items-center justify-between">
        <div className="flex gap-6 text-sm">
          {[{ label: "Matchningar", value: matches, color: "text-emerald-600 dark:text-emerald-400" }, { label: "Drag", value: moves, color: "text-primary" }, { label: "Träffsäkerhet", value: `${accuracy}%`, color: "text-amber-600 dark:text-amber-400" }, { label: "Kvar", value: 10 - matches, color: "text-muted-foreground" }].map(({ label, value, color }) => (
            <div key={label} className="text-center"><div className={`text-2xl font-bold ${color}`}>{value}</div><div className="text-muted-foreground">{label}</div></div>
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
    <section className="space-y-8">
      <SectionHeader emoji="📋" title="Snabbfakta" subtitle="Viktiga saker att komma ihåg." />
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground"><span>🧱</span> Kroppen byggs upp i steg</h3>
        <StegVisual />
      </div>
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
                  <div><p className="font-semibold text-foreground">{f.title}</p><p className="text-xs text-muted-foreground mt-0.5">{f.short}</p></div>
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
      <SectionHeader emoji="💬" title="Scenariofrågor" subtitle="Vad är rätt? Välj A eller B. Klicka sedan på Visa svar." />
      <div className="grid sm:grid-cols-2 gap-6">
        {SCENARIOS.map((s) => {
          const chosen = answers[s.id] ?? null; const isRevealed = !!revealed[s.id]; const isCorrect = chosen === s.correct;
          return (
            <div key={s.id} className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
              <div><span className="text-4xl">{s.emoji}</span><p className="mt-3 font-medium text-foreground leading-relaxed whitespace-pre-line text-sm">{s.situation}</p></div>
              <div className="space-y-2">
                {(["A", "B"] as const).map((opt) => {
                  const text = opt === "A" ? s.optionA : s.optionB; const isChosen = chosen === opt; const isRight = opt === s.correct;
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
          const chosen = answers[q.id]; const isCorrect = chosen === q.correct;
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

export default function VavnaderOchOrgan() {
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
