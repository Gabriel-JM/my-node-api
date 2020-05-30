import { stringKeyAccess } from "@core/types/types-interfaces"

export default class StringParser {

  private captalize(string: string) {
    const firstLetterUp = string.charAt(0).toUpperCase()
    return firstLetterUp + string.slice(1)
  }

  private recreateSplitedWord(original: string, match: RegExpMatchArray) {
    let array = original.split(match[0])

    array = array.map(string => {
      if(array.indexOf(string)) {
        string = match[0].toLowerCase() + string
      }

      return string
    })

    return array
  }

  createEventName(method: string, pathArray: string[]) {
    let newEventName = method

    if(pathArray[1]) {
      const arrayCopy = pathArray.slice(1)
      arrayCopy.forEach(path => {
        if(path) {
          const newName = this.captalize(path)

          newEventName += `By${newName}`
        }
      })
    }

    return newEventName
  }

  pascalCaseToDashCase(text: string): string {
    const match = text.match(/(?<=[a-z])[A-Z]/g)

    if(!match) return text.toLowerCase()

    const stringArray = this.recreateSplitedWord(text, match)
    const newText = stringArray.join('-')

    return this.pascalCaseToDashCase(newText)
  }

  snakeCaseToCamelCase(text: string): string {
    const match = text.match(/_/g)

    if(!match) return text

    let newText = ''

    const stringArray = text.split('_')
    stringArray.forEach((string, index) => {
      if(!index) return newText += string

      newText += this.captalize(string)
    })

    return this.snakeCaseToCamelCase(newText)
  }

  removeIdFromName(text: string) {
    if(text.match(/_id/g)) {
      return text.split('_id').shift() as string
    }

    return text
  }

  parseObjectAttributes(objToParse: stringKeyAccess) {
    const keys = Object.keys(objToParse)
    const objParsed: stringKeyAccess = {}

    for(let keyName of keys) {
      const isObj = typeof objToParse[keyName] === 'object'
      const withoutIdString = this.removeIdFromName(keyName)
      const camelCasekey = this.snakeCaseToCamelCase(withoutIdString)
      
      objParsed[camelCasekey] = isObj ?
        this.parseObjectAttributes(objToParse[keyName]) :
        objToParse[keyName]
    }

    return objParsed
  }

}