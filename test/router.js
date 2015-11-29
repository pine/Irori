import test from 'ava'
import mock from 'mock-require'
import co from 'co'
import fs from 'co-fs-extra'
import {join} from 'path'

test.beforeEach(t => {
  const router = {
    routes: [],
    get: (path, action) => router.routes.push(['get', path, action]),
    post: (path, action) => router.routes.push(['post', path, action])
  }

  const config = {
    token: join(__dirname, '/../config/token.json'),
    tokenExample: join(__dirname, '/../config/token.example.json'),
    user: join(__dirname, '/../config/user.json'),
    userExample: join(__dirname, '/../config/user.example.json')
  }

  return co(function *() {
    if (!(yield fs.exists(config.token))) {
      yield fs.copy(config.tokenExample, config.token)
    }

    if (!(yield fs.exists(config.user))) {
      yield fs.copy(config.userExample, config.user)
    }

    mock('koa-router', () => router)
    require('../lib/router')
    t.context = router
  })
})

test('router', t => {
  const api = require('../lib/route/api')
  const feed = require('../lib/route/feed')
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
