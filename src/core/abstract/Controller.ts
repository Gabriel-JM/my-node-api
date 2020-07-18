import http from 'http'
import { EventEmitter } from 'events'
import { RequestContent, MinimumBodyContent, ServiceResult, ValidationObject } from '../types/types-interfaces'
import StringParser from '../StringParser/StringParser'
import Service from './Service'
import RequestValidator from '../RequestValidator/RequestValidator'

const stringParser = new StringParser()
const eventNames = ['get', 'post', 'put', 'delete', 'options']

export default abstract class Controller<TYPE extends object> extends EventEmitter {
  [key: string]: any
  protected event = ''
  protected res: http.ServerResponse
  protected req: http.IncomingMessage
  protected requestValidator: RequestValidator
  protected headers = {
    'Content-Type': 'application/json'
  }

  constructor(
    protected content: RequestContent,
    protected service: Service<TYPE>,
    protected requestModel: ValidationObject
  ) {
    super()
    this.requestValidator = new RequestValidator(requestModel)
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
    let result: ServiceResult<TYPE>

    if(id) {
      const numberId = Number(id)
      result = await this.service.findById(numberId)
    } else {
      result = await this.service.findAll()
    }

    if(!result) {
      this.badRequest()
      this.sendMessage('Failed on get result.', false)
    }

    this.ok()
    this.sendResponse(result)
  }

  async post() {
    const { body = null } = this.content

    if(!body) {
      this.badRequest()
      this.sendMessage('Request Body not found.', false)
      return
    }
    
    const validationResult = this.requestValidator.validate(body)
      
    if(!validationResult.valid) {
      this.badRequest()
      this.sendMessage(validationResult.message, false)
      return
    }
    
    const result = await this.service.create(body as TYPE)

    if(!result) {
      this.serverError()
      this.sendMessage('Failed on create.', false)
    }

    this.ok()
    this.sendResponse(result)
  }

  async put() {
    const { body = null } = this.content

    if(body && (body as MinimumBodyContent).id) {
      const validationResult = this.requestValidator.validate(body)

      if(validationResult.valid) {
        const result = await this.service.update(body as TYPE)

        if(!result) {
          this.badRequest()
          this.sendMessage('Failed on update.', false)
        }

        this.ok()
        this.sendResponse(result)
      } else {
        this.badRequest()
        this.sendMessage(validationResult.message, false)
      }
    }

    this.badRequest()
    this.sendMessage('Request Body must have an ID.', false)
  }

  async delete() {
    const { id } = this.content.query

    if(id) {
      const result = await this.service.destroy(Number(id))

      result.ok ? this.ok() : this.notFound()
      this.sendResponse(result)
    }

    this.badRequest()
    this.sendMessage('Request Query must have an ID', false)
  }

  ok() {
    this.res.writeHead(200, this.headers)
  }

  options() {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': 2592000000
    }

    this.res.writeHead(204, headers)
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

  serverError() {
    this.res.writeHead(500, this.headers)
  }

  default() {
    this.notAllowed()
    this.res.end(
      this.sendMessage('Method not allowed', false)
    )
  }

  contentType(type: string) {
    this.res.writeHead(200, { 'Content-Type': type })
  }

  sendResponse(responseContent: ServiceResult<TYPE>) {
    this.res.end(JSON.stringify(responseContent))
  }

  sendMessage(message: string, status: boolean) {
    const jsonMessage = JSON.stringify({
      message,
      ok: status
    })

    this.res.end(jsonMessage)
  }

  init() {
    this.emit(this.verifyMethod())
  }
}
