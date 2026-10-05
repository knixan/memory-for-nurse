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
  "text-teal-600 dark:text-teal-400", "text-sky-600 dark:text-sky-400", "text-violet-600 dark:text-violet-400",
  "text-emerald-600 dark:text-emerald-400", "text-rose-600 dark:text-rose-400", "text-amber-600 dark:text-amber-400",
  "text-cyan-600 dark:text-cyan-400", "text-indigo-600 dark:text-indigo-400", "text-pink-600 dark:text-pink-400",
  "text-lime-600 dark:text-lime-400", "text-orange-600 dark:text-orange-400", "text-blue-600 dark:text-blue-400",
  "text-green-600 dark:text-green-400", "text-red-600 dark:text-red-400", "text-purple-600 dark:text-purple-400",
  "text-yellow-600 dark:text-yellow-400", "text-fuchsia-600 dark:text-fuchsia-400", "text-slate-500 dark:text-slate-400",
  "text-zinc-600 dark:text-zinc-400", "text-stone-600 dark:text-stone-400",
];

const RAW_CARDS = [
  { id: 1,  content: "REM-sömn",             icon: <FaBrain         className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[0]  },
  { id: 2,  content: "Drömmar och minneslagring", icon: <FaStar      className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[10] },
  { id: 3,  content: "NREM-sömn",            icon: <FaHospitalAlt   className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[5]  },
  { id: 4,  content: "Djupsömn — kroppen återhämtar sig", icon: <FaShieldAlt className="text-2xl" />, matchId: 2, textColor: CARD_COLORS[15] },
  { id: 5,  content: "Sömnhygien",           icon: <FaLightbulb     className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[2]  },
  { id: 6,  content: "Vanor som förbättrar sömnen", icon: <FaCheck   className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[12] },
  { id: 7,  content: "Dygnsrytm",            icon: <FaComments      className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[8]  },
  { id: 8,  content: "Kroppens inre klocka",  icon: <FaEye           className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[3]  },
  { id: 9,  content: "Sömnbrist",            icon: <FaTimes         className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[14] },
  { id: 10, content: "Sämre immunförsvar och sårläkning", icon: <FaBalanceScale className="text-2xl" />, matchId: 5, textColor: CARD_COLORS[7]  },
  { id: 11, content: "Insomni",              icon: <FaWheelchair    className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[1]  },
  { id: 12, content: "Svårt att somna eller sova", icon: <FaUserAlt  className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[11] },
  { id: 13, content: "Sömnapné",             icon: <FaStethoscope   className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[6]  },
  { id: 14, content: "Andningsuppehåll under sömnen", icon: <FaGavel className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[16] },
  { id: 15, content: "Melatonin",            icon: <FaHeart         className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[13] },
  { id: 16, content: "Hormon som reglerar sömnrytmen", icon: <FaHandsHelping className="text-2xl" />, matchId: 8, textColor: CARD_COLORS[4]  },
  { id: 17, content: "Sömnmiljö",            icon: <FaComments      className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[9]  },
  { id: 18, content: "Mörkt, tyst, lagom temperatur", icon: <FaCheck className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[17] },
  { id: 19, content: "Nattarbete",           icon: <FaBrain         className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[18] },
  { id: 20, content: "Anpassad vård under natten", icon: <FaHeart    className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[19] },
];

const SNABBFAKTA = [
  { emoji: "🌙", text: "Vuxna behöver 7–9 timmar sömn per natt för optimal återhämtning." },
  { emoji: "🔕", text: "Undvik att väcka patienter i onödan — planera nattliga insatser." },
  { emoji: "💡", text: "Starkt ljus på natten stör melatoninproduktionen och sömncykeln." },
  { emoji: "😣", text: "Smärta är en vanlig orsak till sömnsvårigheter — fråga om smärtlindring behövs." },
  { emoji: "🌡️", text: "Optimal sovtemperatur är ca 16–18°C — lite svalare än dagstemperatur." },
  { emoji: "🧠", text: "Sömnbrist ökar risken för förvirring (konfusion) hos äldre patienter." },
  { emoji: "📋", text: "Dokumentera sömnkvaliteten — del av patientens hälsotillstånd." },
  { emoji: "🌿", text: "Icke-farmakologiska metoder: lugn musik, varm dryck, massage." },
];

const BEGREPP = [
  { term: "REM-sömn",         def: "Rapid Eye Movement — sömnfas med drömmar och minneslagring. Hjärnan är aktiv." },
  { term: "NREM-sömn",        def: "Icke-REM sömn — tre stadier från lättsömn till djupsömn där kroppen återhämtar sig." },
  { term: "Sömnhygien",       def: "Vanor och rutiner som förbättrar sömnen — regelbundna tider, mörkt rum, undvika skärmar." },
  { term: "Dygnsrytm",        def: "Kroppens biologiska 24-timmarsklocka som reglerar sömn, hormoner och temperatur." },
  { term: "Insomni",          def: "Sömnstörning med svårighet att somna, sova igenom natten eller vakna för tidigt." },
  { term: "Sömnapné",         def: "Andningsuppehåll under sömnen — leder till fragmenterad sömn och dagtrötthet." },
  { term: "Melatonin",        def: "Hormon som utsöndras av tallkottkörteln vid mörker — signalerar att det är dags att sova." },
  { term: "Konfusion",        def: "Förvirring — vanligt vid sömnbrist, infektion, läkemedel eller snabba miljöbyten." },
  { term: "Sömnbrist",        def: "Att sova för lite — försämrar immunförsvar, sårläkning, kognition och humör." },
  { term: "Vila",             def: "Avslappning utan sömn — minskar trötthet och stress, viktigt komplement till sömn." },
];

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: "🌙",
    situation: "Det är 03.00. En patient sover.\nDu ska kontrollera vitala parametrar.",
    optionA: "Du väcker patienten och utför kontrollen.",
    optionB: "Om det inte är brådskande — dokumenterar och väntar till en rimligare tid.",
    correct: "B",
    explanation: "Onödiga störningar på natten försämrar sömnen och återhämtningen.\nPlanera nattliga kontroller klokt — sömn är en del av vården.",
  },
  {
    id: 2,
    emoji: "😰",
    situation: "En äldre patient är förvirrad och rastlös kl 22.\nHan brukar sova bra.",
    optionA: "Du tänker att det är normalt och går vidare.",
    optionB: "Du undersöker möjliga orsaker: smärta, oro, behöver toaletten? Rapporterar till sjuksköterska.",
    correct: "B",
    explanation: "Plötslig förvirring kan bero på smärta, infektion eller sömnbrist.\nRapportera alltid — det kan vara ett tidigt tecken på försämring.",
  },
  {
    id: 3,
    emoji: "💊",
    situation: "En patient säger att hen aldrig kan sova utan sömnpiller.\nDen inte är ordinerad sömnmedicin.",
    optionA: "Du ger inte medicin — du är inte delegerad för det. Rapporterar till sjuksköterskan.",
    optionB: "Du hämtar ett sömnpiller från medicinförrådet.",
    correct: "A",
    explanation: "Du får aldrig ge medicin utan delegation.\nRapportera till sjuksköterskan som kan ordinera vid behov.",
  },
  {
    id: 4,
    emoji: "🛌",
    situation: "En patient klagar på att rummet är för ljust och bullrigt.\nHon sover dåligt på avdelningen.",
    optionA: "Du förklarar att det är svårt att göra något åt det.",
    optionB: "Du drar för gardiner, stänger dörren och minskar ljud — utan att kompromissa med säkerheten.",
    correct: "B",
    explanation: "Sömnmiljön är en viktig del av omvårdnaden.\nSmå åtgärder kan göra stor skillnad för sömnkvaliteten.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Hur många timmar sömn behöver en vuxen per natt?",
    options: ["4–5 timmar.", "6–7 timmar.", "7–9 timmar.", "10–12 timmar."],
    correct: 2,
    explanation: "7–9 timmar rekommenderas för vuxna. Äldre kan behöva något mindre men sömn är fortfarande viktig.",
  },
  {
    id: 2,
    question: "Vad är REM-sömn?",
    options: ["Djupaste sömnstadiet.", "Sömnfas med drömmar och minneslagring.", "Lättsömn utan drömmar.", "Vakenhet under natten."],
    correct: 1,
    explanation: "REM-sömn (Rapid Eye Movement) är när hjärnan bearbetar minnen och drömmar uppstår.",
  },
  {
    id: 3,
    question: "Vilket hormon reglerar sömncykeln?",
    options: ["Insulin.", "Adrenalin.", "Melatonin.", "Kortisol."],
    correct: 2,
    explanation: "Melatonin utsöndras vid mörker och signalerar till kroppen att det är dags att sova.",
  },
  {
    id: 4,
    question: "Vad kan sömnbrist orsaka hos patienter?",
    options: ["Bättre aptit.", "Snabbare sårläkning.", "Förvirring och sämre immunförsvar.", "Lägre blodtryck."],
    correct: 2,
    explanation: "Sömnbrist försämrar immunförsvar, sårläkning, kognition och ökar risken för konfusion hos äldre.",
  },
  {
    id: 5,
    question: "Vad är sömnapné?",
    options: ["Sömnstörning med mardrömmar.", "Andningsuppehåll under sömnen.", "Att sova för länge.", "Snarkningar utan andningsuppehåll."],
    correct: 1,
    explanation: "Sömnapné innebär att andningen stannar upprepade gånger under sömnen — leder till fragmenterad sömn.",
  },
  {
    id: 6,
    question: "Vilken temperatur är optimal för sömn?",
    options: ["22–25°C.", "10–12°C.", "16–18°C.", "28–30°C."],
    correct: 2,
    explanation: "Ca 16–18°C anses optimalt — lite svalare än dagstemperatur hjälper kroppen att kyla ner sig inför sömn.",
  },
  {
    id: 7,
    question: "Vad är sömnhygien?",
    options: ["Att tvätta sig innan läggdags.", "Vanor och rutiner som förbättrar sömnkvaliteten.", "Att byta sänglinne regelbundet.", "Medicinsk behandling mot sömnbrist."],
    correct: 1,
    explanation: "Sömnhygien inkluderar regelbundna rutiner, undvika koffein, mörkt rum och regelbundna sovtider.",
  },
  {
    id: 8,
    question: "Vad är insomni?",
    options: ["Att sova för länge.", "Sömnstörning med svårighet att somna eller sova igenom natten.", "Nattliga mardrömmar.", "Sömnighet på dagen."],
    correct: 1,
    explanation: "Insomni är en vanlig sömnstörning — kan behandlas med sömnhygien, kognitiv terapi eller medicin.",
  },
  {
    id: 9,
    question: "Hur kan du som undersköterska förbättra patientens sömnmiljö?",
    options: ["Öka belysningen under natten.", "Dämpa ljud och ljus, stänga dörren.", "Väcka patienten för kontroller varje timme.", "Ha TV på hela natten."],
    correct: 1,
    explanation: "Dämpad belysning, lägre ljud och stängd dörr kan göra stor skillnad för sömnkvaliteten.",
  },
  {
    id: 10,
    question: "Varför är det viktigt att dokumentera sömnkvaliteten?",
    options: ["Det är ett lagkrav.", "Det ger information om patientens återhämtning och eventuella problem.", "Det är bara administrativt.", "Bara läkaren behöver veta."],
    correct: 1,
    explanation: "Sömnkvalitet är en del av hälsotillståndet — dålig sömn kan indikera smärta, ångest eller medicinbiverkning.",
  },
];

const SAMMANFATTNING = [
  { emoji: "🌙", text: "Sömn är grundläggande för återhämtning — planera nattliga insatser för att minimera störningar." },
  { emoji: "🔕", text: "Undvik onödiga störningar på natten — väck inte patienten i onödan." },
  { emoji: "💡", text: "Sänk belysning och ljud på kvällen — hjälper patienten att somna." },
  { emoji: "😣", text: "Fråga om smärta vid sömnsvårigheter — smärta är en vanlig orsak." },
  { emoji: "🧠", text: "Sömnbrist kan orsaka förvirring (konfusion) — rapportera förändringar." },
  { emoji: "🌿", text: "Prova icke-farmakologiska metoder: lugn musik, varm dryck, massage." },
  { emoji: "📋", text: "Dokumentera sömnkvaliteten som en del av patientens hälsotillstånd." },
  { emoji: "💊", text: "Ge aldrig sömnmedicin utan delegation — rapportera behov till sjuksköterskan." },
];

const FAKTARUTOR = [
  {
    id: "sömnfaser",
    emoji: "🌙",
    title: "Sömnens faser",
    short: "NREM och REM — kroppen och hjärnan återhämtar sig i olika stadier.",
    bullets: [
      "NREM 1 (lättsömn): övergångsfas, lätt att väckas.",
      "NREM 2: hjärtfrekvens sjunker, kroppstemperaturen minskar.",
      "NREM 3 (djupsömn): svår att väckas, kroppen reparerar vävnad.",
      "REM: hjärnan är aktiv, drömmar, minneslagring.",
      "En normal natt: 4–6 sömnscykler à ca 90 minuter.",
    ],
  },
  {
    id: "sömnbrist",
    emoji: "⚠️",
    title: "Konsekvenser av sömnbrist",
    short: "Påverkar hela kroppen negativt.",
    bullets: [
      "Sämre immunförsvar — ökad infektionsrisk.",
      "Långsammare sårläkning.",
      "Förvirring (konfusion) — vanligt hos äldre.",
      "Sämre smärttröskel.",
      "Förhöjt blodtryck och ökad hjärtrisk på sikt.",
    ],
  },
  {
    id: "sömnhygien",
    emoji: "🌿",
    title: "Sömnhygien och miljö",
    short: "Rätt vanor och miljö förbättrar sömnen.",
    bullets: [
      "Regelbundna sovtider — samma tid varje dag.",
      "Svalare rum ca 16–18°C.",
      "Mörkt och tyst rum — eller öronproppar och ögonmask.",
      "Undvik starkt ljus och skärmar 1–2 timmar innan sömn.",
      "Undvik koffein efter kl 14–15.",
    ],
  },
  {
    id: "icke-farmakologiskt",
    emoji: "🎵",
    title: "Icke-farmakologiska metoder",
    short: "Prova naturliga metoder innan medicin.",
    bullets: [
      "Lugn musik eller naturljud.",
      "Varm (inte het) dryck — mjölk, te utan koffein.",
      "Lätt massage av rygg eller fötter.",
      "Djupandningsövningar och avslappning.",
      "Läsning av en bok — om skärmar undviks.",
    ],
  },
  {
    id: "nattrutiner",
    emoji: "🌃",
    title: "Nattliga rutiner i vården",
    short: "Planera för minimal störning.",
    bullets: [
      "Planera kontroller för att störa sömnen så lite som möjligt.",
      "Dämpa belysning — använd nattlampa, inte takbelysning.",
      "Tala med låg röst och rör dig försiktigt.",
      "Erbjud toalettbesök innan sänggåendet.",
      "Kontrollera att patienten inte har smärta eller obehag.",
    ],
  },
  {
    id: "sömnstörningar",
    emoji: "😰",
    title: "Vanliga sömnstörningar",
    short: "Insomni, apné och restless legs.",
    bullets: [
      "Insomni: svårt att somna eller sova igenom natten.",
      "Sömnapné: andningsuppehåll — behandlas med CPAP-mask.",
      "Restless legs: obehagliga krypningar i benen — störer insomning.",
      "Konfusionssymtom på natten — ofta tecken på underliggande problem.",
      "Rapportera sömnstörningar till sjuksköterskan för bedömning.",
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
        <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium mb-6">Vård och omsorg</span>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
          Sömn<br /><span className="text-white/80">och vila</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl mb-8">
          Lär dig om sömnens betydelse för läkning, hur du skapar en god sömnmiljö och vad du gör när patienter sover dåligt.
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
      <SectionHeader emoji="💬" title="Scenariofrågor" subtitle="Vad gör du? Välj A eller B. Klicka sedan på Visa svar." />
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

export default function SomnOchVila() {
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
