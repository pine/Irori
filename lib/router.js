'use strict'

const router = require('koa-router')()

const api = require('./route/api')
const feed = require('./route/feed')
const index = require('./route/index')

router.get('/api/keepalive', api.keepalive)
router.post('/api/users/:userId/post', api.post)
router.get('/feed/users/:userId/rss.xml', feed.rss)
router.get('/feed/users/:userId/atom.xml', feed.atom)
router.get('/', index.index)

module.exports = router
