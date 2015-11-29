import test from 'ava'
import mock from 'mock-require'

import api from '../lib/route/api'
import feed from '../lib/route/feed'

test.beforeEach(t => {
  const router = {
    routes: [],
    get: (path, action) => router.routes.push(['get', path, action]),
    post: (path, action) => router.routes.push(['post', path, action])
  }

  mock('koa-router', () => router)
  require('../lib/router')
  t.context = router

  t.end()
})

test('router', t => {
  const routes = t.context.routes

  t.is(routes[0][0], 'get')
  t.is(routes[0][1], '/api/keepalive')
  t.is(routes[0][2], api.keepalive)

  t.is(routes[1][0], 'post')
  t.is(routes[1][1], '/api/users/:userId/post')
  t.is(routes[1][2], api.post)

  t.is(routes[2][0], 'get')
  t.is(routes[2][1], '/feed/users/:userId/rss.xml')
  t.is(routes[2][2], feed.rss)

  t.is(routes[3][0], 'get')
  t.is(routes[3][1], '/feed/users/:userId/atom.xml')
  t.is(routes[3][2], feed.atom)

  t.end()
})
