import path from 'path'
import { RequestContent, StringKeyAccess } from '../core/types/types-interfaces'
import ImportsBuilder from '../core/ImportsBuilder/ImportsBuilder'
import { ServerResponse } from 'http'

const srcPath = path.join(__dirname, 'src')
const controllers: StringKeyAccess = ImportsBuilder(srcPath)

export default function appRouter(content: RequestContent) {
  const { res, pathArray } = content
  const [pathOrigin] = pathArray
  const hasPath = controllers && pathOrigin in controllers

  hasPath ? redirectToController(content, pathOrigin) : notFound(res)
}

function redirectToController(content: RequestContent, pathOrigin: string) {
  const controller = controllers[pathOrigin]
  return new controller(content).init()
}

function notFound(response: ServerResponse) {
  response.writeHead(404, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({
    message: 'Path not found.',
    ok: false
  }))
}
