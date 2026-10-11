import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { FiSend, FiX } from 'react-icons/fi'
import { AiBrandLogo } from './AiBrandLogo'
import { chatProfile } from '../data/chatbot'
import { projects } from '../data/projects'
import { skills } from '../data/skills'
import { academicTimeline } from '../data/academic'

type Role = 'user' | 'bot'
type ChatMsg = { id: string; role: Role; text: string }

const LINKISH_RE =
  /(https?:\/\/[^\s]+|mailto:[^\s]+|\/[A-Za-z0-9._/-]+\.pdf\b|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)/gi
const TRAILING_PUNCT = new Set([',', '.', ')', ']', '}', ';', '!', '?', ':'])

function id() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

type BotAction = { scrollTo?: 'projects' | 'contact' | 'skills' | 'about' }
type BotReply = { text: string; action?: BotAction }

function norm(input: string) {
  return input
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9\s+_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasAny(text: string, words: string[]) {
  return words.some((w) => text.includes(w))
}

function formatLinks() {
  const lines = chatProfile.links.map((l) => `${l.label}: ${l.url}`)
  return lines.join('\n')
}

function splitTrailingPunct(raw: string) {
  let token = raw
  let trailing = ''

  while (token.length > 0) {
    const last = token[token.length - 1]
    if (!TRAILING_PUNCT.has(last)) break
    trailing = last + trailing
    token = token.slice(0, -1)
  }

  return { token, trailing }
}

function isExternalHref(href: string) {
  return href.startsWith('https://') || href.startsWith('http://')
}

function hrefForLink(token: string) {
  if (token.startsWith('https://') || token.startsWith('http://') || token.startsWith('mailto:')) return token
  if (token.includes('@') && !token.startsWith('/')) return `mailto:${token}`
  return token
}

function displayForLink(token: string) {
  let display = token

  if (display.startsWith('mailto:')) display = display.slice('mailto:'.length)
  if (display.startsWith('https://')) display = display.slice('https://'.length)
  else if (display.startsWith('http://')) display = display.slice('http://'.length)

  display = display.replace(/\?.*$/, '')
  display = display.replace(/#.*$/, '')
  display = display.replace(/\/$/, '')
  if (display.startsWith('/')) display = display.slice(1)

  const max = 48
  if (display.length > max) display = `${display.slice(0, max - 1)}…`
  return display
}

function linkifyLine(line: string, keyPrefix: string) {
  const out: Array<string | React.ReactNode> = []
  let lastIndex = 0

  for (const match of line.matchAll(LINKISH_RE)) {
    const index = match.index ?? 0
    const full = match[0]
    if (index > lastIndex) out.push(line.slice(lastIndex, index))

    const { token, trailing } = splitTrailingPunct(full)
    const href = hrefForLink(token)
    const display = displayForLink(token)

    out.push(
      <a
        key={`${keyPrefix}-${index}-${href}`}
        href={href}
        target={isExternalHref(href) || href.endsWith('.pdf') ? '_blank' : undefined}
        rel={isExternalHref(href) ? 'noreferrer' : undefined}
        className="break-all text-cyan-200 underline decoration-cyan-300/30 underline-offset-2 hover:decoration-cyan-300/70"
      >
        {display}
      </a>,
    )

    if (trailing) out.push(trailing)
    lastIndex = index + full.length
  }

  if (lastIndex < line.length) out.push(line.slice(lastIndex))
  return out
}

function renderMessageText(text: string, keyPrefix: string) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={`${keyPrefix}-l-${i}`}>
          {linkifyLine(line, `${keyPrefix}-${i}`)}
          {i < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </>
  )
}

function formatProjects() {
  return projects
    .map((p) => {
      const tech = p.tech.join(', ')
      const links = [
        p.liveUrl ? `Live: ${p.liveUrl}` : null,
        p.githubUrl ? `GitHub: ${p.githubUrl}` : null,
      ]
        .filter(Boolean)
        .join(' · ')
      return `• ${p.title} — ${tech}\n  ${p.description}${links ? `\n  ${links}` : ''}`
    })
    .join('\n\n')
}

function formatSkills() {
  const top = [...skills].sort((a, b) => b.level - a.level).slice(0, 7)
  const list = top.map((s) => `${s.name} (${s.level}%)`).join(', ')
  return `Top skills: ${list}.\nTip: open the Skills section to explore the orbit.`
}

function formatEducation() {
  const primary = academicTimeline[0]
  if (!primary) return chatProfile.education

  const details = primary.details.map((d) => `- ${d}`).join('\n')
  return `${primary.title} — ${primary.org} (${primary.timeframe})\n${details}`
}

function findProject(query: string) {
  const q = norm(query)
  if (!q) return null

  const direct = projects.find((p) => q.includes(norm(p.title)))
  if (direct) return direct

  const byToken = projects.find((p) => {
    const title = norm(p.title)
    return title.split(' ').some((token) => token.length >= 4 && q.includes(token))
  })
  return byToken ?? null
}

function answer(input: string): BotReply {
  const t = norm(input)

  if (!t) {
    return { text: 'Type a question like “projects”, “skills”, “resume link”, or “contact info”.' }
  }

  if (hasAny(t, ['hi', 'hello', 'hey', 'hii'])) {
    return {
      text:
        `Hi! I’m your portfolio assistant for ${chatProfile.name}.\n` +
        'Ask about projects, skills, education, resume, or contact info.',
    }
  }

  if (hasAny(t, ['resume', 'cv', 'download resume'])) {
    return {
      text: `Resume: ${chatProfile.resumeUrl}`,
    }
  }

  if (hasAny(t, ['education', 'college', 'university', 'b tech', 'btech', 'charusat'])) {
    return { text: formatEducation(), action: hasAny(t, ['show', 'go', 'scroll']) ? { scrollTo: 'about' } : undefined }
  }

  if (hasAny(t, ['skill', 'stack', 'tech', 'technology', 'tools'])) {
    return { text: formatSkills(), action: hasAny(t, ['show', 'go', 'scroll']) ? { scrollTo: 'skills' } : undefined }
  }

  if (hasAny(t, ['project', 'projects', 'work', 'portfolio'])) {
    const matched = findProject(t)
    if (matched) {
      const links = [
        matched.liveUrl ? `Live: ${matched.liveUrl}` : null,
        matched.githubUrl ? `GitHub: ${matched.githubUrl}` : null,
      ]
        .filter(Boolean)
        .join(' · ')

      return {
        text:
          `${matched.title}\n` +
          `Tech: ${matched.tech.join(', ')}\n` +
          `${matched.description}${links ? `\n${links}` : ''}`,
        action: hasAny(t, ['show', 'go', 'scroll']) || t.includes('show projects') ? { scrollTo: 'projects' } : undefined,
      }
    }

    return {
      text:
        'Here are the main projects in this portfolio:\n\n' +
        formatProjects() +
        '\n\nSay “show projects” to jump to the section.',
      action: t.includes('show projects') ? { scrollTo: 'projects' } : undefined,
    }
  }

  if (hasAny(t, ['contact', 'email', 'gmail', 'linkedin', 'github'])) {
    const jump = hasAny(t, ['show', 'go', 'scroll']) || t.includes('contact section')
    return {
      text:
        'Contact info\n' +
        `Email: ${chatProfile.contactEmail}\n` +
        formatLinks(),
      action: jump ? { scrollTo: 'contact' } : undefined,
    }
  }

  if (hasAny(t, ['intern', 'internship', 'experience'])) {
    return {
      text:
        'Currently focused on building full‑stack projects (React + backend) and practical AI experiments.\n' +
        'Open to internship opportunities where I can contribute quickly and learn fast.',
    }
  }

  if (hasAny(t, ['hire', 'why hire', 'candidate', 'why should', 'why we should'])) {
    return {
      text:
        'Strengths: strong CS fundamentals (DSA/OS/DBMS/CN), clean engineering habits, and polished UI.\n' +
        'I build end‑to‑end features: usable frontend + reliable backend thinking + practical iteration speed.',
    }
  }

  if (hasAny(t, ['help', 'what can you do', 'commands'])) {
    return {
      text:
        'Try asking:\n' +
        '- Projects (or a project name)\n' +
        '- Skills / tech stack\n' +
        '- Education\n' +
        '- Resume link\n' +
        '- Contact info',
    }
  }

  return {
    text:
      "I didn’t catch that. Ask about projects, skills, education, resume, or contact info — or type “help”.",
  }
}

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [isLauncherHovered, setIsLauncherHovered] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    {
      id: id(),
      role: 'bot',
      text: `Hi! I’m your portfolio assistant. Ask me anything about ${chatProfile.name}.`,
    },
  ])

  const quick = useMemo(
    () => [
      'Education',
      'Show projects',
      'Skills',
      'Resume link',
      'Internship details',
      'Why should we hire you?',
      'Contact info',
    ],
    [],
  )

  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages.length, open])

  // Isolate mouse wheel events so main page does not scroll while interacting with chat
  useEffect(() => {
    if (!open) return
    const el = listRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation()
      const isScrollable = el.scrollHeight > el.clientHeight
      if (!isScrollable) return

      const atTop = el.scrollTop <= 0 && e.deltaY < 0
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && e.deltaY > 0

      if (atTop || atBottom) {
        e.preventDefault()
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [open])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    setMessages((m) => [...m, { id: id(), role: 'user', text: trimmed }])
    setInput('')

    window.setTimeout(() => {
      const r = answer(trimmed)
      setMessages((m) => [...m, { id: id(), role: 'bot', text: r.text }])

      if (r.action?.scrollTo) {
        document.getElementById(r.action.scrollTo)?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 350)
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setIsLauncherHovered(true)}
        onMouseLeave={() => setIsLauncherHovered(false)}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex h-[66px] w-[66px] sm:h-[70px] sm:w-[70px] items-center justify-center rounded-full bg-black shadow-[0_12px_36px_rgba(0,0,0,0.95)] transition-all duration-300 cursor-pointer"
        aria-label="Open AI portfolio assistant"
      >
        {/* Ring 1 (Outer Round): Precision Bezel Ring, Rotates CLOCKWISE */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Base Outer Guide Track */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="rgba(0,240,255,0.22)"
              strokeWidth="1.2"
            />
          </svg>
          {/* Active Spinning Clockwise Segment */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: isLauncherHovered ? 2.5 : 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="outer-ring-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke="url(#outer-ring-cyan)"
                strokeWidth="2.2"
                strokeDasharray="95 55"
                strokeLinecap="round"
              />
              <circle cx="50" cy="3" r="2.2" fill="#FFFFFF" filter="drop-shadow(0 0 4px #00F0FF)" />
            </svg>
          </motion.div>
        </div>

        {/* Ring 2 (Inner Round): Concentric Counter-Bezel Ring, Rotates COUNTER-CLOCKWISE */}
        <div className="absolute inset-[4.5px] pointer-events-none">
          {/* Base Inner Guide Track */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgba(168,85,247,0.2)"
              strokeWidth="1"
            />
          </svg>
          {/* Active Spinning Counter-Clockwise Segment */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: isLauncherHovered ? 2.8 : 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="inner-ring-dual" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#C084FC" />
                  <stop offset="45%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="url(#inner-ring-dual)"
                strokeWidth="2"
                strokeDasharray="55 40 30 35"
                strokeLinecap="round"
              />
              <circle cx="50" cy="96" r="1.8" fill="#A5F3FC" filter="drop-shadow(0 0 3px #38BDF8)" />
            </svg>
          </motion.div>
        </div>

        {/* Solid Pure Black Core Disc */}
        <div className="relative z-10 flex h-[48px] w-[48px] sm:h-[52px] sm:w-[52px] items-center justify-center rounded-full bg-black shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]">
          <AiBrandLogo size={40} isHovered={isLauncherHovered} interactive={true} />
        </div>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed z-50 flex w-auto flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#06060a]/92 backdrop-blur-2xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9),0_0_30px_rgba(0,217,255,0.08)] left-3 right-3 bottom-3 top-20 sm:top-auto sm:left-auto sm:right-6 sm:bottom-6 sm:w-[min(420px,92vw)] sm:h-[min(640px,78svh)]"
            role="dialog"
            aria-label="AI Portfolio Assistant"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/[0.02]">
              <div className="flex items-center gap-3 min-w-0">
                {/* Miniature Dual-Ring Bezel Matching Launcher */}
                <div className="relative w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(0,217,255,0.25)]">
                  {/* Outer Clockwise Cyan Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                      <circle
                        cx="50"
                        cy="50"
                        r="47"
                        fill="none"
                        stroke="rgba(0,240,255,0.22)"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="47"
                        fill="none"
                        stroke="#00F0FF"
                        strokeWidth="2.4"
                        strokeDasharray="90 60"
                        strokeLinecap="round"
                      />
                      <circle cx="50" cy="3" r="2.2" fill="#FFFFFF" filter="drop-shadow(0 0 3px #00F0FF)" />
                    </svg>
                  </motion.div>
                  {/* Inner Counter-Clockwise Violet Ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-[3px] pointer-events-none"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="2"
                        strokeDasharray="50 45"
                        strokeLinecap="round"
                      />
                      <circle cx="50" cy="96" r="1.8" fill="#A5F3FC" filter="drop-shadow(0 0 3px #38BDF8)" />
                    </svg>
                  </motion.div>
                  {/* Solid Black Disc */}
                  <div className="relative z-10 w-[28px] h-[28px] rounded-full bg-black flex items-center justify-center">
                    <AiBrandLogo size={24} isHovered={false} interactive={false} />
                  </div>
                </div>

                {/* Header Text Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold tracking-wider text-cyan-300">
                      AI ASSISTANT
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                  <p
                    className="text-[11px] text-zinc-400 truncate max-w-[210px] sm:max-w-[270px] mt-0.5"
                    title={chatProfile.roleLine}
                  >
                    {chatProfile.roleLine}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/15 hover:text-white cursor-pointer flex-shrink-0 ml-2"
                aria-label="Close chatbot"
              >
                <FiX size={16} />
              </button>
            </div>

            <div
              ref={listRef}
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-3 sm:p-4 space-y-3"
            >
              <div className="grid gap-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={
                      'max-w-[94%] sm:max-w-[88%] rounded-2xl border px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ' +
                      (m.role === 'user'
                        ? 'ml-auto border-cyan-400/30 bg-cyan-950/30 text-white shadow-[0_0_15px_rgba(0,217,255,0.1)]'
                        : 'border-white/10 bg-white/5 text-zinc-200')
                    }
                  >
                    {renderMessageText(m.text, m.id)}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-white/5">
                {quick.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-cyan-500/10 hover:border-cyan-400/30 hover:text-cyan-200 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="flex items-center gap-2 border-t border-white/10 p-3 bg-white/[0.02]"
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about education, projects, skills…"
                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-cyan-400/50"
              />
              <button
                type="submit"
                className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-500/15 text-cyan-200 shadow-[0_0_20px_rgba(0,217,255,0.15)] transition hover:bg-cyan-500/25 hover:border-cyan-400/60 cursor-pointer"
                aria-label="Send"
              >
                <FiSend size={15} />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
