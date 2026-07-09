# DSA Commercial Scheduling MVP1

React Aria Netlify/GitHub package for the DSA Commercial Scheduling MVP1 prototype.

The hosted artifact is intentionally narrow: the Vite app contains only the scheduling wizard and decision console.

The stakeholder explanation lives beside the demo as a PDF: `docs/dsa-scheduling-mvp1-stakeholder-manual.pdf`.

## MVP1 Anchor

The Blueprint remains the source of truth for scope. MVP1 is a Commercial Persona flow for "Just Say Yes" / "In The Know":

- starts from SFDC intake;
- uses **Opportunity Start Date** as the mandatory gate date;
- checks whether the Opportunity Start Date is more than four months out;
- asks for missing configuration data;
- calculates site/month options;
- gives Commercial an eligible proposal window, caveated recommendation, or off-ramp.

MVP1 does not reserve capacity, optimize room-level schedules, replace Central Scheduling, or create a final RPM execution date.

## Project Structure

```text
.
├── index.html
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── docs/
│   ├── dsa-scheduling-mvp1-stakeholder-manual.pdf
│   └── mvp1-target-date-clarification-and-context-note.md
├── scripts/
│   ├── build-stakeholder-manual-pdf.py
│   └── validate-static-site.mjs
├── netlify.toml
├── package-lock.json
├── package.json
├── vite.config.js
└── .github/
    └── workflows/
        └── validate.yml
```

## Local Preview

```bash
npm run serve
```

Then open the local URL printed by the server. The Vite build writes the deployable static artifact to `dist`.

## Validate

```bash
npm run build
```

The build compiles the React app and checks that the hosted demo is aligned with the expected MVP1 content.

## Rebuild The Side PDF

```bash
npm run manual:pdf
```

The PDF is intentionally not linked from the hosted demo UI.

## Deploy To Netlify From GitHub

1. Create a new GitHub repository.
2. Push this folder to that repository.
3. In Netlify, choose **Add new site** then **Import an existing project**.
4. Connect the GitHub repository.
5. Use these Netlify settings:

```text
Build command: npm run build
Publish directory: dist
```

The included `netlify.toml` already sets the same build and publish values.

## Suggested Git Commands

```bash
git init
git add .
git commit -m "Package DSA scheduling MVP1 prototype"
git branch -M main
git remote add origin git@github.com:YOUR_ORG/YOUR_REPO.git
git push -u origin main
```

## Date Terminology

Use **Opportunity Start Date** as the official MVP1 gate date.

Use **RFP Requested Start Date** as source context that may explain or populate the Opportunity Start Date. It should not silently replace the gate date.

See `docs/mvp1-target-date-clarification-and-context-note.md`.

## UI Rationale

The reasoning behind each wizard input, status pill, and decision-console element is captured in:

```text
docs/ui-input-decision-rationale.md
```

## Source Caveat

All opportunity, sponsor, site, and metric values in the UI are synthetic placeholders. The SFDC/RACE screenshots were used as design reference only and are not embedded in the deployable package because they include current customer and opportunity context.
