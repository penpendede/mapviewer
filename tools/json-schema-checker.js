const fs = require('fs')
const { Validator } = require('jsonschema')
const { ArgumentParser } = require('argparse')

let validator = new Validator()
let parser = new ArgumentParser({
  'version': '0.0.1',
  'addHelp': true,
  'description': "Validate the project's config files against JSON schemata"
})

parser.addArgument(
  ['-V', '--verbose'],
  {
    'help': 'Verbose error output',
    'nargs': 0
  }
)

let args = parser.parseArgs()

validator.addSchema(JSON.parse(fs.readFileSync('./schemata/pointSchema.json', 'utf8')), 'point')
validator.addSchema(JSON.parse(fs.readFileSync('./schemata/latLngBoundsSchema.json', 'utf8')), 'latLngBounds')
validator.addSchema(JSON.parse(fs.readFileSync('./schemata/subDomainsSchema.json', 'utf8')), 'subDomains')
validator.addSchema(JSON.parse(fs.readFileSync('./schemata/layerOptsSchema.json', 'utf8')), 'layerOpts')
validator.addSchema(JSON.parse(fs.readFileSync('./schemata/layerSourceSchema.json', 'utf8')), 'layerSource')
validator.addSchema(JSON.parse(fs.readFileSync('./schemata/layerSchema.json', 'utf8')), 'layer')
validator.addSchema(JSON.parse(fs.readFileSync('./schemata/layerFileSchema.json', 'utf8')), 'layerFile')
validator.addSchema(JSON.parse(fs.readFileSync('./schemata/viewSchema.json', 'utf8')), 'view')
validator.addSchema(JSON.parse(fs.readFileSync('./schemata/startupConfigSchema.json', 'utf8')), 'startupConfig')

let abortIfValidationFails = (fileName, verbose, validationResult) => {
  if (!validationResult.valid) {
    let errorMessage = file + ': JSON schema validation failed\n'
    if (verbose) {
      errorMessage += JSON.stringify(validationResult, null, 2)
    } else {
      errorMessage += 'For details use --verbose'
    }
    throw new Error(errorMessage)
  }
}

for (let file of ['config/baselayers.json', 'config/featurelayers.json']) {
  fs.readFile(file, (err, data) => {
    if (err) throw err

    abortIfValidationFails(file, args.verbose, validator.validate(
      JSON.parse(data),
      '/layerFile'
    ))
  })
}

let file = 'config/startup.json'
fs.readFile(file, (err, data) => {
  if (err) throw err
  abortIfValidationFails(file, args.verbose, validator.validate(
    JSON.parse(data),
    '/startupConfig'
  ))
})
