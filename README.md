# Hindi Sentence Completer

Live site: https://hindisentencecompleter.vercel.app


Next.js frontend for a fine-tuned Hindi GPT-2 sentence completer,
built for a Stanford CS224N project. Source model/training notebook:
https://github.com/blackirron/Hindi-Sentence-Completer-CS224N-project

## Pages

- `/` — hero, live mini-demo, feature grid
- `/playground` — full predictor (next-word + sentence completion)
- `/about` — model & training details
- `/docs` — API reference, env var setup
- `/support` — FAQ, issue reporting

## Local development

```bash
npm install
npm run dev
```

## Deploying on Vercel

1. Push this project to a Git repo (or import the zip directly in the
   Vercel dashboard: **Add New → Project → Upload**).
2. In Vercel project settings, optionally add:
   - `HUGGINGFACE_API_TOKEN` — a free token from huggingface.co, to
     enable live model calls (without it, `/api/predict` returns a
     small offline demo response instead).
   - `HF_MODEL_ID` — defaults to `surajp/gpt2-hindi`. Point this at
     your own published fine-tuned checkpoint if you push one to the
     Hugging Face Hub.
3. Deploy. No other configuration is required.

See `/docs` in the running app for the API contract.
