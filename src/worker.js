import { canonicalOrigin, knownRoutes, legacyRoutes } from './seo.js'

const canonicalHost = new URL(canonicalOrigin).host
const knownRouteSet = new Set(knownRoutes)
const productionHosts = new Set(['zhstudio.ch', 'www.zhstudio.ch'])

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

async function notFound(request, env) {
  // /404 is the clean asset URL; /404.html would be redirected by HTML handling.
  const assetRequest = new Request(new URL('/404', request.url), {
    method: request.method === 'HEAD' ? 'HEAD' : 'GET',
  })
  const page = await env.ASSETS.fetch(assetRequest)
  const headers = new Headers(page.headers)
  headers.set('content-type', 'text/html; charset=utf-8')
  headers.set('x-robots-tag', 'noindex, nofollow')
  headers.set('cache-control', 'no-cache')
  headers.delete('location')
  return new Response(request.method === 'HEAD' ? null : page.body, { status: 404, headers })
}

function withAssetHeaders(request, response) {
  const headers = new Headers(response.headers)
  const url = new URL(request.url)

  Object.entries(securityHeaders).forEach(([name, value]) => {
    headers.set(name, value)
  })

  if (response.ok && (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/'))) {
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
    const isProductionHost = productionHosts.has(url.hostname)
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
      return withAssetHeaders(request, await notFound(request, env))
    }

    const assetResponse = await env.ASSETS.fetch(request)
    if (assetResponse.status === 404 || url.pathname === '/404.html') {
      return withAssetHeaders(request, await notFound(request, env))
    }
    return withAssetHeaders(request, assetResponse)
  },
}
