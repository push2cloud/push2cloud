var parse = require('./lib/json-schema-to-markdown')
var fs = require('fs')
file = process.argv[2] 
var schema = JSON.parse(fs.readFileSync(file).toString())
var markdown = parse(schema)
console.log(markdown)

