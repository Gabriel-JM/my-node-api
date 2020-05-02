import { stringKeyAccess } from "../types/interfaces"

class RequestValidator {

  [key: string]: any
  modelKeys: string[]

  constructor(private model: stringKeyAccess) {
    this.modelKeys = Object.keys(this.model)
  }

  validate(requestContent: stringKeyAccess) {
    this.requestKeys = Object.keys(requestContent)

    const requestKeysValidationResult = this.validateRequiredKeys()
    
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

    Object.keys(validationObj).forEach(key => {
      const requestValue = requestContent[key]
      const modelKey = this.model[key]
      validationObj[key].forEach((toValidate: string) => {
        if(toValidate in this) {
          const result = this[toValidate](modelKey[toValidate], requestValue)
          if(!result) {
            validationResult = {
              message: `Request didn't pass on ${toValidate} validation.`,
              valid: result
            }
          }
        }
      })
    })

    return validationResult
  }

  private createValidationObject() {
    return this.modelKeys.reduce((acc, key) => {
      return {...acc, [key]: Object.keys(this.model[key])}
    }, {} as stringKeyAccess)
  }

  private validateRequiredKeys() {
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
    const [minimum, maximum] = valuesToCompare
    return value >= minimum && value <= maximum
  }

  private equalTo(expected: number|string|boolean, value: number|string|boolean) {
    return expected === value
  }

  private timeFormat(pattern: string, value: string) {
    const patterns: stringKeyAccess = {
      'hh:mm': /([0-1][0-9]|2[0-4]):[0-5][0-9]/g,
      'hh:mm:ss': /([0-1][0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]/g,
    }

    const regex = patterns[pattern]
    return RegExp(regex).test(value)
  }

}

export default RequestValidator