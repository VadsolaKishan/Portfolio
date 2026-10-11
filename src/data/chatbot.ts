export type ChatProfile = {
  name: string
  roleLine: string
  education: string
  resumeUrl: string
  contactEmail: string
  links: { label: string; url: string }[]
}

export const chatProfile: ChatProfile = {
  name: 'Kishan Vadsola',
  roleLine: 'B.Tech Computer Engineering Student · Full Stack + AI',
  education:
    'B.Tech Computer Engineering (ongoing). Focus on DSA, OS, DBMS, Computer Networks, Software Engineering, and Machine Learning.',
  resumeUrl: '/resume.pdf',
  contactEmail: 'vadsolakishan1310@gmail.com',
  links: [
    { label: 'GitHub', url: 'https://github.com/VadsolaKishan' },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/kishan-vadsola-a68b05331/',
    },
  ],
}
