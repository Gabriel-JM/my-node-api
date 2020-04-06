import * as http from 'http'
import { EventEmitter } from 'events'
import { RequestContent } from '../types/interfaces'
import StringParser from '../StringParser/StringParser'
import Service from './Service'

const stringParser = new StringParser()
const eventNames = ['get', 'post', 'put', 'delete', 'options']

export default abstract class Controller extends EventEmitter {
    [key: string]: any
    protected event = ''
    protected res: http.ServerResponse
    protected req: http.IncomingMessage
    protected headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': 2592000000
    }

    constructor(
        protected content: RequestContent,
        protected service?: Service
    ) {
        super()
        this.res = content.res
        this.req = content.req
        this.createEvents()
    }

    private createEvents() {
        this.generateEventsNames()

        eventNames.forEach(event => {
            this.on(event, () => {
                const hasEvent = event in this
                if(!hasEvent) {
                    this.notFound()
                    this.res.end()
                    throw console.error('Event not found')
                }

                this[event]()
            })
        })
    }

    private generateEventsNames() {
        const { pathArray, method } = this.content
        this.event = stringParser.createEventName(method, pathArray)

        if(!eventNames.includes(this.event)) {
            eventNames.push(this.event)
        }
    }

    private verifyMethod() {
        const hasEventMethod = eventNames.includes(this.event)

        return hasEventMethod ? this.event : 'default'
    }

    async get() {
        let { id = null } = this.content.query
        let result: {} | []

        if(id) {
            const numberId = Number(id)
            result = await this.service?.getOne(numberId)
        }

        result = await this.service?.getAll()

        this.ok()
        this.res.end(JSON.stringify(result))
    }

    async post() {
        const { body = null } = this.content

        if(body) {
            const result = await this.service?.postOne(body)

            this.ok()
            this.res.end(JSON.stringify(result))
        }

        this.badRequest()
        this.res.end(
            this.sendMessage('Request Body not found.', false)
        )
    }

    put() {

    }

    delete() {

    }

    ok() {
        this.res.writeHead(200, this.headers)
    }

    options() {
        this.res.writeHead(204, this.headers)
        this.res.end()
    }

    badRequest() {
        this.res.writeHead(400, this.headers)
    }

    notFound() {
        this.res.writeHead(404, this.headers)
    }

    notAllowed() {
        this.res.writeHead(405, this.headers)
    }

    default() {
        this.notAllowed()
        this.res.end(
            this.sendMessage('Method not allowed', false)
        )
    }

    sendMessage(message: string, status: boolean) {
        return JSON.stringify({
            message,
            ok: status
        })
    }

    start() {
        this.emit(this.verifyMethod())
    }

}