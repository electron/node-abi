var semver = require('semver')

function getAbi (target, runtime) {
  if (target === String(Number(target))) return target
  if (target) target = target.replace(/^v/, '')
  if (!runtime) runtime = 'node'

  if (runtime === 'node') {
    if (!target) return process.versions.modules
    if (target === process.versions.node) return process.versions.modules
  }

  for (var i = 0; i < allTargets.length; ++i) {
    var item = allTargets[i]
    if (item.runtime === runtime && semver.eq(item.target, target)) return item.abi
  }

  throw new Error('Could not detect abi for version ' + target + ' and runtime ' + runtime + '.  Updating "node-abi" might help solve this issue if it is a new release of ' + runtime)
}

function getTarget (abi, runtime) {
  return getTargets(abi, runtime)[0]
}

function getTargets (abi, runtime) {
  if (abi && abi !== String(Number(abi))) return abi
  if (!runtime) runtime = 'node'

  if (runtime === 'node' && !abi) return [process.versions.node]

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

var supportedRanges = [
  {runtime: 'electron', target: '1', lts: false},
  {runtime: 'node', target: '4', supported: new Date(2015, 8, 1) < new Date() < new Date(2018, 4, 1), lts: new Date(2015, 10, 1) < new Date() < new Date(2017, 4, 1)},
  {runtime: 'node', target: '5', supported: new Date(2015, 10, 1) < new Date() < new Date(2016, 6, 1), lts: false},
  {runtime: 'node', target: '6', supported: new Date(2016, 4, 1) < new Date() < new Date(2019, 4, 1), lts: new Date(2016, 10, 1) < new Date() < new Date(2018, 4, 1)},
  {runtime: 'node', target: '7', supported: new Date(2016, 10, 1) < new Date() < new Date(2017, 6, 1), lts: false},
  {runtime: 'node', target: '8', supported: new Date(2017, 4, 1) < new Date() < new Date(2020, 4, 1), lts: new Date(2017, 10, 1) < new Date() < new Date(2019, 4, 1)}
]

var allTargets = [].concat(
  require('./node.json').map(function (item) {
    return {runtime: 'node', target: item.target, abi: item.abi}
  }),
  require('./electron.json').map(function (item) {
    return {runtime: 'electron', target: item.target, abi: item.abi}
  })
).map(function (target) {
  for (var i = 0; i < supportedRanges.length; ++i) {
    var range = supportedRanges[i]
    if (target.runtime === range.runtime && semver.satisfies(target.target, range.target)) target.lts = range.lts
  }

  return target
})

function isSupported (target) {
  return supportedRanges.some(function (range) {
    return target.runtime === range.runtime && semver.satisfies(target.target, range.target) && range.supported
  })
}

exports.getAbi = getAbi
exports.getTarget = getTarget
exports.getTargets = getTargets
exports.deprecatedTargets = allTargets.filter(function (target) { return !isSupported(target) })
exports.supportedTargets = allTargets.filter(function (target) { return isSupported(target) })
exports.futureTargets = []
exports.allTargets = allTargets
