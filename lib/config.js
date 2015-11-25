'use strict'

const assert = require('assert')
const tokens = require('../config/token.json')
const users = require('../config/user.json')

exports.isValidToken = function (token, userId) {
  return tokens.some(tokenObj => {
    return tokenObj.token === token && tokenObj.userIds.indexOf(userId) > -1
  })
}

exports.getUserInfo = function (userId) {
  return users.filter(userObj => userObj.userId === userId)[0]
}
