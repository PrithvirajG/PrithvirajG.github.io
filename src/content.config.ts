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
    tags: z.array(z.string()).optional(),
    url: z.string().url().optional(),
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
