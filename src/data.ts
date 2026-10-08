// Dados que não mudam de idioma. Os textos (títulos, descrições, parágrafos) ficam em src/i18n.ts.

export const profile = {
  name: 'Gabriel Renan',
  email: 'Gabrielgr12343@gmail.com',
  phone: '(13) 98185-0110',
  whatsapp: 'https://wa.me/5513981850110',
  linkedin: 'https://www.linkedin.com/in/', // TODO: coloque o seu link
  github: 'https://github.com/', // TODO: coloque o seu link
  cv: '/Gabriel-Renan-CV.pdf', // TODO: coloque o arquivo em /public
};

export const exploring = ['Node.js', 'Astro', 'Tailwind CSS'];

export type Project = {
  tags: string[];
  href?: string;
  repo?: string;
  /** Mostra o selo "Em andamento". */
  inProgress?: boolean;
  /** Capa opcional (ex.: '/img/projects/portfolio.webp'); sem ela, usa uma paisagem pintada. */
  image?: string;
};

// O título e a descrição de cada projeto estão em src/i18n.ts: project.<posição>.title e project.<posição>.desc.
export const projects: Project[] = [
  { tags: ['Astro', 'React', 'TypeScript', 'Tailwind'], repo: 'https://github.com/' },
  { tags: ['JavaScript', 'HTML', 'CSS'], inProgress: true },
  { tags: ['React', 'Node.js'], inProgress: true },
];
