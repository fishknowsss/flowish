# Flowish

Flowish is a static React web app for daily focus planning, backlog management, rituals, calendar signals, and countdown events.

## Open locally

The simplest local option is to double-click [open-local-site.command](./open-local-site.command) on macOS or [open-local-site.cmd](./open-local-site.cmd) on Windows. It finds an available local port, starts the Flowish dev server there, and opens the matching URL in your browser.

If you prefer terminal commands:

```powershell
npm install
npm run open:local
```

If port `4173` is already used by another project, the script automatically switches to the next free port.

## Build and preview

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

## Publish to GitHub Pages

1. Create a new GitHub repository.
2. Add that repository as `origin`.
3. Push the `main` branch.
4. In GitHub, open `Settings -> Pages` and set `Source` to `GitHub Actions`.
5. After the push finishes, GitHub Actions deploys the `dist` folder automatically.

The site URL will be:

```text
https://<your-github-username>.github.io/<repo-name>/
```

## Share with other people

- Local only: give them the GitHub Pages URL after deployment.
- Private testing: add them as repository collaborators if the repo is private and you later use another host that supports private previews.
- Source code sharing: send them the GitHub repository link.

## Checks

```powershell
npm run lint
npm run build
```
