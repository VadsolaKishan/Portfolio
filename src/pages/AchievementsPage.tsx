import { motion } from 'framer-motion'
import { FiAward, FiCloud, FiCode, FiBriefcase } from 'react-icons/fi'
import { PageTransition } from '../components/PageTransition'
import { ResumeCard } from '../components/ResumeCard'
import { TiltCard } from '../components/TiltCard'

const achievements = [
  {
    title: 'Smart India Hackathon',
    subtitle: 'National Level Hackathon Finalist',
    description:
      'Selected among the top nationwide engineering teams for solving real-world challenges with innovative software solutions.',
    icon: FiAward,
    accent: 'amber',
    tag: 'Finalist 2024',
    metric: 'National Top',
  },
  {
    title: '500+ LeetCode Milestone',
    subtitle: 'Algorithmic Problem Solving',
    description:
      'Solved 500+ problems across Graphs, Dynamic Programming, Binary Trees, and Data Structures with optimal time complexity.',
    icon: FiCode,
    accent: 'cyan',
    tag: '500+ Solved',
    metric: 'DSA Specialist',
  },
  {
    title: 'Google Cloud Ready',
    subtitle: 'Cloud Infrastructure & IAM',
    description:
      'Completed comprehensive hands-on labs on Google Cloud Platform covering compute engines, cloud storage, networking, and security.',
    icon: FiCloud,
    accent: 'sky',
    tag: 'Certified Track',
    metric: 'Cloud Ready',
  },
  {
    title: 'Software Eng Experience',
    subtitle: 'Production App Engineering',
    description:
      'Hands-on experience developing full-stack applications with React, Django REST Framework, and secure database management.',
    icon: FiBriefcase,
    accent: 'purple',
    tag: 'Hands-on',
    metric: 'Full-Stack',
  },
]

export function AchievementsPage() {
  return (
    <PageTransition id="achievements">
      <div className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-12 z-10">
        <div className="max-w-7xl w-full mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-950/30 text-emerald-300 text-xs font-mono font-semibold uppercase tracking-widest mb-4"
            >
              <span>Milestones &bull; Recognitions &bull; Stats</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6"
            >
              Cyber{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Milestones
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
            >
              Demonstrated dedication through national hackathons, rigorous algorithmic milestones,
              and continuous engineering skill validation.
            </motion.p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {achievements.map((acc, i) => (
              <motion.div
                key={acc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full"
              >
                <TiltCard className="h-full">
                  <div className="h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-emerald-500/40 hover:bg-white/[0.04] hover:shadow-[0_0_35px_rgba(16,185,129,0.15)] group">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-400 group-hover:scale-110 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 transition-all duration-300">
                          <acc.icon size={22} />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-zinc-300">
                          {acc.tag}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
                        {acc.title}
                      </h3>
                      <p className="text-xs font-mono text-emerald-400/90 font-medium mb-3">
                        {acc.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {acc.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500">Highlight</span>
                      <span className="text-cyan-300 font-bold">{acc.metric}</span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* Resume Vault Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <ResumeCard />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
