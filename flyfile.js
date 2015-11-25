'use strict'

export function* test() {
  yield this.source('./*.js').eslint()
}
