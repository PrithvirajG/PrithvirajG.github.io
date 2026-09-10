# Portfolio redesign: the Press direction

Date: 2026-09-10
Status: approved for implementation
Repository: `PrithvirajG.github.io` (GitHub Pages user site)

## What this is

A rebuild of Prithviraj Gotepatil's portfolio as a static, editorial, scroll-driven
site. It replaces the current single 1,461-line `index.html` with a content-driven
Astro project.

## Audience and job

Primary audience is hiring managers and recruiters evaluating him for senior
backend, AI, or robotics roles. The site's job is to establish, within one screen,
that he ships production systems across several domains, and then to let a reader
go as deep as they want on any one of them.

Secondary audience is engineers who already know the domain and want detail.

Explicitly not optimised for: freelance client conversion, or design-community
attention.

## Direction

An editorial broadsheet. The career is presented as a printed record: a masthead,
a front page with an index of what is inside, and one sheet per employer.

### Rejected directions and why

These were explored and discarded. Recorded so they are not revisited by accident.

- **A 3D scroll journey in Three.js.** Rejected by the client. It also fought the
  recruiter audience on load time and mobile.
- **A blueprint theme.** Rejected by the client.
- **Flood, Clay, and Console themes.** Presented alongside Press; Press was chosen.

### Palette

Taken from sectional aeronautical charts, which are printed documents about
airspace. This grounds the design in the subject matter and avoids the cream-plus-
terracotta combination that currently reads as a generated-design default.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#E8E7DE` | Chart paper, front sheet |
| `--paper-terrain` | `#E0E1D4` | Terrain tint, second sheet |
| `--paper-water` | `#DCE2E3` | Control-zone tint, third sheet |
| `--ink` | `#14150F` | Olive black, all body text |
| `--ink-soft` | `#54554A` | Secondary text, captions |
| `--magenta` | `#B01B6E` | Airspace boundary; metrics and section kickers |
| `--blue` | `#1B5A87` | Control zone; diagram secondary |
| `--rule` | `#A9AA9C` | Hairline rules |

Paper tone advances one step per sheet, so scrolling moves through the chart.

### Type

Two families, clearly distinct.

- **Newsreader** for the masthead, headlines, decks, and body. A newspaper serif
  designed for screen, with optical sizing.
- **Archivo Narrow** for running heads, captions, figure labels, and the index.
  Condensed sans is what sectional charts use for place names.

Deliberately avoided: all-caps eyebrow labels, metadata joined with middle dots,
arrows appended to links, and accenting a single word inside a headline.

## Structure

### Ordering

Chronological, most recent first.

| Sheet | Desk | Employer | Period |
|---|---|---|---|
| 0 | Front | — | — |
| 1 | Automation | Coditas | 2025 to present |
| 2 | Robotics | FlytBase | 2023 to 2025 |
| 3 | Markets | AlgoBulls and Yun Solutions | 2022 to 2023 |
| 4 | Vision | Integrated Active Monitoring | 2021 to 2022 |
| 5 | Workshop | Personal projects | — |
| 6 | Back page | Contact | — |

### The front page

Carries the whole argument in one screen:

- Masthead: the name, set large, as the primary graphic element.
- A dateline strip: what he does, the span of it, and availability.
- A statement about him, not about any single employer. It names four different
  domains and closes on the through-line. This is the one place the ink reveal runs.
- An index box listing five desks with a plain description and the employer beneath.
  On the real site each entry links to its sheet. This doubles as navigation and as
  proof of breadth.

The front page must not lead with drones. Drone work is one entry among five.

### A sheet

Each employer sheet carries: a kicker, a headline, a deck, one or more project
stories with body copy, figures with captions, a "built with" list, an "also here"
list, and a row of statistics.

Sheet length is the open risk. Each pinned sheet costs its own content height in
scroll distance before handing over. If one employer's content grows past roughly
two screens, split it into two sheets rather than one long one.

## Motion

The page uses pinned sections, also called sticky stacking. Each sheet sticks to
the top of the viewport. A spacer sized to that sheet's overflow follows it, so
while the reader scrolls through the spacer the sheet holds position and its own
content column translates upward by exactly its overflow. When the column bottoms
out, the spacer ends and the next sheet slides over the top.

### Effects kept

1. **Sheets pin, then hand over.** The primary structural device.
2. **Inner scroll** within a pinned sheet, so a sheet can be any height.
3. **Progress hairline** at the bottom edge of a pinned sheet. Required, because
   once a sheet is pinned the browser scrollbar no longer indicates position
   within the section.
4. **Running head** sticky in the left margin, carrying desk and employer.
5. **Paper tone shift** between sheets.
6. **Ink reveal**, word by word, on the front page statement only.

### Effects cut

- **Halftone resolve** on figures. It covers the diagram for over a second and
  draws attention away from the writing.
- **Rules drawing themselves.** A section-entrance animation in disguise.

### Fallbacks

- Below 821px, pinning is disabled and sheets return to normal flow. Mobile browser
  toolbars resize the viewport during scroll, which is where this pattern breaks.
- Under `prefers-reduced-motion`, pinning, translation, and the ink reveal are all
  disabled and the page renders as a plain scrolling document.

## Technical design

### Stack

Astro, static output, deployed to GitHub Pages by a GitHub Actions workflow.

Astro is chosen because the content is long and text-heavy, and Astro ships it as
static HTML with no JavaScript by default. The scroll engine is the only client
script, loaded as an island. This keeps first paint immediate for a recruiter on a
poor connection, and keeps the text crawlable.

### Content model

One Astro content collection per kind. Roughly twenty project files, one per
project, each with frontmatter carrying title, employer, period, whether it reached
production, discipline tags, stack, summary, highlight bullets, optional metrics,
and links. Smaller collections describe employers and disciplines.

A lens is a grouping function over the one project set. Chronology groups by
employer. Discipline groups by tag. Adding a project later is one new file.

### The discipline lens

Deferred, not cancelled. The front page index already names the five disciplines,
which delivers most of the value. A full toggle interacts awkwardly with pinned
sheets, since the two lenses imply different sheet sets. Revisit once the
chronology view is complete and the real content is in.

### Repository layout

```
src/
  content/
    projects/     one markdown file per project
    employers/    coditas, flytbase, algobulls-yun, iam
    disciplines/  automation, robotics, markets, vision, infrastructure
  components/     Sheet, Figure, Stats, Index, RunningHead
  scripts/        pin.ts, the scroll engine
  styles/         tokens.css
  pages/
    index.astro
.github/workflows/deploy.yml
```

The existing `index.html` is preserved in git history and kept building until the
replacement is approved.

## Figures

Figures are currently line diagrams drawn in SVG, in chart ink, with captions.

Open: the client will supply screenshots, architecture diagrams, and drone footage.
Until they arrive, every figure stays a drawn diagram. When they arrive, decide per
figure whether a real image beats a drawing. Drawn diagrams are likely to remain
better for architecture, and real images better for the Android app and the retail
heatmap.

## Content gaps

The current site carries fifteen unanswered questions about metrics, listed in its
own "Open TODOs" section. Those questions move into the `metrics` frontmatter of
the relevant project files and stay visible in development builds until answered.
They are the highest-value content work remaining.

## Quality floor

- Responsive to mobile, with pinning disabled there.
- Visible keyboard focus; the index entries are real links.
- `prefers-reduced-motion` respected.
- No layout shift once fonts load; the scroll engine recomputes on `fonts.ready`.
- Contrast checked for ink and magenta on all three paper tones.

## Out of scope

- A content management system or admin interface.
- A blog.
- Analytics.
- The discipline lens toggle, deferred as above.
