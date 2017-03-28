var test = require('tape')
var getAbi = require('../').getAbi
var getTargets = require('../').getTargets

test('getTargets calculates correct Node target', function (t) {
  t.equal(getTargets('node', '11').length, 45) // 0.10
  t.equal(getTargets('node', '14').length, 25) // 0.11 & 0.12
  // t.equal(getTargets('node', '46').length, 31) // 4
  t.equal(getTargets('node', '47').length, 19) // 5
  // t.equal(getTargets('node', '48').length, 20) // 6
  // t.equal(getTargets('node', '51').length, 11) // 7

  t.end()
})

test('getTargets calculates correct Electron target', function (t) {
  t.equal(getTargets('electron', '47').length, 25) // 0.36 & 1.0
  t.equal(getTargets('electron', '48').length, 13) // 1.1 & 1.2
  t.equal(getTargets('electron', '49').length, 13) // 1.3
  t.equal(getTargets('electron', '50').length, 15) // 1.4

  t.end()
})

test('getAbi calculates correct Node ABI', function (t) {
  t.throws(function () { getAbi('node', '42.42.42') })

  t.equal(getAbi('node', '7.2.0'), '51')
  t.equal(getAbi('node', '7.0.0'), '51')
  t.equal(getAbi('node', '6.9.0'), '48')
  t.equal(getAbi('node', '6.0.0'), '48')
  t.equal(getAbi('node', '5.9.1'), '47')
  t.equal(getAbi('node', '5.0.0'), '47')
  t.equal(getAbi('node', '4.8.0'), '46')
  t.equal(getAbi('node', '4.0.0'), '46')
  t.equal(getAbi('node', '0.12.17'), '14')
  t.equal(getAbi('node', '0.12.0'), '14')
  t.equal(getAbi('node', '0.11.16'), '14')
  t.equal(getAbi('node', '0.11.11'), '14')
  t.equal(getAbi('node', '0.11.10'), '13')
  t.equal(getAbi('node', '0.11.8'), '13')
  t.equal(getAbi('node', '0.11.7'), '0x000C')
  t.equal(getAbi('node', '0.11.0'), '0x000C')
  t.equal(getAbi('node', '0.10.48'), '11')
  t.equal(getAbi('node', '0.10.30'), '11')
  t.equal(getAbi('node', '0.10.4'), '11')
  t.equal(getAbi('node', '0.10.3'), '0x000B')
  t.equal(getAbi('node', '0.10.1'), '0x000B')
  t.equal(getAbi('node', '0.10.0'), '0x000B')
  t.equal(getAbi('node', '0.9.12'), '0x000B')
  t.equal(getAbi('node', '0.9.9'), '0x000B')
  t.equal(getAbi('node', '0.9.8'), '0x000A')
  t.equal(getAbi('node', '0.9.1'), '0x000A')
  t.equal(getAbi('node', '0.9.0'), '1')
  t.equal(getAbi('node', '0.8.0'), '1')
  t.equal(getAbi('node', '0.2.0'), '1')

  t.end()
})

test('getAbi calculates correct Electron ABI', function (t) {
  t.throws(function () { getAbi('electron', '42.42.42') })

  t.equal(getAbi('electron', '1.4.0'), '50')
  t.equal(getAbi('electron', '1.3.0'), '49')
  t.equal(getAbi('electron', '1.2.0'), '48')
  t.equal(getAbi('electron', '1.1.0'), '48')
  t.equal(getAbi('electron', '1.0.0'), '47')
  t.equal(getAbi('electron', '0.37.0'), '47')
  t.equal(getAbi('electron', '0.36.0'), '47')
  t.equal(getAbi('electron', '0.35.0'), '46')
  t.equal(getAbi('electron', '0.34.0'), '46')
  t.equal(getAbi('electron', '0.33.0'), '46')
  t.equal(getAbi('electron', '0.32.0'), '45')
  t.equal(getAbi('electron', '0.31.0'), '45')
  t.equal(getAbi('electron', '0.30.0'), '44')

  t.end()
})
