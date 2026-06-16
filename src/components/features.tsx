import Link from "next/link";
import { IconType } from "react-icons";
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
} from "react-icons/fa";

interface FeatureItem {
  id: string;
  Icon: IconType;
  title: string;
  items: string[];
  links?: Record<string, string>;
}

const FEATURE_DATA: FeatureItem[] = [
  {
    id: "vard-och-omsorg",
    Icon: FaHandsHelping,
    title: "Vård och omsorg",
    links: {
      "Grundläggande omvårdnad": "/vard-och-omsorg/grundlaggande-omvardnad",
    },
    items: [
      "Grundläggande omvårdnad",
      "Personlig hygien",
      "Förflyttningsteknik",
      "Nutrition och kost",
      "Sömn och vila",
      "Observation av patienters hälsotillstånd",
      "Dokumentation och rapportering",
    ],
  },
  {
    id: "medicin",
    Icon: FaStethoscope,
    title: "Medicin",
    items: [
      "Anatomi (kroppens uppbyggnad)",
      "Fysiologi (hur kroppen fungerar)",
      "Vanliga sjukdomar",
      "Symtom och behandlingar",
      "Läkemedelshantering (grundläggande)",
      "Smitta och infektioner",
    ],
  },
  {
    id: "psykiatri",
    Icon: FaBrain,
    title: "Psykiatri",
    items: [
      "Depression",
      "Ångest",
      "Bipolär sjukdom",
      "Schizofreni",
      "Neuropsykiatriska funktionsnedsättningar (ADHD, autism)",
      "Bemötande inom psykiatrisk vård",
    ],
  },
  {
    id: "gerontologi",
    Icon: FaUserAlt,
    title: "Gerontologi och geriatrik",
    items: [
      "Normalt åldrande",
      "Demenssjukdomar",
      "Fallrisker",
      "Äldres hälsa",
      "Palliativ vård",
    ],
  },
  {
    id: "funktionsformaga",
    Icon: FaWheelchair,
    title: "Funktionsförmåga och funktionsnedsättning",
    items: [
      "Fysiska funktionsnedsättningar",
      "Intellektuella funktionsnedsättningar",
      "Hjälpmedel",
      "LSS-verksamhet",
      "Delaktighet och självbestämmande",
    ],
  },
  {
    id: "halso-sjukvard",
    Icon: FaHospitalAlt,
    title: "Hälso- och sjukvård",
    items: [
      "Vårdens organisation i Sverige",
      "Patientsäkerhet",
      "Hygienrutiner",
      "Arbetsmiljö",
      "Vårdrelaterade infektioner",
    ],
  },
  {
    id: "etik",
    Icon: FaBalanceScale,
    title: "Etik och människosyn",
    items: [
      "Etiska dilemman",
      "Integritet",
      "Tystnadsplikt",
      "Sekretess",
      "Självbestämmande",
      "Professionellt bemötande",
    ],
  },
  {
    id: "lagar",
    Icon: FaGavel,
    title: "Lagar och regler",
    items: [
      "Socialstyrelsens föreskrifter",
      "Hälso- och sjukvårdslagen (HSL)",
      "Patientsäkerhetslagen",
      "Patientlagen",
      "Socialtjänstlagen (SoL)",
      "LSS",
    ],
  },
  {
    id: "kommunikation",
    Icon: FaComments,
    title: "Kommunikation",
    items: [
      "Samtal med patienter och anhöriga",
      "Aktivt lyssnande",
      "Konflikthantering",
      "Dokumentation",
      "Samarbete i vårdteam",
    ],
  },
  {
    id: "fokus",
    Icon: FaLightbulb,
    title: "Fokusera särskilt på",
    items: [
      "Anatomi och fysiologi",
      "Vanliga sjukdomar",
      "Hygienrutiner och smittspridning",
      "Demens och äldreomsorg",
      "Psykiatriska diagnoser",
      "Etik och sekretess",
      "HSL, SoL och LSS",
      "Omvårdnadsprocessen (observera–planera–genomföra–utvärdera)",
    ],
  },
];

export function Features() {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="grid gap-6 md:grid-cols-3">
        {FEATURE_DATA.map((feature) => (
          <FeatureCard key={feature.id} {...feature} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ id, Icon, title, items, links }: FeatureItem) {
  return (
    <div id={id} className="rounded-2xl border p-6 transition-shadow hover:shadow-md hover:border-primary scroll-mt-20">
      <Icon className="text-4xl mb-4 text-primary" />
      <h3 className="font-semibold text-xl">{title}</h3>
      <ul className="mt-2 space-y-1 text-muted-foreground">
        {items.map((item, i) => {
          const href = links?.[item];
          return (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 shrink-0">•</span>
              {href ? (
                <Link
                  href={href}
                  className="text-primary underline-offset-2 hover:underline font-medium"
                >
                  {item}
                </Link>
              ) : (
                <span>{item}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
