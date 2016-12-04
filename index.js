function getAbi (target, runtime) {
  if (target) target = target.replace(/^v/, '')

  if (runtime === 'electron') {
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
    if (/^8\./.test(target)) return '52'
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

  throw new Error('Could not detect abi for version ' + target + ' and runtime ' + runtime)
}

var allTargets = [
  {runtime: 'node', target: '0.10.48'},
  {runtime: 'node', target: '0.12.17'},
  {runtime: 'node', target: '4.6.1'},
  {runtime: 'node', target: '5.12.0'},
  {runtime: 'node', target: '6.9.1'},
  {runtime: 'node', target: '7.0.0'},
  {runtime: 'electron', target: '1.0.2'},
  {runtime: 'electron', target: '1.2.8'},
  {runtime: 'electron', target: '1.3.12'},
  {runtime: 'electron', target: '1.4.10'}
]

exports.getAbi = getAbi
exports.allTargets = allTargets
