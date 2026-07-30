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

function withAssetHeaders(request, response) {
  const headers = new Headers(response.headers)
  const url = new URL(request.url)

  Object.entries(securityHeaders).forEach(([name, value]) => {
    headers.set(name, value)
  })

  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/')) {
    headers.set('cache-control', 'public, max-age=31536000, immutable')
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

    if (url.pathname === '/api/request-info') {
      return json(getRequestInfo(request))
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'Not found' }, { status: 404 })
    }

    const assetResponse = await env.ASSETS.fetch(request)
    return withAssetHeaders(request, assetResponse)
  },
}
