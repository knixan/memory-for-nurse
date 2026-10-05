"use client";

import { useState, useEffect } from "react";
import React from "react";
import {
  FaHandsHelping,
  FaCheck,
  FaTimes,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaSync,
  FaHeart,
  FaStar,
  FaLightbulb,
  FaBalanceScale,
  FaGavel,
  FaUsers,
  FaTheaterMasks,
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
];

const RAW_CARDS = [
  { id: 1,  content: "Roller i grupp",       icon: <FaTheaterMasks  className="text-2xl" />, matchId: 1, textColor: CARD_COLORS[0]  },
  { id: 2,  content: "T.ex. ledare, medlare, syndabock", icon: <FaUsers className="text-2xl" />, matchId: 1, textColor: CARD_COLORS[10] },
  { id: 3,  content: "Primärgrupp",          icon: <FaHeart         className="text-2xl" />, matchId: 2, textColor: CARD_COLORS[5]  },
  { id: 4,  content: "Familjen",             icon: <FaHandsHelping  className="text-2xl" />, matchId: 2, textColor: CARD_COLORS[7]  },
  { id: 5,  content: "Normer",               icon: <FaBalanceScale  className="text-2xl" />, matchId: 3, textColor: CARD_COLORS[2]  },
  { id: 6,  content: "Oskrivna regler",      icon: <FaGavel         className="text-2xl" />, matchId: 3, textColor: CARD_COLORS[9]  },
  { id: 7,  content: "Konformitet",          icon: <FaUsers         className="text-2xl" />, matchId: 4, textColor: CARD_COLORS[8]  },
  { id: 8,  content: "Att göra som gruppen", icon: <FaCheck         className="text-2xl" />, matchId: 4, textColor: CARD_COLORS[3]  },
  { id: 9,  content: "Åskådareffekt",        icon: <FaEye           className="text-2xl" />, matchId: 5, textColor: CARD_COLORS[4]  },
  { id: 10, content: "Färre hjälper när fler ser på", icon: <FaTimes className="text-2xl" />, matchId: 5, textColor: CARD_COLORS[11] },
  { id: 11, content: "Rosenthaleffekten",    icon: <FaLightbulb     className="text-2xl" />, matchId: 6, textColor: CARD_COLORS[6]  },
  { id: 12, content: "Tro gott — hen lyckas bättre", icon: <FaStar  className="text-2xl" />, matchId: 6, textColor: CARD_COLORS[1]  },
];

const TOTAL_PAIRS = RAW_CARDS.length / 2;

const SNABBFAKTA = [
  { emoji: "🎭", text: "I en grupp får olika personer olika roller. Till exempel ledare eller medlare." },
  { emoji: "👪", text: "Familjen är en nära grupp. En skolklass är en stor grupp." },
  { emoji: "🦠", text: "Känslor kan spridas snabbt i en grupp. Det kallas social smitta." },
  { emoji: "⭐", text: "Hög status betyder att fler lyssnar på dig." },
  { emoji: "📏", text: "Normer visar hur man bör bete sig. Det är inga lagar." },
  { emoji: "👀", text: "Fler personer ser en olycka — färre hjälper till." },
  { emoji: "🧠", text: "Tror du gott om en person kan hen prestera bättre." },
  { emoji: "🙋", text: "Konformitet betyder att man gör som gruppen." },
];

const BEGREPP = [
  { term: "Socialisation",      def: "Vi lär oss normer och värderingar hela livet. Mest av familjen." },
  { term: "Primärgrupp",        def: "En liten grupp som står dig nära. Till exempel familjen." },
  { term: "Sekundärgrupp",      def: "En stor grupp med mer formella regler. Till exempel en skolklass." },
  { term: "Social smitta",      def: "Känslor eller beteenden sprids mellan personer i en grupp." },
  { term: "Status",             def: "Hög status betyder mer makt och mer uppmärksamhet i gruppen." },
  { term: "Normer",             def: "Oskrivna regler för hur man bör bete sig i en grupp." },
  { term: "Sociala sanktioner", def: "Belöning om du följer normen. Straff om du bryter mot den." },
  { term: "Konformitet",        def: "Att göra som gruppen gör, även om du tycker annorlunda." },
  { term: "Åskådareffekt",      def: "Fler som ser en olycka — färre som hjälper till." },
  { term: "Social maskning",    def: "Att jobba mindre hårt i grupp än när man är ensam." },
];

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: "🏥",
    situation: "Du jobbar i ett team.\nEn kollega får ofta skulden.\nÄven när det inte är hens fel.",
    optionA: "Du låter det vara.",
    optionB: "Du säger ifrån. Ansvaret ska delas.",
    correct: "B",
    explanation: "Syndabock är en dålig roll i en grupp.\nDen skadar både person och stämning.\nSäg ifrån om du ser det hända.",
  },
  {
    id: 2,
    emoji: "🚑",
    situation: "Du ser någon ramla på gatan.\nMånga andra ser det också.\nIngen gör något.",
    optionA: "Du tänker att någon annan hjälper.",
    optionB: "Du pekar på en person och säger: Ring 112!",
    correct: "B",
    explanation: "Fler personer — mindre ansvar känns för var och en.\nDet kallas åskådareffekten.\nPeka ut en person. Då blir hjälpen snabbare.",
  },
  {
    id: 3,
    emoji: "👩‍⚕️",
    situation: "En ny kollega har fått ett dåligt rykte.\nDu märker att du är kall mot hen.",
    optionA: "Du tror på ryktet.",
    optionB: "Du ger kollegan en ärlig chans.",
    correct: "B",
    explanation: "Dina förväntningar styr hur du behandlar andra.\nDet kallas Rosenthaleffekten.\nGe alla en chans utan att döma i förväg.",
  },
  {
    id: 4,
    emoji: "🧑‍🤝‍🧑",
    situation: "Du gör ett grupparbete.\nDu märker att du jobbar mindre än om du var ensam.",
    optionA: "Du accepterar det. Det är normalt.",
    optionB: "Du frågar varför och pratar med gruppen.",
    correct: "B",
    explanation: "Det kallas social maskning.\nOtydliga mål gör att man kämpar mindre.\nPrata om det för att lösa det.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Vilka roller finns i en grupp?",
    options: ["Bara en ledare.", "Till exempel ledare, medlare och syndabock.", "Ingen roll alls.", "Bara prataren."],
    correct: 1,
    explanation: "I en grupp får olika personer olika roller.",
  },
  {
    id: 2,
    question: "Vad är en primärgrupp?",
    options: ["En stor grupp på jobbet.", "En nära grupp, till exempel familjen.", "En grupp du aldrig träffar.", "Samma som en sekundärgrupp."],
    correct: 1,
    explanation: "Primärgruppen är nära och personlig. Till exempel familjen.",
  },
  {
    id: 3,
    question: "Vad är social smitta?",
    options: ["En sjukdom.", "Känslor och beteenden som sprids i en grupp.", "Ett ord för vänskap.", "Ett spel."],
    correct: 1,
    explanation: "Social smitta betyder att känslor sprids mellan personer i en grupp.",
  },
  {
    id: 4,
    question: "Vad betyder hög status i en grupp?",
    options: ["Du blir ignorerad.", "Fler lyssnar på dig.", "Du får alltid skulden.", "Du syns inte."],
    correct: 1,
    explanation: "Hög status betyder att fler lyssnar och bryr sig om vad du säger.",
  },
  {
    id: 5,
    question: "Vad är normer?",
    options: ["Lagar i Sverige.", "Oskrivna regler för hur man bör bete sig.", "Bara skolregler.", "Något bara barn följer."],
    correct: 1,
    explanation: "Normer är oskrivna regler. De är inte samma sak som lagar.",
  },
  {
    id: 6,
    question: "Vad är konformitet?",
    options: ["Att alltid säga emot.", "Att göra som gruppen gör.", "Att vara ledare.", "Att vara ensam."],
    correct: 1,
    explanation: "Konformitet betyder att man anpassar sig efter gruppen.",
  },
  {
    id: 7,
    question: "Vad är åskådareffekten?",
    options: ["Fler som hjälper snabbare.", "Färre hjälper till när fler ser på.", "Något som bara händer barn.", "Att man alltid ringer polisen."],
    correct: 1,
    explanation: "Ju fler som ser en olycka, desto färre hjälper till.",
  },
  {
    id: 8,
    question: "Vad händer om du tror gott om en person?",
    options: ["Inget händer.", "Hen kan prestera bättre. Det kallas Rosenthaleffekten.", "Hen blir arg.", "Hen presterar sämre."],
    correct: 1,
    explanation: "Positiva förväntningar kan hjälpa en person att lyckas bättre.",
  },
];

const SAMMANFATTNING = [
  { emoji: "🎭", text: "Olika roller finns i en grupp. Till exempel ledare och medlare." },
  { emoji: "👪", text: "Vi lär oss normer hela livet. Mest av familjen." },
  { emoji: "📏", text: "Normer är oskrivna regler. Inte samma sak som lagar." },
  { emoji: "🏅", text: "Belöning eller straff får oss att följa normer." },
  { emoji: "🙋", text: "Konformitet betyder att göra som gruppen." },
  { emoji: "👀", text: "Fler åskådare — färre som hjälper till." },
  { emoji: "🌟", text: "Tro gott om andra. Det kan hjälpa dem att lyckas." },
  { emoji: "⚠️", text: "Små steg kan leda till onda handlingar i en grupp." },
];

const FAKTARUTOR = [
  {
    id: "roller",
    emoji: "🎭",
    title: "Roller i grupp",
    short: "Olika personer får olika roller i en grupp.",
    bullets: [
      "Ledaren bestämmer mycket.",
      "Medlaren löser bråk.",
      "Syndabocken får ofta skulden.",
      "Lustigkurren gör gruppen glad.",
    ],
  },
  {
    id: "social-maskning",
    emoji: "⚙️",
    title: "Social maskning",
    short: "Man jobbar mindre hårt i grupp än ensam.",
    bullets: [
      "Ringelmann testade detta år 1913.",
      "En person drog 63 kg själv.",
      "Åtta personer drog bara 31 kg var.",
      "Tydliga mål hjälper mot social maskning.",
    ],
  },
  {
    id: "rosenthal",
    emoji: "🌟",
    title: "Rosenthaleffekten",
    short: "Förväntningar kan styra hur andra lyckas.",
    bullets: [
      "Tror du gott om någon kan hen lyckas bättre.",
      "Tror du illa om någon kan hen lyckas sämre.",
      "Detta kallas en självuppfyllande profetia.",
      "Viktigt att tänka på i vårdyrken.",
    ],
  },
  {
    id: "askadareffekt",
    emoji: "🙋",
    title: "Åskådareffekten",
    short: "Varför hjälper vi — eller inte?",
    bullets: [
      "Vi måste se att något är fel.",
      "Vi måste känna eget ansvar.",
      "Fler åskådare — mindre ansvar känns.",
      "Peka ut en person. Be just hen om hjälp.",
    ],
  },
  {
    id: "milgram",
    emoji: "⚡",
    title: "Milgrams lydnadsexperiment",
    short: "Varför lydde så många en auktoritet?",
    bullets: [
      "Milgram testade lydnad på 1960-talet.",
      "25 av 40 personer lydde hela vägen.",
      "Många kände sig inte själva ansvariga.",
      "Närhet till offret minskade lydnaden.",
    ],
  },
  {
    id: "zimbardo",
    emoji: "🔥",
    title: "Zimbardos sju steg",
    short: "Så kan vanliga människor göra onda saker.",
    bullets: [
      "1. Ta ett litet första steg.",
      "2. Se andra som mindre värda.",
      "3. Vara anonym.",
      "4. Lämna över ansvaret till någon annan.",
      "5. Lyda en auktoritet blint.",
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
        <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium mb-6">Psykiatri</span>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
          Socialpsykologi<br /><span className="text-white/80">– bland andra!</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl mb-8">
          Lär dig hur grupper fungerar. Roller, normer och grupptryck. Med enkla ord och korta meningar.
        </p>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          {["✅ Lätt svenska", "🎮 Memory-spel", "📋 Snabbfakta", "📖 Begrepp", "💬 Scenariofrågor", "🧠 Quiz"].map((tag) => (
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
          setMatches((m) => { const nm = m + 1; if (nm === TOTAL_PAIRS) setTimeout(() => setDone(true), 600); return nm; });
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
          {[{ label: "Matchningar", value: matches, color: "text-emerald-600 dark:text-emerald-400" }, { label: "Drag", value: moves, color: "text-primary" }, { label: "Träffsäkerhet", value: `${accuracy}%`, color: "text-amber-600 dark:text-amber-400" }, { label: "Kvar", value: TOTAL_PAIRS - matches, color: "text-muted-foreground" }].map(({ label, value, color }) => (
            <div key={label} className="text-center"><div className={`text-2xl font-bold ${color}`}>{value}</div><div className="text-muted-foreground">{label}</div></div>
          ))}
        </div>
        <button onClick={initGame} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"><FaSync className="text-xs" /> Nytt spel</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div key={card.id} onClick={() => pickCard(card.id)} className={["relative h-32 sm:h-36 rounded-xl border transition-all duration-500", card.isMatched ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100 cursor-pointer hover:scale-105", card.isSelected ? "ring-2 ring-primary border-primary shadow-lg shadow-primary/20" : "border-border bg-card hover:border-primary/50"].join(" ")}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3 gap-2">
              <span className={card.textColor}>{card.icon}</span>
              <span className={`text-sm text-center font-medium leading-tight ${card.textColor}`}>{card.content}</span>
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
      <SectionHeader emoji="🧩" title="Faktarutor" subtitle="Klicka för att läsa mer om varje ämne." />
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
  const total = QUIZ.length;
  const score = submitted ? QUIZ.filter((q) => answers[q.id] === q.correct).length : 0;
  function reset() { setAnswers({}); setSubmitted(false); }
  return (
    <section>
      <SectionHeader emoji="🧠" title={`Quiz — ${total} frågor`} subtitle="Välj ett svar på varje fråga. Klicka på Rätta när du är klar." />
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
              <div className={`text-4xl font-bold ${score >= total * 0.75 ? "text-emerald-600 dark:text-emerald-400" : score >= total * 0.5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{score} / {total}</div>
              <div className="text-muted-foreground text-sm mt-1">{score === total ? "Perfekt! 🏆" : score >= total * 0.75 ? "Bra jobbat! 🌟" : score >= total * 0.5 ? "Bra försök! Läs igenom igen." : "Försök igen! Du lär dig mer för varje gång."}</div>
            </div>
            <button onClick={reset} className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">Gör om quizet</button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground text-sm">{Object.keys(answers).length} av {total} frågor besvarade.</p>
            <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < total} className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Rätta svaren</button>
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

export default function Socialpsykologi() {
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
