import http from 'http'
import Url from 'url'
import { RequestContent } from './types/types-interfaces'
import appRouter from '../app/appRouter'

function getBodyContent(req : http.IncomingMessage): Promise<object | null> {
  return new Promise((resolve, reject) => {
    let body: Uint8Array[] = []

    req.on('error', err => {
      reject(err)
    })
    
    req.on('data', chunck => {
      body = [...body, chunck]
    })
    
    req.on('end', () => {
      const stringBody = Buffer.concat(body).toString()

      if(stringBody) {
        resolve(JSON.parse(stringBody))
      }

      resolve(null)
    })
  })
}

const server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { url = '/', method = 'GET'} = req
    const { pathname, query } = Url.parse(url, true)

    const pathArray = pathname ? pathname.split('/').slice(1) : []

    try {
      const body = await getBodyContent(req) || {}

      const content: RequestContent = {
        req, res,
        method: method.toLowerCase(), 
        query, pathname, 
        pathArray, body
      }

      appRouter(content)
    } catch(err) {
      console.error('There is an error: ',err)
      res.writeHead(500)
      res.end()
    }
  }
)

export default server
