export const SITE_URL = 'https://boyhax.com'
export const SITE_NAME = 'Boyhax Portfolio'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/Assets/hero.png`
export const DEFAULT_AUTHOR = 'Said Alhajri'

export function toAbsoluteUrl(pathOrUrl: string): string {
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

type BlogPostSeoInput = {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt?: string
  author: string
  lang: string
  keywords: string[]
  ogImage?: string
}

export function buildBlogPostHead(input: BlogPostSeoInput) {
  const canonicalUrl = `${SITE_URL}/blog/${input.slug}`
  const imageUrl = toAbsoluteUrl(input.ogImage || '/Assets/hero.png')
  const locale = input.lang === 'ar' ? 'ar_OM' : 'en_US'
  const keywords = input.keywords.join(',')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    image: [imageUrl],
    datePublished: input.publishedAt,
    dateModified: input.updatedAt || input.publishedAt,
    author: {
      '@type': 'Person',
      name: input.author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_OG_IMAGE,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    inLanguage: input.lang,
    keywords,
  }

  return {
    meta: [
      { title: `${input.title} | Boyhax` },
      { name: 'description', content: input.description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: input.author },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { name: 'googlebot', content: 'index, follow, max-image-preview:large' },
      { property: 'og:type', content: 'article' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: input.title },
      { property: 'og:description', content: input.description },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:alt', content: input.title },
      { property: 'og:locale', content: locale },
      { property: 'og:locale:alternate', content: 'en_US' },
      { property: 'article:published_time', content: input.publishedAt },
      {
        property: 'article:modified_time',
        content: input.updatedAt || input.publishedAt,
      },
      { property: 'article:author', content: input.author },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: input.title },
      { name: 'twitter:description', content: input.description },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:image:alt', content: input.title },
    ],
    links: [
      { rel: 'canonical', href: canonicalUrl },
      { rel: 'alternate', hrefLang: input.lang, href: canonicalUrl },
      { rel: 'alternate', hrefLang: 'x-default', href: canonicalUrl },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(jsonLd),
      },
    ],
  }
}

export function buildBlogIndexHead() {
  const title = 'المدونة | Boyhax — مبرمج عماني'
  const description =
    'مقالات سعيد الحجري (Boyhax) عن تطوير الألعاب، تطبيقات الويب والموبايل، والبرمجة في سلطنة عُمان.'
  const canonicalUrl = `${SITE_URL}/blog`

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      {
        name: 'keywords',
        content:
          'مدونة,مبرمج عماني,تطوير تطبيقات,تطوير مواقع,React,boyhax,سعيد الحجري',
      },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: DEFAULT_OG_IMAGE },
      { property: 'og:locale', content: 'ar_OM' },
      { property: 'og:locale:alternate', content: 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  }
}
