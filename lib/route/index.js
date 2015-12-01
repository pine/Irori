'use strict'

const pkg = require('../../package.json')

exports.index = function *() {
  this.redirect(pkg.homepage)
}
