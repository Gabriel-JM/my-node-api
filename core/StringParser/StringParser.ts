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
    const match = text.match(/(?<=[a-z])[A-Z]/)

    if(!match) return text.toLowerCase()

    const stringArray = this.recreateSplitedWord(text, match)
    const newText = stringArray.join('-')

    return this.pascalCaseToDashCase(newText)
  }

}