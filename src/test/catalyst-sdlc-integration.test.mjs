/* global describe expect test */

import { tryExec } from '@liquid-labs/shell-toolkit'

describe('initial setup', () => {
  test('foo', () => {
    tryExec('catalyst server plugins bundles add -- installBundles=catalyst-sdlc-node')
  })
})