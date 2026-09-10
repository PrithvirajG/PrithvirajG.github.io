# PrithvirajG.github.io

This is the source for my personal portfolio site, published at
[prithvirajg.github.io](https://prithvirajg.github.io). It is built with
[Astro](https://astro.build) and deployed automatically by GitHub Actions.
(An earlier, hand-written single-file version of this site is still
available in git history, at commit `75994d7`, if you're curious.)

## Working on it

```
npm install
npm run dev      # preview at localhost, with live reload
npm test         # run the unit tests
npm run build    # produce the static site in dist/
```

## Where the content lives

This is the part you actually need to remember. Every piece of prose on the
site — employers, projects, education, courses, contests, blog posts — is a
markdown file under `src/content/`, one file per entry, one directory per
kind:

```
src/content/
  employers/
  projects/
  education/
  courses/
  contests/
  posts/
```

Adding a new entry (a job, a project, a course, a blog post) means adding a
markdown file to the right directory. No code changes are needed. The fields
each kind of entry supports — and which ones are required — are defined as
schemas in `src/content.config.ts`. Check that file before adding a new
entry, so you get the frontmatter right the first time.

`education/`, `courses/`, and `contests/` are currently empty. Their pages
are live and working, but until real files are added to those directories,
each one shows a visible placeholder row rather than pretending there's
nothing to add.

### Publishing a blog post

Create a markdown file in `src/content/posts/` with frontmatter for `title`,
`date`, and `summary`, and set `draft: true`. Draft posts render locally
(`npm run dev`) so you can review them, but are excluded from the production
build. When the post is ready, remove the `draft` flag (or set it to
`false`) and it will go out with the next deploy.

## How the site is structured

There are six routes, one per tab in the site's masthead strip (Front,
Projects, Education, Courses, Contests, Notebook). All six share a layout
that renders that masthead. Within a route, content is organized into
"sheets" that pin and scroll independently — each sheet manages its own
scrolling region. Individual blog post pages use a different, simpler
article layout that deliberately does not pin or scroll specially; they're
just a normal page.

## Deployment

Pushing to `main` triggers the workflow in `.github/workflows/deploy.yml`.
It installs dependencies, runs `npm test`, runs `npm run build`, and
publishes the resulting `dist/` to GitHub Pages. There's no manual deploy
step — if it's on `main`, it ships.
