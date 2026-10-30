# Academic Homepage

A personal academic homepage with a white-and-blue visual direction, profile and navigation in a left sidebar, and research content in the main column. It adapts to a single-column layout on small screens. Its content structure was inspired by [this academic homepage](https://ruxi-shi.github.io/home/).

## Update the profile

Edit `app/profile.ts` to update the name, introduction, research interests, seminars, publications, and contact details. Unprovided details have clear English placeholders. An empty email field does not render a fabricated email link.

Publication links use this form: `[{ label: 'arXiv', url: 'https://example.org' }]`. No links appear when the list is empty.

## Run locally

This project uses Node.js 22.13+ and pnpm.

- `pnpm install` installs dependencies.
- `pnpm dev` opens a local development server.
- `pnpm build` creates the deployment output for Sites.

The site is built with React and Vinext. The reference site uses GitHub Pages and Jekyll, and its [README](https://github.com/ruxi-shi/home/blob/gh-pages/README.md) documents the Researcher template. This project has independently written source code and does not copy the reference site's biographical or publication content.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` automatically deploys the `main` branch to GitHub Pages.

1. Push a change to `main`, or start **Publish personal homepage** manually in the Actions tab.
2. Wait for the workflow to complete.
3. Visit `https://fushimi1024.github.io/`.

`pnpm build:github` statically exports and verifies every page in `dist/client`. It is configured for a root GitHub Pages site such as `username.github.io`.

## Traffic analytics

The GitHub Pages workflow supports Cloudflare Web Analytics without committing its site token:

1. Add `fushimi1024.github.io` as a site in Cloudflare Web Analytics.
2. Copy the token from the generated `data-cf-beacon` snippet.
3. In the GitHub repository, open **Settings > Secrets and variables > Actions** and create a repository secret named `CLOUDFLARE_WEB_ANALYTICS_TOKEN`.
4. Run **Publish personal homepage** again, or push a change to `main`.

When the secret is absent, the site still builds normally and does not load an analytics script.
