# DSA Commercial Scheduling MVP1 Stakeholder Prototype

Static stakeholder proposal for the DSA Commercial Scheduling MVP1 concept.

The prototype is intentionally wireframe-level. It demonstrates the MVP1 workflow, SFDC/RFP/Study context, requested start date clarification, rule trace, recommendations, expiry, Central Scheduling triage, reference data governance, and release path.

## Project Structure

```text
.
├── public/
│   └── index.html
├── docs/
│   └── mvp1-target-date-clarification-and-context-note.md
├── netlify.toml
├── package.json
└── .github/
    └── workflows/
        └── validate.yml
```

## Local Preview

This is a static site. You can open `public/index.html` directly, or run:

```bash
npm run serve
```

Then open the local URL printed by the server.

## Deploy To Netlify From GitHub

1. Create a new GitHub repository.
2. Push this folder to that repository.
3. In Netlify, choose **Add new site** then **Import an existing project**.
4. Connect the GitHub repository.
5. Use these Netlify settings:

```text
Build command: npm run build
Publish directory: public
```

The build command is intentionally lightweight. It validates that `public/index.html` exists and then publishes the static file.

## Suggested Git Commands

```bash
git init
git add .
git commit -m "Package DSA scheduling MVP1 prototype"
git branch -M main
git remote add origin git@github.com:YOUR_ORG/YOUR_REPO.git
git push -u origin main
```

## Netlify Notes

The included `netlify.toml` sets:

- `publish = "public"`
- `command = "npm run build"`
- basic security headers for a static prototype
- a fallback redirect to `/index.html`

## Date Terminology

Use **Requested Start Date** or **requested start / commercial timing anchor** instead of generic **target date** until stakeholders confirm the official SFDC field mapping.

See:

```text
docs/mvp1-target-date-clarification-and-context-note.md
```

## Source Caveat

All opportunity, sponsor, site, and metric values in the UI are synthetic placeholders. The SFDC/RACE references are contextual and do not change the defined MVP1 scope.
