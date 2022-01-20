const tsNode = require('ts-node')
// register TypeScript Node require hook
// https://github.com/TypeStrong/ts-node#programmatic-usage
const path = require('path')
const project = path.join(__dirname, 'tsconfig.json')

process.env.TS_CACHED_TRANSPILE_CACHE = path.join(__dirname, 'node_modules', '.ts-cache')

tsNode.register({
  project,
  transpileOnly: true,
  preferTsExts: true, 
})

require('./scripts/gulpfile')
