'use strict'

const Feed = require('feed')
const config = require('../config')

const index = exports.index = function *(format) {
  const userId = this.params.userId

  const userInfo = config.getUserInfo(userId)
  const messages = yield this.mongo.collection('messages').find({ userId }).toArray()

  const feed = new Feed({
    title: userInfo.name,
    description: `RSS for ${userInfo.name}`,
    link: userInfo.url
  })

  messages.forEach(message => {
    feed.addItem({
      title: message.title,
      description: message.title,
      link: message.url,
      date: message.createdAt,
    })
  })

  this.type = 'application/atom+xml; charset=utf-8'
  this.body = feed.render('atom-1.0')
}

exports.rss = function *() {
  yield* index.call(this, 'rss-2.0')
}

exports.atom = function *() {
  yield* index.call(this, 'atom-1.0')
}