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
