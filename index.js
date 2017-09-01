function getAbi (target, runtime) {
  if (target === String(Number(target))) return target
  if (target) target = target.replace(/^v/, '')

  if (runtime === 'electron') {
    if (/^1\.8\./.test(target)) return '57'
    if (/^1\.7\./.test(target)) return '54'
    if (/^1\.6\./.test(target)) return '53'
    if (/^1\.5\./.test(target)) return '51'
    if (/^1\.4\./.test(target)) return '50'
    if (/^1\.3\./.test(target)) return '49'
    if (/^1\.[1-2]\./.test(target)) return '48'
    if (/^1\.0\./.test(target)) return '47'
    if (/^0\.3[6-7]\./.test(target)) return '47'
    if (/^0\.3[3-5]\./.test(target)) return '46'
    if (/^0\.3[1-2]\./.test(target)) return '45'
    if (/^0\.30\./.test(target)) return '44'
  } else {
    if (!target) return process.versions.modules
    if (target === process.versions.node) return process.versions.modules
    if (/^8\./.test(target)) return '57'
    if (/^7\./.test(target)) return '51'
    if (/^6\./.test(target)) return '48'
    if (/^5\./.test(target)) return '47'
    if (/^4\./.test(target)) return '46'
    if (/^0\.12\./.test(target)) return '14'
    if (/^0\.10\.[0-3]$/.test(target)) return '0x000B'
    if (/^0\.10\./.test(target)) return '11'
    // io.js and legacy Node.js
    if (/^3\./.test(target)) return '45'
    if (/^2\./.test(target)) return '44'
    if (/^1\.[1-8]\./.test(target)) return '43'
    if (/^1\.0\./.test(target)) return '42'
    if (/^0\.11\.1[1-6]/.test(target)) return '14'
    if (/^0\.11\.10/.test(target)) return '13'
    if (/^0\.11\.[8-9]/.test(target)) return '13'
    if (/^0\.11\.[0-7]/.test(target)) return '0x000C'
    if (/^0\.9\.1[0-2]$/.test(target)) return '0x000B'
    if (/^0\.9\.9$/.test(target)) return '0x000B'
    if (/^0\.9\.[1-8]$/.test(target)) return '0x000A'
    if (/^0\.9\.0/.test(target)) return '1'
    if (/^0\.[2-8]/.test(target)) return '1'
  }

  throw new Error('Could not detect abi for version ' + target + ' and runtime ' + runtime + '.  Updating "node-abi" might help solve this issue if it is a new release of ' + runtime)
}

function getTarget (abi, runtime) {
  if (abi && abi !== String(Number(abi))) return abi
  if (!runtime) runtime = 'node'

  if (runtime === 'node' && !abi) return process.versions.node

  var match = allTargets
    .filter(function (t) {
      return t.abi === abi && t.runtime === runtime
    })
    .map(function (t) {
      return t.target
    })
  if (match.length) return match[0]

  throw new Error('Could not detect target for abi ' + abi + ' and runtime ' + runtime)
}

var supportedTargets = [
  {runtime: 'node', target: '4.6.1', abi: '46', lts: new Date() < new Date(2017, 4, 1)},
  {runtime: 'node', target: '5.12.0', abi: '47', lts: false},
  {runtime: 'node', target: '6.9.4', abi: '48', lts: new Date() < new Date(2018, 4, 18)},
  {runtime: 'node', target: '7.4.0', abi: '51', lts: false},
  {runtime: 'node', target: '8.0.0', abi: '57', lts: false},
  {runtime: 'electron', target: '1.0.2', abi: '47', lts: false},
  {runtime: 'electron', target: '1.2.8', abi: '48', lts: false},
  {runtime: 'electron', target: '1.3.13', abi: '49', lts: false},
  {runtime: 'electron', target: '1.4.15', abi: '50', lts: false},
  {runtime: 'electron', target: '1.5.0', abi: '51', lts: false},
  {runtime: 'electron', target: '1.6.0', abi: '53', lts: false},
  {runtime: 'electron', target: '1.7.0', abi: '54', lts: false},
  {runtime: 'electron', target: '1.8.0', abi: '57', lts: false}
]

var deprecatedTargets = [
  {runtime: 'node', target: '0.2.0', abi: '1', lts: false},
  {runtime: 'node', target: '0.9.1', abi: '0x000A', lts: false},
  {runtime: 'node', target: '0.10.0', abi: '0x000B', lts: false},
  {runtime: 'node', target: '0.10.48', abi: '11', lts: false},
  {runtime: 'node', target: '0.11.0', abi: '0x000C', lts: false},
  {runtime: 'node', target: '0.11.10', abi: '13', lts: false},
  {runtime: 'node', target: '0.12.17', abi: '14', lts: false},
  {runtime: 'node', target: '1.0.0', abi: '42', lts: false},
  {runtime: 'node', target: '1.1.0', abi: '43', lts: false},
  {runtime: 'node', target: '2.0.0', abi: '44', lts: false},
  {runtime: 'node', target: '3.0.0', abi: '45', lts: false},
  {runtime: 'electron', target: '0.30.0', abi: '44', lts: false},
  {runtime: 'electron', target: '0.31.0', abi: '45', lts: false},
  {runtime: 'electron', target: '0.33.0', abi: '46', lts: false}
]

var futureTargets = []

var allTargets = deprecatedTargets.concat(supportedTargets).concat(futureTargets)

exports.getAbi = getAbi
exports.getTarget = getTarget
exports.deprecatedTargets = deprecatedTargets
exports.supportedTargets = supportedTargets
exports.futureTargets = futureTargets
exports.allTargets = allTargets
