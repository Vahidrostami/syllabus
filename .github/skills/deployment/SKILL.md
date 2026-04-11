---
name: deployment
description: "Deploy generated tutorials to free hosting services. Covers Vercel, Netlify, Surge, GitHub Pages, and Cloudflare Pages with auth flows, SPA routing, troubleshooting, and QR code generation."
---

# Deployment Skill

## Provider Comparison

| Provider | Free Tier | Auth | Deploy Time | Custom Domain | SPA Routing | Bandwidth |
|---|---|---|---|---|---|---|
| **Vercel** | 100 deploys/day | OAuth or Token | ~10s | Yes | Auto (with config) | 100GB/mo |
| **Netlify** | 500 deploys/mo | OAuth or Token | ~15s | Yes | `_redirects` file | 100GB/mo |
| **Surge** | Unlimited | Email only | ~5s | Built-in | `200.html` convention | Unlimited |
| **GitHub Pages** | Unlimited | `gh` CLI | ~30s | CNAME file | `404.html` fallback | 100GB/mo |
| **Cloudflare Pages** | 500 deploys/mo | OAuth or Token | ~20s | Yes | `_redirects` file | Unlimited |

## Vercel (Recommended)

### Authentication Flow

```bash
# Option 1: Environment variable (CI/non-interactive)
export VERCEL_TOKEN="your_token_here"

# Option 2: Interactive login (opens browser)
npx vercel login

# Option 3: Token from Vercel dashboard
# → Settings → Tokens → Create Token → copy to VERCEL_TOKEN
```

### Deployment Commands

```bash
cd syllabus-output

# First deploy (creates project)
npx vercel --prod --yes

# Subsequent deploys
npx vercel --prod --yes

# With custom project name
npx vercel --prod --yes --name learn-python-basics

# With token (non-interactive)
npx vercel --prod --yes --token "$VERCEL_TOKEN"
```

### SPA Routing Config

Create `syllabus-output/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Troubleshooting

| Issue | Fix |
|---|---|
| "Not authenticated" | Run `npx vercel login` or set `VERCEL_TOKEN` |
| "Project not found" | Use `--yes` flag to auto-create |
| 404 on refresh | Add `vercel.json` with rewrites |
| "Too many requests" | Wait a minute, free tier has rate limits |
| Build fails on Vercel | We deploy pre-built `dist/`, so set Output Directory to `dist` |

## Netlify

### Authentication Flow

```bash
# Option 1: Environment variable
export NETLIFY_AUTH_TOKEN="your_token_here"

# Option 2: Interactive login
npx netlify login

# Option 3: Personal access token from Netlify UI
# → User Settings → Applications → Personal access tokens
```

### Deployment Commands

```bash
cd syllabus-output

# Deploy dist folder directly (skip Netlify build)
npx netlify deploy --prod --dir=dist

# With site name
npx netlify deploy --prod --dir=dist --site=learn-python-basics

# First time: will prompt to create or link a site
```

### SPA Routing Config

Create `syllabus-output/dist/_redirects` (AFTER build):
```
/*    /index.html   200
```

Or use `public/_redirects` (BEFORE build — Vite copies public/ to dist/):
```
/*    /index.html   200
```

## Surge (Zero-Auth Fallback)

### Authentication

Surge only requires an email — entered inline the first time. No OAuth, no browser pop-ups, no dashboard required.

```bash
# First time: prompts for email + password (creates account automatically)
npx surge dist learn-python-basics.surge.sh

# Subsequent deploys: remembers credentials in ~/.netrc
npx surge dist learn-python-basics.surge.sh

# Non-interactive with env vars
export SURGE_LOGIN=user@example.com
export SURGE_TOKEN=your_token
npx surge dist learn-python-basics.surge.sh
```

### SPA Routing

```bash
# Copy index.html to 200.html — Surge serves 200.html for all routes
cp dist/index.html dist/200.html
```

### Domain Naming Convention

Generate a deterministic subdomain from the tutorial title:
```javascript
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 40);
const domain = `learn-${slug}.surge.sh`;
```

## GitHub Pages

### Prerequisites
- Project must be a git repo
- Should be pushed to GitHub
- `gh` CLI must be authenticated

### Deployment Commands

```bash
cd syllabus-output

# Set base path in vite.config.js BEFORE building
# base: '/repo-name/'

# Rebuild with correct base path
npm run build

# Copy index.html to 404.html for SPA routing
cp dist/index.html dist/404.html

# Deploy using gh-pages package
npx gh-pages -d dist

# Or using gh CLI
gh repo create learn-python-basics --public --source=. --push
```

### Vite Base Path Config

When deploying to GitHub Pages, update `vite.config.js`:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/repo-name/',  // Must match the GitHub repo name
  plugins: [react()]
});
```

## Cloudflare Pages

### Authentication

```bash
# Option 1: Environment variable
export CLOUDFLARE_API_TOKEN="your_token"

# Option 2: Interactive login
npx wrangler login
```

### Deployment Commands

```bash
cd syllabus-output

npx wrangler pages deploy dist --project-name=learn-python-basics

# First time: creates the project automatically
```

### SPA Routing

Create `dist/_redirects`:
```
/*  /index.html  200
```

## Pre-Deployment Checklist

Run these checks before deploying:

```bash
# 1. Verify dist/ exists and has content
ls -la dist/
test -f dist/index.html || echo "ERROR: No index.html in dist/"

# 2. Check for hardcoded localhost URLs
grep -r "localhost" dist/ && echo "WARNING: localhost URLs found" || echo "OK: No localhost URLs"

# 3. Verify bundle size
du -sh dist/
# Should be < 10MB uncompressed for a typical tutorial

# 4. Ensure SPA routing file exists (depends on provider)
# Created by the deployer agent before deploy

# 5. Check that audio files are included (if audio was generated)
ls dist/audio/*.mp3 2>/dev/null && echo "Audio files present" || echo "No audio files (OK if using Web Speech)"
```

## QR Code Generation

Generate a terminal-printable QR code for the deployed URL so the user can quickly open it on their phone:

```bash
# Using qrcode-terminal (npx, no install needed)
npx qrcode-terminal "https://learn-python-basics.vercel.app"

# Fallback: just print the URL clearly
echo ""
echo "📱 Open on your phone:"
echo "   https://learn-python-basics.vercel.app"
echo ""
```

## Post-Deploy Verification

```bash
# Quick smoke test — check if the URL returns 200
URL="https://learn-python-basics.vercel.app"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")

if [ "$STATUS" = "200" ]; then
  echo "✅ Site is live: $URL"
else
  echo "⚠️ Site returned HTTP $STATUS — may need a few seconds to propagate"
fi

# Check SPA routing works (deep link test)
STATUS_DEEP=$(curl -s -o /dev/null -w "%{http_code}" "$URL/lesson/les-01-01")
if [ "$STATUS_DEEP" = "200" ]; then
  echo "✅ SPA routing works"
else
  echo "⚠️ SPA routing may not be configured correctly"
fi
```

## Error Recovery

| Error | Recovery |
|---|---|
| Auth failed on Vercel | Try `VERCEL_TOKEN` env var → fall back to Surge |
| Auth failed on Netlify | Try `NETLIFY_AUTH_TOKEN` env var → fall back to Surge |
| Surge email prompt hangs | Use `SURGE_LOGIN` + `SURGE_TOKEN` env vars |
| GitHub Pages: not a git repo | Fall back to Surge or Vercel |
| Cloudflare: rate limit | Fall back to Vercel or Surge |
| All providers fail | Print manual instructions with `dist/` path |

### Manual Fallback Instructions
If all automated deploys fail, print:
```
Your tutorial is built and ready at: syllabus-output/dist/

To deploy manually:
  Option 1: Drag & drop dist/ to https://app.netlify.com/drop
  Option 2: npx surge syllabus-output/dist your-name.surge.sh
  Option 3: Upload dist/ to any static hosting service
```
