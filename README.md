# Node.js ABI

[![Build Status](https://travis-ci.org/lgeiger/node-abi.svg?branch=v1.0.0)](https://travis-ci.org/lgeiger/node-abi)

Get the Node ABI for a given target and runtime.

## Installation
```
npm install node-abi
```

## Usage
```javascript
const nodeAbi = require('node-abi')

nodeAbi.getAbi('7.2.0', 'node')
// '51'
nodeAbi.getAbi('1.4.10', 'electron')
// '50'

nodeAbi.allTargets
// [
//   { runtime: 'node', target: '0.10.48' },
//   { runtime: 'node', target: '0.12.17' },
//   { runtime: 'node', target: '4.6.1' },
//   { runtime: 'node', target: '5.12.0' },
//   { runtime: 'node', target: '6.9.1' },
//   { runtime: 'node', target: '7.0.0' },
//   { runtime: 'electron', target: '1.0.2' },
//   { runtime: 'electron', target: '1.2.8' },
//   { runtime: 'electron', target: '1.3.12' },
//   { runtime: 'electron', target: '1.4.10' }
// ]
```

## References

- https://github.com/lgeiger/electron-abi
- https://nodejs.org/en/download/releases/
