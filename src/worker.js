import { canonicalOrigin, knownRoutes, legacyRoutes } from './seo.js'

const canonicalHost = new URL(canonicalOrigin).host
const knownRouteSet = new Set(knownRoutes)

function getHeader(request, name) {
  return request.headers.get(name) || ''
}

function getRequestInfo(request) {
  const url = new URL(request.url)
  const cf = request.cf || {}

  return {
    path: url.pathname,
    method: request.method,
    host: url.host,
    userAgent: getHeader(request, 'user-agent'),
    referer: getHeader(request, 'referer'),
    country: cf.country || null,
    region: cf.region || null,
    city: cf.city || null,
    timezone: cf.timezone || null,
    colo: cf.colo || null,
    httpProtocol: cf.httpProtocol || null,
    tlsVersion: cf.tlsVersion || null,
    requestPriority: cf.requestPriority || null,
  }
}

function json(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      'cache-control': 'no-store',
      ...init.headers,
    },
  })
}

const securityHeaders = {
  'cross-origin-opener-policy': 'same-origin',
  'permissions-policy': 'camera=(), geolocation=(), microphone=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
}

function redirectTo(url, pathname = url.pathname, useCanonicalOrigin = false) {
  const target = new URL(`${pathname}${url.search}`, useCanonicalOrigin ? canonicalOrigin : url.origin)
  return Response.redirect(target.toString(), 301)
}

function isPageLikePath(pathname) {
  const lastSegment = pathname.split('/').pop() || ''
  return !lastSegment.includes('.')
}

function notFound() {
  return new Response('<!doctype html><html lang="de-CH"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Seite nicht gefunden | ZhStudio</title></head><body><h1>Seite nicht gefunden</h1><p><a href="/">Zur Startseite</a></p></body></html>', {
    status: 404,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow',
    },
  })
}

function withAssetHeaders(request, response) {
  const headers = new Headers(response.headers)
  const url = new URL(request.url)

  Object.entries(securityHeaders).forEach(([name, value]) => {
    headers.set(name, value)
  })

  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/')) {
    headers.set('cache-control', 'public, max-age=31536000, immutable')
  }

  if (url.pathname === '/danke') {
    headers.set('x-robots-tag', 'noindex, nofollow')
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const lowerPathname = url.pathname.toLowerCase()
    const withoutTrailingSlash = lowerPathname.length > 1 ? lowerPathname.replace(/\/+$/, '') : lowerPathname
    const legacyTarget = legacyRoutes[withoutTrailingSlash]
    const isProductionHost = url.hostname === 'zhstudio.ch' || url.hostname === canonicalHost
    const needsCanonicalHost = isProductionHost && (url.protocol !== 'https:' || url.host !== canonicalHost)

    if (legacyTarget) {
      return redirectTo(url, legacyTarget, isProductionHost)
    }

    if (knownRouteSet.has(withoutTrailingSlash) && (withoutTrailingSlash !== url.pathname || needsCanonicalHost)) {
      return redirectTo(url, withoutTrailingSlash, needsCanonicalHost)
    }

    if (needsCanonicalHost) {
      return redirectTo(url, url.pathname, true)
    }

    if (url.pathname === '/api/request-info') {
      return json(getRequestInfo(request))
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'Not found' }, { status: 404 })
    }

    if (isPageLikePath(url.pathname) && !knownRouteSet.has(url.pathname)) {
      return withAssetHeaders(request, notFound())
    }

    const assetResponse = await env.ASSETS.fetch(request)
    return withAssetHeaders(request, assetResponse)
  },
}
