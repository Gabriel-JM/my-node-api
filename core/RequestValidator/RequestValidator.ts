import { stringKeyAccess } from '../types/types-interfaces'

class RequestValidator {

  [key: string]: any
  modelKeys: string[]

  constructor(private model: stringKeyAccess) {
    this.modelKeys = Object.keys(model)
  }

  validate(requestContent: stringKeyAccess) {
    const requestKeysValidationResult = this.validateRequiredKeys(requestContent)
    
    if(!requestKeysValidationResult) {
      return {
        message: 'Request don\'t obey to the model requirement.',
        valid: false
      }
    }

    if(this.getLength(this.modelKeys) < this.getLength(this.requestKeys)) {
      return {
        message: 'Request has more properties then model.',
        valid: false
      }
    }

    const validationObj = this.createValidationObject()

    let validationResult = {
      message: 'Ok',
      valid: true
    }

    for(const key in validationObj) {
      const requestValue = requestContent[key]
      const modelKey = this.model[key]
      const toValidateField = validationObj[key]

      toValidateField.forEach((methodName: string) => {
        const modelKeyValidation = modelKey[methodName]
        if(methodName in this) {
          const result = this[methodName](modelKeyValidation, requestValue)
          const isntRequestValid = (
            !result && (!modelKey.optional || 
            modelKey.optional && requestValue)
          )
          
          if(isntRequestValid) {
            validationResult = {
              message: `Request didn't pass on ${key} field ${methodName} validation.`,
              valid: result
            }
          }
        }
      })
      
    }

    return validationResult
  }

  private createValidationObject() {
    return this.modelKeys.reduce((acc, key) => {
      return {...acc, [key]: Object.keys(this.model[key])}
    }, {} as stringKeyAccess)
  }

  private validateRequiredKeys(requestContent: stringKeyAccess) {
    this.requestKeys = Object.keys(requestContent)
    
    const requiredKeys = this.modelKeys.filter(key => {
      const optional = this.model[key].optional || false
      return optional == false
    })

    const requiredKeysValidation = requiredKeys.every(key => {
      return this.requestKeys.includes(key)
    })

    return requiredKeysValidation
  }

  private getLength(value: number|string|[]|{}) {
    const methods: stringKeyAccess = {
      number(value: number) {
        return value.toString().length
      },
      string(value: string) {
        return value.length
      },
      object(value: object | []) {
        return Object.keys(value).length
      }
    }

    const methodName = typeof value
    return methodName in methods ? methods[methodName](value) : 0
  }

  private type(expected: string, value: any) {
    return Array.isArray(value) ?
      expected === 'array' :
      expected === typeof value
  }

  private maxLength(limit: number, value: number|string|[]|{}) {
    return this.getLength(value) <= limit
  }

  private minLength(minimum: number, value: number|string|[]|{}) {
    return this.getLength(value) >= minimum
  }

  private length(expected: number, value: number|string|[]|{}) {
    return this.getLength(value) === expected
  }

  private maxValue(limit: number, value: number) {
    return value <= limit
  }

  private minValue(minimum: number, value: number) {
    return value >= minimum
  }

  private valueBetween(valuesToCompare: number[], value: number) {
    if(!Array.isArray(valuesToCompare)) return false

    const [minimum, maximum] = valuesToCompare
    return value >= minimum && value <= maximum
  }

  private equalTo(expected: number|string|boolean, value: number|string|boolean) {
    return expected === value
  }

  private timeFormat(pattern: string, value: string) {
    if(typeof value !== 'string') return false

    const patterns: stringKeyAccess = {
      'hh:mm a': /(0[1-9]|1[0-2]):[0-5]\d\s(AM|PM)/g,
      'hh:mm:ss a': /(0[1-9]|1[0-2]):[0-5]\d:[0-5]\d\s(AM|PM)/g,
      'hh:mm': /([0-1]\d|2[0-4]):[0-5]\d/g,
      'hh:mm:ss': /([0-1]\d|2[0-4]):[0-5]\d:[0-5]\d/g,
    }

    const regex = patterns[pattern]
    return pattern in patterns && RegExp(regex).test(value)
  }

}

export default RequestValidator