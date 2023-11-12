/* global describe expect test */

import { tryExec } from '@liquid-labs/shell-toolkit'

const CLI_COMMAND='sdlc'
const CLI_PACKAGE='sdlcpilot-cli'
const SERVER_COMMAND=`comply-server`
const SERVER_PACKAGE='comply-server'

describe('sdlcpilot-github-node', () => {
  beforeAll(async () => {
    process.stdout.write(`Installing ${SERVER_PACKAGE} and ${CLI_PACKAGE}...`)
    tryExec(`npm i -g ${SERVER_PACKAGE}`)
    tryExec(`npm i -g ${CLI_PACKAGE}`)
    process.stdout.write('Running setup...')
    tryExec(`TERMINAL_STYLE=greenOnBlack TERMINAL_WIDTH=-1 ${CLI_COMMAND} --setup`)
    process.stdout.write('Starting server...')
    new Promise((resolve) => {
      tryExec(SERVER_COMMAND)
      resolve()
    })
      .then(() => { process.stdout.write('Server process has exitted.') })
    process.stdout.write('Giving it time to spin up...')
    await new Promise((resolve) => setTimeout(resolve, 20 * 1000 /* 20 seconds */))
    process.stdout.write('Installing bundle...')
    tryExec(`${CLI_COMMAND} server plugins bundles add -- bundles=catalyst-sdlc-node`)
  })

  afterAll(() => {
    tryExec(`${CLI_COMMAND} server stop`)
  })

  test('loads 10 handler plugins (plus original core)', () => {
    const result = tryExec(`${CLI_COMMAND} server plugins handlers list | wc -l`)
    expect(result.stdout.trim()).toBe('11')
  })
})