# Cold-clone build

Reproduces a production build from a clean clone.

```bash
git clone <repo-url>
cd civilcadence
npm ci           # installs exact versions from package-lock.json
npm run build    # outputs to dist/
```

Verify locally:
```bash
npm run preview  # serves dist/ at http://localhost:4173
```

Run tests:
```bash
npm test
```
