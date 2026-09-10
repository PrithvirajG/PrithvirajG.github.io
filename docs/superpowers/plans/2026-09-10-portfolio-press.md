# Press Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-file portfolio with a content-driven Astro site of six tabbed sections, each an editorial broadsheet of pinned, internally scrolling sheets, plus article pages for a blog.

**Architecture:** Every tab is a real route sharing one layout that renders a persistent masthead strip. All prose lives in Astro content collections, one markdown file per entry. Pages are static HTML with no JavaScript by default; one client island runs the scroll engine, which pins each sheet, translates its content column by its own overflow, and hands over to the next. Pure geometry and grouping live in plain TypeScript with unit tests; the DOM binding is a thin wrapper. Blog posts use a second, unpinned layout because long-form text cannot be read inside a self-scrolling pane.

**Tech Stack:** Astro 5, TypeScript, Vitest, Newsreader and Archivo Narrow via Google Fonts, GitHub Actions to GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-10-portfolio-press-design.md`

**Reference implementations, both gitignored and neither shipped:**
- `.superpowers/press-prototype.html` — the Work route: masthead strip, front sheet, two employer sheets, and the full scroll engine.
- `.superpowers/press-prototype-courses.html` — a non-Work tab: the entry-row layout and the placeholder treatment.

Read the relevant one before any task that says to.

## Global Constraints

- Node 24, npm 11, both installed. Task 1 is already complete on branch `press-redesign`.
- Colour tokens, exact values: `--paper #E8E7DE`, `--paper-terrain #E0E1D4`, `--paper-water #DCE2E3`, `--ink #14150F`, `--ink-soft #54554A`, `--magenta #B01B6E`, `--blue #1B5A87`, `--rule #A9AA9C`. Strip height `--strip: 46px`.
- Typefaces: Newsreader for masthead, headlines, decks, body. Archivo Narrow for the strip, running heads, captions, figure labels, entry metadata. No third family.
- Six tabs in this order: Work at `/`, Projects at `/projects`, Education at `/education`, Courses at `/courses`, Contests at `/contests`, Notebook at `/notebook`. Contact is not a tab.
- Work sheets are chronological, most recent first: Coditas, FlytBase, AlgoBulls with Yun, Integrated Active Monitoring, then the back page.
- Motion kept: pinned sheets, inner scroll, progress hairline, running head, paper tone shift, ink reveal on the Work landing only.
- Motion cut: halftone resolve on figures, and rules drawing themselves. Do not implement either.
- Pinning is disabled below 821px and under `prefers-reduced-motion`; both fall back to normal flow. Article pages are never pinned.
- Copy rules: no all-caps eyebrow labels, no metadata joined with middle dots, no arrows appended to link text, no accenting a single word inside a headline.
- **Invent nothing.** No course, certificate, contest placement, institution, date, or repository URL may be fabricated. Sections without supplied content ship with structure plus a visible placeholder that says it is waiting on the owner.
- The Work landing must not lead with drone work.
- `index.html` stays untouched and working until the final task.

---

### Task 2: Content collections and schemas

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/employers/{coditas,flytbase,algobulls-yun,iam}.md`
- Create: `src/content/projects/*.md`
- Create: `src/content/education/.gitkeep`, `src/content/courses/.gitkeep`, `src/content/contests/.gitkeep`, `src/content/posts/.gitkeep`
- Modify: `vitest.config.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: six collections. `employers`: `{ desk, name, role, period, start, blurb, paper }`. `projects`: `{ title, employer, status, disciplines, stack, summary, highlights, metrics?, openQuestions?, repo?, demo?, order }`. `education`: `{ qualification, institution, period, result?, note?, order }`. `courses`: `{ name, issuer, year, note?, order }`. `contests`: `{ name, host, year, placement?, built?, order }`. `posts`: `{ title, date, summary, tags?, draft }`. Every later task reads these shapes.

- [ ] **Step 1: Fix the empty-suite exit code**

Carried over from Task 1: `npm test` exits 1 when no test file matches, which fails CI. In `vitest.config.ts`, add `passWithNoTests: true` inside the `test` object.

- [ ] **Step 2: Write the schema**

`src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const md = (dir: string) => glob({ pattern: '**/*.md', base: `./src/content/${dir}` });

const employers = defineCollection({
  loader: md('employers'),
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
  loader: md('projects'),
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
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    order: z.number(),
  }),
});

const education = defineCollection({
  loader: md('education'),
  schema: z.object({
    qualification: z.string(),
    institution: z.string(),
    period: z.string(),
    result: z.string().optional(),
    note: z.string().optional(),
    order: z.number(),
  }),
});

const courses = defineCollection({
  loader: md('courses'),
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    year: z.string(),
    note: z.string().optional(),
    order: z.number(),
  }),
});

const contests = defineCollection({
  loader: md('contests'),
  schema: z.object({
    name: z.string(),
    host: z.string(),
    year: z.string(),
    placement: z.string().optional(),
    built: z.string().optional(),
    order: z.number(),
  }),
});

const posts = defineCollection({
  loader: md('posts'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { employers, projects, education, courses, contests, posts };
```

- [ ] **Step 3: Write the four employer files**

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
role: Python Developer at AlgoBulls, Data Analyst at Yun Solutions
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

- [ ] **Step 4: Write one project file to establish the shape**

`src/content/projects/abstraction-layer.md`:

```markdown
---
title: One service between the drone and the cloud
employer: flytbase
status: production
disciplines: [robotics, infrastructure]
stack: [Python, asyncio, MQTT, Redis, Flask, RabbitMQ, Prometheus, DJI Cloud SDK]
summary: Stateless, horizontally scalable middleware between DJI hardware and the cloud, carrying live telemetry up and control commands back down.
highlights:
  - Runs on asyncio so a slow MQTT topic never blocks a fast one.
  - Redis holds shared drone state, so any instance can answer for any aircraft.
  - Mutexes in the job layer stop two instances issuing the same command.
  - Outbound velocity commands are throttled during manual control so the hardware is never overrun.
  - Retries, circuit breakers, and metrics were in the first version, not a later patch.
metrics:
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

- [ ] **Step 5: Migrate the remaining projects**

Source of truth is `index.html` at the repository root, which holds the full prose for every project. Read it and create one file per project below, following Step 4's shape. Reuse the existing wording. Invent nothing. Every "Add: ..." note in that file becomes an `openQuestions` entry. Omit `repo` and `demo` entirely rather than guessing a URL.

Coditas: `br-generation`, `cec-upgrade-automation`, `mcp-change-history`, `mcp-business-api`, `bulk-br-concurrency`.

FlytBase: `abstraction-layer` (done), `android-app`, `airspace-monitoring`, `tactical-deconfliction`, `on-premise-deployment`, `object-tracking`, `floid`.

AlgoBulls and Yun (`employer: algobulls-yun`): `trading-strategies`, `youtube-market-pipeline`, `play-store-sentiment`.

Integrated Active Monitoring (`employer: iam`): `fisheye-heatmap`, `warehouse-inventory`.

Personal (`employer: workshop`, `status: personal`): `multimodal-chatbot`, `interviewee-analysis`, `smart-inhaler`, `quiz-hub`, `document-scanner`.

Set `order` from 1 within each employer, leading with the strongest project.

- [ ] **Step 6: Keep the empty collections loadable**

Create an empty `.gitkeep` in each of `src/content/education`, `src/content/courses`, `src/content/contests`, and `src/content/posts`. A collection whose directory does not exist fails the build; a collection with no entries is fine and is what the later routes expect.

- [ ] **Step 7: Verify**

```bash
npm run build && npm test
```

Expected: build succeeds, and a schema violation names its file and field if one exists. `npm test` now exits 0.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add content collections for work, study, contests, and posts"
```

---

### Task 3: Grouping and section registry

**Files:**
- Create: `src/lib/grouping.ts`, `src/lib/sections.ts`
- Test: `src/lib/grouping.test.ts`

**Interfaces:**
- Consumes: the collection shapes from Task 2.
- Produces: `groupByEmployer(projects, employers): Sheet[]`, sheets sorted by `start` descending, projects within each sorted by `order` ascending, employers with no projects retained, and projects whose employer matches no entry excluded. `workshopProjects(projects)` returns personal projects sorted by `order`. `SECTIONS` is the single source of truth for the tab strip and the Work index.

- [ ] **Step 1: Write the failing test**

`src/lib/grouping.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { groupByEmployer, workshopProjects } from './grouping';

const employers = [
  { id: 'iam', data: { desk: 'Vision', name: 'IAM', role: 'Intern', period: '2021 to 2022', start: '2021-10', blurb: 'b', paper: 'paper' } },
  { id: 'coditas', data: { desk: 'Automation', name: 'Coditas', role: 'Engineer', period: '2025 to present', start: '2025-08', blurb: 'b', paper: 'paper' } },
  { id: 'flytbase', data: { desk: 'Robotics', name: 'FlytBase', role: 'Developer', period: '2023 to 2025', start: '2023-10', blurb: 'b', paper: 'terrain' } },
];

const projects = [
  { id: 'b', data: { title: 'B', employer: 'coditas', order: 2 } },
  { id: 'a', data: { title: 'A', employer: 'coditas', order: 1 } },
  { id: 'c', data: { title: 'C', employer: 'flytbase', order: 1 } },
  { id: 'q', data: { title: 'Q', employer: 'workshop', order: 2 } },
  { id: 'p', data: { title: 'P', employer: 'workshop', order: 1 } },
];

describe('groupByEmployer', () => {
  it('orders sheets most recent first', () => {
    expect(groupByEmployer(projects as any, employers as any).map(s => s.id))
      .toEqual(['coditas', 'flytbase', 'iam']);
  });

  it('orders projects within a sheet by order ascending', () => {
    expect(groupByEmployer(projects as any, employers as any)[0].projects.map(p => p.data.title))
      .toEqual(['A', 'B']);
  });

  it('excludes projects with no matching employer', () => {
    const ids = groupByEmployer(projects as any, employers as any).flatMap(s => s.projects.map(p => p.id));
    expect(ids).not.toContain('p');
  });

  it('keeps an employer with no projects', () => {
    expect(groupByEmployer(projects as any, employers as any).find(s => s.id === 'iam')?.projects)
      .toEqual([]);
  });
});

describe('workshopProjects', () => {
  it('returns only personal projects, in order', () => {
    expect(workshopProjects(projects as any).map(p => p.id)).toEqual(['p', 'q']);
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

export interface Sheet<P extends ProjectLike = ProjectLike> {
  id: string;
  desk: string;
  name: string;
  role: string;
  period: string;
  blurb: string;
  paper: Paper;
  projects: P[];
}

export function groupByEmployer<P extends ProjectLike>(projects: P[], employers: EmployerLike[]): Sheet<P>[] {
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
      projects: projects.filter(p => p.data.employer === e.id).sort((a, b) => a.data.order - b.data.order),
    }));
}

export function workshopProjects<P extends ProjectLike>(projects: P[]): P[] {
  return projects.filter(p => p.data.employer === 'workshop').sort((a, b) => a.data.order - b.data.order);
}
```

- [ ] **Step 4: Write the section registry**

`src/lib/sections.ts`:

```ts
export interface Section { href: string; tab: string; description: string }

export const SECTIONS: Section[] = [
  { href: '/', tab: 'Work', description: 'Four years of production systems, most recent first.' },
  { href: '/projects', tab: 'Projects', description: 'Things built outside work hours, with their repositories.' },
  { href: '/education', tab: 'Education', description: 'Degree and the institution behind it.' },
  { href: '/courses', tab: 'Courses', description: 'Structured study taken alongside the work.' },
  { href: '/contests', tab: 'Contests', description: 'Hackathons and competitions, and what came out of them.' },
  { href: '/notebook', tab: 'Notebook', description: 'Occasional writing about systems that had to stay up.' },
];
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/lib/grouping.test.ts`
Expected: PASS, five tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib
git commit -m "Add employer grouping and the section registry"
```

---

### Task 4: Scroll geometry

**Files:**
- Create: `src/scripts/pin.ts`
- Test: `src/scripts/pin.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `overflowOf(contentHeight, viewportHeight): number` and `pinAmount(spacerTop, viewportHeight, overflow): number`. Both pure, both taking no DOM references. Task 5 binds them.

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
  it('accounts for a viewport shortened by the masthead strip', () => {
    expect(overflowOf(1000, 800 - 46)).toBe(246);
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
 * A sheet is pinned below the masthead strip. The spacer that follows it in the
 * document buys scroll distance: while the reader travels through the spacer the
 * sheet holds position and its content column slides up by exactly its own
 * overflow. When the column bottoms out the spacer ends and the next sheet slides
 * over the top.
 */

export function overflowOf(contentHeight: number, viewportHeight: number): number {
  return Math.max(0, contentHeight - viewportHeight);
}

export function pinAmount(spacerTop: number, viewportHeight: number, overflow: number): number {
  if (overflow <= 0) return 0;
  return Math.max(0, Math.min(overflow, viewportHeight - spacerTop));
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/scripts/pin.test.ts`
Expected: PASS, seven tests.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/pin.ts src/scripts/pin.test.ts
git commit -m "Add pinned-sheet geometry with tests"
```

---

### Task 5: Global styles and the scroll engine

**Files:**
- Modify: `src/styles/tokens.css`
- Create: `src/scripts/scroll.ts`

**Interfaces:**
- Consumes: `overflowOf` and `pinAmount` from Task 4.
- Produces: a default-exported `start(): void`. It expects `.sheet` elements each followed by a `.spacer` sibling, each containing one `.col` and one `.pin i`, and optionally one `#lede`. Task 6's layout calls it.

Read `.superpowers/press-prototype.html` first. It is the working reference for every selector below.

- [ ] **Step 1: Add the strip height token**

In `src/styles/tokens.css`, add `--strip: 46px;` to the `:root` block, and `padding-top: var(--strip);` to the `body` rule.

- [ ] **Step 2: Append the layout CSS**

Append to `src/styles/tokens.css`:

```css
.strip { position: fixed; top: 0; left: 0; right: 0; height: var(--strip); z-index: 80;
  display: flex; align-items: stretch; background: var(--paper); border-bottom: 1px solid var(--ink); }
.strip .who { display: flex; align-items: center; padding: 0 16px; font-size: 15px;
  letter-spacing: -.01em; border-right: 1px solid var(--rule); white-space: nowrap; }
.strip nav { display: flex; align-items: stretch; overflow-x: auto; }
.strip nav a { display: flex; align-items: center; padding: 0 15px; font-family: var(--chart);
  font-size: 13px; color: var(--ink-soft); text-decoration: none; border-right: 1px solid var(--rule);
  border-bottom: 2px solid transparent; white-space: nowrap; }
.strip nav a:hover { color: var(--ink); background: rgba(20, 21, 15, .04); }
.strip nav a[aria-current="page"] { color: var(--ink); border-bottom-color: var(--magenta); font-weight: 600; }
.strip .say { margin-left: auto; display: flex; align-items: center; padding: 0 16px;
  font-family: var(--chart); font-size: 13px; border-left: 1px solid var(--rule); white-space: nowrap; }

.sheet { position: sticky; top: var(--strip); height: calc(100vh - var(--strip)); overflow: hidden;
  display: grid; grid-template-columns: 112px minmax(0, 1fr);
  border-top: 1px solid var(--ink); box-shadow: 0 -20px 44px -30px rgba(20, 21, 15, .55); }
.spacer { height: 0; }
.col { padding: 26px 30px 40px; max-width: 1080px; will-change: transform; }
.margin { border-right: 1px solid var(--rule); padding: 22px 12px 22px 22px; }
.runhead { position: sticky; top: 22px; font-family: var(--chart); font-size: 12px;
  line-height: 1.35; color: var(--ink-soft); }
.runhead b { display: block; color: var(--ink); font-weight: 600; font-size: 13px; }
.runhead span { display: block; margin-top: 5px; font-variant-numeric: tabular-nums; }
.pin { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; }
.pin i { display: block; height: 100%; width: 0; background: var(--magenta); }

/* .kicker, .hed and .deck are already global from Task 1. Do not restate them. */

.w { color: #C3C4B8; transition: color .18s ease; }
.w.on { color: var(--ink); }
.w.key.on { color: var(--magenta); }

@media (max-width: 820px) {
  .strip .who, .strip .say { display: none; }
  .sheet { grid-template-columns: 1fr; position: relative; height: auto;
    min-height: calc(100vh - var(--strip)); overflow: visible; box-shadow: none; }
  .spacer { height: 0 !important; }
  .col { transform: none !important; will-change: auto; padding: 20px 20px 34px; }
  .margin { border-right: 0; border-bottom: 1px solid var(--rule); padding: 14px 20px; }
  .runhead { position: static; display: flex; gap: 14px; align-items: baseline; }
  .runhead span { margin: 0; }
  .pin { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
  .sheet { position: relative; height: auto; min-height: calc(100vh - var(--strip));
    overflow: visible; box-shadow: none; }
  .spacer { height: 0 !important; }
  .col { transform: none !important; }
  .pin { display: none; }
  .w { color: var(--ink); }
  .w.key { color: var(--magenta); }
}
```

- [ ] **Step 3: Write the engine**

`src/scripts/scroll.ts`:

```ts
import { overflowOf, pinAmount } from './pin';

interface Bound {
  col: HTMLElement;
  spacer: HTMLElement | null;
  bar: HTMLElement | null;
  overflow: number;
}

export default function start(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sheets = Array.from(document.querySelectorAll<HTMLElement>('.sheet'));
  if (!sheets.length) return;

  const strip = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--strip'), 10) || 0;
  const lede = document.getElementById('lede');
  const words: HTMLElement[] = [];
  let pinned = matchMedia('(min-width: 821px)').matches;
  let bound: Bound[] = [];

  if (lede) {
    let html = '';
    lede.childNodes.forEach(node => {
      const isKey = node.nodeType === 1 && (node as Element).classList.contains('key');
      html += (node.textContent ?? '').split(/(\s+)/)
        .map(t => (t.trim() ? `<span class="w${isKey ? ' key' : ''}">${t}</span>` : t))
        .join('');
    });
    lede.innerHTML = html;
    words.push(...Array.from(lede.querySelectorAll<HTMLElement>('.w')));
  }

  function layout(): void {
    pinned = matchMedia('(min-width: 821px)').matches;
    const view = innerHeight - strip;
    bound = sheets.map(sheet => {
      const col = sheet.querySelector<HTMLElement>('.col')!;
      const next = sheet.nextElementSibling as HTMLElement | null;
      const spacer = next && next.classList.contains('spacer') ? next : null;
      const overflow = pinned ? overflowOf(col.scrollHeight, view) : 0;
      if (spacer) spacer.style.height = `${overflow}px`;
      if (!pinned) col.style.transform = '';
      return { col, spacer, bar: sheet.querySelector<HTMLElement>('.pin i'), overflow };
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

- [ ] **Step 4: Verify nothing regressed**

Run: `npm test`
Expected: PASS, twelve tests.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/scroll.ts src/styles/tokens.css
git commit -m "Add global layout styles and the pinned-sheet scroll engine"
```

---

### Task 6: Layouts and the masthead strip

**Files:**
- Create: `src/components/SectionNav.astro`, `src/components/Masthead.astro`
- Create: `src/layouts/Section.astro`, `src/layouts/Article.astro`

**Interfaces:**
- Consumes: `SECTIONS` from Task 3, `start` from Task 5, `src/styles/tokens.css`.
- Produces: `<Section title description current>` wraps a page's sheets and renders head, strip, and the scroll island. `<Article title date>` wraps one blog post in normal flow. `current` is the `href` of the active section, matched against `SECTIONS`.

- [ ] **Step 1: Write `SectionNav.astro`**

The active tab carries `aria-current="page"`, which is also what the stylesheet targets, so the marker and the accessible state cannot drift apart.

```astro
---
import { SECTIONS } from '../lib/sections';
interface Props { current: string; }
const { current } = Astro.props;
---
<div class="strip">
  <div class="who"><a href="/" style="text-decoration:none">Prithviraj Gotepatil</a></div>
  <nav aria-label="Sections">
    {SECTIONS.map(s => (
      <a href={s.href} aria-current={s.href === current ? 'page' : undefined}>{s.tab}</a>
    ))}
  </nav>
  <div class="say"><a href="mailto:prithvirajgotepatil@gmail.com">Get in touch</a></div>
</div>
```

- [ ] **Step 2: Write `Masthead.astro`**

```astro
---
interface Props { first: string; last: string; }
const { first, last } = Astro.props;
---
<h1 class="masthead">{first}<span>{last}</span></h1>

<style>
  .masthead { font-size: clamp(44px, 10.5vw, 140px); line-height: .82; letter-spacing: -.03em;
    font-weight: 500; font-optical-sizing: auto; }
  .masthead span { display: block; font-style: italic; font-weight: 300; letter-spacing: -.02em; }
</style>
```

- [ ] **Step 3: Write `Section.astro`**

```astro
---
import '../styles/tokens.css';
import SectionNav from '../components/SectionNav.astro';
interface Props { title: string; description: string; current: string; }
const { title, description, current } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..600&family=Archivo+Narrow:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <SectionNav current={current} />
    <slot />
    <script>
      import start from '../scripts/scroll';
      start();
    </script>
  </body>
</html>
```

- [ ] **Step 4: Write `Article.astro`**

No sheets, no spacers, no scroll island. A measure under eighty characters.

```astro
---
import '../styles/tokens.css';
import SectionNav from '../components/SectionNav.astro';
interface Props { title: string; date: Date; summary: string; }
const { title, date, summary } = Astro.props;
const stamp = date.toISOString().slice(0, 10);
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={summary} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..600&family=Archivo+Narrow:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <SectionNav current="/notebook" />
    <article>
      <p class="stamp"><time datetime={stamp}>{stamp}</time></p>
      <h1>{title}</h1>
      <p class="summary">{summary}</p>
      <hr />
      <div class="prose"><slot /></div>
      <p class="back"><a href="/notebook">Back to the notebook</a></p>
    </article>

    <style>
      article { max-width: 34em; margin: 0 auto; padding: 46px 22px 90px; }
      .stamp { font-family: var(--chart); font-size: 13px; color: var(--magenta); }
      h1 { font-size: clamp(32px, 5vw, 52px); line-height: 1.02; letter-spacing: -.02em;
        font-weight: 500; margin: 8px 0 10px; }
      .summary { font-size: 20px; font-style: italic; color: var(--ink-soft); }
      hr { border: 0; border-top: 1px solid var(--ink); margin: 22px 0; }
      .prose :global(p) { margin-bottom: 16px; }
      .prose :global(h2) { font-size: 26px; font-weight: 500; margin: 28px 0 8px; }
      .prose :global(pre) { background: var(--paper-terrain); border: 1px solid var(--rule);
        padding: 12px 14px; overflow-x: auto; font-size: 14px; }
      .prose :global(code) { font-family: ui-monospace, monospace; font-size: .9em; }
      .prose :global(blockquote) { border-left: 2px solid var(--magenta); padding-left: 14px;
        font-style: italic; color: var(--ink-soft); }
      .back { font-family: var(--chart); font-size: 13px; margin-top: 40px;
        border-top: 1px solid var(--rule); padding-top: 14px; }
    </style>
  </body>
</html>
```

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: succeeds. Layouts are unused so far, which is fine.

- [ ] **Step 6: Commit**

```bash
git add src/layouts src/components
git commit -m "Add section and article layouts with the masthead strip"
```

---

### Task 7: Sheet and entry components

**Files:**
- Create: `src/components/Sheet.astro`, `src/components/Story.astro`, `src/components/Figure.astro`, `src/components/Stats.astro`, `src/components/EntryList.astro`, `src/components/Awaiting.astro`

**Interfaces:**
- Consumes: nothing beyond the tokens.
- Produces: `<Sheet id desk name period paper>` emits the sheet plus its trailing spacer. `<Story title summary highlights stack metrics? repo? demo?>` renders one project, with an optional `figure` slot. `<Stats metrics>` renders a metric row. `<Figure number caption>` wraps slotted SVG, with no halftone layer. `<EntryList entries>` renders rows of `{ name, note?, who, when, pending? }`. `<Awaiting what>` renders the placeholder notice.

Read `.superpowers/press-prototype-courses.html` for the entry row and placeholder treatment.

- [ ] **Step 1: Write `Sheet.astro`**

```astro
---
interface Props { id: string; desk: string; name: string; period: string; paper: 'paper' | 'terrain' | 'water'; }
const { id, desk, name, period, paper } = Astro.props;
---
<section class="sheet" id={id} data-paper={paper} style={`background: var(--paper${paper === 'paper' ? '' : '-' + paper})`}>
  <div class="margin"><div class="runhead"><b>{desk}</b><span>{name}</span><span>{period}</span></div></div>
  <div class="col"><slot /></div>
  <div class="pin"><i></i></div>
</section>
<div class="spacer"></div>
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
  .stats { display: flex; flex-wrap: wrap; border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink); margin-top: 20px; }
  .stats > div { padding: 11px 20px 12px; border-right: 1px solid var(--rule); }
  .stats > div:first-child { padding-left: 0; }
  .stats > div:last-child { border-right: 0; }
  .n { font-size: 27px; font-variant-numeric: tabular-nums lining-nums; }
  .n.mag { color: var(--magenta); }
  .l { font-family: var(--chart); font-size: 12px; color: var(--ink-soft); }
</style>
```

- [ ] **Step 3: Write `Figure.astro`**

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

Two columns when a figure is slotted, one when not. Repository and demo links appear only when supplied.

```astro
---
import Stats from './Stats.astro';
interface Props {
  title: string;
  summary: string;
  highlights: string[];
  stack: string[];
  metrics?: { value: string; label: string; accent?: boolean }[];
  repo?: string;
  demo?: string;
}
const { title, summary, highlights, stack, metrics = [], repo, demo } = Astro.props;
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
        {repo && <><dt>Source</dt><dd><a href={repo}>{repo.replace(/^https?:\/\//, '')}</a></dd></>}
        {demo && <><dt>Live</dt><dd><a href={demo}>{demo.replace(/^https?:\/\//, '')}</a></dd></>}
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
  .tail dt { color: var(--ink); font-weight: 600; margin-top: 8px; }
  .tail a { text-decoration-color: var(--magenta); text-underline-offset: 4px; }
  @media (max-width: 820px) { .cols.two { grid-template-columns: 1fr; gap: 22px; } }
</style>
```

- [ ] **Step 5: Write `EntryList.astro`**

One row shape shared by Projects, Education, Courses, Contests, and Notebook.

```astro
---
interface Entry { name: string; note?: string; who?: string; when?: string; href?: string; pending?: boolean }
interface Props { entries: Entry[]; }
const { entries } = Astro.props;
---
<div class="entries">
  {entries.map(e => (
    <div class:list={['entry', e.pending && 'pending']}>
      <div>
        <div class="name">{e.href ? <a href={e.href}>{e.name}</a> : e.name}</div>
        {e.note && <div class="note">{e.note}</div>}
      </div>
      <div class="who2">{e.who}</div>
      <div class="yr">{e.when}</div>
    </div>
  ))}
</div>

<style>
  .entries { border-top: 1px solid var(--ink); }
  .entry { border-bottom: 1px solid var(--rule); padding: 14px 0;
    display: grid; grid-template-columns: 1fr 150px 90px; gap: 20px; align-items: baseline; }
  .name { font-size: 21px; line-height: 1.2; }
  .name a { text-decoration-color: var(--magenta); text-underline-offset: 4px; }
  .note { font-size: 15px; color: var(--ink-soft); margin-top: 3px; max-width: 44em; }
  .who2 { font-family: var(--chart); font-size: 13px; color: var(--ink-soft); }
  .yr { font-family: var(--chart); font-size: 13px; color: var(--magenta); text-align: right; }
  .pending .name, .pending .note, .pending .who2, .pending .yr { color: #9A9B8E; }
  .pending .name { font-style: italic; }
  @media (max-width: 820px) {
    .entry { grid-template-columns: 1fr; gap: 4px; }
    .yr { text-align: left; }
  }
</style>
```

- [ ] **Step 6: Write `Awaiting.astro`**

```astro
---
interface Props { what: string; }
const { what } = Astro.props;
---
<div class="awaiting">
  <b>This section is waiting on content.</b>
  Nothing above is real. {what}
</div>

<style>
  .awaiting { margin-top: 26px; border: 1px solid var(--magenta); padding: 14px 16px;
    font-family: var(--chart); font-size: 13px; line-height: 1.6; color: var(--ink); max-width: 44em; }
  .awaiting b { color: var(--magenta); display: block; margin-bottom: 5px; }
</style>
```

- [ ] **Step 7: Verify the build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/components
git commit -m "Add sheet, story, figure, stats, entry list, and placeholder components"
```

---

### Task 8: The Work route

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/figures/AbstractionLayer.astro`, `src/components/figures/ChangeHistory.astro`

**Interfaces:**
- Consumes: everything from Tasks 3, 6, and 7.
- Produces: the Work route. Later routes copy its shape.

- [ ] **Step 1: Port the two diagrams**

`.superpowers/press-prototype.html` contains two finished SVG diagrams in chart ink. Copy each into its own component as a bare `<svg>...</svg>` with no wrapper and no frontmatter, dropping the `.dither` div, which the spec cuts.

`src/components/figures/AbstractionLayer.astro` is the diagram whose labels read "Dock and aircraft", "Abstraction layer", and "Cloud and web".

`src/components/figures/ChangeHistory.astro` is the diagram whose labels read "One sentence", "Audit tables", "Default columns", "View table", "Section map", and "Script".

- [ ] **Step 2: Rewrite `index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Section from '../layouts/Section.astro';
import Sheet from '../components/Sheet.astro';
import Masthead from '../components/Masthead.astro';
import Story from '../components/Story.astro';
import Figure from '../components/Figure.astro';
import AbstractionLayer from '../components/figures/AbstractionLayer.astro';
import ChangeHistory from '../components/figures/ChangeHistory.astro';
import { groupByEmployer } from '../lib/grouping';
import { SECTIONS } from '../lib/sections';

const sheets = groupByEmployer(await getCollection('projects'), await getCollection('employers'));
const elsewhere = SECTIONS.filter(s => s.href !== '/');
---
<Section
  title="Prithviraj Gotepatil"
  description="Backend systems, AI pipelines, and computer vision. Four years shipping production software across robotics, automation, markets, and vision."
  current="/"
>
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
      <aside class="index">
        <h2>Inside</h2>
        <dl>
          {elsewhere.map(s => (
            <div><dt><a href={s.href}>{s.tab}</a></dt><dd>{s.description}</dd></div>
          ))}
        </dl>
      </aside>
    </div>
  </Sheet>

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

  <Sheet id="contact" desk="Back page" name="Get in touch" period="Pune, India" paper="paper">
    <h2 class="hed">Available for backend, AI, and robotics work</h2>
    <p class="deck">Pune, India. Open to remote.</p>
    <ul class="contact">
      <li><a href="mailto:prithvirajgotepatil@gmail.com">prithvirajgotepatil@gmail.com</a></li>
      <li><a href="https://github.com/PrithvirajG">github.com/PrithvirajG</a></li>
    </ul>
  </Sheet>
</Section>

<style is:global>
  .dateline { display: flex; flex-wrap: wrap; margin-top: 20px; border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink); font-family: var(--chart); font-size: 13px; }
  .dateline > div { padding: 7px 16px; border-right: 1px solid var(--rule); }
  .dateline > div:first-child { padding-left: 0; }
  .dateline > div:last-child { border-right: 0; }
  .dateline .now { color: var(--magenta); font-weight: 600; }
  .frontgrid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(250px, .9fr);
    gap: 44px; align-items: start; }
  .lede { margin-top: 34px; font-size: clamp(21px, 2.5vw, 31px); line-height: 1.36; }
  .index { border-top: 1px solid var(--ink); padding-top: 9px; margin-top: 38px; }
  .index h2 { font-family: var(--chart); font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .index dl { font-size: 15px; line-height: 1.42; }
  .index div { border-top: 1px solid var(--rule); padding: 8px 0 9px;
    display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 12px; }
  .index dt { font-family: var(--chart); font-size: 14px; font-weight: 600; }
  .index dt a { text-decoration-color: var(--magenta); text-underline-offset: 4px; }
  .index dd { color: var(--ink-soft); }
  .contact { list-style: none; font-size: 21px; }
  .contact li { margin-bottom: 8px; }
  .contact a { text-decoration-color: var(--magenta); text-underline-offset: 5px; }
  @media (max-width: 820px) { .frontgrid { grid-template-columns: 1fr; gap: 0; } }
</style>
```

- [ ] **Step 3: Check it in a browser**

```bash
npm run dev
```

Expected: the strip is fixed at the top with Work marked current; the masthead fills the screen; the statement turns from grey to ink as you scroll and the closing clause lands in magenta; sheets appear in the order Automation, Robotics, Markets, Vision, Back page; every sheet is fully reachable; the progress hairline fills.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add the Work route with the front sheet and employer sheets"
```

---

### Task 9: Projects, Education, Courses, and Contests routes

**Files:**
- Create: `src/pages/projects.astro`, `src/pages/education.astro`, `src/pages/courses.astro`, `src/pages/contests.astro`

**Interfaces:**
- Consumes: `Section`, `Sheet`, `EntryList`, `Awaiting`, and the collections from Task 2.
- Produces: four routes. Each renders real entries when its collection has any, and placeholder rows plus an `Awaiting` notice when it does not.

All four share one shape. The Projects route differs only in reading the `projects` collection and filtering to personal ones.

- [ ] **Step 1: Write `projects.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Section from '../layouts/Section.astro';
import Sheet from '../components/Sheet.astro';
import EntryList from '../components/EntryList.astro';
import Awaiting from '../components/Awaiting.astro';
import { workshopProjects } from '../lib/grouping';

const mine = workshopProjects(await getCollection('projects'));
const entries = mine.map(p => ({
  name: p.data.title,
  note: p.data.summary,
  who: p.data.stack.slice(0, 3).join(', '),
  when: p.data.repo ? 'source' : '',
  href: p.data.repo,
}));
const missing = mine.filter(p => !p.data.repo).length;
---
<Section title="Projects — Prithviraj Gotepatil" description="Things built outside work hours, with their repositories." current="/projects">
  <Sheet id="projects" desk="Projects" name="Outside work hours" period="2021 to now" paper="terrain">
    <p class="kicker">Built because I wanted them to exist</p>
    <h1 class="hed">Personal projects</h1>
    <p class="deck">Side builds, each with the stack it runs on and a link to the source where there is one.</p>
    <EntryList entries={entries} />
    {missing > 0 && <Awaiting what={`${missing} of these have no repository link yet. Send the GitHub URLs and they become links.`} />}
  </Sheet>

  <Sheet id="contact" desk="Back page" name="Get in touch" period="Pune, India" paper="paper">
    <h2 class="hed">Available for backend, AI, and robotics work</h2>
    <ul class="contact"><li><a href="mailto:prithvirajgotepatil@gmail.com">prithvirajgotepatil@gmail.com</a></li></ul>
  </Sheet>
</Section>
```

- [ ] **Step 2: Write `education.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Section from '../layouts/Section.astro';
import Sheet from '../components/Sheet.astro';
import EntryList from '../components/EntryList.astro';
import Awaiting from '../components/Awaiting.astro';

const rows = (await getCollection('education')).sort((a, b) => a.data.order - b.data.order);
const real = rows.map(e => ({ name: e.data.qualification, note: e.data.note, who: e.data.institution, when: e.data.period }));
const placeholder = [
  { name: 'Qualification', note: 'One line on what it covered.', who: 'Institution', when: 'Years', pending: true },
];
---
<Section title="Education — Prithviraj Gotepatil" description="Degree and the institution behind it." current="/education">
  <Sheet id="education" desk="Education" name="Degree and institution" period="" paper="water">
    <p class="kicker">Where the foundations came from</p>
    <h1 class="hed">Education</h1>
    <p class="deck">Formal qualifications, with the institution and the years.</p>
    <EntryList entries={real.length ? real : placeholder} />
    {real.length === 0 && <Awaiting what="Send the degree, the institution, the years, and the result, and this row becomes real." />}
  </Sheet>

  <Sheet id="contact" desk="Back page" name="Get in touch" period="Pune, India" paper="paper">
    <h2 class="hed">Available for backend, AI, and robotics work</h2>
    <ul class="contact"><li><a href="mailto:prithvirajgotepatil@gmail.com">prithvirajgotepatil@gmail.com</a></li></ul>
  </Sheet>
</Section>
```

- [ ] **Step 3: Write `courses.astro`**

Identical in shape to Step 2. Read the `courses` collection, sort by `order`, and map each entry to `{ name: data.name, note: data.note, who: data.issuer, when: data.year }`. Use three placeholder rows of `{ name: 'Course name', note: 'One line on what it covered and why it was worth the time.', who: 'Issuer', when: 'Year', pending: true }`. Sheet `id="courses"`, `desk="Courses"`, `name="Certifications and study"`, `paper="terrain"`. Kicker "What I went and learned on purpose", headline "Courses and certifications", deck "Structured study taken alongside the work, listed with who issued it and when." The `Awaiting` copy is "Send the courses worth listing with the issuer and the year and they replace these rows." Include the same back page sheet.

- [ ] **Step 4: Write `contests.astro`**

Identical in shape again. Read the `contests` collection, sort by `order`, and map each entry to `{ name: data.name, note: data.built, who: data.host, when: data.placement ?? data.year }`. Use two placeholder rows of `{ name: 'Hackathon or competition', note: 'What you built, in one line.', who: 'Host', when: 'Placement', pending: true }`. Sheet `id="contests"`, `desk="Contests"`, `name="Hackathons and competitions"`, `paper="water"`. Kicker "Built against a clock", headline "Hackathons and competitions", deck "Short-format builds, with who ran them and how they went." The `Awaiting` copy is "Send which contests to include, what you built, and how each placed." Include the same back page sheet.

- [ ] **Step 5: Verify all four**

```bash
npm run dev
```

Visit each route. Expected: the strip marks the right tab on each; placeholder rows are grey and italic; the magenta notice appears under each empty section; every route scrolls correctly; the back page sheet closes each one.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add the Projects, Education, Courses, and Contests routes"
```

---

### Task 10: The Notebook route and article pages

**Files:**
- Create: `src/pages/notebook.astro`, `src/pages/blog/[slug].astro`
- Create: `src/content/posts/hello-world.md`

**Interfaces:**
- Consumes: `Article` from Task 6, `posts` from Task 2.
- Produces: `/notebook` listing published posts newest first, and `/blog/<slug>` for each. Drafts appear in development and never in a production build.

- [ ] **Step 1: Write one real post so the route has something to render**

`src/content/posts/hello-world.md`. Mark it a draft, so it renders locally and never ships:

```markdown
---
title: Starting a notebook
date: 2026-09-10
summary: What this section is for, and what will end up in it.
draft: true
---

This is a placeholder post so the notebook has something to render during
development. It is marked as a draft, so it does not appear in the built site.

Delete this file when the first real post is written.
```

- [ ] **Step 2: Write `notebook.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Section from '../layouts/Section.astro';
import Sheet from '../components/Sheet.astro';
import EntryList from '../components/EntryList.astro';
import Awaiting from '../components/Awaiting.astro';

const posts = (await getCollection('posts', p => import.meta.env.DEV || !p.data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const entries = posts.map(p => ({
  name: p.data.title,
  note: p.data.summary,
  who: p.data.draft ? 'draft' : '',
  when: p.data.date.toISOString().slice(0, 10),
  href: `/blog/${p.id}`,
}));
---
<Section title="Notebook — Prithviraj Gotepatil" description="Occasional writing about systems that had to stay up." current="/notebook">
  <Sheet id="notebook" desk="Notebook" name="Writing" period="" paper="paper">
    <p class="kicker">Occasional, not scheduled</p>
    <h1 class="hed">Notebook</h1>
    <p class="deck">Notes on systems that had to stay up, and what it took.</p>
    {entries.length > 0
      ? <EntryList entries={entries} />
      : <Awaiting what="No posts yet. Each one is a markdown file in the repository and appears here once written." />}
  </Sheet>

  <Sheet id="contact" desk="Back page" name="Get in touch" period="Pune, India" paper="paper">
    <h2 class="hed">Available for backend, AI, and robotics work</h2>
    <ul class="contact"><li><a href="mailto:prithvirajgotepatil@gmail.com">prithvirajgotepatil@gmail.com</a></li></ul>
  </Sheet>
</Section>
```

- [ ] **Step 3: Write `blog/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import Article from '../../layouts/Article.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts', p => import.meta.env.DEV || !p.data.draft);
  return posts.map(post => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<Article title={post.data.title} date={post.data.date} summary={post.data.summary}>
  <Content />
</Article>
```

- [ ] **Step 4: Verify both**

```bash
npm run dev
```

Expected in development: `/notebook` lists the placeholder post marked draft, and its title links to an article page that reads as one column of normal-flow text with the strip above it and no pinning.

```bash
npm run build
```

Expected in the built output: no `blog/` page exists, because the only post is a draft. Confirm with `ls dist`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add the Notebook route and article pages"
```

---

### Task 11: Quality pass

**Files:**
- Modify: whichever files the checks turn up.

**Interfaces:**
- Consumes: the complete site.
- Produces: no new interfaces.

- [ ] **Step 1: Check every route on mobile**

At 390px wide, visit all six routes. Expected: the strip keeps its tabs and drops the name and the contact link; sheets are in normal flow; every section scrolls conventionally; no progress hairline; entry rows stack.

- [ ] **Step 2: Check reduced motion**

Emulate `prefers-reduced-motion: reduce` and reload the Work route. Expected: no pinning, no translation, the statement fully in ink with its closing clause in magenta.

- [ ] **Step 3: Check keyboard navigation**

Tab through the strip and the Work index. Expected: a magenta focus ring on every link, the strip reachable first, and each tab navigating correctly.

- [ ] **Step 4: Check the strip does not cover content**

On each route, follow an in-page anchor and confirm the target is not hidden behind the fixed strip. If it is, add `scroll-margin-top: var(--strip)` to `.sheet` in `src/styles/tokens.css`.

- [ ] **Step 5: Check contrast**

Verify `--ink` and `--magenta` against all three paper tones at 4.5:1 or better, and the pending grey `#9A9B8E` against `--paper-terrain`. If pending grey fails, darken it until it passes and record the value in the spec. Placeholder text must still be readable.

- [ ] **Step 6: Check the longest sheet**

The FlytBase sheet carries seven projects and will be tallest. Confirm it is fully reachable and does not take an unreasonable time to scroll. If it does, split it into two sheets, which the spec allows.

- [ ] **Step 7: Run the full check**

```bash
npm test && npm run build
```

Expected: twelve tests pass, build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Quality pass across all six routes"
```

---

### Task 12: Cut over

Do not start this task without explicit approval from the repository owner. It changes what visitors see.

**Files:**
- Delete: `index.html`
- Create: `README.md`

- [ ] **Step 1: Ask the owner to switch the Pages source**

In repository settings, under Pages, set the source to GitHub Actions. This is manual and cannot be scripted. Until it is done the workflow builds but nothing changes for visitors.

- [ ] **Step 2: Remove the old single-file site**

```bash
git rm index.html
```

It stays in history at commit `75994d7` and can be recovered with `git show 75994d7:index.html`.

- [ ] **Step 3: Write the README**

Cover: what the site is; `npm run dev` to work on it; `npm test` and `npm run build` to check it; that content lives in `src/content/` as one markdown file per entry, one directory per kind; that a blog post is a file in `src/content/posts/` with `draft: true` until ready; and that deployment happens on push to `main`.

- [ ] **Step 4: Merge, push, and verify**

Merge `press-redesign` into `main`, push, and watch the Actions run. When green, open the live site and confirm all six tabs, the pinning, and every link.

- [ ] **Step 5: Confirm the no-JavaScript fallback**

With JavaScript disabled, reload every route. Expected: every word readable in normal flow. If anything is hidden, fix it before calling the cutover done.

---

## Remaining content work

Owned by the repository owner, not by an implementer. Until each arrives, the
relevant section ships with its placeholder visible.

- The fifteen metric questions carried in `openQuestions`.
- Degree, institution, years, and result.
- Courses and certifications, with issuer and year.
- Hackathons and competitions, with host, placement, and what was built.
- Repository URLs for the five personal projects.
- The first real blog post.
- Screenshots, architecture diagrams, and drone footage. Until they arrive every
  figure stays a drawn SVG diagram.
