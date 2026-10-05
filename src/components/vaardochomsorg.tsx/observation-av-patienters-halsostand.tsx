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
  { id: 1,  content: "Blodtryck",             icon: <FaHeart         className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[0]  },
  { id: 2,  content: "Normalt: 90–140/60–90 mmHg", icon: <FaStar     className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[10] },
  { id: 3,  content: "Puls",                  icon: <FaStethoscope   className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[5]  },
  { id: 4,  content: "Normalt: 60–100 slag/min", icon: <FaCheck      className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[15] },
  { id: 5,  content: "Temperatur",            icon: <FaShieldAlt     className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[2]  },
  { id: 6,  content: "Normalt: 36,5–37,5°C",  icon: <FaLightbulb    className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[12] },
  { id: 7,  content: "Andningsfrekvens",      icon: <FaEye           className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[8]  },
  { id: 8,  content: "Normalt: 12–20/min",    icon: <FaComments      className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[3]  },
  { id: 9,  content: "Syremättnad (SpO2)",    icon: <FaBalanceScale  className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[14] },
  { id: 10, content: "Normalt: 95–100%",      icon: <FaWheelchair    className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[7]  },
  { id: 11, content: "NEWS",                  icon: <FaHospitalAlt   className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[1]  },
  { id: 12, content: "Tidigt varningsmätning vid försämring", icon: <FaGavel className="text-2xl" />, matchId: 6, textColor: CARD_COLORS[11] },
  { id: 13, content: "NRS",                   icon: <FaBrain         className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[6]  },
  { id: 14, content: "Smärtskattningsskala 0–10", icon: <FaUserAlt   className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[16] },
  { id: 15, content: "Diures",                icon: <FaTimes         className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[13] },
  { id: 16, content: "Urinmängd per dygn",    icon: <FaHandsHelping  className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[4]  },
  { id: 17, content: "Vätskebalans",          icon: <FaComments      className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[9]  },
  { id: 18, content: "Intag minus förlust",   icon: <FaCheck         className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[17] },
  { id: 19, content: "RLS-85",               icon: <FaEye           className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[18] },
  { id: 20, content: "Bedömning av medvetandegrad", icon: <FaHeart   className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[19] },
];

const SNABBFAKTA = [
  { emoji: "❤️", text: "Normalt blodtryck: systoliskt 90–140, diastoliskt 60–90 mmHg." },
  { emoji: "🩺", text: "Normal puls: 60–100 slag per minut. Arytmi = oregelbunden puls — rapportera!" },
  { emoji: "🌡️", text: "Feber definieras som temp över 38,0°C. Under 36°C kallas hypotermi." },
  { emoji: "🫁", text: "Normal andningsfrekvens: 12–20 andetag/min. Mer än 20 = takypné." },
  { emoji: "💉", text: "Syremättnad (SpO2) under 95% är alarmerande — rapportera omgående." },
  { emoji: "📊", text: "NEWS (National Early Warning Score) summerar vitala parametrar till ett riskpoäng." },
  { emoji: "😣", text: "Använd NRS 0–10 för smärtskattning — 0 = ingen smärta, 10 = värsta tänkbara." },
  { emoji: "💧", text: "Normal diures är ca 1–2 ml per kg per timme (ca 1,5 liter per dygn)." },
];

const BEGREPP = [
  { term: "Blodtryck",          def: "Trycket i blodkärlen. Mäts i mmHg som systoliskt/diastoliskt (t.ex. 120/80)." },
  { term: "Puls",               def: "Hjärtats slag per minut — mäts vid handledsartären eller halsen." },
  { term: "Andningsfrekvens",   def: "Antal andetag per minut — normalt 12–20. Räknas diskret utan att patienten märker det." },
  { term: "Syremättnad (SpO2)", def: "Andelen syre i blodet mätt med pulsoximeter. Normalt 95–100%." },
  { term: "NEWS",               def: "National Early Warning Score — poängsystem som tidigt identifierar patient som försämras." },
  { term: "NRS",                def: "Numeric Rating Scale — smärtskattning 0–10 där 0 = ingen smärta och 10 = outhärdlig." },
  { term: "RLS-85",             def: "Reaktionsnivåskala — bedömer medvetandegrad i 8 nivåer, 1 = vaken, 8 = djup koma." },
  { term: "Diures",             def: "Urinproduktion per tidsenhet — normal ca 1–2 ml/kg/h. Indikator på njurfunktion." },
  { term: "Hypotermi",          def: "Kroppstemperatur under 36°C — kan bero på exponering, infektion eller chock." },
  { term: "Takypné",            def: "Snabb andning — mer än 20 andetag per minut. Tecken på andningsproblem eller feber." },
];

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: "🌡️",
    situation: "Du mäter patientens temperatur: 38,8°C.\nHan verkar trött men klagar inte.",
    optionA: "Temperaturen är inte så hög — du väntar och mäter igen om 4 timmar.",
    optionB: "Du rapporterar till sjuksköterskan omedelbart.",
    correct: "B",
    explanation: "Feber över 38,0°C ska alltid rapporteras — det kan tyda på infektion.\nSjuksköterskan avgör om åtgärd krävs.",
  },
  {
    id: 2,
    emoji: "💉",
    situation: "Du mäter SpO2 med pulsoximeter: 91%.\nPatienten ser lite blekgrå ut.",
    optionA: "Du noterar det och fortsätter med din runda.",
    optionB: "Du rapporterar omedelbart till sjuksköterskan.",
    correct: "B",
    explanation: "SpO2 under 95% är alarmerande — under 90% är ett medicinskt nödläge.\nRapportera direkt och stanna hos patienten.",
  },
  {
    id: 3,
    emoji: "😣",
    situation: "En patient ser smärtpåverkad ut.\nDu frågar hur ont det gör på en skala 0–10.",
    optionA: "Du bedömer smärtan utan att fråga patienten.",
    optionB: "Du frågar patienten och dokumenterar svaret, rapporterar till sjuksköterskan.",
    correct: "B",
    explanation: "Alltid fråga patienten — smärta är subjektiv.\nDokumentera och rapportera för att sjuksköterskan ska kunna ordinera smärtlindring.",
  },
  {
    id: 4,
    emoji: "😵",
    situation: "En äldre patient verkar lite förvirrad och svarar långsamt.\nDet var hon inte igår.",
    optionA: "Du tänker att det är normalt för hennes ålder.",
    optionB: "Du rapporterar förändringen direkt — det kan vara ett tidigt varningstecken.",
    correct: "B",
    explanation: "Plötslig förvirring hos äldre är ett allvarligt tecken — kan bero på infektion, stroke eller lågt blodsocker.\nRapportera alltid plötsliga beteendeförändringar.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Vad är normalt systoliskt blodtryck?",
    options: ["40–80 mmHg.", "90–140 mmHg.", "150–200 mmHg.", "60–90 mmHg."],
    correct: 1,
    explanation: "Normalt systoliskt blodtryck är 90–140 mmHg. Diastoliskt normalt: 60–90 mmHg.",
  },
  {
    id: 2,
    question: "Vad är normal puls för en vuxen?",
    options: ["40–60 slag/min.", "60–100 slag/min.", "100–120 slag/min.", "120–160 slag/min."],
    correct: 1,
    explanation: "Normal vilpuls för vuxna är 60–100 slag per minut.",
  },
  {
    id: 3,
    question: "Vad kallas det om temperaturen är under 36°C?",
    options: ["Hypertoni.", "Takypné.", "Hypotermi.", "Bradykardi."],
    correct: 2,
    explanation: "Hypotermi = kroppstemperatur under 36°C. Kan bero på kyla, infektion eller chock.",
  },
  {
    id: 4,
    question: "Vad är normal andningsfrekvens?",
    options: ["5–10/min.", "12–20/min.", "25–30/min.", "30–40/min."],
    correct: 1,
    explanation: "Normalt: 12–20 andetag per minut. Mer än 20 kallas takypné och ska rapporteras.",
  },
  {
    id: 5,
    question: "Vad mäter en pulsoximeter?",
    options: ["Blodtrycket.", "Syremättnaden i blodet.", "Pulsens styrka.", "Blodsocker."],
    correct: 1,
    explanation: "Pulsoximetern mäter SpO2 — syremättnaden i blodet. Normalt 95–100%.",
  },
  {
    id: 6,
    question: "Vad innebär ett högt NEWS-poäng?",
    options: ["Patienten mår bra.", "Patienten är i akut risk för försämring.", "Det är ingen fara.", "Patienten kan åka hem."],
    correct: 1,
    explanation: "Högt NEWS-poäng (≥5) indikerar att patienten riskerar akut försämring — kräver omedelbar åtgärd.",
  },
  {
    id: 7,
    question: "Vad är NRS-skalan?",
    options: ["En andningsskala.", "En smärtskattningsskala 0–10.", "En blodtrycksskala.", "En medvetandebedömning."],
    correct: 1,
    explanation: "NRS (Numeric Rating Scale) är en smärtskattningsskala. 0 = ingen smärta, 10 = outhärdlig smärta.",
  },
  {
    id: 8,
    question: "Vad är normal SpO2?",
    options: ["80–85%.", "85–90%.", "90–95%.", "95–100%."],
    correct: 3,
    explanation: "Normal syremättnad är 95–100%. Under 95% ska rapporteras. Under 90% är akut.",
  },
  {
    id: 9,
    question: "Vad ska du göra om du ser en plötslig förändring hos en patient?",
    options: ["Vänta och se om det går över.", "Rapportera direkt till sjuksköterskan.", "Ringa anhöriga.", "Ge smärtlindring."],
    correct: 1,
    explanation: "Plötsliga förändringar kan vara allvarliga. Rapportera alltid omedelbart till ansvarig sjuksköterska.",
  },
  {
    id: 10,
    question: "Vad mäter RLS-85?",
    options: ["Blodtryck.", "Smärta.", "Medvetandegraden.", "Andningsfrekvens."],
    correct: 2,
    explanation: "RLS-85 (Reaktionsnivåskala) bedömer medvetandegrad — från vaken och orienterad till djup koma.",
  },
];

const SAMMANFATTNING = [
  { emoji: "❤️", text: "Normalt BT: 90–140/60–90 mmHg. Puls: 60–100/min. Temp: 36,5–37,5°C." },
  { emoji: "🫁", text: "Andningsfrekvens normalt 12–20/min. SpO2 normalt 95–100%." },
  { emoji: "📊", text: "NEWS summerar vitala parametrar — högt poäng kräver omedelbar åtgärd." },
  { emoji: "😣", text: "Använd NRS 0–10 för smärtskattning — fråga alltid patienten." },
  { emoji: "💧", text: "Normal diures ca 1–2 ml/kg/h — dokumentera vätskebalansen." },
  { emoji: "😵", text: "Plötslig förvirring är ett allvarligt varningstecken — rapportera alltid." },
  { emoji: "📢", text: "Rapportera alltid avvikelser direkt — vänta inte och se." },
  { emoji: "📝", text: "Dokumentera alla mätvärden med tid och datum." },
];

const VITALA_PARAMETRAR = [
  { emoji: "❤️", label: "Blodtryck", normal: "90–140 / 60–90 mmHg", lågt: "< 90/60", högt: "> 140/90" },
  { emoji: "🩺", label: "Puls", normal: "60–100 slag/min", lågt: "< 60 (bradykardi)", högt: "> 100 (takykardi)" },
  { emoji: "🌡️", label: "Temperatur", normal: "36,5–37,5°C", lågt: "< 36,0°C (hypotermi)", högt: "> 38,0°C (feber)" },
  { emoji: "🫁", label: "Andning", normal: "12–20 /min", lågt: "< 12 (bradypné)", högt: "> 20 (takypné)" },
  { emoji: "💉", label: "SpO2", normal: "95–100%", lågt: "< 95% — rapportera!", högt: "–" },
];

const FAKTARUTOR = [
  {
    id: "vitala",
    emoji: "📊",
    title: "Vitala parametrar",
    short: "De fem grundläggande mätvärdena du ska känna till.",
    bullets: [
      "Blodtryck: normalt 90–140/60–90 mmHg.",
      "Puls: normalt 60–100 slag/minut.",
      "Temperatur: normalt 36,5–37,5°C.",
      "Andningsfrekvens: normalt 12–20 andetag/minut.",
      "Syremättnad (SpO2): normalt 95–100%.",
    ],
  },
  {
    id: "news",
    emoji: "🚨",
    title: "NEWS — National Early Warning Score",
    short: "Tidigt varningsmätning som summerar vitala parametrar.",
    bullets: [
      "NEWS ger poäng (0–3) för varje vital parameter baserat på avvikelse.",
      "Totalpoäng summeras: låg = 1–4, medium = 5–6, hög = ≥7.",
      "Hög poäng = omedelbar läkarbedömning.",
      "Hjälper personalen att tidigt agera innan patienten försämras allvarligt.",
      "Dokumentera alla mätvärden noggrant för att NEWS ska fungera.",
    ],
  },
  {
    id: "smärta",
    emoji: "😣",
    title: "Smärtbedömning",
    short: "NRS, VAS och observationsbaserad bedömning.",
    bullets: [
      "NRS: Numeric Rating Scale 0–10. Fråga alltid patienten.",
      "VAS: Visuell analog skala — linje från 0 till 10.",
      "Vid omedvetna patienter: se ansiktsuttryck, grimaser, motorik.",
      "Dokumentera smärtskattning, var smärtan sitter och karaktär.",
      "Rapportera omgående om smärtan är ny, kraftig eller förändrad.",
    ],
  },
  {
    id: "andning",
    emoji: "🫁",
    title: "Observation av andning",
    short: "Frekvens, rytm och andningsarbete.",
    bullets: [
      "Räkna andetag diskret — patienten ändrar andningsmönster om de märker.",
      "Räkna under minst 30 sekunder och multiplicera med 2.",
      "Notera: frekvens, djup, rytm, andningsljud, ansiktsfärg.",
      "Cyanos (blå läppar/naglar) = akut syrebrist — ring sjuksköterska.",
      "Stridor (väsande ljud vid inandning) kan tyda på hinder i luftvägarna.",
    ],
  },
  {
    id: "vätska",
    emoji: "💧",
    title: "Vätskebalans och diures",
    short: "Intag minus förlust — viktigt att dokumentera.",
    bullets: [
      "Diures: normalt 1–2 ml/kg/h (ca 1,5 liter per dygn).",
      "Under 500 ml/dygn (oliguri) kan tyda på njursvikt.",
      "Dokumentera allt intag: dryck, mat, dropp.",
      "Dokumentera förluster: urin, diarré, kräkningar.",
      "Rapportera om patienten urinerar onormalt lite.",
    ],
  },
  {
    id: "medvetande",
    emoji: "🧠",
    title: "Medvetandebedömning — RLS-85",
    short: "Bedöm patientens reaktionsgrad systematiskt.",
    bullets: [
      "RLS 1: Vaken, orienterad — svarar normalt.",
      "RLS 2: Somnolent — trött men väckbar.",
      "RLS 3: Mycket somnolent — väcks av stark stimulering.",
      "RLS 4–8: Koma — kräver akut medicinsk bedömning.",
      "Rapportera alltid om patienten verkar svårare att väcka än normalt.",
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
          Observation av<br /><span className="text-white/80">hälsotillstånd</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl mb-8">
          Lär dig mäta och tolka vitala parametrar, bedöma smärta och medvetande, och veta när du ska rapportera.
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

function VitalaTabell() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary/10 border-b border-border">
            <th className="text-left px-4 py-3 font-semibold text-foreground">Parameter</th>
            <th className="text-left px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-400">Normalt</th>
            <th className="text-left px-4 py-3 font-semibold text-amber-700 dark:text-amber-400">Lågt / för lite</th>
            <th className="text-left px-4 py-3 font-semibold text-red-700 dark:text-red-400">Högt / för mycket</th>
          </tr>
        </thead>
        <tbody>
          {VITALA_PARAMETRAR.map((r, i) => (
            <tr key={r.label} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-background"}`}>
              <td className="px-4 py-3 font-medium text-foreground">{r.emoji} {r.label}</td>
              <td className="px-4 py-3 text-emerald-700 dark:text-emerald-400">{r.normal}</td>
              <td className="px-4 py-3 text-amber-700 dark:text-amber-400">{r.lågt}</td>
              <td className="px-4 py-3 text-red-700 dark:text-red-400">{r.högt}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
      <SectionHeader emoji="📋" title="Snabbfakta" subtitle="Viktiga referensvärden och saker att komma ihåg." />
      <VitalaTabell />
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

export default function ObservationAvPatientersHalsostand() {
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
