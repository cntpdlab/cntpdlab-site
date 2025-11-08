"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import CSSCover from "@/components/CSSCover"
import { useI18n } from "@/hooks/use-i18n"
import { ArrowUpRight, Mail, Zap, Code2, Rocket, Users } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

const primaryButtonClasses =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black shadow-[0_8px_30px_rgba(16,185,129,.35)] transition-smooth hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
const ghostButtonClasses =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-smooth hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
const easeOutBezier = [0.16, 1, 0.3, 1] as const

const SpiderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="11" r="3.5" />
    <path d="M12 14.5v5" />
    <path d="M9 5l3 3 3-3" />
    <path d="M6 10l3 1-4 2" />
    <path d="M18 10l-3 1 4 2" />
    <path d="M5 15l4-1-3 5" />
    <path d="M19 15l-4-1 3 5" />
  </svg>
)

const useFadeIn = (stagger = 0.08) => {
  const prefersReducedMotion = useReducedMotion()
  return useMemo(
    () =>
      ({
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
        visible: (index = 0) => ({
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: prefersReducedMotion ? undefined : easeOutBezier,
            delay: prefersReducedMotion ? 0 : index * stagger,
          },
        }),
      }),
    [prefersReducedMotion, stagger]
  )
}

const Header = () => {
  const fadeIn = useFadeIn()
  const { t, lang, setLang } = useI18n()
  const languages: { code: "en" | "ua"; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "ua", label: "UA" },
  ]

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_10px_40px_rgba(0,0,0,.35)] backdrop-blur-md transition-smooth md:grid md:grid-cols-[1fr_auto_auto] md:items-center md:gap-6 md:px-6"
    >
      <div className="flex items-center gap-3 text-sm font-medium tracking-wide text-white">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500 text-base font-semibold text-black shadow-[0_6px_20px_rgba(16,185,129,.35)]">
          <SpiderIcon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-white">CntpdLab</span>
          <span className="text-xs text-white/60">Premium Full-Stack Studio</span>
        </div>
      </div>

      <nav className="hidden items-center gap-6 text-sm text-white/60 md:flex">
        <a
          href="#projects"
          className="transition-smooth hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
        >
          {t("nav.work")}
        </a>
        <a
          href="#expertise"
          className="transition-smooth hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
        >
          {t("nav.expertise")}
        </a>
        <a
          href="#contact"
          className="transition-smooth hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
        >
          {t("nav.contact")}
        </a>
      </nav>

      <div className="flex flex-wrap items-center gap-2">
        <a
          href="mailto:cntpdlab@gmail.com"
          className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-smooth hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 md:inline-flex"
        >
          cntpdlab@gmail.com
        </a>
        <a
          href="https://t.me/cntpdlab"
          className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black transition-smooth hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          target="_blank"
          rel="noreferrer"
        >
          @cntpdlab
          <ArrowUpRight className="h-3 w-3" />
        </a>
        <div className="flex items-center gap-1">
          {languages.map((language) => {
            const isActive = lang === language.code
            return (
              <button
                key={language.code}
                type="button"
                onClick={() => setLang(language.code)}
                aria-pressed={isActive}
                className={`inline-flex min-h-[40px] items-center justify-center rounded-xl px-3 py-1 text-sm font-medium text-white transition-smooth hover:bg-white/5 active:bg-white/10 ring-1 ring-white/10 ${
                  isActive ? "bg-white/10" : ""
                }`}
              >
                {language.label}
              </button>
            )
          })}
        </div>
      </div>
    </motion.header>
  )
}

const HeroSection = () => {
  const fadeIn = useFadeIn()
  const [showCopyToast, setShowCopyToast] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    if (!showCopyToast) return

    const timer = window.setTimeout(() => setShowCopyToast(false), 2000)
    return () => window.clearTimeout(timer)
  }, [showCopyToast])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("cntpdlab@gmail.com")
      setShowCopyToast(true)
      return
    } catch {
      try {
        const textarea = document.createElement("textarea")
        textarea.value = "cntpdlab@gmail.com"
        textarea.setAttribute("readonly", "")
        textarea.style.position = "absolute"
        textarea.style.left = "-9999px"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
        setShowCopyToast(true)
      } catch {
        setShowCopyToast(false)
      }
    }
  }

  return (
    <section className="relative scroll-mt-24">
      <div className="container relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-24 text-center text-white/70 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
        <Header />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex max-w-[900px] flex-col items-center text-white"
        >
          <motion.div
            variants={fadeIn}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" aria-hidden="true" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {t("badge.status")}
          </motion.div>

          <motion.h1
            variants={fadeIn}
            custom={1}
            className="text-balance max-w-[20ch] break-words text-4xl font-extrabold leading-tight tracking-tight text-white hyphens-auto sm:text-5xl md:max-w-[14ch] md:text-6xl lg:text-7xl"
          >
            <span className="block">{t("hero.headlineLine1")}</span>
            <span className="block">{t("hero.headlineLine2")}</span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            custom={2}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            variants={fadeIn}
            custom={3}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 text-white/80 sm:gap-4"
          >
            <a href="#projects" className={primaryButtonClasses} aria-label={t("hero.ctaPrimary")}>
              {t("hero.ctaPrimary")}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <div className="relative">
              <a
                href="mailto:cntpdlab@gmail.com"
                onClick={handleCopyEmail}
                aria-label="Send email or copy address"
                className={ghostButtonClasses}
                title="Send email or copy address"
              >
                <Mail className="h-4 w-4" />
                {t("hero.ctaSecondary")}
              </a>
              {showCopyToast && (
                <span
                  role="status"
                  aria-live="polite"
                  className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 shadow-[0_6px_20px_rgba(0,0,0,.3)] backdrop-blur-sm"
                >
                  Email copied to clipboard 📋
                </span>
              )}
            </div>
            <a
              href="https://t.me/cntpdlab"
              className="text-sm font-medium text-white/70 underline-offset-4 transition-smooth hover:text-white hover:underline"
              target="_blank"
              rel="noreferrer"
              title="Open Telegram chat"
            >
              {t("hero.ctaTelegram")}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const ExpertiseSection = () => {
  const fadeIn = useFadeIn()
  const skills = [
    { icon: Code2, title: "Premium Frontends", description: "Next.js apps with TypeScript, Tailwind, and design systems that scale." },
    { icon: Rocket, title: "Product Backends", description: "Python, FastAPI, PostgreSQL, and clean architectures for MVP to scale." },
    { icon: Zap, title: "Operational Speed", description: "Perf budgets, SEO, and Core Web Vitals dialed in from day one." },
    { icon: Users, title: "Automation & Integrations", description: "Telegram bots, third-party APIs, and CRM workflows that save hours." },
  ]

  return (
    <section id="expertise" className="relative scroll-mt-24 py-12 text-white/70 sm:py-16 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <motion.h2 variants={fadeIn} custom={0} className="text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            What CntpdLab Delivers
          </motion.h2>
          <motion.p variants={fadeIn} custom={1} className="mt-4 text-lg text-white/70">
            Full-stack craftsmanship across product strategy, engineering, and automation so your roadmap hits market faster.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {skills.map((skill, index) => {
            const Icon = skill.icon
            return (
              <motion.article
                key={skill.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                custom={index}
                className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70 shadow-[0_10px_40px_rgba(0,0,0,.35)] backdrop-blur-md transition-smooth hover:border-emerald-400/40 hover:bg-white/10"
              >
                <span className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-300">
                  <Icon className="h-5 w-5 text-emerald-300" />
                  {skill.title}
                </span>
                <p className="text-sm text-white/70">{skill.description}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

type Sample = {
  title: string
  desc: string
  tags: string[]
  outline: string[]
  imageSrc?: string
  imageAlt?: string
  private?: boolean
}

const samples: Sample[] = [
  {
    title: "Growth CRM Dashboard",
    desc: "Realtime analytics, permissions, and automations for a SaaS sales team.",
    tags: ["Next.js", "PostgreSQL", "Shadcn"],
    outline: [
      "Role-based dashboards; 12 KPIs",
      "Lead pipeline sync with CRM",
      "CSV import + audit log",
      "Perf budget: <200ms TTFB (ISR)",
      "Vercel deploy; protected routes",
    ],
    imageSrc: "/projects/crm.jpg",
    imageAlt: "Analytics dashboard",
    private: true,
  },
  {
    title: "Telegram Automation Suite",
    desc: "Bots coordinating ops, notifications, and payments for a logistics network.",
    tags: ["Python", "Redis", "Telegram API"],
    outline: [
      "DM/order bot with commands",
      "Inline payments + receipts",
      "Ops notifications + retries",
      "Idempotency & rate limits",
      "Metrics & alerts",
    ],
    imageSrc: "/projects/tg-suite.jpg",
    imageAlt: "Telegram operations",
    private: true,
  },
  // ⬇️ REPLACED CARD — Certilogo-like verifier
  {
    title: "Product Authenticity Verifier (Certilogo-style)",
    desc: "Client-side verifier built with JS/HTML/CSS: QR scan, code validation, and anti-fraud checks.",
    tags: ["JavaScript", "HTML", "CSS", "QR Scanner"],
    outline: [
      "QR scanner (getUserMedia) + fallback manual entry",
      "Checksum & pattern rules (Luhn/custom) on the client",
      "Offline-ready cache for rule sets",
      "Anti-replay: one-time token ping to API (optional)",
      "Clean UI, mobile-first; works in WebView",
    ],
    imageSrc: "/projects/verifier.jpg",
    imageAlt: "Verifier UI",
    private: false,
  },
  {
    title: "E-commerce Telegram Suite",
    desc: "End-to-end Telegram shop with CRM sync, payments, and an automation bot.",
    tags: ["Next.js", "React", "CRM API", "Telegram Bot API"],
    outline: [
      "Dynamic catalog + inline payments",
      "CRM (KeyCRM/REST) order sync",
      "Auto status updates via bot",
      "Admin dashboard for products",
      "Webhook-based JSON API backend",
    ],
    imageSrc: "/projects/ops.jpg",
    imageAlt: "Telegram commerce",
    private: true,
  },
]

const recentMVPs = [
  {
    title: "CRM Integration for Retail Team",
    description: "Automating pipeline sync with KeyCRM and Telegram notifications.",
  },
  {
    title: "Telegram Shop MVP",
    description: "Built and launched in 3 weeks — payments, inventory, and lead capture.",
  },
  {
    title: "Web Portal for Apple Device Store",
    description: "Product catalog, CMS, and landing engine.",
  },
]

const ProjectsSection = () => {
  const fadeIn = useFadeIn()
  const prefersReducedMotion = useReducedMotion()
  const [activeOutline, setActiveOutline] = useState<Sample | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const { t } = useI18n()

  const coverKind = (title: string): "crm" | "tg" | "ops" | "verify" => {
    const t = title.toLowerCase()
    if (t.includes("crm")) return "crm"
    if (t.includes("verifier")) return "verify"
    if (t.includes("automation")) return "tg"
    return "ops"
  }

  const gridVariants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: prefersReducedMotion ? 0 : 0.08,
        },
      },
    }),
    [prefersReducedMotion]
  )

  const cardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion ? 0.001 : 0.5,
          ease: prefersReducedMotion ? undefined : easeOutBezier,
        },
      },
    }),
    [prefersReducedMotion]
  )

  useEffect(() => {
    if (!activeOutline) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveOutline(null)
      }
    }

    const focusTimeout = window.setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 0)

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.clearTimeout(focusTimeout)
    }
  }, [activeOutline])

  const handleRequestSimilar = () => {
    const contact = document.querySelector<HTMLElement>("#contact")
    contact?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" })
  }

  return (
    <section id="projects" className="relative scroll-mt-24 py-12 text-white/70 sm:py-16 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <motion.h2 variants={fadeIn} custom={0} className="text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            {t("projects.title")}
          </motion.h2>
          <motion.p variants={fadeIn} custom={1} className="mt-4 text-lg text-white/70">
            {t("projects.subtitle")}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2"
        >
          {samples.map((sample) => (
            <motion.article
              key={sample.title}
              variants={cardVariants}
              className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 text-white/70 shadow-[0_10px_40px_rgba(0,0,0,.35)] backdrop-blur-md transition-all duration-300 will-change-transform hover:border-white/20 hover:bg-white/10 hover:shadow-[0_10px_40px_rgba(0,0,0,.35)] hover:scale-[1.02] sm:p-6"
            >
              {sample.private && (
                <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[11px] tracking-wide text-white/70 backdrop-blur-sm sm:text-xs">
                  PRIVATE
                </span>
              )}

              <CSSCover kind={coverKind(sample.title)} className="mb-5 w-full" />

              <div className="flex flex-1 flex-col">
                <h3 className="text-lg font-semibold text-white sm:text-xl">{sample.title}</h3>
                <p className="mt-3 text-sm text-white/70 sm:text-base">{sample.desc}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {sample.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleRequestSimilar}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400 sm:w-auto"
                      aria-label={t("projects.ctaRequest")}
                      title={t("projects.ctaRequest")}
                    >
                      {t("projects.ctaRequest")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveOutline(sample)}
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 sm:w-auto"
                      aria-label={t("projects.ctaOutline")}
                      title={t("projects.ctaOutline")}
                    >
                      {t("projects.ctaOutline")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {activeOutline && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeOutline.title} outline`}
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveOutline(null)
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h3 className="text-lg font-semibold text-white">{activeOutline.title}</h3>
            <ul className="mt-3 space-y-2 list-disc pl-5 text-sm text-white/70">
              {activeOutline.outline.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setActiveOutline(null)}
                className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

const RecentMVPsSection = () => {
  const prefersReducedMotion = useReducedMotion()

  const fadeUpVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion ? 0.001 : 0.5,
          ease: easeOutBezier,
        },
      },
    }),
    [prefersReducedMotion]
  )

  const staggerVariants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: prefersReducedMotion ? 0 : 0.08,
        },
      },
    }),
    [prefersReducedMotion]
  )

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative py-12 sm:py-16 lg:py-24"
      variants={staggerVariants}
    >
      <motion.div variants={staggerVariants} className="mx-auto max-w-5xl px-4 text-center">
        <motion.div variants={staggerVariants} className="mx-auto max-w-3xl">
          <motion.h2 variants={fadeUpVariants} className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Recent MVPs (Private)
          </motion.h2>
          <motion.p
            variants={fadeUpVariants}
            className="mb-12 max-w-2xl mx-auto text-sm text-white/60 sm:text-base"
          >
            Examples of projects we’ve shipped recently — anonymized, but real.
          </motion.p>
        </motion.div>

        <motion.div variants={staggerVariants} className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          {recentMVPs.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUpVariants}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 will-change-transform hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 hover:shadow-[0_10px_40px_rgba(0,0,0,.35)]"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

// QA checklist:
// - GET /api/lead returns 405 JSON in prod.
// - /api/tg-test (with key if set) returns { ok: true } in prod.
// - Form submit in prod triggers green toast and Telegram message.
// - Validation or rate-limit errors show explicit red toasts (no “Failed to fetch”).
const ContactSection = () => {
  const fadeIn = useFadeIn()
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; msg: string }>(
    { show: false, type: "success", msg: "" }
  )
  const { t } = useI18n()

  useEffect(() => {
    if (!toast.show) return
    const timeout = window.setTimeout(() => {
      setToast((state) => ({ ...state, show: false }))
    }, 4000)
    return () => window.clearTimeout(timeout)
  }, [toast.show])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const notes = String(formData.get("notes") ?? "").trim()
    const honeypot = String(formData.get("extra_field") ?? "")

    if (honeypot) {
      return
    }

    if (name.length < 1) {
      setToast({ show: true, type: "error", msg: t("contact.toast.invalid") })
      const firstField = form.elements.namedItem("name") as HTMLElement | null
      firstField?.focus()
      return
    }

    if (notes.length < 10) {
      setToast({ show: true, type: "error", msg: t("contact.toast.notes") })
      const notesField = form.elements.namedItem("notes") as HTMLElement | null
      notesField?.focus()
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          notes,
          company: honeypot,
        }),
      })

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        issues?: { fieldErrors?: Record<string, string[]> }
      }

      if (!response.ok || result?.ok !== true) {
        const validationMessage =
          result?.error === "validation"
            ? "Please check the fields (email can be blank)."
            : undefined

        throw new Error(validationMessage || result?.error || `HTTP ${response.status}`)
      }

      setToast({ show: true, type: "success", msg: t("contact.toast.success") })
      form.reset()
      const firstField = form.elements.namedItem("name") as HTMLElement | null
      firstField?.focus()
    } catch (error) {
      console.error(error)
      const message = error instanceof Error ? error.message : t("contact.toast.error")
      setToast({ show: true, type: "error", msg: message })
      const firstField = form.elements.namedItem("name") as HTMLElement | null
      firstField?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="relative scroll-mt-24 py-12 text-white/70 sm:py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeIn}
          className="rounded-3xl border border-white/10 bg-white/5 p-10 text-white/70 shadow-[0_10px_40px_rgba(0,0,0,.35)] backdrop-blur-md"
        >
          <motion.div variants={fadeIn} custom={0} className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t("contact.title")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-white/70">
              {t("contact.subtitle")}
            </p>
            <p className="mx-auto mt-2 max-w-xl text-base leading-relaxed text-white/70">
              {t("contact.subtitleSecondary")} {" "}
              <a
                href="https://t.me/cntpdlab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 underline-offset-4 hover:underline"
              >
                @cntpdlab
              </a>
              .
            </p>
          </motion.div>

          <form
            onSubmit={handleSubmit}
            action="/api/lead"
            method="POST"
            className="mt-6 space-y-4 sm:mt-8"
            aria-label="CntpdLab project inquiry form"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <label className="flex flex-1 flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{t("contact.name")}</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Founder's name"
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white placeholder-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                  required
                />
              </label>
              <label className="flex flex-1 flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{t("contact.email")}</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@startup.com"
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white placeholder-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                />
                <span className="text-xs text-white/40">Email optional</span>
              </label>
            </div>

            <input
              type="text"
              name="extra_field"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] top-auto h-0 w-0 opacity-0 pointer-events-none"
              aria-hidden="true"
            />

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{t("contact.notes")}</span>
              <textarea
                name="notes"
                placeholder="Roadmap, timelines, budget—whatever helps us align fast."
                className="min-h-[160px] rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white placeholder-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60 sm:text-sm">
                <p className="font-semibold text-white">{t("contact.needFasterTitle")}</p>
                <p>
                  {t("contact.needFasterCopy")}{" "}
                  <a href="https://t.me/cntpdlab" className="text-emerald-300 hover:underline">
                    @cntpdlab
                  </a>
                  .
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className={`${primaryButtonClasses} w-full justify-center text-base disabled:cursor-not-allowed disabled:opacity-60 min-h-[44px]`}
              >
                {isLoading ? t("contact.sending") : t("contact.submit")}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      {toast.show && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-4 py-3 text-sm shadow-[0_10px_40px_rgba(0,0,0,.4)] ${
            toast.type === "success" ? "bg-emerald-500 text-black" : "bg-red-500 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </section>
  )
}

const FooterSection = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/10 py-10 text-white/70">
      <div className="container mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center md:px-6">
        <div>
          <p className="text-lg font-semibold text-white">CntpdLab</p>
          <p className="mt-1 text-sm text-white/60">Building software velocity for founders and product teams.</p>
        </div>
        <p className="mt-8 text-center text-sm text-white/50 whitespace-nowrap">
          CntpdLab — boutique full-stack studio building fast MVPs and automation for founders and product teams.
        </p>
        <p className="text-sm text-white/50">
          © {year} CntpdLab ·
          <a href="mailto:cntpdlab@gmail.com" className="mx-1 text-white/70 transition-smooth hover:text-white">
            cntpdlab@gmail.com
          </a>
          ·
          <a href="https://t.me/cntpdlab" target="_blank" rel="noreferrer" className="ml-1 text-white/70 transition-smooth hover:text-white">
            @cntpdlab
          </a>
        </p>
        <p className="text-xs text-white/50 text-center mt-8">
          © {new Date().getFullYear()} CntpdLab · Full-stack delivery on Next.js + Node · Deployed on Vercel
        </p>
      </div>
    </footer>
  )
}

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden">
      <HeroSection />
      <ExpertiseSection />
      <ProjectsSection />
      <ContactSection />
      <RecentMVPsSection />
      <FooterSection />
    </main>
  )
}
