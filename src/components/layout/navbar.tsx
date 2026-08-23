"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const NAV_LINKS = [
  { href: "/playground", label: "Playground" },
  { href: "/about", label: "About" },
  { href: "/docs", label: "Docs" },
  { href: "/support", label: "Support" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-ink/85 backdrop-blur supports-[backdrop-filter]:bg-ink/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-tulsi/60 bg-tulsi/10 font-display text-lg leading-none text-tulsi">
            अ
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-ink-foreground">
              Hindi Sentence Completer
            </span>
            <span className="font-display text-xs text-muted">
              लिखिए। आगे क्या आएगा?
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-surface text-tulsi"
                    : "text-ink-foreground/75 hover:text-tulsi"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="https://github.com/blackirron/Hindi-Sentence-Completer-CS224N-project"
            target="_blank"
            rel="noreferrer"
            aria-label="View source on GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-foreground/70 transition-colors hover:border-tulsi hover:text-tulsi"
          >
            <GithubIcon className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <Link
            href="/playground"
            className="rounded-full bg-tulsi px-4 py-1.5 text-sm font-medium text-tulsi-foreground transition-opacity hover:opacity-90"
          >
            Try the Playground
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-foreground/80 md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/80 px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  pathname === link.href
                    ? "bg-surface text-tulsi"
                    : "text-ink-foreground/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="https://github.com/blackirron/Hindi-Sentence-Completer-CS224N-project"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-foreground/70"
            >
              <GithubIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
