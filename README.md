# Node.js ABI

[![Build Status](https://travis-ci.org/lgeiger/node-abi.svg?branch=v1.0.0)](https://travis-ci.org/lgeiger/node-abi) [![Greenkeeper badge](https://badges.greenkeeper.io/lgeiger/node-abi.svg)](https://greenkeeper.io/)


Get the Node ABI for a given target and runtime, and vice versa.

## Installation
```
npm install node-abi
```

## Usage
```javascript
const nodeAbi = require('node-abi')

nodeAbi.getAbi('node', '7.2.0')
// '51'
nodeAbi.getAbi('electron', '1.4.10')
// '50'
nodeAbi.getTargets('node', '47')
// [ '5.0.0',
//   '5.1.0',
//   ...
//   '5.11.1',
//   '5.12.0' ]
nodeAbi.getTargets('electron', '49')
// [ '1.3.0',
//   '1.3.1',
//   ...
//   '1.3.12',
//   '1.3.13' ]

nodeAbi.allTargets
// [ { runtime: 'node', target: '0.2.0', abi: '1' },
//   { runtime: 'node', target: '0.2.1', abi: '1' },
//   ...
//   { runtime: 'node', target: '7.7.1', abi: '51' },
//   { runtime: 'node', target: '7.7.2', abi: '51' },
//   { runtime: 'electron', target: '0.24.0', abi: '43' },
//   ...
//   { runtime: 'electron', target: '1.6.2', abi: '53' },
//   { runtime: 'electron', target: '1.6.3', abi: '53' } ]
nodeAbi.deprecatedTargets
nodeAbi.supportedTargets
// ...
```

## References

- https://github.com/lgeiger/electron-abi
- https://nodejs.org/en/download/releases/
- https://github.com/nodejs/LTS
