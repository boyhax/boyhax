import { allPosts } from 'content-collections'

export type BlogPost = (typeof allPosts)[number]

export function getAllPosts(): BlogPost[] {
  return [...allPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((post) => post.slug === slug)
}

export function formatArabicDate(dateString: string): string {
  return new Intl.DateTimeFormat('ar-OM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Muscat',
  }).format(new Date(dateString))
}
