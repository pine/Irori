import test from 'ava'
import mock from 'mock-require'
import sinon from 'sinon'

let api
let isValidToken

test.before(t => {
  isValidToken = sinon.spy(() => true)

  mock('../../lib/config', {
    isValidToken: isValidToken
  })

  api = require('../../lib/route/api')

  t.end()
})

test('keepalive', function* (t) {
  const app = {}
  yield api.keepalive.call(app)

  t.is(app.body, 'OK\n')
})

test('post', function* (t) {
  const insertOne = sinon.spy(data => {
    return Promise.resolve()
  })

  const app = {
    request: {
      body: {
        token: 'token',
        title: 'title',
        url: 'url'
      }
    },
    params: {
      userId: 'userId'
    },
    mongo: {
      collection: function (name) {
        return { insertOne }
      }
    }
  }

  yield api.post.call(app)

  t.ok(isValidToken.calledOnce)
  t.ok(isValidToken.calledWith('token', 'userId'))

  t.ok(insertOne.calledOnce)
  t.ok(insertOne.calledWith(sinon.match(value => {
    return value.userId === 'userId' &&
      value.title === 'title' &&
      value.url === 'url' &&
      value.createdAt instanceof Date
  })))

  t.ok(app.body, 'OK\n')
})
