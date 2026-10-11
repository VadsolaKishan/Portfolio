import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { academicTimeline } from '../data/academic'
import { PageTransition } from '../components/PageTransition'
import { useRef } from 'react'

export function About() {
    const timelineRef = useRef<HTMLDivElement>(null)
    const reducedMotion = useReducedMotion()
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ['start 0.85', 'end 0.25'],
    })
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.25 })

    return (
        <PageTransition id="about">
            <div className="absolute inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.2)_1.5px,transparent_1.5px)] [background-size:36px_36px]" />
                <div className="absolute -top-24 left-1/2 h-[min(30rem,90vw)] w-[min(30rem,90vw)] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
                <div className="absolute -bottom-40 left-1/4 h-[min(32rem,92vw)] w-[min(32rem,92vw)] rounded-full bg-blue-500/10 blur-[160px]" />
            </div>
            <div className="flex flex-col items-center justify-center w-full min-h-screen py-20 sm:py-24 px-4 relative z-10">
                <div className="max-w-5xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-14"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                            About
                        </h1>
                        <p className="text-slate-200/80 mt-4 tracking-[0.22em] uppercase text-xs font-semibold">
                            Profile · Focus · Academics
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="mx-auto max-w-3xl text-center mb-16"
                    >
                        <p className="text-sm md:text-base leading-relaxed text-slate-200/85">
                            Computer Engineering student building clean, reliable products with strong fundamentals in DSA, OS, DBMS, and
                            Computer Networks.
                        </p>
                        <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-200/85">
                            Focus: full‑stack development, practical AI experiments, and professional UI polish with subtle motion.
                        </p>
                    </motion.div>

                    <div ref={timelineRef} className="relative isolate grid gap-8">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute top-0 bottom-0 left-5 sm:left-1/2 w-px -translate-x-1/2 bg-black z-0"
                        />
                        <motion.div
                            aria-hidden="true"
                            className="pointer-events-none absolute top-0 bottom-0 left-5 sm:left-1/2 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-cyan-300 via-blue-400 to-fuchsia-500 z-0"
                            style={{ scaleY: reducedMotion ? 1 : progress }}
                        />
                        {academicTimeline.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 26 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className={`relative flex flex-col sm:flex-row items-center ${index % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'}`}
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-5 sm:left-1/2 top-8 -translate-x-1/2 flex h-5 w-5 items-center justify-center z-20"
                                >
                                    <span className="absolute inset-0 rounded-full border border-cyan-300/40 bg-black/40 backdrop-blur" />
                                    <span className="h-2 w-2 rounded-full bg-cyan-300" />
                                </span>
                                <div className={`relative z-10 w-[calc(100%-3rem)] sm:w-5/12 ml-12 sm:ml-0 ${index % 2 === 0 ? 'sm:pr-12' : 'sm:pl-12'}`}>
                                    <div className="rounded-2xl border border-white/10 bg-black/70 sm:bg-black/40 p-6 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.35)]">
                                        <p className="text-[11px] font-bold tracking-[0.22em] text-cyan-300/90 mb-2 uppercase">
                                            {item.timeframe}
                                        </p>
                                        <h3 className="text-xl font-bold text-white mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm font-medium text-slate-200/85 mb-4">{item.org}</p>
                                        <ul className="flex flex-wrap gap-2 text-xs font-semibold text-slate-200/80">
                                            {item.details.map((d) => (
                                                <li key={d} className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-slate-100/90">
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
