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
