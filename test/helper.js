import co from 'co'
import fs from 'co-fs-extra'
import {join} from 'path'

export function init() {
  return co(function *() {
    const config = {
      token: join(__dirname, '/../config/token.json'),
      tokenExample: join(__dirname, '/../config/token.example.json'),
      user: join(__dirname, '/../config/user.json'),
      userExample: join(__dirname, '/../config/user.example.json')
    }

    if (!(yield fs.exists(config.token))) {
      yield fs.copy(config.tokenExample, config.token)
    }

    if (!(yield fs.exists(config.user))) {
      yield fs.copy(config.userExample, config.user)
    }
  })
}
