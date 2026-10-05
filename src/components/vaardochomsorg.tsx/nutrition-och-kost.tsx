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
  { id: 1,  content: "Protein",               icon: <FaHandsHelping className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[0]  },
  { id: 2,  content: "Bygger muskler och vävnad", icon: <FaStar      className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[10] },
  { id: 3,  content: "Kolhydrater",            icon: <FaHeart         className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[5]  },
  { id: 4,  content: "Kroppens energikälla",   icon: <FaLightbulb     className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[15] },
  { id: 5,  content: "Dysfagi",                icon: <FaStethoscope   className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[2]  },
  { id: 6,  content: "Sväljsvårigheter",        icon: <FaTimes         className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[12] },
  { id: 7,  content: "Aspiration",             icon: <FaEye           className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[8]  },
  { id: 8,  content: "Mat hamnar i luftvägarna", icon: <FaShieldAlt   className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[3]  },
  { id: 9,  content: "MNA",                    icon: <FaBalanceScale  className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[14] },
  { id: 10, content: "Screeningverktyg för undernäring", icon: <FaCheck className="text-2xl" />, matchId: 5, textColor: CARD_COLORS[7]  },
  { id: 11, content: "Enteral nutrition",      icon: <FaHospitalAlt   className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[1]  },
  { id: 12, content: "Näring via sond",        icon: <FaGavel         className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[11] },
  { id: 13, content: "Undernäring",            icon: <FaWheelchair    className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[6]  },
  { id: 14, content: "För lite energi och näring", icon: <FaUserAlt   className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[16] },
  { id: 15, content: "BMI",                    icon: <FaBrain         className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[13] },
  { id: 16, content: "Vikt i förhållande till längd", icon: <FaComments className="text-2xl" />, matchId: 8, textColor: CARD_COLORS[4]  },
  { id: 17, content: "Parenteral nutrition",   icon: <FaComments      className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[9]  },
  { id: 18, content: "Näring direkt i blodbanan", icon: <FaCheck       className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[17] },
  { id: 19, content: "Fett",                   icon: <FaHeart         className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[18] },
  { id: 20, content: "Energi och hjärnfunktion", icon: <FaHandsHelping className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[19] },
];

const SNABBFAKTA = [
  { emoji: "🪑", text: "Patienten ska sitta upprätt minst 45–90 grader vid måltider — minskar aspiration." },
  { emoji: "🥄", text: "Dokumentera hur mycket patienten åt och drack vid varje måltid." },
  { emoji: "⏱️", text: "Stanna i upprättat läge minst 30 minuter efter måltid." },
  { emoji: "💧", text: "Vuxna behöver ca 30 ml vätska per kilo kroppsvikt per dag." },
  { emoji: "🔬", text: "MNA är ett screeningverktyg för att hitta patienter med risk för undernäring." },
  { emoji: "⚠️", text: "Sväljsvårigheter (dysfagi) kräver konsistensanpassad mat — aldrig vanlig mat." },
  { emoji: "📢", text: "Rapportera dålig aptit eller viktminskning direkt till sjuksköterskan." },
  { emoji: "🌡️", text: "Feber, infektion och operation ökar energibehovet kraftigt." },
];

const BEGREPP = [
  { term: "Dysfagi",               def: "Sväljsvårigheter — vanligt vid stroke, Parkinson och hög ålder." },
  { term: "Aspiration",            def: "Mat eller dryck hamnar i luftvägarna istället för i magen — kan ge lunginflammation." },
  { term: "Undernäring",           def: "Kroppen får för lite energi, protein eller näring för att fungera normalt." },
  { term: "MNA",                   def: "Mini Nutritional Assessment — screeningverktyg för att bedöma risk för undernäring." },
  { term: "Enteral nutrition",     def: "Näring som ges via sond (näsgastric eller PEG) direkt till magen eller tarmen." },
  { term: "Parenteral nutrition",  def: "Näring som ges direkt i blodbanan via dropp — används när tarmfunktionen inte fungerar." },
  { term: "BMI",                   def: "Body Mass Index — vikt (kg) delat med längd² (m²). Normalt: 18,5–24,9." },
  { term: "Konsistensanpassning",  def: "Mat och dryck görs tjockare eller mjukare för patienter med sväljsvårigheter." },
  { term: "Protein",               def: "Byggsten för muskler och vävnad — extra viktigt efter operation och vid sårläkning." },
  { term: "Energibehov",           def: "Mängden kalorier kroppen behöver per dag — ökar vid sjukdom, feber och operation." },
];

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: "🍽️",
    situation: "En patient med stroke har svårt att svälja.\nDu ska ge henne lunch.",
    optionA: "Du serverar vanlig gryta och lämnar rummet.",
    optionB: "Du kontrollerar ordinerad konsistens, sätter henne upprätt och stannar under måltiden.",
    correct: "B",
    explanation: "Vid dysfagi finns risk för aspiration.\nKontrollera alltid konsistensordination och sitta kvar.",
  },
  {
    id: 2,
    emoji: "📉",
    situation: "En patient verkar äta allt sämre den senaste veckan.\nHan säger att maten inte smakar.",
    optionA: "Du dokumenterar och rapporterar till sjuksköterskan.",
    optionB: "Du tänker att det nog går över och gör inget.",
    correct: "A",
    explanation: "Dålig aptit kan leda till undernäring snabbt.\nRapportera alltid — sjuksköterskan kan kontakta dietist.",
  },
  {
    id: 3,
    emoji: "💧",
    situation: "En äldre man dricker mycket lite.\nDu misstänker att han är uttorkad.",
    optionA: "Du erbjuder mer dryck och dokumenterar vätskeintaget.",
    optionB: "Du väntar — han säger att han inte är törstig.",
    correct: "A",
    explanation: "Äldre känner sällan törst ordentligt.\nDokumentation av vätskeintag är avgörande — rapportera till sjuksköterska.",
  },
  {
    id: 4,
    emoji: "🏥",
    situation: "En patient ska opereras imorgon.\nHon är redan underviktig.",
    optionA: "Du rapporterar till sjuksköterskan att patienten är underviktig.",
    optionB: "Inget — det är kirurgens ansvar.",
    correct: "A",
    explanation: "Undernäring ökar risken för komplikationer vid operation.\nRapportera — teamet kan sätta in åtgärder.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Vilket läge ska patienten vara i vid måltid?",
    options: ["Fullt liggande.", "Halvsittande ca 30 grader.", "Upprätt 45–90 grader.", "Det spelar ingen roll."],
    correct: 2,
    explanation: "Upprätt position förhindrar aspiration — maten går ner i magen, inte i lungorna.",
  },
  {
    id: 2,
    question: "Vad är aspiration?",
    options: ["Att mat är för varm.", "Att mat hamnar i luftvägarna.", "Att patienten inte vill äta.", "Att mat är för salt."],
    correct: 1,
    explanation: "Aspiration är farligt och kan leda till lunginflammation (aspirationspneumoni).",
  },
  {
    id: 3,
    question: "Vad betyder dysfagi?",
    options: ["Dålig aptit.", "Sväljsvårigheter.", "Dålig matsmältning.", "Allergi mot mat."],
    correct: 1,
    explanation: "Dysfagi innebär svårigheter att svälja — vanligt vid stroke och Parkinsons sjukdom.",
  },
  {
    id: 4,
    question: "Vad är MNA?",
    options: ["En typ av sond.", "En matportion för sjuka.", "Ett screeningverktyg för undernäring.", "En dietplan."],
    correct: 2,
    explanation: "Mini Nutritional Assessment används för att hitta patienter med risk för undernäring.",
  },
  {
    id: 5,
    question: "Hur mycket vätska behöver en vuxen person per dag?",
    options: ["5–10 ml per kg.", "Ca 30 ml per kg.", "1 liter totalt.", "Så mycket de orkar."],
    correct: 1,
    explanation: "Ca 30 ml per kg kroppsvikt per dag — mer vid feber, operation eller värme.",
  },
  {
    id: 6,
    question: "Vad är enteral nutrition?",
    options: ["Näring via blodbanan.", "Näring via munnen.", "Näring via sond till magen eller tarmen.", "Näring via huden."],
    correct: 2,
    explanation: "Enteral nutrition ges via nasogastrisk sond eller PEG när patienten inte kan äta normalt.",
  },
  {
    id: 7,
    question: "Varför är protein viktigt för sjuka patienter?",
    options: ["Det ger energi till hjärnan.", "Det bygger och reparerar muskler och sår.", "Det skyddar mot infektion.", "Det reglerar vätskebalansen."],
    correct: 1,
    explanation: "Protein är extra viktigt vid sjukdom, operation och sårläkning — kroppen förbrukar mer.",
  },
  {
    id: 8,
    question: "Vad ska du dokumentera efter en måltid?",
    options: ["Hur maten smakade.", "Hur mycket patienten åt och drack.", "Om kocken lagade bra mat.", "Hur lång tid måltiden tog."],
    correct: 1,
    explanation: "Dokumentation av matintag ger teamet information om patientens nutritionsstatus.",
  },
  {
    id: 9,
    question: "Vad är ett normalt BMI för en vuxen?",
    options: ["10–15.", "18,5–24,9.", "25–30.", "Över 30."],
    correct: 1,
    explanation: "BMI 18,5–24,9 anses normalt. Under 18,5 är undervikt, över 25 är övervikt.",
  },
  {
    id: 10,
    question: "Vad gör du om en patient verkar dricka för lite?",
    options: ["Gör inget — det är patientens val.", "Erbjuder dryck och dokumenterar vätskeintaget.", "Ger intravenöst dropp direkt.", "Väntar till nästa dag."],
    correct: 1,
    explanation: "Erbjud dryck aktivt och dokumentera — äldre känner sällan törst och behöver påminnas.",
  },
];

const SAMMANFATTNING = [
  { emoji: "🪑", text: "Patienten ska sitta upprätt vid måltid — minst 45–90 grader." },
  { emoji: "⚠️", text: "Vid dysfagi — kontrollera alltid ordinerad konsistens innan du serverar mat." },
  { emoji: "💧", text: "Säkerställ tillräckligt vätskeintag — äldre känner sällan törst." },
  { emoji: "📢", text: "Rapportera dålig aptit eller viktminskning till sjuksköterskan." },
  { emoji: "🥄", text: "Dokumentera alltid hur mycket patienten åt och drack." },
  { emoji: "⏱️", text: "Stanna upprätt minst 30 min efter måltid — minskar reflux och aspiration." },
  { emoji: "🔬", text: "MNA används för att screena för undernäring — viktigt verktyg." },
  { emoji: "🏥", text: "Undernäring ökar risken för komplikationer och försenar läkning." },
];

const FAKTARUTOR = [
  {
    id: "näring",
    emoji: "🥗",
    title: "Makronutrienter",
    short: "Protein, kolhydrater och fett — kroppens byggstenar.",
    bullets: [
      "Protein: bygger och reparerar muskler och vävnad — nyckel vid sårläkning.",
      "Kolhydrater: kroppens främsta energikälla — hjärnan behöver glukos.",
      "Fett: energi, vitamintransport och hjärnfunktion.",
      "Sjuka patienter behöver mer protein än friska.",
      "Feber och operation ökar energibehovet med 20–50%.",
    ],
  },
  {
    id: "dysfagi",
    emoji: "🥄",
    title: "Dysfagi och konsistensanpassning",
    short: "Sväljsvårigheter kräver anpassad mat och dryck.",
    bullets: [
      "Dysfagi är vanligt efter stroke, vid Parkinsons och vid hög ålder.",
      "Mat kan konsistensanpassas: hel, finhackad, mosad eller flytande.",
      "Dryck kan förtjockas med förtyckningsmedel.",
      "IDDSI-skalan klassificerar konsistenser 0–7.",
      "Kontrollera alltid vad som är ordinerat — aldrig gissa.",
    ],
  },
  {
    id: "undernäring",
    emoji: "⚠️",
    title: "Undernäring",
    short: "Vanligt bland sjuka äldre — tidigt ingripande är viktigt.",
    bullets: [
      "Minst 30% av äldre i vården riskerar undernäring.",
      "Tecken: viktminskning, dålig aptit, trötthet, dålig sårläkning.",
      "Konsekvenser: svagare immunsystem, längre vårdtid, fler komplikationer.",
      "MNA-screening hjälper att hitta riskpatienter tidigt.",
      "Dietist kan kopplas in för nutritionsplan.",
    ],
  },
  {
    id: "position",
    emoji: "🪑",
    title: "Rätt position vid måltid",
    short: "Upprätt minskar risken för aspiration.",
    bullets: [
      "Minst 45–90 grader upprätt vid varje måltid.",
      "Stanna upprätt minst 30 minuter efter maten.",
      "Justera sängen om patienten inte kan sitta i stol.",
      "Håll ned tempon — ge en sked i taget.",
      "Undvik att prata med patienten medan de sväljer.",
    ],
  },
  {
    id: "vätska",
    emoji: "💧",
    title: "Vätskebalans",
    short: "Ca 30 ml per kg kroppsvikt per dag.",
    bullets: [
      "Vuxna behöver ca 1,5–2,5 liter vätska per dag.",
      "Äldre märker sällan törst — erbjud dryck aktivt.",
      "Tecken på uttorkning: mörk urin, torr mun, förvirring.",
      "Vätskebalansprotokoll används när noggrann kontroll behövs.",
      "Diarré, kräkning och feber ökar vätskebehovet.",
    ],
  },
  {
    id: "sond",
    emoji: "🏥",
    title: "Enteral och parenteral nutrition",
    short: "Alternativa sätt att ge näring.",
    bullets: [
      "Enteral: via nasogastrisk sond eller PEG (direkt till magen via bukväggen).",
      "Parenteral: näring direkt i blodbanan via central eller perifer venkateter.",
      "Används när patienten inte kan äta och dricka tillräckligt.",
      "Som undersköterska kan du sköta enteral nutrition om du fått delegation.",
      "Kontrollera alltid att sonden sitter rätt — rapportera om något avviker.",
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
          Nutrition<br /><span className="text-white/80">och kost</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl mb-8">
          Lär dig om näring, sväljsvårigheter och hur du säkerställer att patienter får i sig tillräckligt med mat och dryck.
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

export default function NutritionOchKost() {
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
