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

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/request-info') {
      return json(getRequestInfo(request))
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'Not found' }, { status: 404 })
    }

    return env.ASSETS.fetch(request)
  },
}
