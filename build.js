const { compile } = require('nexe')

compile({
  input: './index.js',
  resources: [
    './mail/*'
  ]
}).then(() => {
  console.log('success')
})