import type { Metadata } from "next";
import { Predictor } from "@/components/playground/predictor";

export const metadata: Metadata = {
  title: "Playground · Hindi Sentence Completer",
  description: "Try the fine-tuned Hindi GPT-2 model live: predict the next word or complete a sentence.",
};

export default function PlaygroundPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
        Playground
      </span>
      <h1 className="font-display mt-4 text-3xl text-ink-foreground sm:text-4xl">
        प्लेग्राउंड
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        Type any partial Hindi sentence below, or tap one of the sample
        prompts from the project notebook. Tap a predicted word to add
        it and keep going.
      </p>

      <div className="mt-8">
        <Predictor variant="full" />
      </div>

      <p className="mt-6 text-xs text-muted">
        Running without a configured Hugging Face API token shows an
        offline demo response instead of a live model call — see{" "}
        <a href="/docs" className="text-tulsi hover:underline">
          the docs
        </a>{" "}
        for how to enable live predictions.
      </p>
    </section>
  );
}
