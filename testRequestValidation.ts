import RequestValidator from './core/RequestValidator/RequestValidator'

const model = {
  name: {
    type: 'string',
    maxLength: 80,
    optional: false
  },
  color: {
    type: 'string',
    length: 7,
    optional: false
  }
}

const request = {
  name: 'hi',
  color: '#ff00ff'
}

const requestValidator = new RequestValidator(model)

const result = requestValidator.validate(request)

console.log(result)