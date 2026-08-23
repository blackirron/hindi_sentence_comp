import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs · Hindi Sentence Completer",
  description: "API reference and setup instructions for the Hindi Sentence Completer playground.",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="font-mono mt-3 overflow-x-auto rounded-xl border border-border bg-ink px-4 py-3 text-xs leading-relaxed text-ink-foreground">
      <code>{children}</code>
    </pre>
  );
}

export default function DocsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">Docs</span>
      <h1 className="font-display mt-4 text-3xl text-ink-foreground sm:text-4xl">Documentation</h1>
      <p className="mt-4 text-muted">
        How the playground talks to the model, and how to point it at
        your own fine-tuned checkpoint.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        <div>
          <h2 className="text-lg font-semibold text-ink-foreground">Enabling live predictions</h2>
          <p className="mt-2 text-sm text-muted">
            The API route falls back to a small offline demo whenever no
            token is configured, so the site works out of the box. To
            call a real model, set an environment variable in your
            Vercel project (Settings → Environment Variables):
          </p>
          <CodeBlock>{`HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxx

# optional — defaults to the base pretrained model
HF_MODEL_ID=surajp/gpt2-hindi`}</CodeBlock>
          <p className="mt-2 text-sm text-muted">
            Get a free token from your Hugging Face account settings
            under &ldquo;Access Tokens&rdquo;. To serve your own
            fine-tuned checkpoint instead of the base model, push it to
            the Hub with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-xs">
              model.push_to_hub(...)
            </code>{" "}
            and point <code className="rounded bg-surface px-1.5 py-0.5 text-xs">HF_MODEL_ID</code> at that repo.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-foreground">POST /api/predict</h2>
          <p className="mt-2 text-sm text-muted">Request body:</p>
          <CodeBlock>{`{
  "prompt": "भारत एक",
  "mode": "next-word",   // or "complete"
  "k": 5                  // next-word candidates to return (1–8)
}`}</CodeBlock>
          <p className="mt-3 text-sm text-muted">Response — next-word mode:</p>
          <CodeBlock>{`{
  "mode": "next-word",
  "prompt": "भारत एक",
  "candidates": [
    { "word": "देश", "score": 0.42 },
    { "word": "बड़ा", "score": 0.18 }
  ],
  "source": "model"   // or "offline"
}`}</CodeBlock>
          <p className="mt-3 text-sm text-muted">Response — complete mode:</p>
          <CodeBlock>{`{
  "mode": "complete",
  "prompt": "भारत एक",
  "completion": "भारत एक विशाल और विविधताओं से भरा देश है।",
  "source": "model"
}`}</CodeBlock>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-foreground">Why next-word scores are sampled, not exact</h2>
          <p className="mt-2 text-sm text-muted">
            The notebook&rsquo;s <code className="rounded bg-surface px-1.5 py-0.5 text-xs">predict_next_word</code>{" "}
            reads exact softmax probabilities off the model&rsquo;s raw
            logits — possible when you hold the weights locally, but not
            exposed by the hosted Inference API used here. Instead the
            route draws several short samples from the model, tallies
            the first whole word from each, and reports the tally as an
            approximate score. Running your own model server would let
            you restore exact logit-based scoring.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink-foreground">Local development</h2>
          <CodeBlock>{`npm install
npm run dev
# open http://localhost:3000`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
