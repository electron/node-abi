const fs = require('fs')
const path = require('path')
const proc = require('child_process')
const chalk = require('chalk')
const tmp = require('tmp')
const util = require('./util')

tmp.setGracefulCleanup()

const pkg = 'electron' // old package name is `electron-prebuilt`
const filename = require.resolve('../electron.json')
const bin = require.resolve('./abi.js')
const log = console.log
const common = util.build(filename, log)

const flow = [download, common.load, common.merge, fill]
flow.reduce((promise, fn) => promise.then(fn), Promise.resolve())
  .then(common.finish, common.error)

function download () {
  return exec(`npm info ${pkg} versions`)
    .then((stdout) => {
      const targets = stdout.match(/\d+\.\d+\.\d+/g)
      if (targets === null) throw new Error(`Not found targets for ${pkg}`)

      log(chalk.green(`Found ${targets.length} targets for ${pkg}`))
      return targets.map((target) => ({target: target}))
    })
}

tmp.setGracefulCleanup()
function fill (targets, index) {
  if (index === undefined) index = 0
  if (index === targets.length) return targets

  const target = targets[index]
  if (target.abi) return fill(targets, index + 1)

  const tmpObj = tmp.dirSync({ prefix: `node-abi-electron-${target.target}`, unsafeCleanup: true })
  const options = {cwd: tmpObj.name}

  return exec(`npm install ${pkg}@${target.target}`, options)
    .then(() => {
      const electron = path.join(options.cwd, 'node_modules', '.bin', 'electron')
      if (!fs.existsSync(electron)) {
        log(chalk.yellow(`Skip ${pkg}@${target.target}`))
        targets.splice(index, 1)
        return fill(targets, index)
      }

      return exec(`ELECTRON_RUN_AS_NODE=1 ${electron} ${bin}`, options)
        .catch((err) => {
          tmpObj.removeCallback()
          throw err
        })
        .then((stdout) => {
          tmpObj.removeCallback()

          target.abi = stdout.trim()
          log(chalk.green(`Found abi for ${target.target} (${target.abi})`))

          const validTargets = targets.filter((target) => target.abi)
          return common.write(validTargets)
        })
        .then(() => fill(targets, index + 1))
    })
}

function exec (command, options) {
  return new Promise((resolve, reject) => {
    proc.exec(command, options, (err, stdout) => {
      if (err) reject(err)
      else resolve(stdout)
    })
  })
}
