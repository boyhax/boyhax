import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

const SITE_URL = 'https://boyhax.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/Assets/hero.png`
const DEFAULT_TITLE = 'said alhajri . boyhax portfolio'
const DEFAULT_DESCRIPTION =
  'Full stack developer portfolio with custom web and mobile products.'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: DEFAULT_TITLE,
      },
      {
        name: 'description',
        content: DEFAULT_DESCRIPTION,
      },
      {
        name: 'keywords',
        content:
          'said alhajri,boyhax,full stack developer,react,nodejs,typescript,portfolio,oman',
      },
      {
        name: 'author',
        content: 'Said Alhajri',
      },
      {
        name: 'creator',
        content: 'Said Alhajri',
      },
      {
        name: 'publisher',
        content: 'Boyhax',
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
        name: 'referrer',
        content: 'strict-origin-when-cross-origin',
      },
      {
        name: 'format-detection',
        content: 'telephone=no, address=no, email=no',
      },
      {
        name: 'application-name',
        content: 'Boyhax Portfolio',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'Boyhax Portfolio',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
      {
        name: 'theme-color',
        content: '#091a24',
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
        content: DEFAULT_TITLE,
      },
      {
        property: 'og:description',
        content: DEFAULT_DESCRIPTION,
      },
      {
        property: 'og:url',
        content: SITE_URL,
      },
      {
        property: 'og:image',
        content: DEFAULT_OG_IMAGE,
      },
      {
        property: 'og:image:alt',
        content: 'Boyhax portfolio hero image',
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
        content: DEFAULT_TITLE,
      },
      {
        name: 'twitter:description',
        content: DEFAULT_DESCRIPTION,
      },
      {
        name: 'twitter:image',
        content: DEFAULT_OG_IMAGE,
      },
      {
        name: 'twitter:image:alt',
        content: 'Boyhax portfolio hero image',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'canonical',
        href: SITE_URL,
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
      {
        rel: 'alternate',
        hrefLang: 'en',
        href: SITE_URL,
      },
      {
        rel: 'alternate',
        hrefLang: 'ar',
        href: SITE_URL,
      },
      {
        rel: 'alternate',
        hrefLang: 'x-default',
        href: SITE_URL,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
