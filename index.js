var semver = require('semver')

function getAbi (runtime, target) {
  var match = allTargets.filter(function (item) {
    return item.runtime === runtime && semver.eq(item.target, target)
  })

  if (match.length) return match[0].abi
  throw new Error('Could not detect abi for runtime ' + runtime + ' and version ' + target + ' (updating "node-abi" might help solve this issue if it is a new release of ' + runtime + ')')
}

function getTargets (runtime, abi) {
  var match = allTargets
    .filter(function (item) {
      return item.runtime === runtime && item.abi === abi
    })
    .map(function (item) {
      return item.target
    })

  if (match.length) return match
  throw new Error('Could not detect target for runtime ' + runtime + ' and abi ' + abi)
}

var allTargets = [].concat(
  require('./node.json').map(function (item) {
    return {runtime: 'node', target: item.target, abi: item.abi}
  }),
  require('./electron.json').map(function (item) {
    return {runtime: 'electron', target: item.target, abi: item.abi}
  })
)

var supportedRanges = [
  {runtime: 'electron', target: '1'},
  {runtime: 'node', target: '4', start: new Date(2015, 8, 1), stop: new Date(2018, 4, 1)},
  {runtime: 'node', target: '5', start: new Date(2015, 10, 1), stop: new Date(2016, 6, 1)},
  {runtime: 'node', target: '6', start: new Date(2016, 4, 1), stop: new Date(2019, 4, 1)},
  {runtime: 'node', target: '7', start: new Date(2016, 10, 1), stop: new Date(2017, 6, 1)},
  {runtime: 'node', target: '8', start: new Date(2017, 4, 1), stop: new Date(2020, 4, 1)}
]

function isSupported (target) {
  return supportedRanges.some(function (range) {
    if (target.runtime !== range.runtime) return false
    if (!semver.satisfies(target.target, range.target)) return false
    if (range.start && range.start > Date.now()) return false
    if (range.stop && range.stop < Date.now()) return false
    return true
  })
}

exports.isSupported = isSupported
exports.getAbi = getAbi
exports.getTargets = getTargets
exports.deprecatedTargets = allTargets.filter(function (target) { return !isSupported(target) })
exports.supportedTargets = allTargets.filter(function (target) { return isSupported(target) })
exports.allTargets = allTargets
