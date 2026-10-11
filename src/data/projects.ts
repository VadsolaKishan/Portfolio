export type Project = {
  title: string
  tech: string[]
  description: string
  liveUrl?: string
  githubUrl?: string
}

export const projects: Project[] = [
  {
    title: 'Hospital Management System',
    tech: ['Django', 'React', 'Neon PostgreSQL'],
    description:
      'Role-based dashboards, patient records, appointment workflows, and secure data access patterns.',
    liveUrl: 'https://hms-lemon-ten.vercel.app',
    githubUrl: 'https://github.com/VadsolaKishan/Hospital_Management_System',
  },
  {
    title: 'Matrix Calculator',
    tech: ['Flask + NumPy', 'HTML + Tailwind CSS', 'SQLite3'],
    description:
      'A web-based matrix computation tool powered by NumPy, supporting core matrix operations with a clean UI and efficient backend processing.',
    liveUrl: 'https://kishanvadsola.pythonanywhere.com/',
    githubUrl: 'https://github.com/VadsolaKishan/Matrix-Calculator-Pro',
  },
  {
    title: 'Tic Tac Toe',
    tech: ['HTML + CSS'],
    description:
      'An interactive browser-based game featuring dynamic state management and optimized win-condition logic using JavaScript.',
    liveUrl: 'https://vadsolakishan.github.io/Tic_Tac_Toe/',
    githubUrl: 'https://github.com/VadsolaKishan/Tic_Tac_Toe',
  },
]
