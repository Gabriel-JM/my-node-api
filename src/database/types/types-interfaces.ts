import { RowDataPacket, OkPacket } from "mysql2"

export type whereValue = keyValuePair[]

export type keyValuePair = [string, (string | number | boolean)]

export type DatabaseRowData = RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[]

export interface QueryObject {
  values?: string
  where?: whereValue | keyValuePair
  join?: Join
  orderBy?: string
}

export interface Join {
  table: string
  on: [string, string]
  join?: Join
}

export interface ValuesInsert {
  values: (string | number | boolean)[] | object
}

export interface ValuesUpdate {
  values: object
  where: whereValue | keyValuePair
}
