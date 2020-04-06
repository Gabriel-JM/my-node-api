import * as http from 'http'
import * as Url from 'url'
import { RequestContent } from './core/types/interfaces'
import AppRouter from './app/AppRouter'

const port = 3200

const server = http.createServer(
    async (req: http.IncomingMessage, res: http.ServerResponse) => {
        const { url = '/', method = 'GET'} = req
        const { pathname, query } = Url.parse(url, true)

        const pathArray = pathname ? pathname.split('/').slice(1) : []

        try {
            const body = await getBodyContent(req)

            const content: RequestContent = {
                req, res,
                method, query,
                pathname, pathArray,
                body
            }

            new AppRouter(content)
        } catch(err) {
            console.error('There is an error: ',err)
            res.writeHead(400)
            res.end()
        }
    }
)

server.listen(port, () => console.log('Server working... Port: '+port))

function getBodyContent(req : http.IncomingMessage): Promise<object | null> {
    return new Promise((resolve, reject) => {
        let body: Uint8Array[] = []

        req.on('error', err => {
            reject(err)
        }
        ).on('data', chunck => {
            body = [...body, chunck]
        }
        ).on('end', () => {
            const stringBody = Buffer.concat(body).toString('uft8')

            if(stringBody) {
                resolve(JSON.parse(stringBody))
            }

            resolve(null)
        })
    })
}