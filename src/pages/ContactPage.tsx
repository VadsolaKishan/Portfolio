import { motion } from 'framer-motion'
import { Contact } from '../components/Contact'
import { PageTransition } from '../components/PageTransition'
import { SiteStatusStrip } from '../components/SiteStatusStrip'

export function ContactPage() {
    return (
        <PageTransition id="contact">
            <div className="absolute inset-0 -z-10 bg-transparent overflow-hidden">
                <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.22)_2px,transparent_2px)] [background-size:40px_40px] pointer-events-none" />
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0wLDBMNCwgME0wLDFMNCwgMU0wLDJMNCwgMk0wLDNMNCwgMyIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_60%)]" />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px]"
                />
            </div>
            <div className="flex flex-col items-center justify-start w-full min-h-screen py-20 sm:py-24 px-4 relative z-10">
                <div className="max-w-6xl w-full flex flex-col gap-10">
                    <Contact />
                    <SiteStatusStrip />
                </div>
            </div>
        </PageTransition>
    )
}
