import { useEffect, useState } from 'react'

export function SiteStatusStrip() {
  const [visits, setVisits] = useState(0)

  useEffect(() => {
    const countedFlag = 'ss:visitCounted'

    const fetchStats = async () => {
      try {
        const shouldHit = sessionStorage.getItem(countedFlag) !== '1'
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        
        if (shouldHit) {
          await fetch(`${apiUrl}/api/visits`, { method: 'POST' })
          sessionStorage.setItem(countedFlag, '1')
        }

        const res = await fetch(`${apiUrl}/api/stats`)
        if (res.ok) {
          const data = await res.json()
          setVisits(data.visits)
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }

    void fetchStats()
  }, [])

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md shadow-lg">
          <div className="px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <p className="text-sm sm:text-base font-bold tracking-tight text-white">
                  &copy; {new Date().getFullYear()} KISHAN VADSOLA
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold tracking-[0.22em] uppercase text-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.35)]" />
                  Online
                </div>
              </div>

              <div className="flex gap-2 sm:justify-end">
                <div className="flex flex-col justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 min-w-[5rem]">
                  <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-slate-400">Visits</p>
                  <p className="text-sm font-black text-cyan-200">{visits.toLocaleString()}</p>
                </div>
                <div className="flex flex-col justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 min-w-[10rem]">
                  <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-slate-400">Built with</p>
                  <p className="text-sm font-extrabold text-slate-100">
                    React <span className="text-slate-500">+</span> Vite <span className="text-slate-500">+</span> Tailwind
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
