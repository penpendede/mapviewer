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

let pointSchema = {
  'id': '/point',
  'type': 'array',
  'items': { 'type': 'number' },
  'minItems': 2,
  'maxItems': 2
}

let latLngBoundsSchema = {
  'id': '/latLngBounds',
  'type': 'array',
  'items': { 'type': {'$ref': '/point'} },
  'minItems': 2,
  'maxItems': 2
}

let subDomainSchema = {
  'id': '/subDomain',
  'oneOf': [
    { 'type': 'string' },
    {
      'type': 'array',
      'items': {
        'type': 'string'
      },
      'minItems': 1
    }
  ]
}

let layerOptsSchema = {
  'id': '/layerOpts',
  'type': 'object',
  'properties': {
    'attribution': { 'type': 'string' },
    'bounds': { 'type': { '$ref': '/latLngBounds' } },
    'maxZoom': { 'type': 'number' },
    'minZoom': { 'type': 'number' },
    'opacity': { 'type': 'number' }
  }
}

let layerSourceSchema = {
  'id': '/layerSource',
  'type': 'object',
  'properties': {
    'uriTemplate': { 'type': 'string' },
    'opts': { 'type': { '$ref': '/layerOpts' } }
  },
  'required': ['uriTemplate']
}

let layerSchema = {
  'id': '/layer',
  'type': 'object',
  'properties': {
    'label': { 'type': 'string' },
    'id': { 'type': 'string' },
    'about': { 'type': 'string' },
    'type': { 'type': 'string' },
    'source': { 'type': { '$ref': '/layerSource' } }
  },
  'required': ['label', 'id', 'type', 'source']
}

let layerFileSchema = {
  'id': '/layerFile',
  'type': 'array',
  'items': { 'type': { '$ref': '/layer' } }
}

let viewSchema = {
  'id': '/view',
  'type': 'object',
  'properties': {
    'center': { 'type': { '$ref': '/point' } },
    'zoom': { 'type': 'number' }
  }
}

let startupConfigSchema = {
  'id': '/startupConfig',
  'type': 'object',
  'properties': {
    'domElementId': { 'type': 'string' },
    'view': { 'type': { '$ref': '/view' } },
    'placeHolderBaseLayer': { 'type': { '$ref': '/layer' } }
  },
  'required': [ 'domElementId' ]
}

validator.addSchema(pointSchema, '/point')
validator.addSchema(latLngBoundsSchema, '/latLngBounds')
validator.addSchema(subDomainSchema, '/subDomain')
validator.addSchema(layerOptsSchema, '/layerOpts')
validator.addSchema(layerSourceSchema, '/layerSource')
validator.addSchema(layerSchema, '/layer')
validator.addSchema(layerFileSchema, '/layerFile')
validator.addSchema(viewSchema, '/view')
validator.addSchema(startupConfigSchema, '/startupConfig')

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
