import fs from 'fs'
import path from 'path'
import StringParser from '../StringParser/StringParser'

const stringParser = new StringParser()

let mainPath: string

export default function build(mainFolderPath: string) {
    try {
        mainPath = mainFolderPath
        const dirs = fs.readdirSync(mainPath, 'utf-8')
        const controllers = extractFoldersController(dirs)

        return buildImports(dirs, controllers)
    } catch(error) {
        console.log('\nbuild function: Folder not found\n\n', error)
        return {} as object
    }
}

function extractFoldersController(foldersNames: string[]) {
    const controllerFiles = foldersNames.map(folder => {
        try {
            const folderPath = path.join(mainPath, folder)
            const folderContent = fs.readdirSync(folderPath)
            const controllerFile = folderContent.find(file => {
                return file === `${folder}Controller.ts`
            })

            return controllerFile
        } catch {
            console.log('\nextractFoldersController function: File not found\n\n')
            return null
        }
    })

    return controllerFiles.filter(file => file) as string[]
}

function buildImports(dirs: string[], controllers: string[]) {
    const importsObject = {}

    dirs.forEach(dirName => {
        const controllerName = `${dirName}Controller.ts`
        const requestPath = path.join(mainPath, dirName, controllerName)
        const existsPath = fs.existsSync(requestPath)

        if(existsPath && controllers.includes(controllerName)) {
            const pathName = stringParser.pascalCaseToDashCase(dirName)
            const controllerClass = require(requestPath)
            const controller = (
                'default' in controllerClass ?
                    controllerClass.default : controllerClass
            )

            Object.assign(importsObject, {
                [pathName]: controller
            })
        }
    })

    return importsObject
}