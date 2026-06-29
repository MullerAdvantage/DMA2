# Architecture

## Request Flow

```
Browser
  └─► Next.js App Router (app/)
        ├─► Dashboard UI (React Client Components)
        │     ├─ /dashboard          → Overview + breach summary + quick actions
        │     ├─ /dashboard/mocs     → Breach tracker + detail panel
        │     ├─ /dashboard/evidence → Upload + ingest + AI analysis
        │     ├─ /dashboard/reports  → Report generator (Markdown output)
        │     ├─ /dashboard/openclaw → Skill executor
        │     └─ /dashboard/bot      → AI chat (MOCS-aware)
        │
        └─► API Routes (app/api/)
              ├─ /api/bot          → Claude claude-sonnet-4-6 (system prompt from bot/prompts/system.txt)
              ├─ /api/mocs/ingest  → fs write to mocs/evidence/{category}/
              ├─ /api/mocs/analyze → Claude forensics analysis → JSON
              ├─ /api/mocs/report  → Claude report generation → Markdown
              └─ /api/openclaw    → Skill router → Claude with skill-specific system prompt
```

## Directory Layout

```
agency-system/
├── app/
│   ├── layout.tsx              Root layout (Sidebar + Inter font)
│   ├── page.tsx                Redirects → /dashboard
│   ├── globals.css             Brand CSS (navy + gold variables)
│   ├── api/
│   │   ├── bot/route.ts        AI chat endpoint
│   │   ├── mocs/
│   │   │   ├── ingest/route.ts Upload evidence to filesystem
│   │   │   ├── analyze/route.ts Claude forensic JSON analysis
│   │   │   └── report/route.ts Claude Markdown report generation
│   │   └── openclaw/route.ts   Skill executor
│   └── dashboard/
│       ├── page.tsx            Overview dashboard
│       ├── components/
│       │   └── Sidebar.tsx     Navy sidebar with gold active state
│       ├── bot/page.tsx        Full chat UI
│       ├── mocs/page.tsx       Breach tracker + detail
│       ├── evidence/page.tsx   Upload + ingest + analyze
│       ├── reports/page.tsx    Report generator
│       └── openclaw/page.tsx   Skill runner
│
├── bot/prompts/
│   └── system.txt              MOCS-aware AI assistant system prompt
├── openclaw/skills/            Skill system prompts (add {skill}.txt per skill)
├── mocs/
│   ├── evidence/               File storage (gitignored)
│   │   ├── billing/
│   │   ├── deliverables/
│   │   ├── seo/
│   │   ├── ads/
│   │   └── comms/
│   ├── financial-forensics/
│   └── reporting/
├── scripts/                    CLI utilities
├── utils/                      Shared utilities
├── .env.local.example          Env var template
├── package.json
├── next.config.js
├── tailwind.config.ts          Authority Navy + gold palette
├── tsconfig.json
└── .gitignore
```

## Key Design Decisions

1. **Client components** for all interactive UI (bot, uploaders, skill runner)
2. **Server-side API routes** for all Claude API calls — API key never in browser
3. **File-based evidence storage** — no DB required, upgrade to blob storage later
4. **Skill-specific system prompts** — add `openclaw/skills/{skill}.txt` per skill
5. **Vercel Edge-compatible** — all routes use Web API (Response, FormData, fetch)
6. **Brand-native** — Authority Navy #0E2A47, gold #C8A04B throughout

## To deploy

1. `npm install`
2. Copy `.env.local.example` → `.env.local`, fill in ANTHROPIC_API_KEY
3. `npm run dev` to test locally at localhost:3000
4. Push to GitHub → Vercel auto-deploys on merge to main
5. Add env vars in Vercel dashboard (Settings → Environment Variables)
