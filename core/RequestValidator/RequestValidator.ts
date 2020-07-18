import { StringKeyAccess, ValidationObject } from '../types/types-interfaces'

type MeasurableTypes = string | number | [] | {}

class RequestValidator {

  [key: string]: any
  modelKeys: string[]

  constructor(private model: ValidationObject) {
    this.modelKeys = Object.keys(model)
  }

  validate(requestContent: StringKeyAccess) {
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
    }, {} as StringKeyAccess)
  }

  private validateRequiredKeys(requestContent: StringKeyAccess) {
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

  private getLength(value: MeasurableTypes) {
    const methods: StringKeyAccess = {
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

  type(expected: string, value: any) {
    return Array.isArray(value) ?
      expected === 'array' :
      expected === typeof value
  }

  maxLength(limit: number, value: MeasurableTypes) {
    return this.getLength(value) <= limit
  }

  minLength(minimum: number, value: MeasurableTypes) {
    return this.getLength(value) >= minimum
  }

  length(expected: number, value: MeasurableTypes) {
    return this.getLength(value) === expected
  }

  lengthBetween(expectedValues: [number, number], value: MeasurableTypes) {
    const [minimum, maximum] = expectedValues
    return this.minLength(minimum, value) && this.maxLength(maximum, value)
  }

  maxValue(limit: number, value: number) {
    return value <= limit
  }

  minValue(minimum: number, value: number) {
    return value >= minimum
  }

  valueBetween(valuesToCompare: [number, number], value: number) {
    if(!Array.isArray(valuesToCompare)) return false

    const [minimum, maximum] = valuesToCompare
    return value >= minimum && value <= maximum
  }

  maxDecimalLength(lengthValues: [number, number], value: number) {
    const [maxBeforeDot, maxAfterDot] = lengthValues
    const [beforeDot, afterDot = 0] = value.toString().split('.')
    return (
      this.maxLength(maxBeforeDot, +beforeDot) && this.maxLength(maxAfterDot, +afterDot)
    )
  }

  minDecimalLength(lengthValues: [number, number], value: number) {
    const [minBeforeDot, minAfterDot] = lengthValues
    const [beforeDot, afterDot = 0] = value.toString().split('.')
    return (
      this.minLength(minBeforeDot, +beforeDot) && this.minLength(minAfterDot, +afterDot)
    )
  }

  decimalLength(lengthValues: [number, number], value: number) {
    const [lengthBeforeDot, lengthAfterDot] = lengthValues
    const [beforeDot, afterDot = 0] = value.toString().split('.')
    return (
      this.length(lengthBeforeDot, +beforeDot) && this.length(lengthAfterDot, +afterDot)
    )
  }

  equalTo(expected: number|string|boolean, value: number|string|boolean) {
    return expected === value
  }

  regExpMatch(expected: string | RegExp, value: string | number) {
    const matchResult = RegExp(expected).exec(value.toString())
    return Boolean(matchResult)
  }

  timeFormat(pattern: string, value: string) {
    if(typeof value !== 'string') return false

    const patterns: StringKeyAccess = {
      'hh:mm a': /(0[1-9]|1[0-2]):[0-5]\d\s(AM|PM)/g,
      'hh:mm:ss a': /(0[1-9]|1[0-2]):[0-5]\d:[0-5]\d\s(AM|PM)/g,
      'hh:mm': /([0-1]\d|2[0-4]):[0-5]\d/g,
      'hh:mm:ss': /([0-1]\d|2[0-4]):[0-5]\d:[0-5]\d/g,
    }

    const regex = patterns[pattern]
    const matchResult = RegExp(regex).exec(value)
    const isInputEqualMatch = matchResult && matchResult[0] === matchResult.input

    return pattern in patterns && isInputEqualMatch
  }

  dateFormat(pattern: string, value: string) {
    if(typeof value !== 'string') return false

    const days = /(0[1-9]|[1-2][0-9]|3[0-1])/
    const months = /(0[1-9]|1[0-2])/
    const years2digits = /\d{2}/
    const years4digits = /\d{4}/

    const patterns: StringKeyAccess = {
      'dd/mm/yyyy': RegExp(`${days}\/${months}\/${years4digits}`),
      'dd/mm/yy': RegExp(`${days}\/${months}\/${years2digits}`),
      'mm/dd/yyyy': RegExp(`${months}\/${days}\/${years4digits}`),
      'mm/dd/yy': RegExp(`${months}\/${days}\/${years2digits}`),
      'dd-mm-yyyy': RegExp(`${days}-${months}-${years4digits}`),
      'dd-mm-yy': RegExp(`${days}-${months}-${years2digits}`),
      'mm-dd-yyyy': RegExp(`${months}-${days}-${years4digits}`),
      'mm-dd-yy': RegExp(`${months}-${days}-${years2digits}`),
      'yyyy-mm-dd': RegExp(`${years4digits}-${months}-${days}`)
    }

    const regex = patterns[pattern]
    const matchResult = RegExp(regex).exec(value)
    const isInputEqualMatch = matchResult && matchResult[0] === matchResult.input

    return pattern in patterns && isInputEqualMatch
  }

}

export default RequestValidator
