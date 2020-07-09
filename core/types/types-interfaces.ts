import * as http from 'http'
import { ParsedUrlQuery } from 'querystring';

export interface RequestContent {
  req: http.IncomingMessage
  res: http.ServerResponse
  method: string
  query: ParsedUrlQuery
  pathname: string | null
  pathArray: string[]
  body: {} | BodyContent
}

export interface stringKeyAccess {
  [key: string]: any
}

export interface DeleteResult {
  message: string
  objectId: number
  ok: boolean
}

export interface RepositoryResultError {
  error: Error
  method: string
}

export type BodyContent = { id: number }