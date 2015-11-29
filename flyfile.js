import {init} from './test/helper'

export function* test() {
  yield init()
  yield this.source('./*.js').eslint()
  yield this.source('./test/**/*_test.js').ava()
}
