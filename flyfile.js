'use strict'

export function* test() {
  yield this.source('./*.js').eslint()
  yield this.source('./test/*.js').ava()
}
