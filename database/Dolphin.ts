import connection from './connection'
import QueryBuilder from './utils/QueryStringBuilder'
import {
  QueryObject,
  ValuesInsert,
  ValuesUpdate,
  DatabaseRowData
} from './types/types-interfaces'
import StringParser from '../core/StringParser/StringParser'

export default class Dolphin {

  private conn = connection
  private queryBuilder = new QueryBuilder()

  constructor(private table: string) {}

  async selectAll() {
    const query = `SELECT * FROM ${this.table};`

    return this.execQuery(query)
  }

  async select(queryConfig: QueryObject) {
    const { values } = queryConfig

    let query = `SELECT ${values} FROM ${this.table}`

    if(queryConfig.join) {
      query = this.queryBuilder.createJoin(query, queryConfig.join)
    }

    if(queryConfig.where) {
      query += this.queryBuilder.createWhereQuery(queryConfig.where)
    }

    if(queryConfig.orderBy) {
      const { orderBy } = queryConfig
      query += ` ORDER BY ${orderBy}`
    }

    query += ';'

    return this.execQuery(query)
  }

  async insert(insertValues: ValuesInsert) {
    let { values } = insertValues
    const isArray = Array.isArray(values)
    let method = (
      isArray ? 'insertFromArrayValues' : 'insertFromObject'
    )

    const query = this.queryBuilder[method](this.table, values)

    values = isArray ? values : Object.values(values)

    return this.execQuery(query, values as [])
  }

  async update(updateObj: ValuesUpdate) {
    const { values, where } = updateObj
    const stringValue = this.queryBuilder.updateValuesString(values)
    const whereString = this.queryBuilder.createWhereQuery(where)

    const query = (`
      UPDATE ${this.table} SET ${stringValue}${whereString};
    `)

    return this.execQuery(query)
  }

  async delete(id: number) {
    const query = `DELETE FROM ${this.table} WHERE id = ?`

    return this.execQuery(query, [id])
  }

  private async verifyRelations(rows: DatabaseRowData) {
    //console.log(rows)

    return rows
  }

  private async sanitazeResult(rows: DatabaseRowData) {
    const stringParser = new StringParser()

    if(Array.isArray(rows)) {
      return (rows as []).map((row: DatabaseRowData) => { 
        return stringParser.parseObjectAttributes(row)
      }) as DatabaseRowData
    }
    
    return stringParser.parseObjectAttributes(rows) as DatabaseRowData
  }

  private async execQuery(query: string, values: any[] = []) {
    try {
      const [rows, fields] = await this.conn.execute(query, values)
      const data = this.sanitazeResult(rows)

      return { rows: data, fields }
    } catch(err) {
      console.error(err)
      return null
    }
  }

}