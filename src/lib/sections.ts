export interface Section { href: string; tab: string; description: string }

export const SECTIONS: Section[] = [
  { href: '/', tab: 'Work', description: 'Four years of production systems, most recent first.' },
  { href: '/projects', tab: 'Projects', description: 'Things built outside work hours, with their repositories.' },
  { href: '/education', tab: 'Education', description: 'Degree and the institution behind it.' },
  { href: '/courses', tab: 'Courses', description: 'Structured study taken alongside the work.' },
  { href: '/contests', tab: 'Contests', description: 'Hackathons and competitions, and what came out of them.' },
  { href: '/notebook', tab: 'Notebook', description: 'Occasional writing about systems that had to stay up.' },
];
