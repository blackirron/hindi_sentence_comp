import Link from "next/link";
import { ArrowRight, GitBranch, ListTree, ScanText, Sprout } from "lucide-react";
import { Predictor } from "@/components/playground/predictor";

const FEATURES = [
  {
    icon: Sprout,
    title: "Fine-tuned, not from scratch",
    body: "Starts from surajp/gpt2-hindi, an 88M-parameter GPT-2 pretrained on Hindi, then fine-tuned further on conversational Hindi lines pulled from OpenSubtitles.",
  },
  {
    icon: ScanText,
    title: "Whole words, not subword scraps",
    body: "GPT-2 predicts in subword pieces. The predictor walks token-by-token until it hits a real word boundary, so you see \"कल्पना\", never a stray \"्पना\".",
  },
  {
    icon: GitBranch,
    title: "Two modes, one model",
    body: "Predict just the next word with ranked candidates, or let the model run on and stop itself after two or three full sentences.",
  },
  {
    icon: ListTree,
    title: "Danda-aware stopping",
    body: "Sentence completion counts Devanagari's । (danda) alongside ./?/! so generations end on a real sentence, not mid-token.",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-28">
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
          CS224N project &middot; fine-tuned Hindi GPT-2
        </span>
        <h1 className="font-display max-w-3xl text-4xl leading-tight text-ink-foreground sm:text-6xl">
          लिखिए। आगे क्या आएगा?
        </h1>
        <p className="max-w-xl text-lg text-muted">
          Type a partial Hindi sentence. The model predicts what comes
          next — word by word, or the whole rest of the sentence.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 rounded-full bg-tulsi px-5 py-2.5 text-sm font-medium text-tulsi-foreground transition-opacity hover:opacity-90"
          >
            Open the full playground <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-ink-foreground/80 transition-colors hover:border-tulsi hover:text-tulsi"
          >
            How the model works
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <Predictor variant="compact" />
      </section>

      <div className="leaf-divider" />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-2xl text-ink-foreground sm:text-3xl">
          Built for the messy middle of a sentence
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Every design decision here traces back to a real fix made
          while training this model — nothing is decorative.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="ink-grain rounded-2xl border border-border bg-surface p-6"
            >
              <Icon className="h-5 w-5 text-tulsi" strokeWidth={1.75} />
              <h3 className="mt-4 text-base font-semibold text-ink-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
