import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About · Hindi Sentence Completer",
  description: "Model details and training approach for the fine-tuned Hindi GPT-2 sentence completer.",
};

const TRAINING_STEPS = [
  {
    step: "1",
    title: "Base model",
    body: "surajp/gpt2-hindi — a GPT-2 architecture (about 88M parameters) pretrained from scratch on Hindi text, loaded via Hugging Face Transformers.",
  },
  {
    step: "2",
    title: "Corpus",
    body: "Hindi lines pulled from the OPUS OpenSubtitles en–hi bitext, keeping only the Hindi side. Lines are cleaned (length filtered, bracketed stage directions and leading dashes stripped) and deduplicated to build a conversational, spoken-register corpus rather than formal prose.",
  },
  {
    step: "3",
    title: "Tokenizing & chunking",
    body: "The same tokenizer as the base model is reused (retraining it would break the pretrained embeddings' meaning). Lines are joined with the tokenizer's EOS token and cut into fixed 128-token blocks, the standard packing strategy for causal-LM fine-tuning.",
  },
  {
    step: "4",
    title: "Fine-tuning",
    body: "Hugging Face Trainer, 3 epochs, batch size 16, learning rate 5e-5, 100 warmup steps, mixed precision when a GPU is available. Eval loss is tracked each epoch and converted to perplexity to catch overfitting early.",
  },
  {
    step: "5",
    title: "Whole-word decoding",
    body: "A single forward pass gives next-token probabilities, but GPT-2 tokens are subwords. The predictor walks forward token-by-token per candidate until the next token would start a new word (a leading space or punctuation), so predictions surface as real words, not fragments.",
  },
  {
    step: "6",
    title: "Sentence completion",
    body: "Generation stops after a target number of sentence-ending characters (., ?, !, and the Devanagari danda ।) rather than a fixed token count, so short prompts don't get padded out and longer ones don't cut off mid-thought.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">About</span>
      <h1 className="font-display mt-4 text-3xl text-ink-foreground sm:text-4xl">
        A GPT-2 that learned to speak conversational Hindi
      </h1>
      <p className="mt-4 text-muted">
        This project fine-tunes a Hindi GPT-2 checkpoint on everyday,
        spoken-register Hindi so it completes sentences the way people
        actually talk, not the way a newspaper is written. It was built
        for Stanford&rsquo;s CS224N.
      </p>

      <div className="mt-10 flex flex-col gap-6">
        {TRAINING_STEPS.map((s) => (
          <div key={s.step} className="flex gap-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
            <span className="font-display shrink-0 text-2xl text-tulsi">{s.step}</span>
            <div>
              <h2 className="text-base font-semibold text-ink-foreground">{s.title}</h2>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-base font-semibold text-ink-foreground">
          What this live demo actually calls
        </h2>
        <p className="mt-2 text-sm text-muted">
          The fine-tuned checkpoint produced by the notebook is saved
          locally to the training session and was never pushed to the
          Hugging Face Hub, so a deployed website can&rsquo;t call it
          directly. This playground calls the public base model,{" "}
          <code className="rounded bg-ink px-1.5 py-0.5 text-xs text-tulsi">surajp/gpt2-hindi</code>,
          through Hugging Face&rsquo;s hosted Inference API instead — same
          decoding logic from the notebook, base weights. Point{" "}
          <code className="rounded bg-ink px-1.5 py-0.5 text-xs text-tulsi">HF_MODEL_ID</code>{" "}
          at your own published fine-tuned repo to serve the real thing.
          See{" "}
          <Link href="/docs" className="text-tulsi hover:underline">
            the docs
          </Link>{" "}
          for setup.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-base font-semibold text-ink-foreground">Source material</h2>
        <p className="mt-2 text-sm text-muted">
          The full training notebook and a walkthrough recording are in
          the project repository.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <a
            href="https://github.com/blackirron/Hindi-Sentence-Completer-CS224N-project"
            target="_blank"
            rel="noreferrer"
            className="text-tulsi hover:underline"
          >
            Word_predictor+sentence_completer_in_CLI.ipynb →
          </a>
        </div>
      </div>
    </section>
  );
}
