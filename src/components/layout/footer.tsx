import Link from "next/link";
import { MessageSquareWarning } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";

export function Footer() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-lg text-tulsi">
              हिंदी वाक्य पूर्णक
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              A GPT-2 model fine-tuned on Hindi conversational text,
              predicting the next word and completing sentences in
              Devanagari.
            </p>
          </div>

          <div className="text-sm">
            <p className="mb-3 font-medium text-ink-foreground">Project</p>
            <ul className="space-y-2 text-muted">
              <li>
                <Link href="/about" className="hover:text-tulsi">
                  About &amp; model details
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-tulsi">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-tulsi">
                  Playground
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="mb-3 font-medium text-ink-foreground">Support</p>
            <ul className="space-y-2 text-muted">
              <li>
                <Link
                  href="https://github.com/blackirron/Hindi-Sentence-Completer-CS224N-project"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-tulsi"
                >
                  <GithubIcon className="h-3.5 w-3.5" /> Source on GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/blackirron/Hindi-Sentence-Completer-CS224N-project/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-tulsi"
                >
                  <MessageSquareWarning className="h-3.5 w-3.5" /> Report an
                  issue
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 text-xs text-muted">
          Built for CS224N &middot; fine-tuned from surajp/gpt2-hindi
        </div>
      </div>
    </footer>
  );
}
