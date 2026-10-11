import { motion } from 'framer-motion'
import { Projects } from '../components/Projects'
import { PageTransition } from '../components/PageTransition'

export function ProjectsPage() {
    return (
        <PageTransition id="projects">
            <div className="absolute inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.2)_1.5px,transparent_1.5px)] [background-size:36px_36px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_65%)]" />
                <div className="absolute top-1/3 left-1/4 w-[min(35rem,90vw)] h-[min(35rem,90vw)] bg-blue-600/10 rounded-full blur-[140px]" />
            </div>
            <div className="flex flex-col items-center justify-start w-full min-h-screen py-20 sm:py-24 px-4 relative z-10">
                <div className="max-w-6xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                            Projects
                        </h1>
                        <p className="text-blue-200 mt-4 tracking-[0.2em] uppercase text-sm font-semibold">
                            Real-World Solutions in Code
                        </p>
                    </motion.div>

                    <Projects />
                </div>
            </div>
        </PageTransition>
    )
}
