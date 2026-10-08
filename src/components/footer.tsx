export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
        Kod och Design av Josefine Eriksson ·{" "}
        <a
          href="https://kodochdesign.se"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium underline-offset-2 hover:underline"
        >
          kodochdesign.se
        </a>
      </div>
    </footer>
  );
}
