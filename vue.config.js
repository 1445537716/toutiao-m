const { defineConfig } = require('@vue/cli-service')
const { ESLint } = require('eslint')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false
})
