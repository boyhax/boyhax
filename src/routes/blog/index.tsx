import { Link, createFileRoute } from '@tanstack/react-router'
import { BlogShell } from '#/components/BlogShell'
import { formatArabicDate, getAllPosts } from '#/lib/blog'
import { buildBlogIndexHead } from '#/lib/seo'

export const Route = createFileRoute('/blog/')({
  loader: () => getAllPosts(),
  head: () => buildBlogIndexHead(),
  component: BlogIndexPage,
})

function BlogIndexPage() {
  const posts = Route.useLoaderData()

  return (
    <BlogShell lang="ar">
      <section className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6">
        <div className="landing-reveal rounded-3xl p-6 sm:p-10">
          <p className="text-xs font-semibold tracking-[0.18em] text-cyan-100">
            Boyhax Blog
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">المدونة</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200/85 sm:text-lg">
            مقالات عن البرمجة، تطوير الألعاب، تطبيقات الويب والموبايل، ورحلة
            المبرمج العماني.
          </p>
        </div>

        <div className="mt-10 space-y-5">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="landing-reveal-delay rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-200/30 hover:bg-white/8"
            >
              <time
                dateTime={post.publishedAt}
                className="text-xs font-medium text-cyan-100/90"
              >
                {formatArabicDate(post.publishedAt)}
              </time>
              <h2 className="mt-2 text-2xl font-bold">
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="transition hover:text-cyan-100"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-slate-200/90">{post.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="mt-5 inline-flex text-sm font-semibold text-cyan-100 transition hover:text-white"
              >
                اقرأ المقال ←
              </Link>
            </article>
          ))}
        </div>
      </section>
    </BlogShell>
  )
}
