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
  Icon: IconType;
  title: string;
  description: string;
}

const FEATURE_DATA: FeatureItem[] = [
  {
    Icon: FaHandsHelping,
    title: "Vård och omsorg",
    description:
      "Grundläggande omvårdnad, personlig hygien, förflyttningsteknik, nutrition, sömn och vila, observation av patienters hälsotillstånd, dokumentation och rapportering.",
  },
  {
    Icon: FaStethoscope,
    title: "Medicin",
    description:
      "Anatomi, fysiologi, vanliga sjukdomar, symtom och behandlingar, grundläggande läkemedelshantering, smitta och infektioner.",
  },
  {
    Icon: FaBrain,
    title: "Psykiatri",
    description:
      "Kunskap om psykisk hälsa och ohälsa, depression, ångest, bipolär sjukdom, schizofreni, neuropsykiatriska funktionsnedsättningar och bemötande inom psykiatrisk vård.",
  },
  {
    Icon: FaUserAlt,
    title: "Gerontologi och geriatrik",
    description:
      "Normalt åldrande, demenssjukdomar, fallrisker, äldres hälsa och palliativ vård.",
  },
  {
    Icon: FaWheelchair,
    title: "Funktionsförmåga och funktionsnedsättning",
    description:
      "Fysiska och intellektuella funktionsnedsättningar, hjälpmedel, LSS-verksamhet, delaktighet och självbestämmande.",
  },
  {
    Icon: FaHospitalAlt,
    title: "Hälso- och sjukvård",
    description:
      "Vårdens organisation i Sverige, patientsäkerhet, hygienrutiner, arbetsmiljö och vårdrelaterade infektioner.",
  },
  {
    Icon: FaBalanceScale,
    title: "Etik och människosyn",
    description:
      "Etiska dilemman, integritet, tystnadsplikt, sekretess, självbestämmande och professionellt bemötande.",
  },
  {
    Icon: FaGavel,
    title: "Lagar och regler",
    description:
      "Socialstyrelsens föreskrifter, Hälso- och sjukvårdslagen (HSL), Patientsäkerhetslagen, Patientlagen, Socialtjänstlagen (SoL) och LSS.",
  },
  {
    Icon: FaComments,
    title: "Kommunikation",
    description:
      "Samtal med patienter och anhöriga, aktivt lyssnande, konflikthantering, dokumentation och samarbete i vårdteam.",
  },
  {
    Icon: FaLightbulb,
    title: "Fokusera särskilt på",
    description:
      "Anatomi och fysiologi, vanliga sjukdomar, hygienrutiner och smittspridning, demens och äldreomsorg, psykiatriska diagnoser, etik och sekretess, HSL, SoL och LSS, samt omvårdnadsprocessen.",
  },
];

export function Features() {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="grid gap-6 md:grid-cols-3">
        {FEATURE_DATA.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ Icon, title, description }: FeatureItem) {
  return (
    <div className="rounded-2xl border p-6 transition-shadow hover:shadow-md hover:border-primary">
      <Icon className="text-4xl mb-4 text-primary" />
      <h3 className="font-semibold text-xl">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}