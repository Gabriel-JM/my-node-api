import * as path from 'path'
import { RequestContent, stringKeyAccess } from '../core/types/interfaces'
import ImportsBuilder from '../core/ImportsBuilder/ImportsBuilder'
import * as http from 'http'

const srcPath = path.join(__dirname, 'src')
const controllers: stringKeyAccess = ImportsBuilder(srcPath)

export default function appRouter(content: RequestContent) {
    const { res, pathArray } = content
    const [pathOrigin] = pathArray
    const hasPath = controllers && pathOrigin in controllers

    hasPath ? redirectToController(content, pathOrigin) : notFound(res)
}

function redirectToController(content: RequestContent, pathOrigin: string) {
    return new controllers[pathOrigin](content).init()
}

function notFound(response: http.ServerResponse) {
    response.writeHead(404, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({
        message: 'Path not found.',
        ok: false
    }))
}