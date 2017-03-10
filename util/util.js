const fs = require('fs')
const chalk = require('chalk')
const semver = require('semver')

function build (filename, log) {
  return {
    load (newTargets) {
      let targets = []

      try {
        targets = require(filename)
        log(chalk.green(`Loaded ${targets.length} targets from ${filename}`))
      } catch (err) {
        if (err.code !== 'MODULE_NOT_FOUND') throw err
        log(chalk.yellow(`${filename} not found`))
      }

      return [targets, newTargets]
    },

    merge ([targets, newTargets]) {
      const count = targets.length

      for (const newItem of newTargets) {
        const exists = targets.some((item) => semver.eq(newItem.target, item.target))
        if (!exists) targets.push(newItem)
      }

      log(chalk.green(`Added ${targets.length - count} new targets`))
      return targets.sort((a, b) => semver.gt(a.target, b.target) ? 1 : -1)
    },

    write (targets) {
      const content = JSON.stringify(targets, null, 2)
      return new Promise((resolve, reject) => {
        fs.writeFile(filename, content, (err) => {
          if (err) return reject(err)

          log(chalk.green(`Writed ${targets.length} targets to ${filename}`))
          resolve()
        })
      })
    },

    finish: () => log(chalk.green('Done')),
    error: (err) => log(chalk.red(err.stack || err))
  }
}

exports.build = build
