# CivilCadence — FE Civil Study Planner

A free, privacy-first study planner for the NCEES FE Civil exam. Built for FDOT PE trainees and civil engineering students.

## What it does

- Covers all 14 NCEES FE Civil knowledge areas with official question-count ranges
- Allocates study days by confidence level and question count (lower confidence + more exam questions → more days)
- Generates a full calendar view of your study schedule
- Exports to .ics for Google Calendar or Apple Calendar
- Share your plan via URL or QR code
- Stores data locally — nothing leaves your device

## Who it's for

FDOT civil engineering PE trainees, FE Civil exam candidates, and civil engineering students preparing for the NCEES FE Civil exam.

## Local development

Prerequisites: Node 20+

```bash
npm ci
npm run dev    # http://localhost:5173
```

Run tests:
```bash
npm test
```

Build for production:
```bash
npm run build
# Output: dist/
```

## Deploying to Cloudflare Pages

1. Push this repository to GitHub
2. Cloudflare Dashboard → Pages → Create a project → connect repo
3. Build command: `npm ci && npm run build`
4. Build output directory: `dist`
5. Environment variable: `NODE_VERSION = 20`
6. Deploy
7. (Optional) Add custom domain `civilcadence.app`

## Privacy note

Share URLs contain your full plan data encoded in the URL fragment. They are not private — anyone with the link can load your plan.

## License

MIT — see [LICENSE](LICENSE)
