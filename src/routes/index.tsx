import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { CarouselApi } from '#/components/ui/carousel'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '#/components/ui/carousel'
import { getAllPosts } from '#/lib/blog'

type PortfolioData = {
  title: string
  title_ar: string
  name: string
  name_ar: string
  intro: string
  intro_ar: string
  about: string
  about_ar: string
  hero_image: string
  avatar_image: string
}

type SocialLink = {
  label: string
  label_ar?: string
  href: string
}

type DataJsonSocialItem = {
  label: string
  label_ar?: string
  url: string
  icon?: string
}

type DataJsonCta = {
  label?: string
  label_ar?: string
  href?: string
}

type CtaData = {
  label: string
  label_ar?: string
  href: string
}

type DataJsonContent = {
  site?: {
    copyrightName?: string
  }
  social?: DataJsonSocialItem[]
  hero?: {
    greeting?: string
    greeting_ar?: string
    name?: string
    name_ar?: string
    intro?: string
    intro_ar?: string
    avatar?: string
    hero?: string
    heroImage?: string
    roles?: string[]
    primaryCta?: DataJsonCta
    secondaryCta?: DataJsonCta
  }
  about?: {
    description?: string
    description_ar?: string
    image?: string
  }
  projects?: Array<{
    title?: string
    title_ar?: string
    description?: string
    description_ar?: string
    tags?: string[]
    image?: string
    href?: string
    demo?: string
    repo?: string
  }>
  contact?: {
    text?: string
    text_ar?: string
  }
}

type ProjectData = {
  title: string
  title_ar?: string
  description?: string
  description_ar?: string
  tags?: string[]
  image: string
  href: string
}

const emptyPortfolio: PortfolioData = {
  title: '',
  title_ar: '',
  name: '',
  name_ar: '',
  intro: '',
  intro_ar: '',
  about: '',
  about_ar: '',
  hero_image: '',
  avatar_image: '',
}

function normalizeExternalUrl(value: string): string {
  const trimmed = value.trim()

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('/')
  ) {
    return trimmed
  }

  return `https://${trimmed}`
}

function normalizePublicAssetPath(value: string): string {
  if (value.startsWith('/assets/')) {
    return value.replace('/assets/', '/Assets/')
  }

  if (value.startsWith('/assets')) {
    return value.replace('/assets', '/Assets')
  }

  return value
}

const techStack = [
  {
    title: 'TypeScript',
    image: 'https://skillicons.dev/icons?i=ts',
    href: 'https://www.typescriptlang.org/',
  },
  {
    title: 'React',
    image: 'https://skillicons.dev/icons?i=react',
    href: 'https://react.dev/',
  },
  {
    title: 'TanStack',
    image: 'https://skillicons.dev/icons?i=tailwind',
    href: 'https://tanstack.com/',
  },
  {
    title: 'Node.js',
    image: 'https://skillicons.dev/icons?i=nodejs',
    href: 'https://nodejs.org/',
  },
  {
    title: 'PostgreSQL',
    image: 'https://skillicons.dev/icons?i=postgres',
    href: 'https://www.postgresql.org/',
  },
  {
    title: 'Docker',
    image: 'https://skillicons.dev/icons?i=docker',
    href: 'https://www.docker.com/',
  },
]

type BlogPostPreview = {
  slug: string
  title: string
  summary: string
  publishedAt: string
}

type LandingLoaderData = {
  portfolio: PortfolioData
  socialLinks: SocialLink[]
  projects: ProjectData[]
  blogPosts: BlogPostPreview[]
  roles: string[]
  primaryCta: CtaData | null
  secondaryCta: CtaData | null
  contactText: string
  contactTextAr: string
  copyrightName: string
}

const SITE_URL = 'https://boyhax.com'

function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) {
    return SITE_URL
  }

  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }

  if (pathOrUrl.startsWith('/')) {
    return `${SITE_URL}${pathOrUrl}`
  }

  return `${SITE_URL}/${pathOrUrl}`
}

const defaultLandingData: LandingLoaderData = {
  portfolio: emptyPortfolio,
  socialLinks: [],
  projects: [],
  blogPosts: [],
  roles: [],
  primaryCta: null,
  secondaryCta: null,
  contactText: '',
  contactTextAr: '',
  copyrightName: '',
}

function mapDataJson(
  dataJson: DataJsonContent,
): Omit<LandingLoaderData, 'blogPosts'> {
  const socialLinks = Array.isArray(dataJson.social) && dataJson.social.length
    ? dataJson.social
        .filter((item) => item.label && item.url)
        .map((item) => ({
          label: item.label,
          label_ar: item.label_ar,
          href: normalizeExternalUrl(item.url),
        }))
    : []

  const portfolio: PortfolioData = {
    title: dataJson.hero?.greeting || '',
    title_ar: dataJson.hero?.greeting_ar || dataJson.hero?.intro_ar || '',
    name: dataJson.hero?.name || '',
    name_ar: dataJson.hero?.name_ar || dataJson.hero?.name || '',
    intro: dataJson.hero?.intro || '',
    intro_ar: dataJson.hero?.intro_ar || dataJson.hero?.intro || '',
    about:
      dataJson.about?.description || dataJson.hero?.intro || '',
    about_ar:
      dataJson.about?.description_ar ||
      dataJson.hero?.intro_ar ||
      '',
    hero_image:
      normalizePublicAssetPath(
        dataJson.hero?.hero ||
        dataJson.hero?.heroImage ||
        dataJson.about?.image ||
        dataJson.hero?.avatar ||
        '',
      ),
    avatar_image:
      normalizePublicAssetPath(
        dataJson.hero?.avatar ||
        dataJson.hero?.hero ||
        dataJson.hero?.heroImage ||
        '',
      ),
  }

  const projects = Array.isArray(dataJson.projects) && dataJson.projects.length
    ? dataJson.projects
        .filter((item) => item.title && item.image && (item.href || item.demo || item.repo))
        .map((item) => ({
          title: item.title || '',
          title_ar: item.title_ar,
          description: item.description,
          description_ar: item.description_ar,
          tags: item.tags,
          image: normalizePublicAssetPath(item.image || ''),
          href: normalizeExternalUrl(item.href || item.demo || item.repo || ''),
        }))
    : []

  const mapCta = (cta?: DataJsonCta): CtaData | null =>
    cta?.label && cta.href
      ? {
          label: cta.label,
          label_ar: cta.label_ar,
          href: cta.href.startsWith('#')
            ? cta.href
            : normalizePublicAssetPath(normalizeExternalUrl(cta.href)),
        }
      : null

  return {
    portfolio,
    socialLinks,
    projects,
    roles: Array.isArray(dataJson.hero?.roles) ? dataJson.hero.roles : [],
    primaryCta: mapCta(dataJson.hero?.primaryCta),
    secondaryCta: mapCta(dataJson.hero?.secondaryCta),
    contactText: dataJson.contact?.text || '',
    contactTextAr: dataJson.contact?.text_ar || dataJson.contact?.text || '',
    copyrightName: dataJson.site?.copyrightName || '',
  }
}

async function loadLandingData(): Promise<LandingLoaderData> {
  try {
    let dataJson: DataJsonContent

    if (typeof window === 'undefined') {
      const [{ readFile }, { join }] = await Promise.all([
        import('node:fs/promises'),
        import('node:path'),
      ])
      const filePath = join(process.cwd(), 'public', 'data', 'data.json')
      const fileContent = await readFile(filePath, 'utf-8')
      dataJson = JSON.parse(fileContent) as DataJsonContent
    } else {
      const dataRes = await fetch('/data/data.json', { cache: 'no-store' })
      if (!dataRes.ok) {
        return defaultLandingData
      }

      dataJson = (await dataRes.json()) as DataJsonContent
    }

    return {
      ...mapDataJson(dataJson),
      blogPosts: getAllPosts().map((post) => ({
        slug: post.slug,
        title: post.title,
        summary: post.summary,
        publishedAt: post.publishedAt,
      })),
    }
  } catch {
    return defaultLandingData
  }
}

export const Route = createFileRoute('/')({
  loader: loadLandingData,
  head: ({ loaderData }) => {
    const portfolio = loaderData?.portfolio || emptyPortfolio
    const title = portfolio.title || 'said alhajri . boyhax portfolio'
    const description =
      portfolio.intro ||
      'Full stack developer portfolio with custom web and mobile products.'
    const imagePath =
      portfolio.hero_image || portfolio.avatar_image || '/Assets/hero.png'
    const imageUrl = toAbsoluteUrl(imagePath)
    const canonicalUrl = SITE_URL

    return {
      meta: [
        {
          title,
        },
        {
          name: 'description',
          content: description,
        },
        {
          name: 'keywords',
          content:
            'said alhajri,boyhax,full stack developer,react,nodejs,typescript,portfolio,oman',
        },
        {
          name: 'robots',
          content: 'index, follow, max-image-preview:large',
        },
        {
          name: 'googlebot',
          content: 'index, follow, max-image-preview:large',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:site_name',
          content: 'Boyhax Portfolio',
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          property: 'og:url',
          content: canonicalUrl,
        },
        {
          property: 'og:image',
          content: imageUrl,
        },
        {
          property: 'og:image:alt',
          content: `${portfolio.name || 'Boyhax'} portfolio preview`,
        },
        {
          property: 'og:locale',
          content: 'en_US',
        },
        {
          property: 'og:locale:alternate',
          content: 'ar_OM',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: description,
        },
        {
          name: 'twitter:image',
          content: imageUrl,
        },
        {
          name: 'twitter:image:alt',
          content: `${portfolio.name || 'Boyhax'} portfolio preview`,
        },
      ],
      links: [
        {
          rel: 'canonical',
          href: canonicalUrl,
        },
      ],
    }
  },
  component: App,
})

type RevealVariant = 'up' | 'left' | 'right' | 'zoom'

function Reveal({
  variant = 'up',
  className = '',
  children,
}: {
  variant?: RevealVariant
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || visible) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -48px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const bar = barRef.current
      if (!bar) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />
}

function useSkyParallax() {
  const skyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let x = 0
    let y = 0

    const update = () => {
      frame = 0
      const sky = skyRef.current
      if (!sky) return
      const layers = sky.querySelectorAll<HTMLElement>('.sky-parallax')
      layers.forEach((layer, index) => {
        const depth = (index + 1) * 7
        layer.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`
      })
    }

    const onMove = (event: MouseEvent) => {
      x = (event.clientX / window.innerWidth - 0.5) * -1
      y = (event.clientY / window.innerHeight - 0.5) * -1
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return skyRef
}

function RolesTicker({ roles, isArabic }: { roles: string[]; isArabic: boolean }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!roles.length) return

    const current = roles[roleIndex % roles.length]

    if (!deleting && text === current) {
      const pause = window.setTimeout(() => setDeleting(true), 1600)
      return () => window.clearTimeout(pause)
    }

    if (deleting && text === '') {
      setDeleting(false)
      setRoleIndex((i) => (i + 1) % roles.length)
      return
    }

    const id = window.setTimeout(
      () => {
        setText(
          deleting
            ? current.slice(0, text.length - 1)
            : current.slice(0, text.length + 1),
        )
      },
      deleting ? 45 : 90,
    )

    return () => window.clearTimeout(id)
  }, [roles, roleIndex, text, deleting])

  if (!roles.length) return null

  return (
    <p className="mt-5 text-lg font-semibold text-cyan-200 sm:text-xl" dir="ltr">
      <span className="text-slate-300/80">
        {isArabic ? '> أبني بـ ' : '> I build with '}
      </span>
      <span>{text}</span>
      <span className="typing-caret" aria-hidden="true" />
    </p>
  )
}

function App() {
  const {
    portfolio,
    socialLinks,
    projects,
    blogPosts,
    roles,
    primaryCta,
    secondaryCta,
    contactText,
    contactTextAr,
    copyrightName,
  } = Route.useLoaderData()
  const [projectApi, setProjectApi] = useState<CarouselApi>()
  const [stackApi, setStackApi] = useState<CarouselApi>()
  const [isArabic, setIsArabic] = useState(false)
  const [failedProjectImages, setFailedProjectImages] = useState<
    Record<string, boolean>
  >({})
  const skyRef = useSkyParallax()

  useEffect(() => {
    setFailedProjectImages({})
  }, [projects])

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('language')
    if (savedLanguage === 'ar' || savedLanguage === 'en') {
      setIsArabic(savedLanguage === 'ar')
    } else {
      const language =
        navigator.languages?.[0] || navigator.language || navigator.language
      setIsArabic(language.toLowerCase().startsWith('ar'))
    }
  }, [])

  const toggleLanguage = () => {
    setIsArabic((prev) => {
      const next = !prev
      window.localStorage.setItem('language', next ? 'ar' : 'en')
      return next
    })
  }

  useEffect(() => {
    if (!projectApi) return

    const id = window.setInterval(() => {
      if (isArabic) {
        projectApi.scrollPrev()
      } else {
        projectApi.scrollNext()
      }
    }, 2600)

    return () => window.clearInterval(id)
  }, [projectApi, isArabic])

  useEffect(() => {
    if (!stackApi) return

    const id = window.setInterval(() => {
      if (isArabic) {
        stackApi.scrollPrev()
      } else {
        stackApi.scrollNext()
      }
    }, 2200)

    return () => window.clearInterval(id)
  }, [stackApi, isArabic])

  return (
    <main
      lang={isArabic ? 'ar' : 'en'}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="sky-background relative min-h-screen overflow-hidden text-slate-100"
    >
      <ScrollProgressBar />
      <button
        type="button"
        onClick={toggleLanguage}
        className="absolute right-4 top-4 z-20 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-bold tracking-widest text-white backdrop-blur transition hover:bg-white/20 sm:right-6 sm:top-6"
        aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      >
        {isArabic ? 'EN' : 'AR'}
      </button>

      <div ref={skyRef} className="pointer-events-none absolute inset-0 -z-10">
        <div className="sky-gradient-layer" />
        <div className="sky-clouds-layer sky-parallax" />
        <div className="sky-stars-layer sky-parallax" />
        <div className="sky-falling-stars-layer">
          {Array.from({ length: 10 }).map((_, index) => (
            <span
              key={`falling-star-${index}`}
              className="sky-falling-star"
              style={{
                left: `${8 + (index * 9) % 84}%`,
                top: `${6 + (index * 7) % 34}%`,
                animationDelay: `${index * 1.1}s`,
                animationDuration: `${5 + (index % 4)}s`,
              }}
            />
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="landing-reveal flex flex-col-reverse items-center gap-10 rounded-3xl p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-center lg:flex-1 lg:text-start">
            <p className="inline-flex rounded-full border border-cyan-200/40 bg-cyan-200/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-cyan-100">
              {isArabic ? portfolio.name_ar : portfolio.name}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
              {isArabic ? portfolio.title_ar : portfolio.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-200/85 sm:text-lg">
              {isArabic ? portfolio.intro_ar : portfolio.intro}
            </p>

            <RolesTicker roles={roles} isArabic={isArabic} />

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {primaryCta ? (
                <a
                  href={primaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(79,184,178,0.45)] transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  {isArabic ? primaryCta.label_ar || primaryCta.label : primaryCta.label}
                </a>
              ) : null}
              {secondaryCta ? (
                <a
                  href={secondaryCta.href}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  {isArabic
                    ? secondaryCta.label_ar || secondaryCta.label
                    : secondaryCta.label}
                </a>
              ) : null}
            </div>
          </div>

          {portfolio.avatar_image ? (
            <div className="hero-avatar-ring landing-zoom shrink-0">
              <img
                src={portfolio.avatar_image}
                alt={isArabic ? portfolio.name_ar : portfolio.name}
                className="size-40 rounded-full object-cover sm:size-52 lg:size-64"
                fetchPriority="high"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8" aria-labelledby="about-title">
        <Reveal variant="up" className="rounded-3xl p-6 sm:p-8">
          <h2 id="about-title" className="section-heading text-2xl font-bold sm:text-3xl">
            {isArabic ? 'نبذة' : 'About'}
          </h2>
          <p className="mt-3 max-w-4xl text-slate-200/90">
            {isArabic ? portfolio.about_ar : portfolio.about}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map((link, index) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                style={{ '--stagger-index': index } as React.CSSProperties}
                className="stagger-item inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                {isArabic ? link.label_ar || link.label : link.label}
                <ArrowUpRight className="size-4" />
              </a>
            ))}
            <Link
              to="/blog"
              style={{ '--stagger-index': socialLinks.length } as React.CSSProperties}
              className="stagger-item inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-200/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-200/20"
            >
              {isArabic ? 'المدونة' : 'Blog'}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      <section
        id="projects"
        className="mx-auto max-w-6xl scroll-mt-16 px-4 pb-16 sm:px-6 lg:px-8"
        aria-labelledby="projects-title"
      >
        <Reveal variant={isArabic ? 'right' : 'left'}>
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 id="projects-title" className="section-heading text-2xl font-bold sm:text-3xl">
            {isArabic ? 'المشاريع' : 'Projects'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => projectApi?.scrollPrev()}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition hover:bg-black/45 disabled:opacity-40"
              disabled={!projectApi}
              aria-label={isArabic ? 'السابق' : 'Previous'}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => projectApi?.scrollNext()}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition hover:bg-black/45 disabled:opacity-40"
              disabled={!projectApi}
              aria-label={isArabic ? 'التالي' : 'Next'}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <Carousel
          setApi={setProjectApi}
          opts={{ align: 'start', loop: true, direction: isArabic ? 'rtl' : 'ltr' }}
        >
          <CarouselContent>
            {projects.map((project) => (
              (() => {
                const projectKey = `${project.href}-${project.title}`
                const hasImageError = failedProjectImages[projectKey]

                return (
              <CarouselItem
                key={projectKey}
                className="basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-cyan-200/40 hover:bg-white/10"
                >
                  {!hasImageError ? (
                    <div className="relative h-52 overflow-hidden sm:h-56">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={() => {
                          setFailedProjectImages((prev) => ({
                            ...prev,
                            [projectKey]: true,
                          }))
                        }}
                      />
                      <div className="absolute inset-0 flex items-end justify-end bg-linear-to-t from-slate-950/80 via-transparent to-transparent p-3 opacity-0 transition duration-300 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                          {isArabic ? 'زيارة الموقع' : 'Visit site'}
                          <ArrowUpRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-base font-semibold text-slate-100">
                        {isArabic ? project.title_ar || project.title : project.title}
                      </p>
                      <ArrowUpRight className="size-4 text-cyan-200" />
                    </div>
                    {project.description ? (
                      <p className="text-sm text-slate-200/80">
                        {isArabic
                          ? project.description_ar || project.description
                          : project.description}
                      </p>
                    ) : null}
                    {project.tags?.length ? (
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-2" dir="ltr">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-cyan-100/90"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </a>
              </CarouselItem>
                )
              })()
            ))}
          </CarouselContent>
        </Carousel>
        </Reveal>
      </section>

      {blogPosts.length > 0 ? (
        <section
          className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8"
          aria-labelledby="blog-title"
        >
          <Reveal variant="up">
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 id="blog-title" className="section-heading text-2xl font-bold sm:text-3xl">
              {isArabic ? 'المدونة' : 'Blog'}
            </h2>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-100 transition hover:text-white"
            >
              {isArabic ? 'جميع المقالات' : 'View all'}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                style={{ '--stagger-index': index } as React.CSSProperties}
                className="stagger-item group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-200/30 hover:bg-white/8"
              >
                <time
                  dateTime={post.publishedAt}
                  className="text-xs font-medium text-cyan-100/90"
                >
                  {new Intl.DateTimeFormat(isArabic ? 'ar-OM' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'Asia/Muscat',
                  }).format(new Date(post.publishedAt))}
                </time>
                <h3 className="mt-2 text-lg font-bold text-slate-100 transition group-hover:text-cyan-100">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-200/85">
                  {post.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-100">
                  {isArabic ? 'اقرأ المقال' : 'Read post'}
                  <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
          </Reveal>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="stack-title">
        <Reveal variant={isArabic ? 'left' : 'right'}>
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 id="stack-title" className="section-heading text-2xl font-bold sm:text-3xl">
            {isArabic ? 'التقنيات' : 'Tech Stack'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => stackApi?.scrollPrev()}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition hover:bg-black/45 disabled:opacity-40"
              disabled={!stackApi}
              aria-label={isArabic ? 'السابق' : 'Previous'}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => stackApi?.scrollNext()}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition hover:bg-black/45 disabled:opacity-40"
              disabled={!stackApi}
              aria-label={isArabic ? 'التالي' : 'Next'}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <Carousel
          setApi={setStackApi}
          opts={{ align: 'start', loop: true, direction: isArabic ? 'rtl' : 'ltr' }}
        >
          <CarouselContent>
            {techStack.map((tech) => (
              <CarouselItem
                key={tech.title}
                className="basis-1/2 sm:basis-1/3 lg:basis-1/5"
              >
                <a
                  href={tech.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col items-center gap-4 rounded-2xl p-6 text-center"
                >
                  <img
                    src={tech.image}
                    alt={tech.title}
                    className="size-16 transition duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <p className="text-sm font-semibold text-slate-100 sm:text-base">
                    {tech.title}
                  </p>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        </Reveal>
      </section>

      <section
        id="contact"
        className="mx-auto max-w-6xl scroll-mt-16 px-4 pb-20 sm:px-6 lg:px-8"
        aria-labelledby="contact-title"
      >
        <Reveal
          variant="zoom"
          className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center sm:p-12"
        >
          <h2 id="contact-title" className="text-2xl font-bold sm:text-4xl">
            {isArabic ? 'لنبنِ شيئاً معاً' : "Let's build something together"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200/85 sm:text-lg">
            {isArabic ? contactTextAr : contactText}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://omanapps.com"
              target="_blank"
              rel="noreferrer"
              style={{ '--stagger-index': 0 } as React.CSSProperties}
              className="stagger-item inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(79,184,178,0.45)] transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              {isArabic ? 'ابدأ مشروعك' : 'Start a project'}
              <ArrowUpRight className="size-4" />
            </a>
            {socialLinks.map((link, index) => (
              <a
                key={`contact-${link.label}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                style={{ '--stagger-index': index + 1 } as React.CSSProperties}
                className="stagger-item inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                {isArabic ? link.label_ar || link.label : link.label}
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-300/80 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()}{' '}
            {isArabic ? portfolio.name_ar : copyrightName || portfolio.name}
          </p>
          <p dir="ltr" className="font-semibold tracking-widest text-cyan-100/80">
            boyhax.com
          </p>
        </div>
      </footer>
    </main>
  )
}
