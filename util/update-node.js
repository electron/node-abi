const path = require('path')
const chalk = require('chalk')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const util = require('./util')

const source = 'https://nodejs.org/en/download/releases/'
const filename = path.join(__dirname, '..', 'node.json')
const log = console.log
const common = util.build(filename, log)

const flow = [download, parse, common.load, common.merge, common.write]
flow.reduce((promise, fn) => promise.then(fn), Promise.resolve())
  .then(common.finish, common.error)

function download () {
  return fetch(source).then((response) => response.text())
}

function parse (html) {
  const $ = cheerio.load(html)
  const targets = $('table.download-table tbody tr')
    .map(function () {
      const tds = $(this).children()
      return {
        target: ($(tds.get(0)).text().match(/\d+\.\d+\.\d+/) || [])[0],
        abi: $(tds.get(5)).text()
      }
    })
    .get()
    .filter((item) => item.target && item.abi.length > 0)

  log(chalk.green(`Received ${targets.length} targets from ${source}`))
  return targets
}
