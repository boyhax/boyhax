import { useEffect, useState } from 'react'
import type { CarouselApi } from '#/components/ui/carousel'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '#/components/ui/carousel'

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

type DataJsonContent = {
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
  }
  about?: {
    description?: string
    description_ar?: string
    image?: string
  }
  projects?: Array<{
    title?: string
    title_ar?: string
    image?: string
    href?: string
    demo?: string
    repo?: string
  }>
}

type ProjectData = {
  title: string
  title_ar?: string
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

type LandingLoaderData = {
  portfolio: PortfolioData
  socialLinks: SocialLink[]
  projects: ProjectData[]
}

const defaultLandingData: LandingLoaderData = {
  portfolio: emptyPortfolio,
  socialLinks: [],
  projects: [],
}

function mapDataJson(dataJson: DataJsonContent): LandingLoaderData {
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
          image: normalizePublicAssetPath(item.image || ''),
          href: normalizeExternalUrl(item.href || item.demo || item.repo || ''),
        }))
    : []

  return {
    portfolio,
    socialLinks,
    projects,
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

    return mapDataJson(dataJson)
  } catch {
    return defaultLandingData
  }
}

export const Route = createFileRoute('/')({
  loader: loadLandingData,
  component: App,
})

function App() {
  const { portfolio, socialLinks, projects } = Route.useLoaderData()
  const [projectApi, setProjectApi] = useState<CarouselApi>()
  const [stackApi, setStackApi] = useState<CarouselApi>()
  const [isArabic, setIsArabic] = useState(false)
  const [failedProjectImages, setFailedProjectImages] = useState<
    Record<string, boolean>
  >({})

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
      <button
        type="button"
        onClick={toggleLanguage}
        className="absolute right-4 top-4 z-20 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-bold tracking-widest text-white backdrop-blur transition hover:bg-white/20 sm:right-6 sm:top-6"
        aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      >
        {isArabic ? 'EN' : 'AR'}
      </button>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="sky-gradient-layer" />
        <div className="sky-clouds-layer" />
        <div className="sky-stars-layer" />
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
        <div className="rounded-3xl p-6 sm:p-10 landing-reveal">
          <div>
          <div className="mb-3 inline-flex items-center gap-2">
            <p className="inline-flex rounded-full border border-cyan-200/40 bg-cyan-200/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-cyan-100">
              {isArabic ? portfolio.name_ar : portfolio.name}
            </p>
            {portfolio.avatar_image ? (
              <img
                src={portfolio.avatar_image}
                alt={isArabic ? portfolio.name_ar : portfolio.name}
                className="size-8 rounded-full border border-white/30 object-cover"
                loading="lazy"
              />
            ) : null}
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            {isArabic ? portfolio.title_ar : portfolio.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200/85 sm:text-lg">
            {isArabic ? portfolio.intro_ar : portfolio.intro}
          </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8" aria-labelledby="about-title">
        <div className="rounded-3xl p-6 sm:p-8 landing-reveal-delay">
          <h2 id="about-title" className="text-2xl font-bold sm:text-3xl">
            {isArabic ? 'نبذة' : 'About'}
          </h2>
          <p className="mt-3 max-w-4xl text-slate-200/90">
            {isArabic ? portfolio.about_ar : portfolio.about}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                {isArabic ? link.label_ar || link.label : link.label}
                <ArrowUpRight className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="projects-title">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 id="projects-title" className="text-2xl font-bold sm:text-3xl">
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
          className="landing-reveal"
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
                  className="group block overflow-hidden rounded-2xl"
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
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between gap-2 p-4">
                    <p className="text-base font-semibold text-slate-100">
                      {isArabic ? project.title_ar || project.title : project.title}
                    </p>
                    <ArrowUpRight className="size-4 text-cyan-200" />
                  </div>
                </a>
              </CarouselItem>
                )
              })()
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8" aria-labelledby="stack-title">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 id="stack-title" className="text-2xl font-bold sm:text-3xl">
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
          className="landing-reveal-delay"
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
      </section>
    </main>
  )
}
