import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { BlogShell } from '#/components/BlogShell'
import { MarkdownContent } from '#/components/MarkdownContent'
import { formatArabicDate, getPostBySlug } from '#/lib/blog'
import { buildBlogPostHead } from '#/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug)

    if (!post) {
      throw notFound()
    }

    return post
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {}
    }

    return buildBlogPostHead({
      title: loaderData.title,
      description: loaderData.description,
      slug: loaderData.slug,
      publishedAt: loaderData.publishedAt,
      updatedAt: loaderData.updatedAt,
      author: loaderData.author,
      lang: loaderData.lang,
      keywords: loaderData.keywords,
      ogImage: loaderData.ogImage,
    })
  },
  component: BlogPostPage,
})

function BlogPostPage() {
  const post = Route.useLoaderData()

  return (
    <BlogShell lang={post.lang}>
      <article className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6">
        <header className="landing-reveal rounded-3xl p-6 sm:p-10">
          <Link
            to="/blog"
            className="text-sm font-semibold text-cyan-100 transition hover:text-white"
          >
            ← جميع المقالات
          </Link>
          <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base text-slate-200/85 sm:text-lg">
            {post.summary}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span>{post.author}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={post.publishedAt}>
              {formatArabicDate(post.publishedAt)}
            </time>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <MarkdownContent
          content={post.content}
          className="blog-prose landing-reveal-delay mt-10 rounded-3xl p-6 sm:p-10"
        />
      </article>
    </BlogShell>
  )
}
