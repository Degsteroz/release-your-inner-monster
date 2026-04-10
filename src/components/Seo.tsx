import { useLayoutEffect } from 'react'

import ogImageSrc from '../assets/Rea.webp'

const DOC_TITLE = 'Ultra White — Not Just An Energy Drink'
const META_TITLE = DOC_TITLE
const META_DESCRIPTION =
  'A digital manifesto dedicated to the icy aesthetic and rebel spirit of Monster Ultra. Fan-made tribute.'

const OG_TITLE = 'Ultra White — Lifestyle Manifesto'
const OG_DESCRIPTION =
  'Zero sugar, zero limits. An unauthorized tribute to the cold, clean power of Ultra.'
const TWITTER_DESCRIPTION =
  'A late-night fun tribute to the icons of strength and energy by Degster_0z.'

const DEFAULT_SITE_ORIGIN = 'https://your-domain.com'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const sel = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(sel) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  const sel = `link[rel="${rel}"]`
  let el = document.head.querySelector(sel) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export default function Seo() {
  useLayoutEffect(() => {
    const envOrigin = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
    const origin =
      envOrigin || (typeof window !== 'undefined' ? window.location.origin : DEFAULT_SITE_ORIGIN)

    const pageUrl = `${origin}/`
    const imageUrl = new URL(ogImageSrc, origin).href

    document.title = DOC_TITLE

    upsertMeta('name', 'title', META_TITLE)
    upsertMeta('name', 'description', META_DESCRIPTION)
    upsertMeta('name', 'robots', 'index, follow')
    upsertMeta('name', 'theme-color', '#0a0a0a')

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:url', pageUrl)
    upsertMeta('property', 'og:title', OG_TITLE)
    upsertMeta('property', 'og:description', OG_DESCRIPTION)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:image:type', 'image/webp')
    upsertMeta('property', 'og:locale', 'en_US')

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', OG_TITLE)
    upsertMeta('name', 'twitter:description', TWITTER_DESCRIPTION)
    upsertMeta('name', 'twitter:image', imageUrl)

    upsertLink('canonical', pageUrl)
  }, [])

  return null
}
