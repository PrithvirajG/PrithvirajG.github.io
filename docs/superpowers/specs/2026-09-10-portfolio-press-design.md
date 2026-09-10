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

The site is a set of sections. A newspaper calls these sections; the reader sees
them as tabs in the masthead strip. Each section is a separate route with a real
URL, and each behaves internally exactly like the approved reading experience:
pinned sheets that scroll their own content and hand over to the next.

### Why routes and not client-side tabs

Client-side tabs were rejected. Real routes give shareable links, a working back
button, and a page each search engine can index. They also avoid forcing the pinned
sheet engine to tear down and recompute its geometry on every tab switch, which is
its most fragile moment.

### Sections

| Route | Tab | Contains |
|---|---|---|
| `/` | Work | Masthead, statement, section index, then one sheet per employer |
| `/projects` | Projects | Personal projects, each with its repository link |
| `/education` | Education | Degree, institution, years, result, and anything academic |
| `/courses` | Courses | Courses and certifications, with issuer and year |
| `/contests` | Contests | Hackathons and competitions, with placement and what was built |
| `/notebook` | Notebook | Blog index; each post links to its own article page |
| `/blog/<slug>` | — | One article. Not a tab, and not pinned. |

Contact is not a tab. It is the last sheet of every section and a link at the right
end of the masthead strip.

### The masthead strip

Persistent across every route. Carries the name set small on the left, the section
tabs in the middle, and contact on the right. The current section is marked by a
rule beneath it, not by colour alone. On the Work route the full masthead appears
below the strip at full size; elsewhere the strip alone stands in for it.

The strip is a list of real links. It works with JavaScript disabled and it is
reachable by keyboard.

### The Work landing

Carries the whole argument in one screen:

- Masthead: the name, set large, as the primary graphic element.
- A dateline strip: what he does, the span of it, and availability.
- A statement about him, not about any single employer. It names four different
  domains and closes on the through-line. This is the one place the ink reveal runs.
- An index listing every section with a plain description. It duplicates the tab
  strip deliberately, because a reader arriving at the top of the page reads before
  they navigate.

Employer sheets follow, chronological, most recent first.

| Sheet | Desk | Employer | Period |
|---|---|---|---|
| 0 | Front | — | — |
| 1 | Automation | Coditas | 2025 to present |
| 2 | Robotics | FlytBase | 2023 to 2025 |
| 3 | Markets | AlgoBulls and Yun Solutions | 2022 to 2023 |
| 4 | Vision | Integrated Active Monitoring | 2021 to 2022 |
| 5 | Back page | Contact | — |

The Work landing must not lead with drones. Drone work is one entry among many.

### Article pages

A blog post is long-form reading, and long-form reading and pinned sheets fight
each other. An article page therefore drops pinning entirely: the masthead strip,
a headline, a dateline, and one column of text in normal flow, at a measure under
eighty characters. It keeps the palette and the type, nothing else.

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

One Astro content collection per kind, and one markdown file per entry. Adding
anything later is one new file, never a code change.

| Collection | Entries | Feeds |
|---|---|---|
| `employers` | 4 | Work sheets |
| `projects` | ~20 | Work sheets and the Projects route |
| `education` | 1 to 3 | Education route |
| `courses` | as supplied | Courses route |
| `contests` | as supplied | Contests route |
| `posts` | grows over time | Notebook route and article pages |

Projects carry an optional `repo` and `demo` URL. On the Projects route the
repository link is prominent, since that is what a reader goes there for.

Posts carry a title, a date, a one-line summary, an optional list of tags, and a
`draft` flag. Drafts render in development and are excluded from the production
build, so a half-written post can live in the repository safely.

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
    employers/    coditas, flytbase, algobulls-yun, iam
    projects/     one markdown file per project
    education/    one file per qualification
    courses/      one file per course or certification
    contests/     one file per hackathon or competition
    posts/        one file per blog post
  components/     Sheet, Story, Figure, Stats, Masthead, SectionNav, EntryList
  layouts/        Section.astro (pinned), Article.astro (normal flow)
  lib/            grouping.ts
  scripts/        pin.ts, scroll.ts
  styles/         tokens.css
  pages/
    index.astro         Work
    projects.astro
    education.astro
    courses.astro
    contests.astro
    notebook.astro
    blog/[slug].astro   one article page per post
.github/workflows/deploy.yml
```

Two layouts, and only two. `Section.astro` carries the masthead strip and hosts
pinned sheets; every tab uses it. `Article.astro` carries the masthead strip and one
column of normal-flow text; only blog posts use it.

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
own "Open TODOs" section. Those questions move into the `openQuestions` frontmatter
of the relevant project files and stay visible in development builds until answered.
They are the highest-value content work remaining.

The new sections need content that does not exist anywhere yet. Until the owner
supplies it, each route ships with its structure in place and a single placeholder
entry that is obviously a placeholder, never invented detail.

- **Education:** degree, institution, years, and result. The current site states a
  B.Tech with a CGPA of 8.79 and nothing more.
- **Courses:** which courses and certifications to list, with issuer and year.
- **Contests:** which hackathons and competitions, what was built, and how each
  placed.
- **Projects:** repository URLs, and demo URLs where they exist. The current site
  names five personal projects and links to none of them.
- **Posts:** whether any blog post exists yet. If none does, the Notebook route
  ships with an empty state saying so plainly.

Nothing in these sections may be invented. An empty section is honest; a fabricated
certificate is not.

## Quality floor

- Responsive to mobile, with pinning disabled there.
- Visible keyboard focus; the index entries are real links.
- `prefers-reduced-motion` respected.
- No layout shift once fonts load; the scroll engine recomputes on `fonts.ready`.
- Contrast checked for ink and magenta on all three paper tones.

## Out of scope

- A content management system or admin interface. Posts are markdown files in the
  repository, written in an editor and published by pushing.
- Comments on blog posts.
- Tag or archive pages for the blog. The Notebook route lists every post; that is
  enough until there are enough posts for it not to be.
- Search.
- Analytics.
- The discipline lens toggle, deferred as above.
