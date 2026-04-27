# Prompt Forge

AI image/video prompt manager for Grok Imagine.

## What it does

- Store & organize image prompts with tags
- Build prompts using reusable template variables (`{character}`, `{scene}`, `{style}`, etc.)
- Manage libraries of characters, scenes, styles, time periods, and moods
- One-click copy resolved prompts to clipboard
- Export/import all data as JSON for backup

## Tech

- Plain HTML/CSS/JS — no build step
- localStorage for persistence
- Dark vintage theme

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → Create → Pages
3. Connect your GitHub repo, select this folder as build output directory
4. Deploy — no build needed, it's static

## Local dev

Just open `index.html` in a browser. Or:

```bash
npx serve .
```

## Roadmap

- [ ] Cloud sync (backend database)
- [ ] Prompt versioning/history
- [ ] Image preview (paste generated image URL)
- [ ] Prompt categories/projects
- [ ] Mobile PWA support
