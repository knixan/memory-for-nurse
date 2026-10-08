import Link from "next/link";
import { FaHeart, FaBrain, FaGamepad, FaUserAlt } from "react-icons/fa";

export const metadata = {
  title: "Om appen",
  description:
    "Appen är skapad av Josefine Eriksson för att hjälpa elever att lätt plugga och memorera inför prov.",
};

const FEATURES = [
  { Icon: FaGamepad, title: "Spel", text: "Memory-spel och scenariofrågor gör det roligare att öva." },
  { Icon: FaBrain, title: "Quiz", text: "Testa dig själv och få förklaring till varje svar." },
  { Icon: FaHeart, title: "Enkelt språk", text: "Korta meningar och enkla ord, så att det är lätt att förstå." },
];

export default function OmAppen() {
  return (
    <div>
      <section className="relative bg-linear-to-br from-primary/90 to-primary py-16 sm:py-24 text-primary-foreground overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="relative container mx-auto px-6 max-w-3xl">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium mb-6">Om appen</span>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">Memory for Nurse</h1>
          <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl">
            Ett enklare sätt att plugga och memorera inför prov inom vård och omsorg.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 pb-20 mt-12 max-w-3xl space-y-12">
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Vad är appen?</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Den här appen är skapad av <strong className="text-foreground">Josefine Eriksson</strong> för att
            hjälpa elever som läser vård och omsorg att lätt kunna plugga och memorera inför prov.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Här finns spel, faktarutor, begrepp och quiz för varje ämne. Du kan öva lite i taget, när du vill,
            och se direkt vad du kan och vad du behöver repetera.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Målet är att det ska vara enkelt att repetera och roligt att öva, så att du känner dig trygg på
            provet och i ditt kommande arbete.
          </p>
        </section>

        <section className="grid sm:grid-cols-3 gap-4">
          {FEATURES.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5">
              <Icon className="text-3xl text-primary mb-3" />
              <p className="font-bold text-foreground mb-1">{title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-primary/30 bg-primary/5 p-6 flex items-start gap-4">
          <FaUserAlt className="text-3xl text-primary shrink-0 mt-1" />
          <div>
            <p className="font-bold text-foreground">Skapad av Josefine Eriksson</p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Appen är ett studiestöd och ersätter inte kurslitteraturen.
            </p>
          </div>
        </section>

        <Link
          href="/"
          className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Till ämnena
        </Link>
      </div>
    </div>
  );
}
