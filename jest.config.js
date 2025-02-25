const dotenv = require('dotenv')
dotenv.config({
  path: '.env.development',
})
const nextJest = require('next/jest')

const createJestconfig = nextJest({
  dir: './',
})
const jestConfig = createJestconfig({
  moduleDirectories: ['node_modules', '<rootDir>'],
})

module.exports = jestConfig
