import connection from './connection'
import QueryBuilder from './utils/QueryStringBuilder'
import { QueryObject, ValuesInsert, ValuesUpdate } from './types/interfaces'

export default class Dolphin {

    private conn = connection
    private queryBuilder = new QueryBuilder()

    constructor(private table: string) {}

    async selectAll() {
        const query = `SELECT * FROM ${this.table};`

        return await this.execQuery(query)
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

        return await this.execQuery(query)
    }

    async insert(insertValues: ValuesInsert) {
        const { values } = insertValues
        const isArray = Array.isArray(values)
        let method = (
            isArray ? 'insertFromArrayValues' : 'insertFromObject'
        )

        const query = this.queryBuilder[method](this.table, values)

        return await this.execQuery(query, values as [])
    }

    async update(updateObj: ValuesUpdate) {
        const { values, where } = updateObj
        const stringValue = this.updatePairString(values)
        const [toBeCompared, valueToCompare] = where

        const query = (`
            UPDATE ${this.table} SET ${stringValue} 
            WHERE ${toBeCompared} = ${valueToCompare};
        `)

        return await this.execQuery(query)
    }

    private updatePairString(obj: object) {
        const entries = Object.entries(obj)
        let finalString = ''

        entries.forEach((entry, index) => {
            const [key, value] = entry
            if(index) {
                finalString += `, ${key} = ${value}`
            } else {
                finalString += `${key} = ${value}`
            }
        })

        return finalString
    }

    async delete(id: number) {
        const query = `DELETE FROM ${this.table} WHERE id = ?`

        return await this.execQuery(query, [id])
    }

    private async execQuery(query: string, values?: any[]) {
        try {
            const [rows, fields] = await this.conn.execute(query, values)

            return { rows, fields }
        } catch(err) {
            console.error(err)
            return null
        }
    }

}