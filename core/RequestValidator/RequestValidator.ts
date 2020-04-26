import { stringKeyAccess } from "../types/interfaces"

class RequestValidator {

  [key: string]: any

  constructor(private model: stringKeyAccess) {}

  validate(requestContent: stringKeyAccess) {
    const modelKeys = Object.keys(this.model)
    const requestKeys = Object.keys(requestContent)

    const requiredKeys = modelKeys.filter(key => {
      const optional = this.model[key].optional || false
      return optional == false
    })

    const validateRequestKeys = requiredKeys.every(key => {
      return requestKeys.includes(key)
    })
    
    if(!validateRequestKeys) {
      return {
        message: 'Request don\'t obey to the model requirement.',
        valid: false
      }
    }

    if(this.getLength(modelKeys) < this.getLength(requestKeys)) {
      return {
        message: 'Request has more properties then model.',
        valid: false
      }
    }

    const validationObj = modelKeys.reduce((acc, key) => {
      return {...acc, [key]: Object.keys(this.model[key])}
    }, {} as stringKeyAccess)

    Object.keys(validationObj).forEach(key => {
      validationObj[key].forEach((toValidate: string) => {
        console.log(key, toValidate, toValidate in this)
      })
    })

    return true
  }

  private type(expected: string, value: any) {
    return Array.isArray(value) ?
      expected === 'array' :
      expected === typeof value
  }

  private getLength(value: number | string | [] | {}) {
    const methods: stringKeyAccess = {
      number(value: number) {
        return value.toString().length
      },
      string(value: string) {
        return value.length
      },
      object(value: object | []) {
        const isArray = Array.isArray(value)

        return isArray ?
          (value as []).length :
          Object.keys(value).length
      }
    }

    return methods[typeof value](value)
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

  private timeFormat(value: string) {
    const regex = /([0-1][0-9]|2[0-4]):[0-5][0-9]/g
    return RegExp(regex).test(value)
  }

}

export default RequestValidator