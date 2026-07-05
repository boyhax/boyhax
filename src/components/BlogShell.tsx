import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

type BlogShellProps = {
  lang?: string
  children: ReactNode
}

export function BlogShell({ lang = 'ar', children }: BlogShellProps) {
  const isArabic = lang === 'ar'

  return (
    <main
      lang={lang}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="sky-background relative min-h-screen overflow-hidden text-slate-100"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="sky-gradient-layer" />
        <div className="sky-clouds-layer" />
        <div className="sky-stars-layer" />
      </div>

      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 pb-4 pt-6 sm:px-6">
        <Link
          to="/"
          className="text-sm font-semibold text-cyan-100 transition hover:text-white"
        >
          {isArabic ? '← العودة للرئيسية' : '← Back home'}
        </Link>
        <Link
          to="/blog"
          className="text-sm font-semibold text-slate-200/90 transition hover:text-white"
        >
          {isArabic ? 'المدونة' : 'Blog'}
        </Link>
      </header>

      {children}
    </main>
  )
}
