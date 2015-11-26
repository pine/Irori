'use strict'

const config = require('../config')

exports.post = function *() {
  const token = this.request.body.token
  const userId = this.params.userId
  const title = this.request.body.title
  const url = this.request.body.url

  if (config.isValidToken(token, userId)) {
    yield this.mongo.collection('messages').insertOne({
      userId,
      title,
      url,
      createdAt: new Date(),
    })

    this.body = 'OK\n'
  }
}
