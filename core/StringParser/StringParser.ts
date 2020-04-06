export default class StringParser {

    private captalize(string: string) {
        const firstLetterUp = string.charAt(0).toUpperCase()
        return firstLetterUp + string.slice(1)
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

}