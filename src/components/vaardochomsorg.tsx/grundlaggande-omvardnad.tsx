"use client";

import { useState, useEffect } from "react";
import React from "react";
import {
  FaHandsHelping,
  FaStethoscope,
  FaBrain,
  FaUserAlt,
  FaWheelchair,
  FaHospitalAlt,
  FaBalanceScale,
  FaGavel,
  FaComments,
  FaLightbulb,
  FaHeart,
  FaStar,
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaSync,
} from "react-icons/fa";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Colors — varied so pairs don't match visually ───────────────────────────

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

// ─── Memory card data — 10 pairs ──────────────────────────────────────────────

const RAW_CARDS = [
  { id: 1,  content: "Personlig hygien",                             icon: <FaHandsHelping className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[0]  },
  { id: 2,  content: "Hjälp med tvätt, tandvård och toalettbesök",  icon: <FaUserAlt       className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[10] },
  { id: 3,  content: "Förflyttningsteknik",                          icon: <FaWheelchair    className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[5]  },
  { id: 4,  content: "Sätt att flytta patienter utan skada",         icon: <FaShieldAlt     className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[15] },
  { id: 5,  content: "Näringsstatus",                                icon: <FaHeart         className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[2]  },
  { id: 6,  content: "Bedöma och stödja patientens matintag",        icon: <FaBalanceScale  className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[12] },
  { id: 7,  content: "Trycksår (decubitus)",                         icon: <FaTimes         className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[8]  },
  { id: 8,  content: "Sår vid långt tryck mot huden",                icon: <FaStethoscope   className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[3]  },
  { id: 9,  content: "Delegation",                                   icon: <FaGavel         className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[14] },
  { id: 10, content: "Sjuksköterska ger undersköterska en uppgift",  icon: <FaCheck         className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[7]  },
  { id: 11, content: "Observation",                                  icon: <FaEye           className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[1]  },
  { id: 12, content: "Notera förändringar hos patienten",            icon: <FaBrain         className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[11] },
  { id: 13, content: "Basala hygienrutiner",                         icon: <FaShieldAlt     className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[6]  },
  { id: 14, content: "Stoppa smittspridning i vården",               icon: <FaHandsHelping  className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[16] },
  { id: 15, content: "Rehabilitering",                               icon: <FaStar          className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[13] },
  { id: 16, content: "Träna för att återfå förlorade förmågor",      icon: <FaHospitalAlt   className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[4]  },
  { id: 17, content: "Dokumentation",                                icon: <FaComments      className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[9]  },
  { id: 18, content: "Skriva journal och rapport",                   icon: <FaLightbulb     className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[17] },
  { id: 19, content: "Palliativ vård",                               icon: <FaHospitalAlt   className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[18] },
  { id: 20, content: "Vård och stöd i livets slutskede",             icon: <FaHeart         className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[19] },
];

// ─── Snabbfakta ───────────────────────────────────────────────────────────────

const SNABBFAKTA = [
  { emoji: "🧼", text: "Tvätta händerna 20–30 sekunder med tvål och vatten." },
  { emoji: "🔄", text: "Vänd patienten varannan timme — det förebygger trycksår." },
  { emoji: "🪑", text: "Patienten ska sitta rakt upp när de äter. Minst 45 grader." },
  { emoji: "📝", text: "Skriv i journalen direkt efter du gjort något." },
  { emoji: "🧤", text: "Basala hygienrutiner gäller alltid — inte bara vid smitta." },
  { emoji: "🏥", text: "Du arbetar alltid under en sjuksköterskas ansvar." },
  { emoji: "📢", text: "Rapportera med SBAR — det är tydligt och strukturerat." },
  { emoji: "❤️", text: "Personcentrerad vård — patientens önskemål styr." },
];

// ─── Begrepp ──────────────────────────────────────────────────────────────────

const BEGREPP = [
  { term: "Omvårdnad",       def: "Att ta hand om hela personen — kropp, tankar och socialt liv." },
  { term: "Egenvård",        def: "Det som patienten klarar att göra helt på egen hand." },
  { term: "Helhetssyn",      def: "Att se hela människan, inte bara sjukdomen." },
  { term: "Integritet",      def: "Patientens rätt att bestämma och ha privatliv." },
  { term: "Trycksår",        def: "Sår som uppstår när huden trycks mot ett underlag länge." },
  { term: "Aspiration",      def: "När mat eller vätska hamnar i luftvägarna — inte i magen." },
  { term: "SBAR",            def: "Rapport-metod: Situation · Bakgrund · Aktuellt · Rekommendation." },
  { term: "Delegation",      def: "Sjuksköterskan ger dig rätt att utföra en viss uppgift." },
  { term: "Rehabilitering",  def: "Träna och öva för att återfå förmågor man tappat." },
  { term: "Palliativ vård",  def: "Vård när man inte kan bli frisk — fokus på välmående." },
];

// ─── Scenariofrågor ───────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: "👴",
    situation: "En äldre man vill klä på sig själv.\nDet tar lång tid och han misslyckas ibland.",
    optionA: "Du klär på honom — det går snabbare.",
    optionB: "Du låter honom försöka. Du hjälper bara om han behöver.",
    correct: "B",
    explanation: "Det är viktigt att patienten får göra det han kan själv.\nDet stärker hans självkänsla och förmåga.",
  },
  {
    id: 2,
    emoji: "😰",
    situation: "En patient ser plötsligt förvirrad ut.\nHon är svår att väcka.",
    optionA: "Du väntar — kanske går det över.",
    optionB: "Du rapporterar direkt till sjuksköterskan.",
    correct: "B",
    explanation: "Plötslig förvirring kan vara farligt.\nDet kan bero på infektion, stroke eller lågt blodsocker. Berätta direkt!",
  },
  {
    id: 3,
    emoji: "🛏️",
    situation: "Du ska flytta en patient från sängen till en stol.",
    optionA: "Du lyfter patienten med egna armar.",
    optionB: "Du använder glidlakan eller lyftsele.",
    correct: "B",
    explanation: "Rätt hjälpmedel skyddar dig och patienten.\nDet minskar risken för fall och ryggskador.",
  },
  {
    id: 4,
    emoji: "🍽️",
    situation: "En patient har svårt att svälja.\nDet är dags för lunch.",
    optionA: "Du serverar vanlig mat och lämnar rummet.",
    optionB: "Du sätter patienten rakt upp och ger anpassad konsistens.",
    correct: "B",
    explanation: "Om maten hamnar i luftvägarna kan det bli allvarligt.\nRätt position och konsistens är viktigt.",
  },
];

// ─── Quiz ─────────────────────────────────────────────────────────────────────

const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Vad innebär personcentrerad vård?",
    options: [
      "Patienten sköter all vård själv.",
      "Vården utgår från patientens egna önskemål och behov.",
      "En person utför all vård.",
      "Läkaren bestämmer allt.",
    ],
    correct: 1,
    explanation: "Vården ska anpassas efter vad patienten vill och behöver.",
  },
  {
    id: 2,
    question: "Hur länge tvålar du händerna?",
    options: ["5 sekunder.", "10 sekunder.", "20–30 sekunder.", "2 minuter."],
    correct: 2,
    explanation: "20–30 sekunder tar bort de flesta bakterier och virus.",
  },
  {
    id: 3,
    question: "Vad är ett trycksår?",
    options: [
      "Ett sår från en operation.",
      "Sår som uppstår när huden trycks länge mot ett underlag.",
      "En infektion i blodet.",
      "Rodnad från solen.",
    ],
    correct: 1,
    explanation: "Trycksår uppstår när blodcirkulationen stoppas av långvarigt tryck.",
  },
  {
    id: 4,
    question: "Vad innebär delegation?",
    options: [
      "Patienten väljer sin sjuksköterska.",
      "En sjuksköterska ger dig rätt att göra en uppgift.",
      "Du bestämmer din egen arbetsuppgift.",
      "En läkare utbildar undersköterskor.",
    ],
    correct: 1,
    explanation: "Delegation innebär att en sjuksköterska överlåter en uppgift och ansvaret till dig.",
  },
  {
    id: 5,
    question: "Hur ska patienten sitta när de äter?",
    options: [
      "Halvt liggande.",
      "Upprätt — minst 45–90 grader.",
      "Fullt liggande.",
      "Det spelar ingen roll.",
    ],
    correct: 1,
    explanation: "Upprätt position hjälper maten att gå ner i magen — inte i luftvägarna.",
  },
  {
    id: 6,
    question: "Vad betyder SBAR?",
    options: [
      "Situation · Bakgrund · Aktuellt · Rekommendation.",
      "Säkerhet · Beredskap · Ansvar · Resultat.",
      "Sjukdom · Blod · Andning · Röntgen.",
      "Sömn · Blodtryck · Aptit · Rörelse.",
    ],
    correct: 0,
    explanation: "SBAR är ett strukturerat sätt att rapportera tydligt till annan personal.",
  },
  {
    id: 7,
    question: "Varför använder vi basala hygienrutiner?",
    options: [
      "För att se professionella ut.",
      "För att spara tid.",
      "För att hindra smitta från att spridas.",
      "För att lugna patienterna.",
    ],
    correct: 2,
    explanation: "Basala hygienrutiner skyddar patienten och dig mot smittsamma sjukdomar.",
  },
  {
    id: 8,
    question: "Vad är rehabilitering?",
    options: [
      "Medicin för att sova bättre.",
      "Träning och stöd för att återfå förmågor man tappat.",
      "En typ av operation.",
      "Att vila utan att röra sig.",
    ],
    correct: 1,
    explanation: "Rehab hjälper patienten att bli mer självständig efter sjukdom eller skada.",
  },
  {
    id: 9,
    question: "Vad förebygger trycksår bäst?",
    options: [
      "Ge mer mat.",
      "Byta patientens position regelbundet.",
      "Ge lugnande medicin.",
      "Hålla patienten varm.",
    ],
    correct: 1,
    explanation: "Att byta position varannan timme minskar trycket och håller blodet igång.",
  },
  {
    id: 10,
    question: "Vad är palliativ vård?",
    options: [
      "Intensivvård för att bota sjukdom.",
      "Vård efter en olycka.",
      "Vård som fokuserar på välmående när man inte kan bli frisk.",
      "Vård av barn under 12 år.",
    ],
    correct: 2,
    explanation: "Palliativ vård handlar om att leva så bra som möjligt — inte om att bota.",
  },
];

// ─── Sammanfattning ───────────────────────────────────────────────────────────

const SAMMANFATTNING = [
  { emoji: "🙋", text: "Stöd patientens självständighet — gör inte det de kan själv." },
  { emoji: "🧼", text: "Tvätta händerna rätt — 20–30 sekunder med tvål." },
  { emoji: "🔄", text: "Byt patientens position — förebygger trycksår." },
  { emoji: "📢", text: "Rapportera förändringar direkt till sjuksköterskan." },
  { emoji: "🪝", text: "Använd hjälpmedel när du förflyttar patienter." },
  { emoji: "🍽️", text: "Kontrollera position och konsistens vid måltid." },
  { emoji: "📝", text: "Skriv i journalen direkt efter varje åtgärd." },
  { emoji: "❤️", text: "Personcentrerad vård — patientens önskemål är grunden." },
];

// ─── Shared section header ────────────────────────────────────────────────────

function SectionHeader({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-foreground">
        <span className="text-4xl">{emoji}</span>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-muted-foreground text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── 1. Hero ──────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative bg-linear-to-br from-primary/90 to-primary py-16 sm:py-24 text-primary-foreground overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative container mx-auto px-6 max-w-3xl">
        <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium mb-6">
          Vård och omsorg
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
          Grundläggande
          <br />
          <span className="text-white/80">omvårdnad</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl mb-8">
          Lär dig grunderna. Hygien, förflyttning, mat och dokumentation.
          Viktiga kunskaper för alla som jobbar i vården.
        </p>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          {["🎮 Memory-spel", "📋 Snabbfakta", "📖 Begrepp", "💬 Scenariofrågor", "🧠 Quiz"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-4 py-2"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

// ─── 2. Memory game ───────────────────────────────────────────────────────────

function MemoryGameSection() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  function initGame() {
    const shuffled = [...RAW_CARDS]
      .map((c) => ({ ...c, isMatched: false, isSelected: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelected([]);
    setMatches(0);
    setMoves(0);
    setDone(false);
  }

  function pickCard(id: number) {
    if (selected.length === 2) return;
    if (selected.includes(id)) return;
    if (cards.find((c) => c.id === id)?.isMatched) return;

    const next = [...selected, id];
    setSelected(next);
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isSelected: true } : c))
    );

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const cardA = cards.find((c) => c.id === next[0])!;
      const cardB = cards.find((c) => c.id === next[1])!;

      if (cardA.matchId === cardB.matchId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              next.includes(c.id)
                ? { ...c, isMatched: true, isSelected: false }
                : { ...c, isSelected: false }
            )
          );
          setMatches((m) => {
            const nm = m + 1;
            if (nm === 10) setTimeout(() => setDone(true), 600);
            return nm;
          });
          setSelected([]);
        }, 700);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => ({ ...c, isSelected: false })));
          setSelected([]);
        }, 900);
      }
    }
  }

  const accuracy = moves > 0 ? Math.round((matches / moves) * 100) : 0;

  return (
    <section>
      <SectionHeader
        emoji="🎮"
        title="Memory-spel"
        subtitle="Klicka på två kort som hör ihop. Matchade par försvinner."
      />

      {/* Stats */}
      <div className="rounded-xl border border-border bg-card p-4 mb-6 flex flex-wrap gap-6 items-center justify-between">
        <div className="flex gap-6 text-sm">
          {[
            { label: "Matchningar", value: matches, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Drag", value: moves, color: "text-primary" },
            { label: "Träffsäkerhet", value: `${accuracy}%`, color: "text-amber-600 dark:text-amber-400" },
            { label: "Kvar", value: 10 - matches, color: "text-muted-foreground" },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={initGame}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <FaSync className="text-xs" /> Nytt spel
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => pickCard(card.id)}
            className={[
              "relative h-28 sm:h-32 rounded-xl border transition-all duration-500",
              card.isMatched
                ? "scale-0 opacity-0 pointer-events-none"
                : "scale-100 opacity-100 cursor-pointer hover:scale-105",
              card.isSelected
                ? "ring-2 ring-primary border-primary shadow-lg shadow-primary/20"
                : "border-border bg-card hover:border-primary/50",
            ].join(" ")}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-2">
              <span className={card.textColor}>{card.icon}</span>
              <span
                className={`text-xs text-center font-medium leading-tight ${card.textColor}`}
              >
                {card.content}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Win modal */}
      {done && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Bra jobbat!</h3>
            <p className="text-muted-foreground mb-6">
              Du klarade det på <strong>{moves} drag</strong> med{" "}
              <strong>{accuracy}% träffsäkerhet</strong>.
            </p>
            <button
              onClick={initGame}
              className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Spela igen
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── 3. Snabbfakta ────────────────────────────────────────────────────────────

function SnabbfaktaSection() {
  return (
    <section>
      <SectionHeader
        emoji="📋"
        title="Snabbfakta"
        subtitle="Viktiga saker att komma ihåg."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SNABBFAKTA.map(({ emoji, text }) => (
          <div
            key={text}
            className="rounded-xl border border-border bg-card p-4 flex gap-3 items-start"
          >
            <span className="text-2xl shrink-0 mt-0.5">{emoji}</span>
            <p className="text-sm leading-relaxed text-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 4. Faktarutor ───────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { num: 1, emoji: "👀", name: "Observera",  desc: "Vad ser du? Vad märker du hos patienten?" },
  { num: 2, emoji: "📋", name: "Planera",    desc: "Vad ska göras? Vem gör vad?" },
  { num: 3, emoji: "🤝", name: "Genomföra",  desc: "Gör det som planerades." },
  { num: 4, emoji: "✅", name: "Utvärdera",  desc: "Blev det bättre? Behöver planen ändras?" },
];

const PROCESS_EXAMPLE = [
  { emoji: "👀", step: "Observera",  text: "Patienten äter dåligt." },
  { emoji: "📋", step: "Planera",    text: "Hjälpa patienten vid varje måltid." },
  { emoji: "🤝", step: "Genomföra",  text: "Sitta bredvid och stötta." },
  { emoji: "✅", step: "Utvärdera",  text: "Äter patienten bättre nu?" },
];

const OBSERVATION_AREAS = [
  { emoji: "🫁", label: "Andning",     question: "Andas personen normalt?" },
  { emoji: "🌡️", label: "Temperatur",  question: "Verkar personen ha feber?" },
  { emoji: "🍽️", label: "Aptit",       question: "Äter personen mindre än vanligt?" },
  { emoji: "🚶", label: "Rörelse",     question: "Går eller rör sig personen annorlunda?" },
  { emoji: "😊", label: "Humör",       question: "Verkar personen ledsen eller förvirrad?" },
  { emoji: "💧", label: "Vätska",      question: "Dricker personen tillräckligt?" },
  { emoji: "🩺", label: "Smärta",      question: "Verkar personen ha ont?" },
  { emoji: "🛌", label: "Sömn",        question: "Sover personen dåligt?" },
];

interface FaktaRuta {
  id: string;
  emoji: string;
  title: string;
  short: string;
  bullets: string[];
  example?: string;
}

const FAKTARUTOR: FaktaRuta[] = [
  {
    id: "hygien",
    emoji: "🧴",
    title: "Personlig hygien",
    short: "Stöd med tvätt, tandvård och toalettbesök.",
    bullets: [
      "Patienten ska göra det de kan själva — du hjälper bara det som behövs.",
      "Fråga alltid om lov. Respektera integriteten.",
      "Täck patienten så de inte fryser.",
      "Notera och dokumentera hur hygienen gick.",
    ],
  },
  {
    id: "forflyttning",
    emoji: "🛏️",
    title: "Förflyttningsteknik",
    short: "Rätt teknik skyddar dig och patienten.",
    bullets: [
      "Använd alltid hjälpmedel — glidlakan, lyftsele, rullstol.",
      "Förklara för patienten vad du ska göra.",
      "Böj knäna — inte ryggen — när du hjälper.",
      "Be om hjälp om det är för tungt.",
      "Rätt teknik minskar risken för fall och ryggskador.",
    ],
  },
  {
    id: "nutrition",
    emoji: "🍽️",
    title: "Nutrition och ätande",
    short: "Rätt mat och rätt position är viktigt.",
    bullets: [
      "Patienten ska sitta upprätt — minst 45 grader — när de äter.",
      "Sväljsvårigheter (dysfagi) kräver anpassad konsistens.",
      "Om mat hamnar i luftvägarna kallas det aspiration — det är farligt.",
      "Dokumentera hur mycket patienten åt och drack.",
      "Vid dålig aptit — informera sjuksköterskan.",
    ],
  },
  {
    id: "trycksar",
    emoji: "🩹",
    title: "Trycksår (decubitus)",
    short: "Sår som uppstår när huden trycks länge mot ett underlag.",
    bullets: [
      "Uppstår vid långvarigt tryck — i säng eller rullstol.",
      "Vanligast på hälar, höfter och korsrygg.",
      "Förebygg: byt position varannan timme.",
      "Kontrollera huden regelbundet — rodnad är ett varningssignal.",
      "Rapportera förändringar direkt.",
    ],
  },
  {
    id: "hygienrutiner",
    emoji: "🧼",
    title: "Basala hygienrutiner",
    short: "Förhindra att smitta sprids i vården.",
    bullets: [
      "Tvätta händerna 20–30 sekunder med tvål och vatten.",
      "Använd handsprit om händerna inte är synligt smutsiga.",
      "Bär handskar vid kontakt med blod eller kroppsvätska.",
      "Ta av ringar och klockor när du arbetar.",
      "Gäller alltid — inte bara vid känd smitta.",
    ],
  },
  {
    id: "delegation",
    emoji: "📋",
    title: "Delegation",
    short: "En sjuksköterska ger dig rätt att göra en viss uppgift.",
    bullets: [
      "Delegation ska vara skriftlig.",
      "Sjuksköterskan ansvarar för att du klarar uppgiften.",
      "Du ansvarar för hur du utför uppgiften.",
      "Exempel: ge medicin, ta blodsocker.",
      "Om du är osäker — fråga alltid. Aldrig gissa.",
    ],
  },
  {
    id: "sbar",
    emoji: "📢",
    title: "SBAR — så rapporterar du",
    short: "Ett strukturerat sätt att rapportera till sjuksköterskan.",
    bullets: [
      "S — Situation: Vad händer just nu?",
      "B — Bakgrund: Vad är bakgrunden?",
      "A — Aktuellt: Vad har du observerat?",
      "R — Rekommendation: Vad behöver göras?",
    ],
    example:
      "'Patienten verkar förvirrad sedan kl 14. Brukar vara alert. Svarar nu inte rätt. Bör undersökas.'",
  },
  {
    id: "rehabilitering",
    emoji: "🏃",
    title: "Rehabilitering",
    short: "Träning och stöd för att återfå förlorade förmågor.",
    bullets: [
      "Målet är att patienten ska bli mer självständig.",
      "Du stödjer patienten att träna — gå, klä på sig, äta.",
      "Rehab sker i vardagen, inte bara hos sjukgymnast.",
      "Uppmuntra patienten — positiv feedback hjälper.",
      "Dokumentera framsteg.",
    ],
  },
  {
    id: "palliativ",
    emoji: "🕊️",
    title: "Palliativ vård",
    short: "Vård i livets slutskede — fokus på välmående.",
    bullets: [
      "Målet är inte att bota — utan att lindra och ge livskvalitet.",
      "Fysisk smärta, oro och ensamhet ska lindras.",
      "Patienten och anhöriga ska stödjas.",
      "Respektera patientens sista önskemål.",
      "Kan ges hemma, på hospice eller sjukhus.",
    ],
  },
];

function FaktaruterSection() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="space-y-12">
      <SectionHeader
        emoji="🩺"
        title="Faktarutor"
        subtitle="Läs igenom varje ämne. Det hjälper dig svara på frågorna nedan."
      />

      {/* Omvårdnadsprocessen */}
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-5 text-foreground">
          <span>🔄</span> Omvårdnadsprocessen
        </h3>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-semibold text-foreground mb-4 text-sm">De fyra stegen</p>
            <div className="space-y-2">
              {PROCESS_STEPS.map((s, i) => (
                <div key={s.num}>
                  <div className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
                    <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                      {s.num}
                    </span>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {s.emoji} {s.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="flex justify-center py-1 text-primary text-xl">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-semibold text-foreground mb-4 text-sm">
              Exempel — patienten äter dåligt
            </p>
            <div className="space-y-2">
              {PROCESS_EXAMPLE.map((e, i) => (
                <div key={e.step}>
                  <div className="rounded-lg border border-border bg-background px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      {e.emoji} {e.step}
                    </p>
                    <p className="text-sm text-foreground">{e.text}</p>
                  </div>
                  {i < PROCESS_EXAMPLE.length - 1 && (
                    <div className="flex justify-center py-1 text-muted-foreground text-xl">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Personcentrerad vård */}
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-5 text-foreground">
          <span>❤️</span> Personcentrerad vård
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-5">
            <p className="font-bold text-red-700 dark:text-red-400 mb-3">❌ Förr</p>
            <p className="text-red-800 dark:text-red-300 text-sm italic leading-relaxed">
              &ldquo;Vad är det för fel på patienten?&rdquo;
            </p>
            <p className="text-red-700 dark:text-red-400 text-xs mt-2">Fokus på sjukdomen.</p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 p-5">
            <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-3">✅ Nu</p>
            <p className="text-emerald-800 dark:text-emerald-300 text-sm italic leading-relaxed">
              &ldquo;Vem är personen?&rdquo;
            </p>
            <p className="text-emerald-700 dark:text-emerald-400 text-xs mt-2">Fokus på hela människan.</p>
          </div>
        </div>
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <p className="font-semibold text-foreground mb-4">❤️ Vi utgår från patientens…</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { emoji: "💭", label: "Önskemål",        desc: "Vad vill patienten?" },
              { emoji: "🏠", label: "Vanor",            desc: "Vad brukar de göra?" },
              { emoji: "🎯", label: "Behov",            desc: "Vad behöver de?" },
              { emoji: "🗽", label: "Självbestämmande", desc: "Vad väljer de själv?" },
            ].map(({ emoji, label, desc }) => (
              <div key={label} className="rounded-lg border border-border bg-card p-3 text-center">
                <div className="text-2xl mb-1">{emoji}</div>
                <p className="font-semibold text-sm text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground border-t border-border pt-3">
            💡 Detta kommer ofta på prov.
          </p>
        </div>
      </div>

      {/* Observation */}
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-5 text-foreground">
          <span>👀</span> Observation — vad ska du titta efter?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {OBSERVATION_AREAS.map(({ emoji, label, question }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2"
            >
              <span className="text-3xl">{emoji}</span>
              <p className="font-bold text-foreground text-sm">{label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{question}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          <strong>Viktigt:</strong> Om du märker något ovanligt — berätta direkt för sjuksköterskan.
          Skriv ner det i journalen.
        </div>
      </div>

      {/* Accordion cards */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">
          Fler ämnen — klicka för att läsa mer
        </h3>
        <div className="space-y-2">
          {FAKTARUTOR.map((f) => {
            const isOpen = open === f.id;
            return (
              <div
                key={f.id}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0">{f.emoji}</span>
                    <div>
                      <p className="font-semibold text-foreground">{f.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.short}</p>
                    </div>
                  </div>
                  {isOpen ? (
                    <FaChevronUp className="text-primary shrink-0" />
                  ) : (
                    <FaChevronDown className="text-muted-foreground shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-3 border-t border-border space-y-3">
                    <ul className="space-y-2">
                      {f.bullets.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-foreground leading-relaxed"
                        >
                          <span className="text-primary shrink-0 mt-1">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    {f.example && (
                      <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-sm text-foreground italic">
                        💬 Exempel: {f.example}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 5. Begrepp ───────────────────────────────────────────────────────────────

function BegreppSection() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section>
      <SectionHeader
        emoji="📖"
        title="Begrepp och förklaringar"
        subtitle="Klicka på ett ord för att se vad det betyder."
      />
      <div className="space-y-2">
        {BEGREPP.map(({ term, def }) => {
          const isOpen = open === term;
          return (
            <div
              key={term}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : term)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/50 transition-colors"
              >
                <span className="font-semibold text-foreground">{term}</span>
                {isOpen ? (
                  <FaChevronUp className="text-primary shrink-0" />
                ) : (
                  <FaChevronDown className="text-muted-foreground shrink-0" />
                )}
              </button>
              {isOpen && (
                <p className="px-5 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground border-t border-border">
                  {def}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── 5. Scenariofrågor ────────────────────────────────────────────────────────

function ScenarierSection() {
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  function pick(id: number, choice: "A" | "B") {
    if (revealed[id]) return;
    setAnswers((prev) => ({ ...prev, [id]: choice }));
  }

  function reveal(id: number) {
    if (!answers[id]) return;
    setRevealed((prev) => ({ ...prev, [id]: true }));
  }

  return (
    <section>
      <SectionHeader
        emoji="💬"
        title="Scenariofrågor"
        subtitle="Vad gör du? Välj A eller B. Klicka sedan på Visa svar."
      />
      <div className="grid sm:grid-cols-2 gap-6">
        {SCENARIOS.map((s) => {
          const chosen = answers[s.id] ?? null;
          const isRevealed = !!revealed[s.id];
          const isCorrect = chosen === s.correct;

          return (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4"
            >
              {/* Situation */}
              <div>
                <span className="text-4xl">{s.emoji}</span>
                <p className="mt-3 font-medium text-foreground leading-relaxed whitespace-pre-line text-sm">
                  {s.situation}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {(["A", "B"] as const).map((opt) => {
                  const text = opt === "A" ? s.optionA : s.optionB;
                  const isChosen = chosen === opt;
                  const isRight = opt === s.correct;

                  let cls =
                    "border-border bg-background text-foreground hover:border-primary/60";
                  if (isRevealed) {
                    cls = isRight
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                      : isChosen
                      ? "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400"
                      : "border-border bg-background text-muted-foreground opacity-50";
                  } else if (isChosen) {
                    cls = "border-primary bg-primary/10 text-foreground";
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => pick(s.id, opt)}
                      disabled={isRevealed}
                      className={`w-full rounded-lg border px-4 py-3 text-left text-sm leading-relaxed transition-colors ${cls}`}
                    >
                      <span className="font-bold mr-2">{opt})</span>
                      {text}
                      {isRevealed && isRight && (
                        <FaCheck className="inline ml-2 text-emerald-500" />
                      )}
                      {isRevealed && isChosen && !isRight && (
                        <FaTimes className="inline ml-2 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Reveal button */}
              {!isRevealed && (
                <button
                  onClick={() => reveal(s.id)}
                  disabled={!chosen}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Visa svar
                </button>
              )}

              {/* Explanation */}
              {isRevealed && (
                <div
                  className={`rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line border ${
                    isCorrect
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                      : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                  }`}
                >
                  <p className="font-bold mb-1">
                    {isCorrect ? "✅ Rätt!" : "❌ Fel — men bra försök!"}
                  </p>
                  <p className="font-semibold mb-1">Förklaring:</p>
                  <p>{s.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── 6. Quiz ─────────────────────────────────────────────────────────────────

function QuizSection() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? QUIZ.filter((q) => answers[q.id] === q.correct).length
    : 0;

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <section>
      <SectionHeader
        emoji="🧠"
        title="Quiz — 10 frågor"
        subtitle="Välj ett svar på varje fråga. Klicka på Rätta när du är klar."
      />

      <div className="space-y-6">
        {QUIZ.map((q, qi) => {
          const chosen = answers[q.id];
          const isCorrect = chosen === q.correct;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="font-semibold text-foreground mb-4 text-base leading-relaxed">
                <span className="text-primary font-bold mr-2">{qi + 1}.</span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isRight = oi === q.correct;

                  let cls =
                    "border-border bg-background text-foreground hover:border-primary/60";
                  if (submitted) {
                    cls = isRight
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                      : isChosen
                      ? "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400"
                      : "border-border opacity-50 text-muted-foreground bg-background";
                  } else if (isChosen) {
                    cls = "border-primary bg-primary/10 text-foreground";
                  }

                  return (
                    <button
                      key={oi}
                      onClick={() =>
                        !submitted &&
                        setAnswers((prev) => ({ ...prev, [q.id]: oi }))
                      }
                      disabled={submitted}
                      className={`w-full rounded-lg border px-4 py-3 text-left text-sm leading-relaxed transition-colors ${cls}`}
                    >
                      <span className="font-bold mr-2">
                        {String.fromCharCode(65 + oi)})
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`mt-3 rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    isCorrect
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {isCorrect ? "✅" : "❌"}{" "}
                  <strong>{q.explanation}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score bar */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {submitted ? (
          <>
            <div className="text-center sm:text-left">
              <div
                className={`text-4xl font-bold ${
                  score >= 8
                    ? "text-emerald-600 dark:text-emerald-400"
                    : score >= 5
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {score} / 10
              </div>
              <div className="text-muted-foreground text-sm mt-1">
                {score === 10
                  ? "Perfekt! 🏆"
                  : score >= 8
                  ? "Bra jobbat! 🌟"
                  : score >= 5
                  ? "Bra försök! Läs igenom igen."
                  : "Försök igen! Du lär dig mer för varje gång."}
              </div>
            </div>
            <button
              onClick={reset}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Gör om quizet
            </button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground text-sm">
              {Object.keys(answers).length} av 10 frågor besvarade.
            </p>
            <button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < 10}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Rätta svaren
            </button>
          </>
        )}
      </div>
    </section>
  );
}

// ─── 7. Sammanfattning ────────────────────────────────────────────────────────

function SammanfattningSection() {
  return (
    <section>
      <SectionHeader
        emoji="✅"
        title="Sammanfattning"
        subtitle="Det här är det viktigaste att komma ihåg."
      />
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

// ─── Main export ──────────────────────────────────────────────────────────────

export default function GrundlaggandeOmvardnad() {
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
