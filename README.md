# DSA Commercial Scheduling MVP1

Static Netlify/GitHub package for the DSA Commercial Scheduling MVP1 stakeholder prototype.

This package intentionally splits the artifact into two surfaces:

- **Demo:** `public/index.html` contains only the scheduling wizard and decision console.
- **Stakeholder manual:** `public/manual.html` carries the explanatory story, VoC synthesis, scope guardrails, and implementation notes.

## MVP1 Anchor

The Blueprint remains the source of truth for scope. MVP1 is a Commercial Persona flow for "Just Say Yes" / "In The Know":

- starts from SFDC intake;
- uses **Opportunity Start Date** as the mandatory gate date;
- checks whether the Opportunity Start Date is more than four months out;
- asks for missing configuration data;
- calculates site/month options;
- gives Commercial a green light, caveated recommendation, or off-ramp.

MVP1 does not reserve capacity, optimize room-level schedules, replace Central Scheduling, or create a final RPM execution date.

## Project Structure

```text
.
├── public/
│   ├── app.js
│   ├── index.html
│   ├── manual.html
│   └── styles.css
├── docs/
│   └── mvp1-target-date-clarification-and-context-note.md
├── scripts/
│   ├── serve-static.mjs
│   └── validate-static-site.mjs
├── netlify.toml
├── package.json
└── .github/
    └── workflows/
        └── validate.yml
```

## Local Preview

```bash
npm run serve
```

Then open the local URL printed by the server. The site is static, so Netlify can publish the `public` directory directly after validation.

## Validate

```bash
npm run build
```

The build checks that the demo, manual, JavaScript, and CSS files contain the expected MVP1 content.

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
