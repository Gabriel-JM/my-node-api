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
    optional: true
  }
}

const request = {
  name: 'hi',
  color: '#ff00ff'
}

const requestValidator = new RequestValidator(model)

requestValidator.validate(request)