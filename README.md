# TradeGuard AI

**Autonomous Trademark Protection Platform** — monitors web & social media for trademark violations using AI agents, powered by Brightdata MCP and Triggerware.ai.

## Overview

TradeGuard AI is an intelligent platform that autonomously detects and reports trademark violations across marketplaces and social media. Users register their brands, and the system continuously scans the web using agentic workflows — no manual intervention required.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, standalone output) |
| Frontend | React 19, TypeScript, Tailwind CSS 4 |
| 3D Landing | Three.js / React Three Fiber |
| Auth & DB | Supabase (JWT auth, PostgreSQL) |
| AI Engine | AIML API (gpt-4o-mini) with function calling |
| Web Scraping | Brightdata MCP (Model Context Protocol) |
| Agentic Monitoring | Triggerware.ai (trigger-based data monitoring) |
| Email | Resend (transactional reports) |
| PDF Processing | PDF.js (client-side text extraction) |
| Deployment | Vercel |

## Architecture & Orchestration

```
┌─────────────────────────────────────────────────────────────────┐
│                        TradeGuard AI                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────────┐     │
│  │  User /  │───▶│  AI Chat     │───▶│  Function Calling │     │
│  │  PDF     │    │  (gpt-4o-mini)│    │  (Tool Use)       │     │
│  └──────────┘    └──────────────┘    └─────────┬─────────┘     │
│                                                 │               │
│                    ┌────────────────────────────┼──────┐        │
│                    ▼                ▼           ▼      ▼        │
│  ┌──────────────────┐  ┌────────────────┐  ┌──────────────┐   │
│  │  Supabase DB     │  │  Brightdata    │  │ Triggerware  │   │
│  │  (products,      │  │  MCP SERP      │  │ (agentic     │   │
│  │   monitoring)    │  │  (web scan)    │  │  triggers)   │   │
│  └──────────────────┘  └────────────────┘  └──────────────┘   │
│                                                 │               │
│                    ┌────────────────────────────┘               │
│                    ▼                                             │
│  ┌──────────────────┐  ┌────────────────┐                      │
│  │  Cron Job        │  │  Resend Email  │                      │
│  │  (periodic poll) │─▶│  (violation    │                      │
│  │                  │  │   reports)     │                      │
│  └──────────────────┘  └────────────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Integration Flow

1. **Brightdata MCP** — Establishes MCP sessions to perform SERP searches (Google) for marketplace and social media trademark mentions.
2. **Triggerware.ai** — Creates persistent agentic triggers per product that autonomously monitor for new data/violations over time.
3. **AIML API** — Powers the AI chat with function calling (tool use), enabling multi-step reasoning and chained tool calls.
4. **Resend** — Sends automated HTML email reports when violations are detected.
5. **Supabase** — Handles authentication (JWT verification in middleware), product storage, and monitoring results.
6. **Cron Jobs** — Periodically polls Triggerware triggers via `/api/cron/monitor` to detect new violations.

## Autonomous Agent Capabilities

The AI agent operates in **agentic mode** with the following autonomous capabilities:

### Function Calling Tools
| Tool | Description |
|------|-------------|
| `list_products` | List all monitored brands/products |
| `add_product` | Register a new brand + create Triggerware trigger |
| `add_products_from_pdf` | Extract brands from PDF → bulk register + triggers + scan |
| `update_product` | Update product monitoring config |
| `delete_product` | Remove product + cleanup trigger |
| `scan_product` | Trigger immediate trademark violation scan |

### Agentic Workflows

- **PDF → Auto-Register → Monitor → Report**: Upload a PDF containing brand names → AI extracts all brands → registers each in DB → creates Triggerware triggers → runs initial BrightData SERP scan → emails report if violations found.
- **Chained Tool Calls**: The agent supports multi-step reasoning (e.g., `list_products` → identify target → `scan_product`).
- **Automated Cron Monitoring**: Periodic polling of all active Triggerware triggers detects new violations without user intervention.
- **Violation Detection**: Uses Levenshtein distance similarity scoring (threshold 0.75) to detect trademark infringements including typosquatting and similar-name violations.
- **Auto Email Reports**: When violations are detected (by cron or manual scan), HTML reports are automatically sent to the user's email via Resend.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # AI chat with function calling
│   │   ├── brightdata/    # BrightData MCP scan endpoints
│   │   ├── cron/monitor/  # Periodic Triggerware polling
│   │   ├── triggerware/   # Triggerware trigger management
│   │   ├── products/      # Product CRUD
│   │   └── auth/          # Auth endpoints (PIN-based)
│   ├── dashboard/         # Protected dashboard pages
│   └── (public pages)     # Landing, signin, signup
├── lib/
│   ├── brightdata.ts      # MCP session, SERP search, violation detection
│   ├── triggerware.ts     # Triggerware API client (triggers, queries)
│   ├── monitoring-job.ts  # Orchestrates scan + email report
│   ├── products.ts        # Supabase product operations
│   └── supabase-*.ts      # Supabase client/admin setup
├── features/
│   ├── dashboard/         # Dashboard components (ChatBot, alerts, stats)
│   ├── landing/           # 3D landing page with Three.js
│   ├── auth/              # Auth flow (PIN-based email verification)
│   └── ui/               # Shared UI components
└── prompts/
    └── extraction.ts      # HTML content extraction prompt template
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
BRIGHTDATA_API_KEY=        # Brightdata MCP API key
TRIGGERWARE_API_KEY=       # Triggerware.ai API key
AIML_API_KEY=              # AIML API key (gpt-4o-mini)
RESEND_API_KEY=            # Resend email API key
RESEND_FROM_EMAIL=         # Sender email address
SUPABASE_URL=              # Supabase project URL
SUPABASE_ANON_KEY=         # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY= # Supabase service role key
SUPABASE_JWT_SECRET=       # JWT secret for auth verification
CRON_SECRET=               # Secret to protect cron endpoints
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm start
```

## Key APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | AI chat with function calling (agentic) |
| `/api/cron/monitor` | GET | Cron: poll Triggerware triggers |
| `/api/brightdata/monitor` | POST | Manual BrightData SERP scan |
| `/api/triggerware` | POST | Manage Triggerware triggers |
| `/api/products` | GET/POST | Product CRUD |
| `/api/products/[id]` | PATCH/DELETE | Product update/delete |

## Hackathon Context

Built for the **Brightdata MCP Hackathon** — demonstrating autonomous AI agents that leverage:
- **Brightdata MCP** for real-time web data access via Model Context Protocol
- **Triggerware.ai** for persistent agentic data monitoring triggers
- **Function calling** for autonomous multi-step trademark protection workflows
