# Node.js ABI

[![Build Status](https://travis-ci.org/lgeiger/node-abi.svg?branch=v1.0.0)](https://travis-ci.org/lgeiger/node-abi) [![Greenkeeper badge](https://badges.greenkeeper.io/lgeiger/node-abi.svg)](https://greenkeeper.io/)


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
//  { runtime: 'node', target: '0.10.48', lts: false },
//  { runtime: 'node', target: '0.12.17', lts: false },
//  { runtime: 'node', target: '4.6.1', lts: false },
//  { runtime: 'node', target: '5.12.0', lts: false },
//  { runtime: 'node', target: '6.9.4', lts: true },
//  { runtime: 'node', target: '7.4.0', lts: false },
//  { runtime: 'electron', target: '1.0.2', lts: false },
//  { runtime: 'electron', target: '1.2.8', lts: false },
//  { runtime: 'electron', target: '1.3.13', lts: false },
//  { runtime: 'electron', target: '1.4.15', lts: false }
// ]
```

## References

- https://github.com/lgeiger/electron-abi
- https://nodejs.org/en/download/releases/
