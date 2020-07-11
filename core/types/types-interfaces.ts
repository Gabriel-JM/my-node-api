import http from 'http'
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

export interface StringKeyAccess {
  [key: string]: any
}

export interface DeleteResult {
  message: string
  objectId: number
  ok: boolean
}

export type RepositoryResult<TYPE> = Promise<TYPE | RepositoryResultError | RepositoryDeleteResult>

export interface RepositoryDeleteResult {
  message: string
  objectId: number
  ok: boolean
}

export interface RepositoryResultError {
  error: Error
  method: string
}

export type BodyContent = { id: number }