import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center">
      <Image
        src="/hero.png"
        alt="Undersköterska i svensk vårdmiljö"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-2xl text-white">
          <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur px-4 py-2 text-sm border border-white/20">
            Undersköterskeutbildning
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
            Lär dig teorin som krävs för att bli
            <span className="block text-sky-300">
              undersköterska i Sverige
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-200">
            Studera medicin, omvårdnad, psykiatri, etik,
            lagstiftning och äldreomsorg med tydliga
            förklaringar och praktiska exempel.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" className="bg-sky-600 hover:bg-sky-700 px-8">
              Börja studera
            </Button>

            <Button variant="outline" size="lg" className="border-white/30 bg-white/10 backdrop-blur hover:bg-white/20 text-white hover:text-white px-8">
              Se alla ämnen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}