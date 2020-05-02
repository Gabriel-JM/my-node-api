import RequestValidator from './core/RequestValidator/RequestValidator'

const model = {
  name: {
    type: 'string',
    timeFormat: 'hh:mm:ss'
  }
}

const request = {
  name: '18:50:00'
}

const requestValidator = new RequestValidator(model)

const result = requestValidator.validate(request)

console.log(result)