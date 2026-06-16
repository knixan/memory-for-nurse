"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
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
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaChevronDown,
} from "react-icons/fa";

const AMNEN = [
  { icon: FaHandsHelping, label: "Vård och omsorg",                  href: "/#vard-och-omsorg" },
  { icon: FaStethoscope,  label: "Medicin",                          href: "/#medicin" },
  { icon: FaBrain,        label: "Psykiatri",                        href: "/#psykiatri" },
  { icon: FaUserAlt,      label: "Gerontologi och geriatrik",        href: "/#gerontologi" },
  { icon: FaWheelchair,   label: "Funktionsförmåga",                 href: "/#funktionsformaga" },
  { icon: FaHospitalAlt,  label: "Hälso- och sjukvård",             href: "/#halso-sjukvard" },
  { icon: FaBalanceScale, label: "Etik och människosyn",            href: "/#etik" },
  { icon: FaGavel,        label: "Lagar och regler",                 href: "/#lagar" },
  { icon: FaComments,     label: "Kommunikation",                    href: "/#kommunikation" },
  { icon: FaLightbulb,    label: "Fokusera särskilt på",             href: "/#fokus" },
];

// Isolated so its own useEffect only handles the mounted guard for next-themes.
function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const base =
    "rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors";

  if (!mounted) {
    // Placeholder keeps layout stable during hydration
    return <span className={`inline-block w-8 h-8 ${className ?? ""}`} />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Byt tema"
      className={`${base} ${className ?? ""}`}
    >
      {resolvedTheme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-6">

        {/* Logotyp */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity"
        >
          <FaHospitalAlt className="text-2xl" />
          <span>Vård och Omsorg</span>
        </Link>

        {/* Desktop-nav */}
        <div className="hidden md:flex items-center gap-2">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              Ämnen
              <FaChevronDown
                className={`text-xs transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-border bg-popover shadow-lg py-2 z-50">
                {AMNEN.map(({ icon: Icon, label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Icon className="text-primary shrink-0" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="#"
            className="rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Om appen
          </Link>

          <Button size="sm" className="ml-2">
            Börja studera
          </Button>

          <ThemeToggle className="ml-1" />
        </div>

        {/* Mobil: tema + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Stäng meny" : "Öppna meny"}
            className="rounded-md p-2 text-foreground hover:bg-accent transition-colors"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobilmeny */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 pb-4">
          <p className="pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Ämnen
          </p>
          <div className="grid grid-cols-1 gap-0.5">
            {AMNEN.map(({ icon: Icon, label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Icon className="text-primary shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="#"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              Om appen
            </Link>
            <Button size="sm" className="w-full" onClick={() => setMobileOpen(false)}>
              Börja studera
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
