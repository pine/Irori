import test from 'ava'
import mock from 'mock-require'

test.beforeEach(t => {
  mock('../config/token.json', [
    {
      "token": "token",
      "userIds": ["userId"]
    }
  ])

  mock('../config/user.json', [
    {
      "userId": "userId",
      "name": "name"
    }
  ])

  t.context = require('../lib/config')
  t.end()
})

test('isValidToken', t => {
  t.ok(t.context.isValidToken("token", "userId"))
  t.notOk(t.context.isValidToken("invalid_token", "userId"))
  t.notOk(t.context.isValidToken("token", "invalid_userId"))
  t.end()
})

test('getUserInfo', t => {
  t.same(
    t.context.getUserInfo("userId"),
    { "userId": "userId", "name": "name" }
  )
  t.notOk(t.context.getUserInfo("invalid_userId"))
  t.end()
})
