import { http, HttpResponse } from 'msw'

export const handlers = [
  // Intercept the /api/ping request and return a 200 response
  http.get('/api/ping', () => {
    return HttpResponse.json({
      pong: true,
      version: 'v0.0.1',
      commit: 'mock-commit-hash'
    })
  })
]