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
  { id: 1,  content: "Munhygien",                icon: <FaHandsHelping className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[0]  },
  { id: 2,  content: "Tandborstning 2 ggr/dag",  icon: <FaStar          className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[10] },
  { id: 3,  content: "Deltvätt",                 icon: <FaUserAlt       className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[5]  },
  { id: 4,  content: "Tvätt av ansikte och intima delar", icon: <FaShieldAlt className="text-2xl" />, matchId: 2, textColor: CARD_COLORS[15] },
  { id: 5,  content: "Integritet",               icon: <FaHeart         className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[2]  },
  { id: 6,  content: "Fråga alltid om lov",      icon: <FaComments      className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[12] },
  { id: 7,  content: "Hudbedömning",             icon: <FaEye           className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[8]  },
  { id: 8,  content: "Inspektera vid varje tvätttillfälle", icon: <FaStethoscope className="text-2xl" />, matchId: 4, textColor: CARD_COLORS[3]  },
  { id: 9,  content: "Fotvård",                  icon: <FaWheelchair    className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[14] },
  { id: 10, content: "Extra viktigt vid diabetes", icon: <FaCheck       className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[7]  },
  { id: 11, content: "Helkropptvätt",            icon: <FaHospitalAlt   className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[1]  },
  { id: 12, content: "Grundlig tvätt i säng",    icon: <FaBrain         className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[11] },
  { id: 13, content: "Basala hygienrutiner",      icon: <FaShieldAlt    className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[6]  },
  { id: 14, content: "Handskar vid intimvård",   icon: <FaGavel         className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[16] },
  { id: 15, content: "Hårvård",                  icon: <FaLightbulb     className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[13] },
  { id: 16, content: "Tvätta och kamma håret",   icon: <FaBalanceScale  className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[4]  },
  { id: 17, content: "Perineal hygien",          icon: <FaComments      className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[9]  },
  { id: 18, content: "Framifrån bakåt vid intimtvätt", icon: <FaCheck   className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[17] },
  { id: 19, content: "Ödem",                     icon: <FaTimes         className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[18] },
  { id: 20, content: "Vätska i vävnaderna",      icon: <FaHeart         className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[19] },
];

const SNABBFAKTA = [
  { emoji: "🧴", text: "Fråga alltid patienten vad de vill ha hjälp med — respektera deras önskemål." },
  { emoji: "🧤", text: "Använd handskar vid kontakt med slemhinnor, sår och intima delar." },
  { emoji: "🌡️", text: "Kontrollera att vattnet inte är för varmt — äldre känner värme sämre." },
  { emoji: "👁️", text: "Inspektera alltid huden vid tvätt — rodnad på utsatta ställen är ett varningssignal." },
  { emoji: "🦷", text: "Munhygien ska göras minst 2 gånger per dag — även för patienter som inte äter." },
  { emoji: "🦶", text: "Patienter med diabetes behöver extra noggrann fotvård — sår läker dåligt." },
  { emoji: "🛡️", text: "Täck alltid patienten — respektera integriteten och håll dem varma." },
  { emoji: "📝", text: "Dokumentera hur hygienen gick och vad du observerade på huden." },
];

const BEGREPP = [
  { term: "Integritet",          def: "Patientens rätt att bestämma över sin kropp och sitt privatliv. Du ska alltid fråga om lov." },
  { term: "Autonomi",            def: "Självbestämmande — patienten har rätt att tacka nej till hjälp." },
  { term: "Munvård",             def: "Tandborstning, rengöring av tandprotes och fuktning av munhålan." },
  { term: "Perineal hygien",     def: "Intimtvätt — alltid framifrån bakåt för att undvika infektion." },
  { term: "Deltvätt",            def: "Tvätt av ansikte, händer och intima delar — görs dagligen." },
  { term: "Helkropptvätt",       def: "Grundlig tvätt av hela kroppen, ofta i sängen." },
  { term: "Hudinspekt",          def: "Titta noga på huden vid varje tvätttillfälle — rodnad, sår, svullnad." },
  { term: "Ödem",                def: "Svullnad orsakad av att vätska samlats i vävnaderna." },
  { term: "Cyanos",              def: "Blåfärgning av läppar eller naglar — tecken på syrebrist." },
  { term: "Ikterus",             def: "Gulfärgning av hud och ögonvitor — kan tyda på leverproblem." },
];

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: "👵",
    situation: "En äldre kvinna vill inte ha hjälp med duschen idag.\nHon brukar duscha varje dag.",
    optionA: "Du hjälper henne ändå — hygienen är viktig.",
    optionB: "Du respekterar hennes önskan. Erbjuder deltvätt istället.",
    correct: "B",
    explanation: "Patienten har rätt att bestämma över sin kropp (autonomi).\nDu kan föreslå ett alternativ — men aldrig tvinga.",
  },
  {
    id: 2,
    emoji: "🦷",
    situation: "En patient med stroke kan inte borsta tänderna själv.\nHan är medvetslös men andas.",
    optionA: "Du skippar munvården tills han vaknar.",
    optionB: "Du utför munvård varsamt — fuktning och rengöring.",
    correct: "B",
    explanation: "Munhygien ska göras även för medvetslösa patienter.\nTorr mun och bakterier kan leda till lunginflammation.",
  },
  {
    id: 3,
    emoji: "🦶",
    situation: "Du tvättar en patients fötter och ser en liten spricka\nmellan tårna. Patienten har diabetes.",
    optionA: "Det är så litet — du nämner det inte.",
    optionB: "Du dokumenterar och rapporterar till sjuksköterskan.",
    correct: "B",
    explanation: "Vid diabetes läker sår dåligt och kan bli allvarliga snabbt.\nAlltid rapportera — även små förändringar.",
  },
  {
    id: 4,
    emoji: "🚿",
    situation: "Du ska hjälpa en man med intimtvätt.\nHan verkar besvärad och tittar bort.",
    optionA: "Du berättar vad du ska göra och frågar om det är okej.",
    optionB: "Du utför tvätten snabbt utan att säga något.",
    correct: "A",
    explanation: "Informera alltid patienten om vad du ska göra.\nDet minskar oro och respekterar integriteten.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "I vilken riktning ska du tvätta vid intimhygien?",
    options: ["Bakifrån framåt.", "Framifrån bakåt.", "Cirkelrörelser.", "Det spelar ingen roll."],
    correct: 1,
    explanation: "Alltid framifrån bakåt — annars för du bakterier mot urinröret och kan orsaka infektion.",
  },
  {
    id: 2,
    question: "Hur ofta ska munhygien utföras?",
    options: ["En gång per vecka.", "En gång per dag.", "Minst två gånger per dag.", "Bara om patienten ber om det."],
    correct: 2,
    explanation: "Munhygien minst 2 gånger per dag minskar risken för karies, infektion och lunginflammation.",
  },
  {
    id: 3,
    question: "Varför behöver patienter med diabetes extra fotvård?",
    options: [
      "Deras fötter luktar mer.",
      "Sår läker dåligt och kan bli allvarliga.",
      "De har mer känsliga naglar.",
      "Det är ett krav från socialstyrelsen.",
    ],
    correct: 1,
    explanation: "Diabetes kan ge nervskador och dålig cirkulation — sår märks inte och läker dåligt.",
  },
  {
    id: 4,
    question: "Vad är deltvätt?",
    options: [
      "Tvätt av bara händerna.",
      "Tvätt av hela kroppen.",
      "Tvätt av ansikte, händer och intima delar.",
      "Tvätt av ryggen.",
    ],
    correct: 2,
    explanation: "Deltvätt görs dagligen och fokuserar på de delar som behöver mest omsorg.",
  },
  {
    id: 5,
    question: "Vad gör du om patienten vägrar hjälp med hygienen?",
    options: [
      "Tvinga dem — det är din skyldighet.",
      "Respekterar beslutet och dokumenterar.",
      "Rapporterar det som avvikelse.",
      "Ringer anhöriga för beslut.",
    ],
    correct: 1,
    explanation: "Patienten har rätt att säga nej (autonomi). Dokumentera och informera ansvarig sjuksköterska.",
  },
  {
    id: 6,
    question: "Vad ska du kontrollera när du tvättar en patient?",
    options: [
      "Att du hinner bli klar snabbt.",
      "Att temperaturen på vattnet är rätt och att huden ser bra ut.",
      "Att patienten inte tittar.",
      "Att det finns tillräckligt med tvål.",
    ],
    correct: 1,
    explanation: "Kontrollera vattentemperatur (äldre känner värme sämre) och inspektera huden för förändringar.",
  },
  {
    id: 7,
    question: "Varför ska du täcka patienten under tvättning?",
    options: [
      "För att det ser snyggare ut.",
      "För att hålla patienten varm och bevara integriteten.",
      "Det behövs inte.",
      "Bara om det är kallt i rummet.",
    ],
    correct: 1,
    explanation: "Att täcka patienten respekterar deras integritet och förhindrar nedkylning.",
  },
  {
    id: 8,
    question: "Vad betyder ikterus?",
    options: [
      "Blåfärgning av huden.",
      "Rödfärgning av huden.",
      "Gulfärgning av hud och ögonvitor.",
      "Blek hud.",
    ],
    correct: 2,
    explanation: "Ikterus är gulfärgning som kan tyda på leverproblem. Rapportera till sjuksköterskan.",
  },
  {
    id: 9,
    question: "Vilka skyddshandskar används vid intimtvätt?",
    options: [
      "Sterila handskar.",
      "Engångshandskar — rena, inte sterila.",
      "Handskar behövs inte.",
      "Läderhandskar.",
    ],
    correct: 1,
    explanation: "Engångshandskar skyddar dig och patienten. Byt handskar mellan framsida och baksida.",
  },
  {
    id: 10,
    question: "Vad är ödem?",
    options: [
      "En typ av sår.",
      "Infektion i huden.",
      "Vätska som samlas i vävnaderna och ger svullnad.",
      "Torr hud.",
    ],
    correct: 2,
    explanation: "Ödem kan vara tecken på hjärt-, njur- eller leverproblem. Rapportera om du ser det.",
  },
];

const SAMMANFATTNING = [
  { emoji: "🙋", text: "Fråga alltid om lov — patienten bestämmer hur och när." },
  { emoji: "🧤", text: "Använd handskar vid intimvård och kontakt med slemhinnor." },
  { emoji: "👁️", text: "Inspektera huden vid varje tillfälle — rodnad är ett varningssignal." },
  { emoji: "🦷", text: "Munhygien minst 2 gånger per dag, även för medvetslösa patienter." },
  { emoji: "🌡️", text: "Kontrollera vattentemperaturen — äldre märker inte om det är för varmt." },
  { emoji: "🛡️", text: "Täck alltid patienten för att bevara integriteten och hålla dem varma." },
  { emoji: "🦶", text: "Extra fotvård vid diabetes — även små sår ska rapporteras." },
  { emoji: "📝", text: "Dokumentera observationer och hur hygienen gick direkt efteråt." },
];

const FAKTARUTOR = [
  {
    id: "deltvätt",
    emoji: "🚿",
    title: "Deltvätt och helkropptvätt",
    short: "Daglig deltvätt — helkropptvätt vid behov.",
    bullets: [
      "Deltvätt: ansikte, händer och intima delar — görs varje dag.",
      "Helkropptvätt: hela kroppen tvättas, ofta i sängen hos sängliggande patienter.",
      "Börja med ansiktet och avsluta med intima delar.",
      "Byt tvättlapp (eller handskar) mellan olika delar av kroppen.",
      "Dokumentera hur det gick och eventuella observationer.",
    ],
  },
  {
    id: "munvård",
    emoji: "🦷",
    title: "Munvård",
    short: "Viktigt för alla patienter — även sängliggande och medvetslösa.",
    bullets: [
      "Borsta tänderna minst 2 gånger per dag.",
      "Rengör tandprotesen efter varje måltid.",
      "Fukta munnen hos patienter som inte dricker — muntorrhet är vanligt.",
      "Kontrollera efter sår, beläggning och tecken på svampinfektion.",
      "Risk: aspiration (att rengöringsvätskan hamnar i lungorna) — var försiktig.",
    ],
  },
  {
    id: "intimvård",
    emoji: "🛁",
    title: "Perineal hygien (intimtvätt)",
    short: "Tvätta alltid framifrån bakåt.",
    bullets: [
      "Tvätta framifrån bakåt — aldrig tvärtom, annars riskeras infektion.",
      "Byt tvättlapp/handskar mellan framsida och baksida.",
      "Informera alltid patienten om vad du ska göra.",
      "Använd engångshandskar.",
      "Torka varsamt och se till att huden är torr efteråt — fukt ger sår.",
    ],
  },
  {
    id: "hudinspekt",
    emoji: "👁️",
    title: "Hudinspekion vid tvätt",
    short: "Titta noggrant på huden vid varje tillfälle.",
    bullets: [
      "Inspektera hud på utsatta ställen: hälar, höfter, svanskota, armbågar.",
      "Rodnad som inte bleknar är tidigt tecken på trycksår — rapportera!",
      "Notera ödem (svullnad), utslag, sår och missfärgningar.",
      "Torr hud kan smörjas med lotion — håller huden elastisk.",
      "Fuktiga hudveck kan ge skavsår — torka ordentligt.",
    ],
  },
  {
    id: "fotvård",
    emoji: "🦶",
    title: "Fotvård",
    short: "Extra viktigt för patienter med diabetes och dålig cirkulation.",
    bullets: [
      "Tvätta och torka noga mellan tårna — fukt ger svamp.",
      "Klipp naglar rakt — undvik att klippa hörnen (inväxta naglar).",
      "Kontrollera om det finns sår, sprickor eller nagelsvamp.",
      "Vid diabetes: kontakta fotvårdsterapeut — klipp inte naglar själv.",
      "Rapport vid minsta sår — läker dåligt vid diabetes.",
    ],
  },
  {
    id: "integritet",
    emoji: "❤️",
    title: "Integritet och autonomi",
    short: "Patientens rätt att bestämma — alltid.",
    bullets: [
      "Fråga alltid om lov innan du hjälper med hygienen.",
      "Patienten kan tacka nej — respektera det och dokumentera.",
      "Knacka på dörren, dra för gardiner, stäng dörren.",
      "Tala lugnt och förklara vad du ska göra.",
      "Låt patienten göra det de klarar själva — stötta bara det de behöver.",
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
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />
      <div className="relative container mx-auto px-6 max-w-3xl">
        <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium mb-6">
          Vård och omsorg
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
          Personlig
          <br />
          <span className="text-white/80">hygien</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl mb-8">
          Lär dig hjälpa patienter med hygien på ett tryggt och respektfullt sätt.
          Integritet, hudbedömning och rätt teknik.
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
        <button onClick={initGame} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <FaSync className="text-xs" /> Nytt spel
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => pickCard(card.id)}
            className={["relative h-28 sm:h-32 rounded-xl border transition-all duration-500",
              card.isMatched ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100 cursor-pointer hover:scale-105",
              card.isSelected ? "ring-2 ring-primary border-primary shadow-lg shadow-primary/20" : "border-border bg-card hover:border-primary/50",
            ].join(" ")}
          >
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
                        <span className="text-primary shrink-0 mt-1">•</span>
                        <span>{b}</span>
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
                  if (isRevealed) {
                    cls = isRight ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                      : isChosen ? "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400"
                      : "border-border bg-background text-muted-foreground opacity-50";
                  } else if (isChosen) { cls = "border-primary bg-primary/10 text-foreground"; }
                  return (
                    <button key={opt} onClick={() => pick(s.id, opt)} disabled={isRevealed} className={`w-full rounded-lg border px-4 py-3 text-left text-sm leading-relaxed transition-colors ${cls}`}>
                      <span className="font-bold mr-2">{opt})</span>{text}
                      {isRevealed && isRight && <FaCheck className="inline ml-2 text-emerald-500" />}
                      {isRevealed && isChosen && !isRight && <FaTimes className="inline ml-2 text-red-500" />}
                    </button>
                  );
                })}
              </div>
              {!isRevealed && (
                <button onClick={() => reveal(s.id)} disabled={!chosen} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Visa svar</button>
              )}
              {isRevealed && (
                <div className={`rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line border ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300" : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"}`}>
                  <p className="font-bold mb-1">{isCorrect ? "✅ Rätt!" : "❌ Fel — men bra försök!"}</p>
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
              <p className="font-semibold text-foreground mb-4 text-base leading-relaxed">
                <span className="text-primary font-bold mr-2">{qi + 1}.</span>{q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isRight = oi === q.correct;
                  let cls = "border-border bg-background text-foreground hover:border-primary/60";
                  if (submitted) {
                    cls = isRight ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                      : isChosen ? "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400"
                      : "border-border opacity-50 text-muted-foreground bg-background";
                  } else if (isChosen) { cls = "border-primary bg-primary/10 text-foreground"; }
                  return (
                    <button key={oi} onClick={() => !submitted && setAnswers((prev) => ({ ...prev, [q.id]: oi }))} disabled={submitted} className={`w-full rounded-lg border px-4 py-3 text-left text-sm leading-relaxed transition-colors ${cls}`}>
                      <span className="font-bold mr-2">{String.fromCharCode(65 + oi)})</span>{opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className={`mt-3 rounded-lg px-4 py-3 text-sm leading-relaxed ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"}`}>
                  {isCorrect ? "✅" : "❌"} <strong>{q.explanation}</strong>
                </div>
              )}
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

export default function PersonligHygien() {
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
