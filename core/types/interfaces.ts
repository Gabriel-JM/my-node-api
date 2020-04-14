import * as http from 'http'
import { ParsedUrlQuery } from 'querystring';

export interface RequestContent {
    req: http.IncomingMessage
    res: http.ServerResponse
    method: string
    query: ParsedUrlQuery
    pathname: string | null
    pathArray: string[]
    body: BodyContent
}

export type BodyContent = { id?: number } | null
