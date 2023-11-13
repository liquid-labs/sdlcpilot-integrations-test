/* global describe expect test */
import { spawn } from 'node:child_process'

import { tryExec } from '@liquid-labs/shell-toolkit'

const CLI_COMMAND='sdlc'
const CLI_PACKAGE='sdlcpilot-cli'
const SERVER_COMMAND=`comply-server`
const SERVER_PACKAGE='comply-server'

jest.setTimeout(60 * 1000)

const logCommandResult = (result) => {
  process.stdout.write('exit code: ' + result.code + '\n')
  // if (result.stdout.length > 0) {
    process.stdout.write(result.stdout)
  // }
  // if (result.stderr.length > 0) {
    process.stderr.write(result.stderr)
  //}
}

describe('sdlcpilot-github-node', () => {
  beforeAll(async () => {
    process.stdout.write(`Installing ${SERVER_PACKAGE} and ${CLI_PACKAGE}...\n`)
    logCommandResult(tryExec(`npm i -g ${SERVER_PACKAGE}`))
    logCommandResult(tryExec(`npm i -g ${CLI_PACKAGE}`))

    process.stdout.write('Starting server...\n')
    const serverProcess = spawn(SERVER_COMMAND, { detached: true })
    
    serverProcess.stdout.on('data', (data) => {
      process.stdout.write(`stdout: ${data}`)
    })
    serverProcess.stderr.on('data', (data) => {
      process.stdout.write(`stdout: ${data}`)
    })

    process.stdout.write('Giving it time to spin up...\n')
    await new Promise((resolve) => setTimeout(resolve, 20 * 1000 /* 20 seconds */))

    process.stdout.write('Running setup...\n')
    logCommandResult(tryExec(`TERMINAL_STYLE=greenOnBlack TERMINAL_WIDTH=-1 ${CLI_COMMAND} --setup`))

    process.stdout.write('WORKAROUND: Installing liq-integrations...\n') // TODO: WORKAROUND
    logCommandResult(tryExec(`${CLI_COMMAND} server plugins handlers add -- npmNames=@liquid-labs/liq-integrations`))

    process.stdout.write('Installing bundle...\n')
    logCommandResult(tryExec(`${CLI_COMMAND} server plugins bundles add -- bundles=catalyst-sdlc-node`))
  })

  afterAll(() => {
    tryExec(`${CLI_COMMAND} server stop`)
  })

  test('loads 10 handler plugins (plus original core)', () => {
    const result = tryExec(`${CLI_COMMAND} server plugins handlers list | wc -l`)
    expect(result.stdout.trim()).toBe('11')
  })
})