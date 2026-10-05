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
  { id: 1,  content: "Patientjournal",          icon: <FaComments      className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[0]  },
  { id: 2,  content: "Dokumentation om patientens vård", icon: <FaStar  className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[10] },
  { id: 3,  content: "PDL",                     icon: <FaGavel         className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[5]  },
  { id: 4,  content: "Patientdatalagen",         icon: <FaShieldAlt     className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[15] },
  { id: 5,  content: "SBAR",                    icon: <FaBrain         className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[2]  },
  { id: 6,  content: "Strukturerat sätt att rapportera", icon: <FaComments className="text-2xl" />, matchId: 3, textColor: CARD_COLORS[12] },
  { id: 7,  content: "Sekretess",               icon: <FaEye           className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[8]  },
  { id: 8,  content: "Tystnadsplikt om patienten", icon: <FaHandsHelping className="text-2xl" />, matchId: 4, textColor: CARD_COLORS[3]  },
  { id: 9,  content: "SOAP",                    icon: <FaLightbulb     className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[14] },
  { id: 10, content: "Journalanteckningsstruktur", icon: <FaCheck       className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[7]  },
  { id: 11, content: "ICF",                     icon: <FaHospitalAlt   className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[1]  },
  { id: 12, content: "Klassifikation av funktionstillstånd", icon: <FaBalanceScale className="text-2xl" />, matchId: 6, textColor: CARD_COLORS[11] },
  { id: 13, content: "Signering",               icon: <FaUserAlt       className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[6]  },
  { id: 14, content: "Skriva under utförd åtgärd", icon: <FaCheck       className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[16] },
  { id: 15, content: "Avvikelserapport",        icon: <FaTimes         className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[13] },
  { id: 16, content: "Dokumentera fel och tillbud", icon: <FaWheelchair className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[4]  },
  { id: 17, content: "Skiftrapport",            icon: <FaStethoscope   className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[9]  },
  { id: 18, content: "Informationsöverföring vid passbytet", icon: <FaHeart className="text-2xl" />, matchId: 9, textColor: CARD_COLORS[17] },
  { id: 19, content: "Genomförandeplan",        icon: <FaBrain         className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[18] },
  { id: 20, content: "Hur vården ska genomföras", icon: <FaHandsHelping className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[19] },
];

const SNABBFAKTA = [
  { emoji: "📝", text: "Skriv i journalen direkt efter en åtgärd — inte timmar senare." },
  { emoji: "🔒", text: "Tystnadsplikt gäller allt om patienten — även för anhöriga om patienten inte samtyckt." },
  { emoji: "✍️", text: "Signera alltid — utan signering är dokumentationen inte juridiskt giltig." },
  { emoji: "📢", text: "Rapportera med SBAR: Situation · Bakgrund · Aktuellt · Rekommendation." },
  { emoji: "⚠️", text: "Avvikelserapport ska skrivas vid alla fel och tillbud — inte bara olyckor." },
  { emoji: "📋", text: "Genomförandeplanen visar hur vården ska utföras och uppdateras regelbundet." },
  { emoji: "👁️", text: "Dokumentera vad du såg, inte vad du tror — objektivt alltid." },
  { emoji: "⚖️", text: "PDL (Patientdatalagen) reglerar vem som får läsa och skriva i journalen." },
];

const BEGREPP = [
  { term: "Patientjournal",    def: "Samlad dokumentation om en patients hälsa, vård och behandling." },
  { term: "PDL",               def: "Patientdatalagen — lag som styr hur journaluppgifter får hanteras och delas." },
  { term: "Sekretess",         def: "Tystnadsplikt — du får inte dela information om patienten utan samtycke." },
  { term: "SBAR",              def: "Situation · Bakgrund · Aktuellt · Rekommendation — strukturerad rapportmetod." },
  { term: "SOAP",              def: "Journalstruktur: Subjektivt (vad patienten säger) · Objektivt (vad du ser) · Analys · Plan." },
  { term: "Signering",         def: "Att skriva under sin dokumentation — bekräftar att du utfört åtgärden." },
  { term: "Avvikelserapport",  def: "Dokumentation om fel, tillbud eller olyckor — del av patientsäkerhetsarbetet." },
  { term: "Genomförandeplan",  def: "Dokument som beskriver hur vård och omsorg ska genomföras för en specifik patient." },
  { term: "ICF",               def: "International Classification of Functioning — klassificerar funktionstillstånd, inte enbart diagnos." },
  { term: "Skiftrapport",      def: "Muntlig eller skriftlig informationsöverlämning vid arbetspassbyte." },
];

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: "📝",
    situation: "Du gav medicin till en patient kl 09:00.\nDu glömde dokumentera. Det är nu kl 14:00.",
    optionA: "Du dokumenterar nu med rätt tidpunkt (kl 09:00) och signerar.",
    optionB: "Du hoppar över det — det gick ju bra.",
    correct: "A",
    explanation: "Dokumentera alltid — även i efterhand, med rätt tidpunkt.\nEn avslutat utan dokumentation är juridiskt ogiltig.",
  },
  {
    id: 2,
    emoji: "📞",
    situation: "En anhörig ringer och frågar om sin mammas hälsotillstånd.\nDu känner inte till om patienten gett samtycke.",
    optionA: "Du delar information — de är ju familj.",
    optionB: "Du berättar att du inte kan lämna ut information utan patientens samtycke.",
    correct: "B",
    explanation: "Sekretessen gäller även för anhöriga.\nFråga patienten (om möjligt) eller kontrollera om samtycke finns dokumenterat.",
  },
  {
    id: 3,
    emoji: "⚠️",
    situation: "Du råkade ge fel dos av ett läkemedel.\nPatienten verkar inte ha tagit skada.",
    optionA: "Du gör ingenting — det gick ju bra.",
    optionB: "Du rapporterar till sjuksköterskan och skriver en avvikelserapport.",
    correct: "B",
    explanation: "Alla medicinska fel ska rapporteras — oavsett om patienten tog skada.\nDet är grunden för patientsäkerhetsarbete.",
  },
  {
    id: 4,
    emoji: "🗣️",
    situation: "Du ska rapportera till sjuksköterskan om en patient\nsom fått försämrad andning.",
    optionA: "Du ringer och säger: 'Patienten i rum 4 mår lite dåligt.'",
    optionB: "Du rapporterar med SBAR: Situation, Bakgrund, Aktuellt, Rekommendation.",
    correct: "B",
    explanation: "SBAR ger sjuksköterskan all viktig information strukturerat.\n'Mår lite dåligt' ger ingen handlingsbar information.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Vad betyder SBAR?",
    options: [
      "Situation · Bakgrund · Aktuellt · Rekommendation.",
      "Säkerhet · Beredskap · Ansvar · Resultat.",
      "Sjukdom · Blod · Andning · Röntgen.",
      "Sömn · Blodtryck · Aptit · Rörelse.",
    ],
    correct: 0,
    explanation: "SBAR är ett strukturerat rapportverktyg: Situation, Bakgrund, Aktuellt tillstånd och Rekommendation.",
  },
  {
    id: 2,
    question: "Vad styr Patientdatalagen (PDL)?",
    options: ["Hur mediciner ordineras.", "Hur journaluppgifter får hanteras och delas.", "Hur vårdpersonal utbildas.", "Hur avdelningar bemannas."],
    correct: 1,
    explanation: "PDL reglerar hantering av patientuppgifter — vem som får läsa, skriva och dela information.",
  },
  {
    id: 3,
    question: "Vad innebär sekretess i vården?",
    options: ["Att patienter inte får kommunicera.", "Att du inte får lämna ut patientuppgifter utan samtycke.", "Att journaler stängs av på natten.", "Att läkare inte informerar patienter."],
    correct: 1,
    explanation: "Tystnadsplikt innebär att du inte delar patientinformation utan att patienten samtyckt — gäller även anhöriga.",
  },
  {
    id: 4,
    question: "Vad är en genomförandeplan?",
    options: ["En lista på alla diagnoser.", "En plan för hur vård och omsorg ska genomföras för en patient.", "En schema för personal.", "En operationsplan."],
    correct: 1,
    explanation: "Genomförandeplanen beskriver hur omvårdnaden ska utföras — personligt anpassad för varje patient.",
  },
  {
    id: 5,
    question: "Vad ska du göra om du gör ett misstag?",
    options: ["Hoppas att ingen märker.", "Rapportera till sjuksköterskan och skriv avvikelserapport.", "Be en kollega om råd och glömma det.", "Dokumentera det som en dag senare."],
    correct: 1,
    explanation: "Alla fel och tillbud ska rapporteras och dokumenteras — det är grunden för att förbättra patientsäkerheten.",
  },
  {
    id: 6,
    question: "Vad innebär SOAP i journalföring?",
    options: [
      "Säker · Omsorgsfull · Ansvarsfull · Professionell.",
      "Subjektivt · Objektivt · Analys · Plan.",
      "Situation · Observation · Åtgärd · Princip.",
      "Sökord · Ordinering · Anteckning · Påskrift.",
    ],
    correct: 1,
    explanation: "SOAP strukturerar journalanteckningar: vad patienten säger, vad du observerar, bedömning och plan.",
  },
  {
    id: 7,
    question: "Vad innebär signering i journalen?",
    options: ["Att läsa igenom andras noteringar.", "Att du skriver under och bekräftar att du utfört åtgärden.", "Att patienten godkänner vården.", "Att chef godkänner dokumentationen."],
    correct: 1,
    explanation: "Signering bekräftar att du utfört åtgärden — utan signering är dokumentationen juridiskt ogiltig.",
  },
  {
    id: 8,
    question: "Vad är en avvikelserapport?",
    options: ["En rapport om bra vård.", "Dokumentation om fel, tillbud eller olyckor.", "En komplettering till journalen.", "En lista på vad som saknas på avdelningen."],
    correct: 1,
    explanation: "Avvikelserapporter är en del av patientsäkerhetsarbetet — alla avvikelser ska rapporteras, oavsett konsekvens.",
  },
  {
    id: 9,
    question: "Vem har rätt att läsa en patients journal?",
    options: ["Alla på sjukhuset.", "Bara läkare.", "Personal som har vård av patienten och behöver informationen.", "Anhöriga utan begränsning."],
    correct: 2,
    explanation: "Bara personal med direkt koppling till patientens vård och som behöver informationen för sin uppgift.",
  },
  {
    id: 10,
    question: "När ska du dokumentera en åtgärd?",
    options: ["En gång per dag.", "I slutet av arbetspasset.", "Direkt efter utförd åtgärd.", "Nästa dag."],
    correct: 2,
    explanation: "Dokumentera direkt — minnet är fräscht och informationen är juridiskt och medicinskt korrekt.",
  },
];

const SAMMANFATTNING = [
  { emoji: "📝", text: "Dokumentera direkt efter utförd åtgärd — inte timmar senare." },
  { emoji: "✍️", text: "Signera alltid — utan signering är dokumentationen juridiskt ogiltig." },
  { emoji: "🔒", text: "Sekretess gäller allt om patienten — även mot anhöriga utan samtycke." },
  { emoji: "📢", text: "Rapportera med SBAR — ger sjuksköterskan tydlig och strukturerad information." },
  { emoji: "⚠️", text: "Skriv avvikelserapport vid alla fel och tillbud — oavsett om patienten tog skada." },
  { emoji: "📋", text: "Genomförandeplanen beskriver hur vården ska ges — uppdatera den vid förändringar." },
  { emoji: "👁️", text: "Dokumentera vad du observerade objektivt — inte dina tolkningar." },
  { emoji: "⚖️", text: "PDL reglerar hantering av patientuppgifter — känna till lagen är ditt ansvar." },
];

const SBAR_STEPS = [
  { letter: "S", word: "Situation", desc: "Vad händer just nu?", example: "\"Patient X i rum 4 är andnöd sedan kl 14:30.\"" },
  { letter: "B", word: "Bakgrund", desc: "Vad är bakgrunden?", example: "\"Hon kom in för höftersättning, 75 år, KOL i anamnesen.\"" },
  { letter: "A", word: "Aktuellt", desc: "Vad har du observerat?", example: "\"SpO2 91%, AF 24/min, patienten säger att det klämmer i bröstet.\"" },
  { letter: "R", word: "Rekommendation", desc: "Vad behöver göras?", example: "\"Behöver du komma och bedöma henne nu?\"" },
];

const FAKTARUTOR = [
  {
    id: "journal",
    emoji: "📓",
    title: "Patientjournalen",
    short: "Rättslig handling — ska vara korrekt och aktuell.",
    bullets: [
      "Journalen är en rättslig handling — felaktig dokumentation kan vara brottslig.",
      "Skriv vad du observerade (objektivt) — inte vad du tror.",
      "Signera alltid med ditt namn och din titel.",
      "Rätta fel med korrekt rättningsmetod — stryk aldrig över.",
      "Dokumentera direkt — aldrig retroaktivt utan tydlig tidsstämpel.",
    ],
  },
  {
    id: "sekretess",
    emoji: "🔒",
    title: "Sekretess och tystnadsplikt",
    short: "Patientinformation är skyddad av lag.",
    bullets: [
      "Tystnadsplikt regleras av Offentlighets- och sekretesslagen (OSL).",
      "Du får inte berätta om patienter för obehöriga — inte ens för familj.",
      "Gäller även utanför arbetstid — t.ex. på sociala medier.",
      "Patienten kan ge samtycke till att dela information.",
      "Brott mot sekretessen kan leda till anmälan och straff.",
    ],
  },
  {
    id: "avvikelse",
    emoji: "⚠️",
    title: "Avvikelserapportering",
    short: "Alla fel och tillbud ska rapporteras.",
    bullets: [
      "Tillbud: händelse som kunde ha lett till skada, men inte ledde det.",
      "Avvikelse: händelse som ledde till eller riskerade att leda till skada.",
      "Lex Maria: allvarliga händelser måste rapporteras till Socialstyrelsen.",
      "Syftet är att lära och förbättra — inte att straffa.",
      "Du är skyldig att rapportera oavsett om du eller kollegan gjorde fel.",
    ],
  },
  {
    id: "genomförandeplan",
    emoji: "📋",
    title: "Genomförandeplan",
    short: "Hur vården ska utföras — personligt anpassad.",
    bullets: [
      "Beskriver konkret hur varje omvårdnadsinsats ska utföras.",
      "Utgår från patientens önskemål och behov.",
      "Uppdateras vid förändringar i patientens tillstånd.",
      "Används som stöd för all vårdpersonal som arbetar med patienten.",
      "Skiljer sig från genomförandedokumentationen (vad som faktiskt gjorts).",
    ],
  },
  {
    id: "pdl",
    emoji: "⚖️",
    title: "Patientdatalagen (PDL)",
    short: "Reglerar hur patientuppgifter hanteras.",
    bullets: [
      "Journalen ägs av regionen/kommunen — inte patienten.",
      "Patienten har rätt att läsa sin journal.",
      "Bara behörig personal får ta del av journalen.",
      "Åtkomst loggas — du kan inte läsa utan att det syns.",
      "Personuppgiftsincidenter (t.ex. obehörig åtkomst) ska anmälas.",
    ],
  },
  {
    id: "icf",
    emoji: "🏥",
    title: "ICF — Klassifikation av funktionstillstånd",
    short: "Bedöm hela personen, inte bara diagnosen.",
    bullets: [
      "ICF = International Classification of Functioning, Disability and Health.",
      "Fokus på vad personen kan och vad som påverkar funktionsförmågan.",
      "Tre dimensioner: kroppsfunktion, aktivitet, delaktighet.",
      "Miljöfaktorer och personliga faktorer beaktas också.",
      "Används inom rehabilitering, LSS och äldrevård.",
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
          Dokumentation<br /><span className="text-white/80">och rapportering</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl mb-8">
          Lär dig skriva korrekt i journalen, rapportera med SBAR och förstå sekretess och patientdatalagen.
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

function SbarVisual() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {SBAR_STEPS.map((s) => (
        <div key={s.letter} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground text-xl font-bold shrink-0">{s.letter}</span>
            <div>
              <p className="font-bold text-foreground">{s.word}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic leading-relaxed">{s.example}</p>
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
      <SectionHeader emoji="📋" title="Snabbfakta" subtitle="Viktiga regler och saker att komma ihåg." />
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground"><span>📢</span> SBAR — så rapporterar du</h3>
        <SbarVisual />
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

export default function DokumentationOchRapportering() {
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
