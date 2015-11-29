import test from 'ava'
import mock from 'mock-require'
import sinon from 'sinon'

let Feed
let feed
let addItem
let getUserInfo

test.before(function* () {
  getUserInfo = sinon.spy(() => ({
    userId: 'userId',
    name: 'name',
    url: 'http://www.example.com'
  }))

  Feed = sinon.spy()
  addItem = sinon.spy()

  mock('../../lib/config', {
    getUserInfo: getUserInfo
  })

  mock('feed', function () {
    Feed(...arguments)
    this.render = () => 'render'
    this.addItem = addItem
  })

  feed = require('../../lib/route/feed')
})

test.beforeEach(function* (t) {
  t.context = sinon.sandbox.create()
})

test.afterEach(function* (t) {
  t.context.restore()
})

test.serial('index', function* (t) {
  const toArray = sinon.spy(() => {
    return Promise.resolve([
      {
        title: 'title',
        url: 'url',
        createdAt: 'createdAt'
      }
    ])
  })
  const find = sinon.spy(() => {
    return { toArray }
  })

  const app = {
    params: {
      userId: 'userId'
    },
    mongo: {
      collection: function (name) {
        return { find }
      }
    }
  }

  yield feed.index.call(app)

  t.ok(getUserInfo.calledOnce)

  t.ok(find.calledOnce)
  t.ok(find.calledWith({ userId: 'userId' }))
  t.ok(toArray.calledOnce)

  t.ok(Feed.calledOnce)
  t.ok(Feed.calledWith({
    title: 'name',
    description: 'RSS for name',
    link: 'http://www.example.com'
  }))

  t.ok(addItem.calledOnce)
  t.ok(addItem.calledWith({
    title: 'title',
    description: 'title',
    link: 'url',
    date: 'createdAt'
  }))

  t.is(app.type, 'application/xml')
  t.is(app.body, 'render')
})

test.serial('atom', function* (t) {
  const index = t.context.stub(feed, 'index', function* () { })

  yield feed.atom()

  t.ok(index.calledOnce)
  t.ok(index.calledWith('atom-1.0'))
})

test.serial('rss', function* (t) {
  const index = t.context.stub(feed, 'index', function* () { })

  yield feed.rss()

  t.ok(index.calledOnce)
  t.ok(index.calledWith('rss-2.0'))
})
