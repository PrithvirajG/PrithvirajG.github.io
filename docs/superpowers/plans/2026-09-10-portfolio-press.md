# Press Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-file portfolio with a content-driven Astro site presented as an editorial broadsheet with pinned, internally scrolling sheets.

**Architecture:** All prose lives in Astro content collections, one markdown file per project. Pages render as static HTML with no JavaScript by default. A single client island runs the scroll engine, which pins each sheet, translates its content column by its own overflow, and hands over to the next sheet. Pure geometry and grouping logic live in plain TypeScript modules with unit tests; the DOM binding is a thin wrapper around them.

**Tech Stack:** Astro 5, TypeScript, Vitest, Newsreader and Archivo Narrow via Google Fonts, GitHub Actions to GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-10-portfolio-press-design.md`

**Reference implementation:** `.superpowers/press-prototype.html` is a working throwaway prototype of the front page, two sheets, and the scroll engine. Read it before Task 5. It is gitignored and must not be shipped.

## Global Constraints

- Node 24, npm 11. Both are already installed.
- Colour tokens, exact values: `--paper #E8E7DE`, `--paper-terrain #E0E1D4`, `--paper-water #DCE2E3`, `--ink #14150F`, `--ink-soft #54554A`, `--magenta #B01B6E`, `--blue #1B5A87`, `--rule #A9AA9C`.
- Typefaces: Newsreader for masthead, headlines, decks, body. Archivo Narrow for running heads, captions, figure labels, index. No third family.
- Sheet order is chronological, most recent first: Coditas, FlytBase, AlgoBulls with Yun, Integrated Active Monitoring, Workshop, Back page.
- Motion kept: pinned sheets, inner scroll, progress hairline, running head, paper tone shift, ink reveal on the front page only.
- Motion cut: halftone resolve on figures, rules drawing themselves. Do not implement either.
- Pinning is disabled below 821px and under `prefers-reduced-motion`. Both fall back to normal document flow.
- Copy rules: no all-caps eyebrow labels, no metadata joined with middle dots, no arrows appended to link text, no accenting a single word inside a headline.
- The front page must not lead with drone work. Drones are one of five desks.
- `index.html` stays untouched and working until Task 10.

---

### Task 1: Scaffold the Astro project and the deploy workflow

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`
- Create: `src/styles/tokens.css`
- Create: `src/pages/index.astro`
- Create: `.github/workflows/deploy.yml`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nothing.
- Produces: a buildable Astro site at repo root; the CSS custom properties named in Global Constraints, available to every later task via `src/styles/tokens.css`.

- [ ] **Step 1: Initialise the project**

Run from the repository root:

```bash
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --skip-houston
npm install
npm install -D vitest
```

If the installer refuses because the directory is not empty, answer yes to continuing. It must not delete `index.html`.

- [ ] **Step 2: Add the static-output config**

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://prithvirajg.github.io',
  output: 'static',
  build: { format: 'file' },
});
```

- [ ] **Step 3: Add the test runner config**

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 4: Write the design tokens**

`src/styles/tokens.css`:

```css
:root {
  --paper: #E8E7DE;
  --paper-terrain: #E0E1D4;
  --paper-water: #DCE2E3;
  --ink: #14150F;
  --ink-soft: #54554A;
  --magenta: #B01B6E;
  --blue: #1B5A87;
  --rule: #A9AA9C;
  --serif: "Newsreader", Georgia, "Times New Roman", serif;
  --chart: "Archivo Narrow", "Helvetica Neue", Arial, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--serif);
  font-size: 18px;
  line-height: 1.62;
  font-variant-numeric: oldstyle-nums;
  -webkit-font-smoothing: antialiased;
  transition: background-color .9s ease;
}

a { color: inherit; }
:focus-visible { outline: 2px solid var(--magenta); outline-offset: 3px; }
```

- [ ] **Step 5: Add a placeholder page that proves the build**

`src/pages/index.astro`:

```astro
---
import '../styles/tokens.css';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Prithviraj Gotepatil</title>
  </head>
  <body>
    <p>Build works.</p>
  </body>
</html>
```

- [ ] **Step 6: Add the deploy workflow**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

This workflow has no effect on the live site until the repository's Pages source is switched to GitHub Actions, which happens in Task 10.

- [ ] **Step 7: Ignore build output**

Append to `.gitignore`:

```
node_modules/
dist/
.astro/
```

- [ ] **Step 8: Verify the build and the test runner**

```bash
npm run build
npm test
```

Expected: the build writes `dist/index.html`; `npm test` reports no test files, which is a pass at this stage.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Scaffold Astro project, design tokens, and Pages workflow"
```

---

### Task 2: Content collections and schema

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/employers/coditas.md`, `flytbase.md`, `algobulls-yun.md`, `iam.md`
- Create: `src/content/projects/*.md` (one per project, listed in Step 4)
- Test: `src/lib/grouping.test.ts` (written in Task 3)

**Interfaces:**
- Consumes: nothing.
- Produces: two collections. `employers` entries have `{ desk: string, name: string, role: string, period: string, start: string, blurb: string, paper: 'paper' | 'terrain' | 'water' }`. `projects` entries have `{ title: string, employer: string, status: 'production' | 'internal' | 'personal', disciplines: string[], stack: string[], summary: string, highlights: string[], metrics?: { value: string, label: string, accent?: boolean }[], openQuestions?: string[], order: number }`. `employer` matches an `employers` entry id, or the literal `workshop` for personal projects.

- [ ] **Step 1: Define the schema**

`src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const employers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/employers' }),
  schema: z.object({
    desk: z.string(),
    name: z.string(),
    role: z.string(),
    period: z.string(),
    start: z.string(),
    blurb: z.string(),
    paper: z.enum(['paper', 'terrain', 'water']),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    employer: z.string(),
    status: z.enum(['production', 'internal', 'personal']),
    disciplines: z.array(z.string()).min(1),
    stack: z.array(z.string()).min(1),
    summary: z.string(),
    highlights: z.array(z.string()).min(1),
    metrics: z.array(z.object({
      value: z.string(),
      label: z.string(),
      accent: z.boolean().optional(),
    })).optional(),
    openQuestions: z.array(z.string()).optional(),
    order: z.number(),
  }),
});

export const collections = { employers, projects };
```

- [ ] **Step 2: Write the four employer files**

`src/content/employers/coditas.md`:

```markdown
---
desk: Automation
name: Coditas
role: AI Backend Engineer
period: 2025 to present
start: "2025-08"
blurb: Modernising a legacy enterprise compliance platform with an AI-first approach, turning hours of manual developer work into minutes of guided automation.
paper: paper
---
```

`src/content/employers/flytbase.md`:

```markdown
---
desk: Robotics
name: FlytBase
role: Robotics and Backend Developer
period: 2023 to 2025
start: "2023-10"
blurb: Drone automation across the whole stack, from cloud microservices carrying live telemetry to the Android app running on the controller in an operator's hands.
paper: terrain
---
```

`src/content/employers/algobulls-yun.md`:

```markdown
---
desk: Markets
name: AlgoBulls and Yun Solutions
role: Python Developer, then Data Analyst
period: 2022 to 2023
start: "2022-10"
blurb: Automated trading strategies and the broker plumbing beneath them, plus scraping and language pipelines feeding market sentiment analysis.
paper: water
---
```

`src/content/employers/iam.md`:

```markdown
---
desk: Vision
name: Integrated Active Monitoring
role: Software Developer Intern
period: 2021 to 2022
start: "2021-10"
blurb: Computer vision for retail and warehouse analytics, deployed end to end from a model on a Jetson Nano to the dashboard a store manager actually opened.
paper: paper
---
```

- [ ] **Step 3: Write one project file to establish the shape**

`src/content/projects/abstraction-layer.md`:

```markdown
---
title: One service between the drone and the cloud
employer: flytbase
status: production
disciplines: [robotics, infrastructure]
stack: [Python, asyncio, MQTT, Redis, Flask, RabbitMQ]
summary: Stateless, horizontally scalable middleware between DJI hardware and the cloud, carrying live telemetry up and control commands back down.
highlights:
  - Runs on asyncio so a slow MQTT topic never blocks a fast one.
  - Redis holds shared drone state, so any instance can answer for any aircraft.
  - Mutexes in the job layer stop two instances issuing the same command.
  - Outbound velocity commands are throttled during manual control so the hardware is never overrun.
  - Retries, circuit breakers, and metrics were in the first version, not a later patch.
metrics:
  - { value: "70 to 95%", label: "Geofence sync success after redesign", accent: true }
  - { value: "3", label: "Protocols spoken" }
openQuestions:
  - Peak MQTT messages per second.
  - Number of drone and dock units managed in production.
order: 1
---

Telemetry arrives over many MQTT topics at once and none of it can wait. The
service runs on asyncio so a slow topic never blocks a fast one, and Redis holds
the shared drone state so any instance can answer for any aircraft.

Two instances issuing the same command is how you lose a drone. Mutexes in the job
layer make that impossible, and outbound velocity commands during manual control
are throttled so the hardware is never asked to do more than it can.

It speaks MQTT to the aircraft, HTTP to the web tier, and RabbitMQ to everything
else. Retries, circuit breakers, and metrics were part of the first version, not a
later patch.
```

- [ ] **Step 4: Migrate the remaining projects**

Source of truth is the current `index.html`, which contains the full prose for every project. Read it and create one file per project below, following the shape from Step 3. Reuse the existing wording; do not invent facts. Every "Add: ..." note in the current file becomes an `openQuestions` entry.

Coditas (`employer: coditas`): `br-generation`, `cec-upgrade-automation`, `mcp-change-history`, `mcp-business-api`, `bulk-br-concurrency`.

FlytBase (`employer: flytbase`): `abstraction-layer` (done), `android-app`, `airspace-monitoring`, `tactical-deconfliction`, `on-premise-deployment`, `object-tracking`, `floid`.

AlgoBulls and Yun (`employer: algobulls-yun`): `trading-strategies`, `youtube-market-pipeline`, `play-store-sentiment`.

Integrated Active Monitoring (`employer: iam`): `fisheye-heatmap`, `warehouse-inventory`.

Workshop (`employer: workshop`, `status: personal`): `multimodal-chatbot`, `interviewee-analysis`, `smart-inhaler`, `quiz-hub`, `document-scanner`.

Set `order` to control the sequence within a sheet, starting at 1 for the project that should lead. Lead each employer with its strongest project.

- [ ] **Step 5: Verify the schema accepts every file**

```bash
npm run build
```

Expected: build succeeds. A schema violation fails the build and names the offending file and field. Fix and rerun until clean.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add employer and project content collections"
```

---

### Task 3: Grouping logic

**Files:**
- Create: `src/lib/grouping.ts`
- Test: `src/lib/grouping.test.ts`

**Interfaces:**
- Consumes: the collection entry shapes from Task 2.
- Produces: `groupByEmployer(projects, employers): Sheet[]` where `Sheet` is `{ id: string, desk: string, name: string, role: string, period: string, blurb: string, paper: 'paper' | 'terrain' | 'water', projects: ProjectLike[] }`. Sheets are sorted by `start` descending. Projects within a sheet are sorted by `order` ascending. Task 7 renders this array directly.

- [ ] **Step 1: Write the failing test**

`src/lib/grouping.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { groupByEmployer } from './grouping';

const employers = [
  { id: 'iam', data: { desk: 'Vision', name: 'IAM', role: 'Intern', period: '2021 to 2022', start: '2021-10', blurb: 'b', paper: 'paper' } },
  { id: 'coditas', data: { desk: 'Automation', name: 'Coditas', role: 'Engineer', period: '2025 to present', start: '2025-08', blurb: 'b', paper: 'paper' } },
  { id: 'flytbase', data: { desk: 'Robotics', name: 'FlytBase', role: 'Developer', period: '2023 to 2025', start: '2023-10', blurb: 'b', paper: 'terrain' } },
];

const projects = [
  { id: 'b', data: { title: 'B', employer: 'coditas', order: 2 } },
  { id: 'a', data: { title: 'A', employer: 'coditas', order: 1 } },
  { id: 'c', data: { title: 'C', employer: 'flytbase', order: 1 } },
  { id: 'p', data: { title: 'P', employer: 'workshop', order: 1 } },
];

describe('groupByEmployer', () => {
  it('orders sheets most recent first', () => {
    const sheets = groupByEmployer(projects as any, employers as any);
    expect(sheets.map(s => s.id)).toEqual(['coditas', 'flytbase', 'iam']);
  });

  it('orders projects within a sheet by order ascending', () => {
    const sheets = groupByEmployer(projects as any, employers as any);
    expect(sheets[0].projects.map(p => p.data.title)).toEqual(['A', 'B']);
  });

  it('excludes projects with no matching employer', () => {
    const sheets = groupByEmployer(projects as any, employers as any);
    const ids = sheets.flatMap(s => s.projects.map(p => p.id));
    expect(ids).not.toContain('p');
  });

  it('keeps an employer with no projects', () => {
    const sheets = groupByEmployer(projects as any, employers as any);
    expect(sheets.find(s => s.id === 'iam')?.projects).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/grouping.test.ts`
Expected: FAIL, cannot resolve `./grouping`.

- [ ] **Step 3: Write the implementation**

`src/lib/grouping.ts`:

```ts
export type Paper = 'paper' | 'terrain' | 'water';

export interface EmployerLike {
  id: string;
  data: { desk: string; name: string; role: string; period: string; start: string; blurb: string; paper: Paper };
}

export interface ProjectLike {
  id: string;
  data: { title: string; employer: string; order: number };
}

export interface Sheet {
  id: string;
  desk: string;
  name: string;
  role: string;
  period: string;
  blurb: string;
  paper: Paper;
  projects: ProjectLike[];
}

export function groupByEmployer<P extends ProjectLike>(projects: P[], employers: EmployerLike[]): (Sheet & { projects: P[] })[] {
  return [...employers]
    .sort((a, b) => (a.data.start < b.data.start ? 1 : a.data.start > b.data.start ? -1 : 0))
    .map(e => ({
      id: e.id,
      desk: e.data.desk,
      name: e.data.name,
      role: e.data.role,
      period: e.data.period,
      blurb: e.data.blurb,
      paper: e.data.paper,
      projects: projects
        .filter(p => p.data.employer === e.id)
        .sort((a, b) => a.data.order - b.data.order),
    }));
}

export function workshopProjects<P extends ProjectLike>(projects: P[]): P[] {
  return projects.filter(p => p.data.employer === 'workshop').sort((a, b) => a.data.order - b.data.order);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/grouping.test.ts`
Expected: PASS, four tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/grouping.ts src/lib/grouping.test.ts
git commit -m "Add employer grouping, most recent first"
```

---

### Task 4: The scroll engine geometry

**Files:**
- Create: `src/scripts/pin.ts`
- Test: `src/scripts/pin.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `overflowOf(contentHeight: number, viewportHeight: number): number` and `pinAmount(spacerTop: number, viewportHeight: number, overflow: number): number`. Task 5 binds these to the DOM. Both are pure and take no DOM references.

- [ ] **Step 1: Write the failing test**

`src/scripts/pin.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { overflowOf, pinAmount } from './pin';

describe('overflowOf', () => {
  it('is zero when the content fits', () => {
    expect(overflowOf(600, 800)).toBe(0);
  });
  it('is the excess when the content is taller', () => {
    expect(overflowOf(1400, 800)).toBe(600);
  });
});

describe('pinAmount', () => {
  it('is zero before the spacer enters the viewport', () => {
    expect(pinAmount(900, 800, 600)).toBe(0);
  });
  it('tracks scroll once the spacer is entering', () => {
    expect(pinAmount(500, 800, 600)).toBe(300);
  });
  it('clamps at the overflow so content never overshoots', () => {
    expect(pinAmount(-400, 800, 600)).toBe(600);
  });
  it('is zero when there is no overflow', () => {
    expect(pinAmount(0, 800, 0)).toBe(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/scripts/pin.test.ts`
Expected: FAIL, cannot resolve `./pin`.

- [ ] **Step 3: Write the implementation**

`src/scripts/pin.ts`:

```ts
/**
 * A sheet is pinned to the top of the viewport. The spacer that follows it in
 * the document buys scroll distance: while the reader travels through the
 * spacer the sheet holds position and its content column slides up by exactly
 * its own overflow. When the column bottoms out the spacer ends and the next
 * sheet slides over the top.
 */

export function overflowOf(contentHeight: number, viewportHeight: number): number {
  return Math.max(0, contentHeight - viewportHeight);
}

export function pinAmount(spacerTop: number, viewportHeight: number, overflow: number): number {
  if (overflow <= 0) return 0;
  const travelled = viewportHeight - spacerTop;
  return Math.max(0, Math.min(overflow, travelled));
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/scripts/pin.test.ts`
Expected: PASS, six tests.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/pin.ts src/scripts/pin.test.ts
git commit -m "Add pinned-sheet geometry with tests"
```

---

### Task 5: The scroll engine DOM binding

**Files:**
- Create: `src/scripts/scroll.ts`
- Modify: `src/styles/tokens.css` (append the sheet layout block)

**Interfaces:**
- Consumes: `overflowOf` and `pinAmount` from Task 4.
- Produces: a default-exported `start(): void` that Task 7 calls from an inline module script. It expects the DOM to contain `.sheet` elements each followed by a `.spacer` sibling, each sheet containing one `.col` and one `.pin i`, and a `#lede` element on the front sheet.

Read `.superpowers/press-prototype.html` before writing this. It is the working reference for every selector and behaviour below.

- [ ] **Step 1: Append the sheet layout CSS**

Append to `src/styles/tokens.css`:

```css
.sheet {
  position: sticky; top: 0; height: 100vh; overflow: hidden;
  display: grid; grid-template-columns: 112px minmax(0, 1fr);
  border-top: 1px solid var(--ink);
  box-shadow: 0 -20px 44px -30px rgba(20, 21, 15, .55);
}
.spacer { height: 0; }
.col { padding: 26px 30px 40px; max-width: 1080px; will-change: transform; }
.margin { border-right: 1px solid var(--rule); padding: 22px 12px 22px 22px; }
.runhead { position: sticky; top: 22px; font-family: var(--chart); font-size: 12px; line-height: 1.35; color: var(--ink-soft); }
.runhead b { display: block; color: var(--ink); font-weight: 600; font-size: 13px; }
.runhead span { display: block; margin-top: 5px; font-variant-numeric: tabular-nums; }
.pin { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; }
.pin i { display: block; height: 100%; width: 0; background: var(--magenta); }
.w { color: #C3C4B8; transition: color .18s ease; }
.w.on { color: var(--ink); }
.w.key.on { color: var(--magenta); }

@media (max-width: 820px) {
  .sheet { grid-template-columns: 1fr; position: relative; height: auto; min-height: 100vh; overflow: visible; box-shadow: none; }
  .spacer { height: 0 !important; }
  .col { transform: none !important; will-change: auto; padding: 20px 20px 34px; }
  .margin { border-right: 0; border-bottom: 1px solid var(--rule); padding: 14px 20px; }
  .runhead { position: static; display: flex; gap: 14px; align-items: baseline; }
  .runhead span { margin: 0; }
  .pin { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
  .sheet { position: relative; height: auto; min-height: 100vh; overflow: visible; box-shadow: none; }
  .spacer { height: 0 !important; }
  .col { transform: none !important; }
  .pin { display: none; }
  .w { color: var(--ink); }
  .w.key { color: var(--magenta); }
}
```

- [ ] **Step 2: Write the engine**

`src/scripts/scroll.ts`:

```ts
import { overflowOf, pinAmount } from './pin';

interface Bound {
  sheet: HTMLElement;
  col: HTMLElement;
  spacer: HTMLElement | null;
  bar: HTMLElement | null;
  overflow: number;
}

export default function start(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const sheets = Array.from(document.querySelectorAll<HTMLElement>('.sheet'));
  const lede = document.getElementById('lede');
  const words: HTMLElement[] = [];
  let pinned = matchMedia('(min-width: 821px)').matches;
  let bound: Bound[] = [];

  if (lede) {
    let html = '';
    lede.childNodes.forEach(node => {
      const isKey = node.nodeType === 1 && (node as Element).classList.contains('key');
      html += (node.textContent ?? '').split(/(\s+)/).map(t =>
        t.trim() ? `<span class="w${isKey ? ' key' : ''}">${t}</span>` : t
      ).join('');
    });
    lede.innerHTML = html;
    words.push(...Array.from(lede.querySelectorAll<HTMLElement>('.w')));
  }

  function layout(): void {
    pinned = matchMedia('(min-width: 821px)').matches;
    bound = sheets.map(sheet => {
      const col = sheet.querySelector<HTMLElement>('.col')!;
      const next = sheet.nextElementSibling as HTMLElement | null;
      const spacer = next && next.classList.contains('spacer') ? next : null;
      const overflow = pinned ? overflowOf(col.scrollHeight, innerHeight) : 0;
      if (spacer) spacer.style.height = `${overflow}px`;
      if (!pinned) col.style.transform = '';
      return { sheet, col, spacer, bar: sheet.querySelector<HTMLElement>('.pin i'), overflow };
    });
  }

  let ticking = false;
  function onScroll(): void {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;

      const mid = innerHeight * .5;
      let current = sheets[0];
      for (const s of sheets) if (s.getBoundingClientRect().top <= mid) current = s;
      const tone = current?.dataset.paper;
      if (tone) document.body.style.backgroundColor = `var(--paper${tone === 'paper' ? '' : '-' + tone})`;

      if (pinned) for (const b of bound) {
        if (!b.overflow || !b.spacer) { if (b.bar) b.bar.style.width = '0'; continue; }
        const amount = pinAmount(b.spacer.getBoundingClientRect().top, innerHeight, b.overflow);
        b.col.style.transform = `translateY(${-amount}px)`;
        if (b.bar) b.bar.style.width = `${(amount / b.overflow) * 100}%`;
      }

      if (lede && words.length) {
        const r = lede.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (innerHeight * .82 - r.top) / (r.height + innerHeight * .28)));
        const n = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < n));
      }
    });
  }

  layout();
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { layout(); onScroll(); });
  if (document.fonts?.ready) document.fonts.ready.then(() => { layout(); onScroll(); });
}
```

- [ ] **Step 3: Run the existing tests to confirm nothing regressed**

Run: `npm test`
Expected: PASS, ten tests from Tasks 3 and 4.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/scroll.ts src/styles/tokens.css
git commit -m "Add pinned-sheet scroll engine and layout"
```

---

### Task 6: Sheet components

**Files:**
- Create: `src/components/Sheet.astro`, `src/components/Figure.astro`, `src/components/Stats.astro`, `src/components/Story.astro`

**Interfaces:**
- Consumes: the `Sheet` type from Task 3.
- Produces: `<Sheet desk name period paper>` renders the running head, the content column, the progress hairline, and the trailing spacer. `<Story project>` renders one project. `<Stats metrics>` renders a metric row. `<Figure caption>` wraps slotted SVG. Task 7 composes all four.

- [ ] **Step 1: Write `Sheet.astro`**

```astro
---
interface Props { id: string; desk: string; name: string; period: string; paper: 'paper' | 'terrain' | 'water'; }
const { id, desk, name, period, paper } = Astro.props;
---
<section class="sheet" id={id} data-paper={paper} style={`background: var(--paper${paper === 'paper' ? '' : '-' + paper})`}>
  <div class="margin">
    <div class="runhead"><b>{desk}</b><span>{name}, {period}</span></div>
  </div>
  <div class="col"><slot /></div>
  <div class="pin"><i></i></div>
</section>
<div class="spacer"></div>

<style>
  .kicker { font-family: var(--chart); font-size: 13px; font-weight: 600; color: var(--magenta); }
  .hed { font-size: clamp(30px, 4.6vw, 58px); line-height: .98; letter-spacing: -.02em; font-weight: 500; margin: 8px 0 4px; }
  .deck { font-size: 20px; font-style: italic; color: var(--ink-soft); max-width: 26em; margin-bottom: 20px; }
</style>
```

- [ ] **Step 2: Write `Stats.astro`**

```astro
---
interface Props { metrics: { value: string; label: string; accent?: boolean }[]; }
const { metrics } = Astro.props;
---
{metrics.length > 0 && (
  <div class="stats">
    {metrics.map(m => (
      <div>
        <div class:list={['n', m.accent && 'mag']}>{m.value}</div>
        <div class="l">{m.label}</div>
      </div>
    ))}
  </div>
)}

<style>
  .stats { display: flex; border-top: 1px solid var(--ink); border-bottom: 1px solid var(--ink); margin-top: 20px; }
  .stats > div { padding: 11px 20px 12px; border-right: 1px solid var(--rule); }
  .stats > div:first-child { padding-left: 0; }
  .stats > div:last-child { border-right: 0; }
  .n { font-size: 27px; font-variant-numeric: tabular-nums lining-nums; }
  .n.mag { color: var(--magenta); }
  .l { font-family: var(--chart); font-size: 12px; color: var(--ink-soft); }
</style>
```

- [ ] **Step 3: Write `Figure.astro`**

No halftone layer. The spec cuts it.

```astro
---
interface Props { number: number; caption: string; }
const { number, caption } = Astro.props;
---
<figure>
  <div class="plate"><slot /></div>
  <figcaption><b>Figure {number}.</b> {caption}</figcaption>
</figure>

<style>
  .plate { background: var(--paper-terrain); border: 1px solid var(--ink); }
  .plate :global(svg) { display: block; width: 100%; height: auto; }
  figcaption { font-family: var(--chart); font-size: 12px; color: var(--ink-soft); margin-top: 7px; }
  figcaption b { color: var(--ink); font-weight: 600; }
</style>
```

- [ ] **Step 4: Write `Story.astro`**

A story is two columns when it has a figure and one column when it does not.

```astro
---
import Stats from './Stats.astro';
interface Props {
  title: string;
  summary: string;
  highlights: string[];
  stack: string[];
  metrics?: { value: string; label: string; accent?: boolean }[];
}
const { title, summary, highlights, stack, metrics = [] } = Astro.props;
const hasFigure = Astro.slots.has('figure');
---
<article class="story">
  <h3 class="title">{title}</h3>
  <p class="summary">{summary}</p>
  <div class:list={['cols', hasFigure && 'two']}>
    <div>
      <ul class="highlights">{highlights.map(h => <li>{h}</li>)}</ul>
      <dl class="tail">
        <dt>Built with</dt>
        <dd>{stack.join(', ')}</dd>
      </dl>
    </div>
    {hasFigure && <div><slot name="figure" /></div>}
  </div>
  <Stats metrics={metrics} />
</article>

<style>
  .story { margin-bottom: 34px; }
  .title { font-size: 26px; font-weight: 500; line-height: 1.1; margin-bottom: 6px; }
  .summary { max-width: 38em; margin-bottom: 10px; }
  .cols.two { display: grid; grid-template-columns: 1.35fr 1fr; gap: 34px; }
  .highlights { max-width: 38em; margin: 0 0 12px 1.1em; }
  .highlights li { margin-bottom: 5px; }
  .tail { font-family: var(--chart); font-size: 13px; color: var(--ink-soft); }
  .tail dt { color: var(--ink); font-weight: 600; }
  @media (max-width: 820px) { .cols.two { grid-template-columns: 1fr; gap: 22px; } }
</style>
```

- [ ] **Step 4b: Port the two existing diagrams**

`.superpowers/press-prototype.html` contains two finished SVG diagrams in chart ink.
Copy each into its own component, dropping the `.dither` div, which the spec cuts.

Create `src/components/figures/AbstractionLayer.astro` from the SVG whose labels read
"Dock and aircraft", "Abstraction layer", and "Cloud and web".

Create `src/components/figures/ChangeHistory.astro` from the SVG whose labels read
"One sentence", "Audit tables", "Default columns", "View table", "Section map", and
"Script".

Each file is the bare `<svg>...</svg>` with no wrapper and no frontmatter.

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: build succeeds. Components are unused so far, which is fine.

- [ ] **Step 6: Commit**

```bash
git add src/components
git commit -m "Add sheet, story, figure, and stats components"
```

---

### Task 7: The front page

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/Masthead.astro`, `src/components/DeskIndex.astro`

**Interfaces:**
- Consumes: `Sheet.astro` from Task 6, `groupByEmployer` from Task 3, `start` from Task 5.
- Produces: a rendered front sheet. Later tasks append sheets after it inside the same page.

- [ ] **Step 1: Write `Masthead.astro`**

```astro
---
interface Props { first: string; last: string; }
const { first, last } = Astro.props;
---
<h1 class="masthead">{first}<span>{last}</span></h1>

<style>
  .masthead { font-size: clamp(44px, 10.5vw, 140px); line-height: .82; letter-spacing: -.03em; font-weight: 500; font-optical-sizing: auto; }
  .masthead span { display: block; font-style: italic; font-weight: 300; letter-spacing: -.02em; }
</style>
```

- [ ] **Step 2: Write `DeskIndex.astro`**

Each entry is a real link to its sheet, which gives keyboard users section navigation for free.

```astro
---
interface Props { entries: { desk: string; href: string; description: string; where: string }[]; }
const { entries } = Astro.props;
---
<aside class="index">
  <h2>Inside</h2>
  <dl>
    {entries.map(e => (
      <div>
        <dt><a href={e.href}>{e.desk}</a></dt>
        <dd>{e.description}<span>{e.where}</span></dd>
      </div>
    ))}
  </dl>
</aside>

<style>
  .index { border-top: 1px solid var(--ink); padding-top: 9px; margin-top: 38px; }
  .index h2 { font-family: var(--chart); font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .index dl { font-size: 15px; line-height: 1.42; }
  .index div { border-top: 1px solid var(--rule); padding: 8px 0 9px; display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 12px; }
  .index dt { font-family: var(--chart); font-size: 14px; font-weight: 600; }
  .index dd { color: var(--ink-soft); }
  .index dd span { display: block; font-family: var(--chart); font-size: 12px; color: var(--magenta); margin-top: 2px; }
</style>
```

- [ ] **Step 3: Rewrite `index.astro` with the front sheet**

The statement is about him, spans domains, and does not lead with drones. It is the only place the ink reveal runs, which is why it carries `id="lede"`.

```astro
---
import '../styles/tokens.css';
import Sheet from '../components/Sheet.astro';
import Masthead from '../components/Masthead.astro';
import DeskIndex from '../components/DeskIndex.astro';

const entries = [
  { desk: 'Automation', href: '#coditas', description: 'Agents that do the work a person used to do by hand.', where: 'Coditas' },
  { desk: 'Robotics', href: '#flytbase', description: 'Drone fleets, docking stations, and the services between them.', where: 'FlytBase' },
  { desk: 'Markets', href: '#algobulls-yun', description: 'Trading strategies and the broker plumbing under them.', where: 'AlgoBulls' },
  { desk: 'Vision', href: '#iam', description: 'Cameras that count people and notice what moved.', where: 'Integrated Active Monitoring' },
  { desk: 'Workshop', href: '#workshop', description: 'Things built for their own sake, outside work hours.', where: 'Personal' },
];
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Prithviraj Gotepatil</title>
    <meta name="description" content="Backend systems, AI pipelines, and computer vision. Four years shipping production software across robotics, automation, markets, and vision." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..600&family=Archivo+Narrow:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <Sheet id="front" desk="Front" name="Pune" period="India" paper="paper">
      <Masthead first="Prithviraj" last="Gotepatil" />
      <div class="dateline">
        <div class="now">Backend systems, AI pipelines, computer vision</div>
        <div>Four years, five domains</div>
        <div>Available</div>
      </div>
      <div class="frontgrid">
        <p class="lede" id="lede">
          Backend is the part nobody sees until it breaks. I have built it for drones in the air,
          cameras on a warehouse ceiling, trades moving through a broker, and agents doing compliance
          work nobody wanted to do by hand. <span class="key">Different rooms, same job.</span>
        </p>
        <DeskIndex entries={entries} />
      </div>
    </Sheet>

    <script>
      import start from '../scripts/scroll';
      start();
    </script>

    <style is:global>
      .dateline { display: flex; flex-wrap: wrap; margin-top: 20px; border-top: 1px solid var(--ink); border-bottom: 1px solid var(--ink); font-family: var(--chart); font-size: 13px; }
      .dateline > div { padding: 7px 16px; border-right: 1px solid var(--rule); }
      .dateline > div:first-child { padding-left: 0; }
      .dateline > div:last-child { border-right: 0; }
      .dateline .now { color: var(--magenta); font-weight: 600; }
      .frontgrid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(250px, .9fr); gap: 44px; align-items: start; }
      .lede { margin-top: 34px; font-size: clamp(21px, 2.5vw, 31px); line-height: 1.36; }
      @media (max-width: 820px) { .frontgrid { grid-template-columns: 1fr; gap: 0; } }
    </style>
  </body>
</html>
```

- [ ] **Step 4: Check it in a browser**

```bash
npm run dev
```

Open the printed URL. Expected: the masthead fills the screen, the dateline sits under it, the statement is grey and turns to ink as you scroll, and the index lists five desks with working anchor links.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add the front sheet, masthead, and desk index"
```

---

### Task 8: Render every employer sheet

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `groupByEmployer` and `workshopProjects` from Task 3, all components from Task 6.
- Produces: the complete chronology view.

- [ ] **Step 1: Load and group the content**

Add to the frontmatter of `index.astro`:

```astro
import { getCollection } from 'astro:content';
import Story from '../components/Story.astro';
import Figure from '../components/Figure.astro';
import AbstractionLayer from '../components/figures/AbstractionLayer.astro';
import ChangeHistory from '../components/figures/ChangeHistory.astro';
import { groupByEmployer, workshopProjects } from '../lib/grouping';

const allProjects = await getCollection('projects');
const allEmployers = await getCollection('employers');
const sheets = groupByEmployer(allProjects, allEmployers);
const workshop = workshopProjects(allProjects);
```

- [ ] **Step 2: Render the sheets after the front sheet**

Insert after the closing `</Sheet>` of the front sheet:

```astro
{sheets.map(sheet => (
  <Sheet id={sheet.id} desk={sheet.desk} name={sheet.name} period={sheet.period} paper={sheet.paper}>
    <p class="kicker">{sheet.role}</p>
    <h2 class="hed">{sheet.desk}</h2>
    <p class="deck">{sheet.blurb}</p>
    {sheet.projects.map(p => (
      <Story
        title={p.data.title}
        summary={p.data.summary}
        highlights={p.data.highlights}
        stack={p.data.stack}
        metrics={p.data.metrics}
      >
        {p.id === 'abstraction-layer' && (
          <Figure slot="figure" number={1} caption="Telemetry climbs, commands descend. The service is the only thing that speaks both.">
            <AbstractionLayer />
          </Figure>
        )}
        {p.id === 'mcp-change-history' && (
          <Figure slot="figure" number={2} caption="The workflow fans out across four checks and comes back with a script.">
            <ChangeHistory />
          </Figure>
        )}
      </Story>
    ))}
  </Sheet>
))}

<Sheet id="workshop" desk="Workshop" name="Personal projects" period="2021 to now" paper="terrain">
  <p class="kicker">Outside work hours</p>
  <h2 class="hed">Things built for their own sake</h2>
  {workshop.map(p => (
    <Story
      title={p.data.title}
      summary={p.data.summary}
      highlights={p.data.highlights}
      stack={p.data.stack}
      metrics={p.data.metrics}
    />
  ))}
</Sheet>
```

- [ ] **Step 3: Add the back page**

Insert after the workshop sheet:

```astro
<Sheet id="contact" desk="Back page" name="Get in touch" period="Pune, India" paper="paper">
  <h2 class="hed">Available for backend, AI, and robotics work</h2>
  <p class="deck">Pune, India. Open to remote.</p>
  <ul class="contact">
    <li><a href="mailto:prithvirajgotepatil@gmail.com">prithvirajgotepatil@gmail.com</a></li>
    <li><a href="https://github.com/PrithvirajG">GitHub</a></li>
  </ul>
</Sheet>
```

Add to the global style block:

```css
.contact { list-style: none; font-size: 21px; }
.contact li { margin-bottom: 8px; }
.contact a { text-decoration-color: var(--magenta); text-underline-offset: 5px; }
```

- [ ] **Step 4: Verify sheet order and scrolling**

```bash
npm run dev
```

Expected, in order: front, Automation for Coditas, Robotics for FlytBase, Markets for AlgoBulls and Yun, Vision for Integrated Active Monitoring, Workshop, Back page. Each sheet pins, scrolls its own content, fills its progress hairline, then hands over. No content is unreachable.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Render every employer sheet, most recent first"
```

---

### Task 9: Quality pass

**Files:**
- Modify: whichever files the checks below turn up.

**Interfaces:**
- Consumes: the complete site from Task 8.
- Produces: no new interfaces.

- [ ] **Step 1: Check the mobile fallback**

In browser devtools, set the width to 390px. Expected: sheets are in normal flow, every section scrolls conventionally, the running head sits above the content, and no progress hairline is shown.

- [ ] **Step 2: Check reduced motion**

In devtools, emulate `prefers-reduced-motion: reduce` and reload. Expected: no pinning, no translation, the statement renders fully in ink with the closing clause in magenta.

- [ ] **Step 3: Check keyboard navigation**

Tab through the page. Expected: every index entry and every link shows a magenta focus ring, and following an index link jumps to the matching sheet.

- [ ] **Step 4: Check contrast**

Verify `--ink` on each of the three paper tones, and `--magenta` on each, meet at least 4.5:1. If magenta fails on any paper tone, darken the token and record the new value in the spec.

- [ ] **Step 5: Check a long sheet**

The FlytBase sheet has seven projects and will be the tallest. Confirm the whole sheet is reachable and that scrolling through it does not feel unreasonably long. If it does, split it into two sheets as the spec allows.

- [ ] **Step 6: Run the full check**

```bash
npm test && npm run build
```

Expected: ten tests pass and the build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Quality pass: mobile, reduced motion, focus, contrast"
```

---

### Task 10: Cut over

Do not start this task without explicit approval from the repository owner. It changes what visitors see.

**Files:**
- Delete: `index.html`
- Modify: `README.md` (create if absent)

**Interfaces:**
- Consumes: the verified site from Task 9.
- Produces: the live site.

- [ ] **Step 1: Ask the owner to switch the Pages source**

In the repository settings, under Pages, set the source to GitHub Actions. This is a manual step in the GitHub interface and cannot be scripted from here. Until it is done, the workflow builds but nothing changes for visitors.

- [ ] **Step 2: Remove the old single-file site**

```bash
git rm index.html
```

The file remains in history at commit `75994d7` and can be restored with `git show 75994d7:index.html`.

- [ ] **Step 3: Write a short README**

Cover: what the site is, `npm run dev` to work on it, `npm test` and `npm run build` to check it, that content lives in `src/content/projects` as one file per project, and that deployment happens on push to `main`.

- [ ] **Step 4: Push and verify the deploy**

```bash
git add -A
git commit -m "Cut over to the Astro site"
git push
```

Watch the Actions run. When it is green, open `https://prithvirajg.github.io` and confirm the front sheet renders, the sheets pin and hand over, and every link works.

- [ ] **Step 5: Confirm the fallback still holds**

With JavaScript disabled in the browser, reload the live site. Expected: every word of every project is readable in normal document flow. If anything is hidden, fix it before considering the cutover complete.

---

## Remaining content work

Not blocking, and best done by the repository owner rather than an implementer.

- Answer the fifteen metric questions carried in `openQuestions` frontmatter. They are the highest-value improvement to the site.
- Supply screenshots, architecture diagrams, and drone footage. Until then every figure stays a drawn SVG diagram. When they arrive, decide per figure whether a real image beats a drawing.
- Decide whether the discipline lens toggle is worth building, which the spec defers.
