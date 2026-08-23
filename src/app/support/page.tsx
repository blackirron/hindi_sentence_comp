import type { Metadata } from "next";
import { GithubIcon } from "@/components/icons/github-icon";
import { MessageSquareWarning } from "lucide-react";

export const metadata: Metadata = {
  title: "Support · Hindi Sentence Completer",
  description: "FAQ and support links for the Hindi Sentence Completer project.",
};

const FAQ = [
  {
    q: "Why does it say \u201cOffline demo\u201d instead of \u201cLive model\u201d?",
    a: "No Hugging Face API token is configured for this deployment, so the API route returns a small set of canned sample responses instead of calling the model. See the Docs page for how to add a token.",
  },
  {
    q: "Is this using the actual fine-tuned model from the notebook?",
    a: "Not by default — that checkpoint lives only in the training notebook's session and isn't published anywhere the live site can reach. The playground calls the public base model, surajp/gpt2-hindi, with the same decoding logic. See the About page for the full explanation.",
  },
  {
    q: "Predictions look slow the first time I try them.",
    a: "Hugging Face's hosted Inference API spins model instances down when idle, so the first request after a quiet period can take several seconds to \u201cwarm up.\u201d Subsequent requests are much faster.",
  },
  {
    q: "Can I use this for languages other than Hindi?",
    a: "The tokenizer and fine-tuning corpus are Hindi-specific, so results for other languages will be unreliable. Swapping HF_MODEL_ID to a different base model would need matching changes to the corpus and preprocessing.",
  },
];

export default function SupportPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">Support</span>
      <h1 className="font-display mt-4 text-3xl text-ink-foreground sm:text-4xl">Support</h1>
      <p className="mt-4 text-muted">
        This is a CS224N course project, not a production service — but
        issues and questions are genuinely welcome.
      </p>

      <div className="mt-10 flex flex-col gap-6">
        {FAQ.map((item) => (
          <div key={item.q} className="border-t border-border pt-6 first:border-t-0 first:pt-0">
            <h2 className="text-base font-semibold text-ink-foreground">{item.q}</h2>
            <p className="mt-2 text-sm text-muted">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href="https://github.com/blackirron/Hindi-Sentence-Completer-CS224N-project"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-tulsi"
        >
          <GithubIcon className="h-5 w-5 text-tulsi" />
          <div>
            <p className="text-sm font-medium text-ink-foreground">Source on GitHub</p>
            <p className="text-xs text-muted">Notebook, model details, training walkthrough</p>
          </div>
        </a>
        <a
          href="https://github.com/blackirron/Hindi-Sentence-Completer-CS224N-project/issues"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-tulsi"
        >
          <MessageSquareWarning className="h-5 w-5 text-tulsi" />
          <div>
            <p className="text-sm font-medium text-ink-foreground">Report an issue</p>
            <p className="text-xs text-muted">Bugs, broken predictions, anything odd</p>
          </div>
        </a>
      </div>
    </section>
  );
}
