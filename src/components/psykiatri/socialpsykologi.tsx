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
  "text-green-600 dark:text-green-400", "text-red-600 dark:text-red-400", "text-purple-600 dark:text-purple-400",
  "text-yellow-600 dark:text-yellow-400", "text-fuchsia-600 dark:text-fuchsia-400", "text-slate-500 dark:text-slate-400",
  "text-zinc-600 dark:text-zinc-400", "text-stone-600 dark:text-stone-400",
];

const RAW_CARDS = [
  { id: 1,  content: "Roller i grupp",          icon: <FaTheaterMasks  className="text-2xl" />, matchId: 1,  textColor: CARD_COLORS[0]  },
  { id: 2,  content: "T.ex. medlaren, syndabocken, lustigkurren", icon: <FaUsers className="text-2xl" />, matchId: 1, textColor: CARD_COLORS[10] },
  { id: 3,  content: "Primärgrupp",             icon: <FaHeart         className="text-2xl" />, matchId: 2,  textColor: CARD_COLORS[5]  },
  { id: 4,  content: "Nära och personlig, t.ex. familjen", icon: <FaHandsHelping className="text-2xl" />, matchId: 2, textColor: CARD_COLORS[15] },
  { id: 5,  content: "Social smitta",           icon: <FaComments      className="text-2xl" />, matchId: 3,  textColor: CARD_COLORS[2]  },
  { id: 6,  content: "Känslor och beteenden sprids i gruppen", icon: <FaEye className="text-2xl" />, matchId: 3, textColor: CARD_COLORS[12] },
  { id: 7,  content: "Status",                  icon: <FaStar          className="text-2xl" />, matchId: 4,  textColor: CARD_COLORS[8]  },
  { id: 8,  content: "Hög status — andra lyssnar och tar åsikten på allvar", icon: <FaUserAlt className="text-2xl" />, matchId: 4, textColor: CARD_COLORS[3]  },
  { id: 9,  content: "Normer",                  icon: <FaBalanceScale  className="text-2xl" />, matchId: 5,  textColor: CARD_COLORS[14] },
  { id: 10, content: "Hur man bör bete sig, inte vad som är tillåtet", icon: <FaGavel className="text-2xl" />, matchId: 5, textColor: CARD_COLORS[7]  },
  { id: 11, content: "Sociala sanktioner",      icon: <FaShieldAlt     className="text-2xl" />, matchId: 6,  textColor: CARD_COLORS[1]  },
  { id: 12, content: "Belöning eller bestraffning för att följa normer", icon: <FaCheck className="text-2xl" />, matchId: 6, textColor: CARD_COLORS[11] },
  { id: 13, content: "Konformitet",             icon: <FaUsers         className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[6]  },
  { id: 14, content: "Att anpassa sig och göra som gruppen", icon: <FaCheck className="text-2xl" />, matchId: 7,  textColor: CARD_COLORS[16] },
  { id: 15, content: "Åskådareffekt",           icon: <FaEye           className="text-2xl" />, matchId: 8,  textColor: CARD_COLORS[13] },
  { id: 16, content: "Färre hjälper till ju fler som ser på", icon: <FaTimes className="text-2xl" />, matchId: 8, textColor: CARD_COLORS[4]  },
  { id: 17, content: "Rosenthaleffekten",       icon: <FaLightbulb     className="text-2xl" />, matchId: 9,  textColor: CARD_COLORS[9]  },
  { id: 18, content: "Positiva förväntningar höjer prestationen", icon: <FaStar className="text-2xl" />, matchId: 9, textColor: CARD_COLORS[17] },
  { id: 19, content: "Social maskning",         icon: <FaBrain         className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[18] },
  { id: 20, content: "Jobbar mindre hårt i grupp än själv", icon: <FaHeart className="text-2xl" />, matchId: 10, textColor: CARD_COLORS[19] },
];

const SNABBFAKTA = [
  { emoji: "🎭", text: "I en grupp uppstår ofta olika roller, t.ex. ledaren, medlaren eller syndabocken." },
  { emoji: "👪", text: "Primärgrupper är nära och personliga, t.ex. familjen — sekundärgrupper är stora och formella." },
  { emoji: "🦠", text: "Social smitta innebär att känslor och beteenden sprids snabbt i en grupp." },
  { emoji: "⭐", text: "Hög status innebär att andra lyssnar mer på vad du säger och tar dina åsikter på allvar." },
  { emoji: "📏", text: "Normer handlar om hur man bör bete sig — inte om vad som är förbjudet eller tillåtet." },
  { emoji: "👀", text: "Åskådareffekten gör att färre ingriper ju fler som bevittnar en nödsituation." },
  { emoji: "🧠", text: "Positiva förväntningar på en person kan faktiskt förbättra dennes prestation (Rosenthaleffekten)." },
  { emoji: "🙋", text: "Konformitet innebär att man anpassar sig efter gruppens åsikter, även mot bättre vetande." },
];

const BEGREPP = [
  { term: "Socialisation",     def: "En livslång process där individen påverkas av normer, värderingar och attityder — mest av 'signifikanta andra', t.ex. familjen." },
  { term: "Primärgrupp",       def: "En liten, nära och personlig grupp med starka känslomässiga band, t.ex. familjen eller nära vänner." },
  { term: "Sekundärgrupp",     def: "En stor, formell grupp med mer opersonliga relationer, t.ex. en arbetsplats eller skolklass." },
  { term: "Social smitta",     def: "Att beteenden, känslor, idéer eller tillstånd sprids mellan medlemmarna i en grupp." },
  { term: "Status",            def: "En persons sociala ställning i gruppen. Hög status ger mer inflytande och uppmärksamhet, låg status ger mindre." },
  { term: "Normer",            def: "Oskrivna, delade förväntningar på hur man bör tänka, känna och bete sig i en grupp — till skillnad från lagar och regler." },
  { term: "Sociala sanktioner",def: "Belöningar (t.ex. beröm, komplimanger, likes) eller bestraffningar (t.ex. kritik, utskällning, utfrysning) som styr beteende efter normer." },
  { term: "Konformitet",       def: "Att anpassa sig efter gruppens förväntningar och göra som de andra, även om man egentligen tycker annorlunda." },
  { term: "Åskådareffekt",     def: "Ju fler som bevittnar en nödsituation, desto mindre sannolikt att någon enskild person ingriper — ansvaret sprids ut i gruppen." },
  { term: "Social maskning",   def: "Att man anstränger sig mindre när man arbetar i grupp än när man utför samma uppgift ensam (social loafing)." },
];

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: "🏥",
    situation: "Du jobbar i ett team på fyra undersköterskor.\nEn kollega får ofta skulden när något går fel i teamet, även när det inte är hens fel.",
    optionA: "Du tänker att gruppen behöver en syndabock för att fungera och låter det vara.",
    optionB: "Du säger ifrån och påpekar att ansvaret bör delas rättvist i teamet.",
    correct: "B",
    explanation: "Att alltid lägga skulden på samma person är en osund grupproll (syndabocken) som kan skada både individen och arbetsklimatet.\nAtt säga ifrån är ett sätt att bryta ett destruktivt mönster.",
  },
  {
    id: 2,
    emoji: "🚑",
    situation: "Du är en av tio personer som ser någon ramla ihop på gatan.\nIngen annan verkar göra något.",
    optionA: "Du antar att någon annan redan har larmat och går vidare.",
    optionB: "Du går fram, pekar ut en specifik person och ber hen ringa 112 medan du hjälper.",
    correct: "B",
    explanation: "Detta är ett klassiskt exempel på åskådareffekten — ansvaret sprids ut i gruppen.\nGenom att peka ut en specifik person bryter du ansvarsspridningen och ökar chansen att någon faktiskt hjälper till.",
  },
  {
    id: 3,
    emoji: "👩‍⚕️",
    situation: "En ny kollega har fått ett rykte om att vara 'lat' innan hen ens har börjat jobba.\nDu märker att du själv börjar bemöta hen kyligt.",
    optionA: "Du fortsätter bemöta kollegan utifrån ryktet — det är säkert sant.",
    optionB: "Du påminner dig om Rosenthaleffekten och ger kollegan en chans utan förutfattade meningar.",
    correct: "B",
    explanation: "Förväntningar — positiva som negativa — påverkar hur vi bemöter andra, vilket i sin tur påverkar hur de faktiskt presterar (självuppfyllande profetia).\nAtt vara medveten om detta hjälper dig att bemöta alla rättvist.",
  },
  {
    id: 4,
    emoji: "🧑‍🤝‍🧑",
    situation: "I ett grupparbete märker du att du jobbar mycket mindre hårt än du skulle gjort om du gjort uppgiften själv.",
    optionA: "Du accepterar det — det är normalt att dra ner på tempot i grupp.",
    optionB: "Du funderar på varför — kanske känns målen otydliga eller din insats oviktig — och tar upp det med gruppen.",
    correct: "B",
    explanation: "Detta kallas social maskning (social loafing).\nAtt identifiera orsaken — otydliga mål, låg motivation eller att insatsen känns oviktig — är första steget för att motverka den.",
  },
];

const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Vilka roller kan finnas i en grupp?",
    options: ["Bara ledaren och medlemmarna.", "Den dominante, anklagaren, medlaren, syndabocken, martyren och lustigkurren.", "Chefen och de anställda.", "Ingen särskild rollfördelning uppstår i grupper."],
    correct: 1,
    explanation: "I grupper uppstår ofta flera olika roller som skapar balans, t.ex. den dominante, anklagaren, medlaren, syndabocken, martyren och lustigkurren.",
  },
  {
    id: 2,
    question: "Vad kännetecknar en primärgrupp?",
    options: ["En stor och formell grupp.", "En nära och personlig grupp, t.ex. familjen.", "En grupp man bara träffar på jobbet.", "En grupp helt utan känslomässiga band."],
    correct: 1,
    explanation: "Primärgruppen är nära och personlig, t.ex. familjen, medan sekundärgruppen är stor och formell.",
  },
  {
    id: 3,
    question: "Vad är social smitta?",
    options: ["Att man blir fysiskt sjuk av att vara i grupp.", "Att beteenden, känslor eller tillstånd sprids i en grupp.", "Ett medicinskt begrepp för virussmitta.", "Att man bara smittas av dåligt humör hemma."],
    correct: 1,
    explanation: "Social smitta innebär att beteenden, känslor, idéer eller tillstånd sprids mellan medlemmarna i en grupp.",
  },
  {
    id: 4,
    question: "Vad innebär hög status i en grupp?",
    options: ["Man blir ofta ignorerad.", "Andra lyssnar på personen och tar hens åsikter på allvar.", "Man får alltid skulden för misstag.", "Man påverkar aldrig gruppens beslut."],
    correct: 1,
    explanation: "Hög status innebär att andra lyssnar på personen och tar hens åsikter på större allvar, medan låg status ger mindre uppmärksamhet och inflytande.",
  },
  {
    id: 5,
    question: "Vad handlar normer om?",
    options: ["Vad som är juridiskt förbjudet.", "Hur de flesta i en grupp tycker att man bör göra.", "Officiella lagar och regler.", "Bara skriftliga regler på en arbetsplats."],
    correct: 1,
    explanation: "Normer säger inte vad som är förbjudet eller tillåtet som lagar gör — de handlar om hur de flesta i en grupp tycker att man bör bete sig.",
  },
  {
    id: 6,
    question: "Vad är exempel på sociala sanktioner?",
    options: ["Bara skriftliga varningar.", "Beröm och komplimanger (belöning), kritik och utfrysning (bestraffning).", "Enbart juridiska påföljder.", "Sanktioner finns bara i arbetslivet."],
    correct: 1,
    explanation: "Sociala sanktioner kan vara belöningar som beröm, komplimanger och likes, eller bestraffningar som kritik, utskällning och att bli ignorerad.",
  },
  {
    id: 7,
    question: "Vad är konformitet?",
    options: ["Att alltid gå emot gruppen.", "Att man anpassar sig efter gruppen och gör som de andra.", "Att vara ensam i sina åsikter.", "Ett annat ord för ledarskap."],
    correct: 1,
    explanation: "Konformitet innebär att man anpassar sig efter gruppens förväntningar och gör som de andra, ofta även om man egentligen tycker annorlunda.",
  },
  {
    id: 8,
    question: "Vad visade Aschs konformitetsexperiment?",
    options: ["Nästan ingen föll för grupptryck.", "Cirka 75% föll för grupptrycket i en enkel synuppgift.", "Deltagarna vägrade svara alls.", "Experimentet handlade om lydnad mot auktoritet, inte grupptryck."],
    correct: 1,
    explanation: "I Aschs experiment föll ca 75% av deltagarna för grupptrycket minst en gång, trots att uppgiften (att jämföra linjers längd) var enkel och inget hot förelåg.",
  },
  {
    id: 9,
    question: "Vad är åskådareffekten?",
    options: ["Att fler personer alltid hjälper snabbare.", "Att färre ingriper i en nödsituation ju fler åskådare som finns.", "Ett fenomen som bara gäller barn.", "Att man alltid ringer polisen direkt."],
    correct: 1,
    explanation: "Åskådareffekten innebär att sannolikheten att någon ingriper i en nödsituation minskar ju fler åskådare som finns, på grund av ansvarsspridning.",
  },
  {
    id: 10,
    question: "Vad handlar Zimbardos sju steg mot ondska om?",
    options: ["Hur man blir en bra ledare.", "En beskrivning av hur vanliga människor steg för steg kan förledas till att göra onda handlingar.", "Ett recept för konflikthantering.", "En modell för hur grupper fattar bra beslut."],
    correct: 1,
    explanation: "Zimbardos sju steg beskriver hur vanliga, goda människor stegvis kan förledas till onda handlingar — via t.ex. avhumanisering, anonymitet och blind lydnad mot auktoritet.",
  },
];

const SAMMANFATTNING = [
  { emoji: "🎭", text: "I grupper uppstår ofta olika roller som skapar balans — t.ex. ledaren, medlaren och syndabocken." },
  { emoji: "👪", text: "Socialisation är en livslång process där vi påverkas mest av våra närmaste, 'signifikanta andra'." },
  { emoji: "📏", text: "Normer handlar om hur man bör bete sig — inte om vad som är förbjudet enligt lag." },
  { emoji: "🏅", text: "Sociala sanktioner (belöning/bestraffning) styr oss att följa gruppens normer." },
  { emoji: "🙋", text: "Konformitet innebär att vi anpassar oss efter gruppen — ibland mot bättre vetande." },
  { emoji: "👀", text: "Åskådareffekten gör att färre hjälper till ju fler som bevittnar en nödsituation." },
  { emoji: "🌟", text: "Positiva eller negativa förväntningar kan bli självuppfyllande profetior (Rosenthaleffekten)." },
  { emoji: "⚠️", text: "Zimbardos sju steg visar hur vanliga människor stegvis kan förledas till onda handlingar." },
];

const FAKTARUTOR = [
  {
    id: "roller",
    emoji: "🎭",
    title: "Roller i grupp",
    short: "Deltagarna intar olika roller som skapar balans i gruppen.",
    bullets: [
      "Den dominante/överlägsne tar ofta plats och styr samtalet.",
      "Anklagaren riktar kritik mot andra i gruppen.",
      "Medlaren försöker lösa konflikter och skapa samförstånd.",
      "Syndabocken får ofta skulden när något går fel.",
      "Martyren offrar sig själv för gruppen.",
      "Lustigkurren lättar upp stämningen med humor.",
    ],
  },
  {
    id: "social-maskning",
    emoji: "⚙️",
    title: "Social maskning",
    short: "Man jobbar ofta mindre hårt i grupp än ensam.",
    bullets: [
      "Ringelmann (1913): en person drog 63 kg, tre personer 53 kg var, fler än åtta bara 31 kg var.",
      "Risken ökar vid dålig motivation och otydliga gruppmål.",
      "Risken ökar om uppgiften känns oviktig eller irrelevant.",
      "Risken ökar om den egna insatsen upplevs som oviktig.",
      "Motverkas genom tydliga individuella ansvarsområden och mål.",
    ],
  },
  {
    id: "rosenthal",
    emoji: "🌟",
    title: "Rosenthaleffekten & självuppfyllande profetia",
    short: "Förväntningar påverkar verkligheten.",
    bullets: [
      "Positiva förväntningar på en person kan förbättra dennes prestation.",
      "Tandläkarstudenterna 1993: elever som av misstag togs in trots lägre poäng presterade lika bra som övriga, eftersom lärarna inte visste vilka det var.",
      "Självuppfyllande profetia: mina förväntningar på andra styr hur jag bemöter dem — och därmed hur de agerar.",
      "Gäller särskilt i vårdande och pedagogiska yrken, t.ex. sjuksköterska eller lärare.",
      "Placebo- och noceboeffekten bygger på samma princip, fast kopplat till hälsa.",
    ],
  },
  {
    id: "askadareffekt",
    emoji: "🙋",
    title: "Åskådareffekten och att hjälpa till",
    short: "Varför hjälper vi — eller låter bli?",
    bullets: [
      "Vi måste först uppfatta att något är fel och bedöma det som en nödsituation.",
      "Vi måste känna personligt ansvar — är du ensam tar du oftare ansvar.",
      "Vi väger kostnaden för att ingripa mot kostnaden för att låta bli.",
      "Ju fler åskådare, desto mer ansvarsspridning och mindre sannolikt att någon hjälper.",
      "Man hjälper lättare någon man känner än en helt okänd person.",
    ],
  },
  {
    id: "lydnad",
    emoji: "⚡",
    title: "Lydnad och Milgrams experiment",
    short: "Varför lydde så många en auktoritet?",
    bullets: [
      "Milgram (1960-talet) undersökte hur långt vanliga människor går när en auktoritet ber dem skada någon annan.",
      "25 av 40 deltagare gav de högsta elchockerna (450 volt).",
      "Förklaringar: opersonligt avstånd, upplevde sig inte ansvariga själva, trodde det var för en god sak.",
      "Lydnaden ökade med närhet till auktoriteten och minskade med närhet till offret.",
      "Om en annan person i rummet protesterade minskade lydnaden kraftigt.",
    ],
  },
  {
    id: "zimbardo",
    emoji: "🔥",
    title: "Zimbardos sju steg mot ondska",
    short: "Vägen mot ondska är hal — sju steg att känna igen.",
    bullets: [
      "1. Att obetänksamt ta det första lilla steget.",
      "2. Avhumanisering av andra ('vi och dom').",
      "3. Anonymitet.",
      "4. Överlåtande av det personliga ansvaret till någon annan.",
      "5. Blind auktoritetslydnad.",
      "6. Okritisk anpassning till gruppnormer.",
      "7. Tolerans av ondska genom att förhålla sig passiv.",
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
          Lär dig om roller, normer, grupptryck och förväntningars kraft — och vad klassiska experiment som Milgram, Asch och Zimbardo lär oss om människors beteende i grupp.
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
