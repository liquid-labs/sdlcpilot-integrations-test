/* global describe expect test */

import { tryExec } from '@liquid-labs/shell-toolkit'

const CLI_COMMAND='sdlc'
const CLI_PACKAGE='sdlcpilot-cli'
const SERVER_PACKAGE='comply-server'

describe('sdlcpilot-github-node', () => {
  beforeAll(() => {
    tryExec(`npm i -g ${SERVER_PACKAGE}`)
    tryExec(`npm i -g ${CLI_PACKAGE}`)
    tryExec(`TERMINAL_STYLE=greenOnBlack TERMINAL_WIDTH=-1 ${CLI_COMMAND} --setup`)
    tryExec(`${CLI_COMMAND} server plugins bundles add -- bundles=catalyst-sdlc-node`)
  })

  test('loads 10 handler plugins (plus original core)', () => {
    const result = tryExec(`${CLI_COMMAND} server plugins handlers list | wc -l`)
    expect(result.stdout.trim()).toBe('11')
  })
})