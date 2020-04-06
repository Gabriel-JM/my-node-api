import connection from './connection'
import { QueryObject, Join, ValuesInsert } from './types/interfaces'

export default class Dolphin {

    private query = ''
    private conn = connection

    constructor(private table: string) {}

    async selectAll() {
        const query = `SELECT * FROM ${this.table};`

        return await this.execQuery(query)
    }

    async select(queryConfig: QueryObject) {
        const { values } = queryConfig

        let query = `SELECT ${values} FROM ${this.table}`

        if(queryConfig.join) {
            query = this.createJoin(query, queryConfig.join)
        }

        if(queryConfig.where) {
            const [toBeCompared, valueToCompare] = queryConfig.where
            query += ` WHERE ${toBeCompared} = ${valueToCompare}`
        }

        if(queryConfig.orderBy) {
            const { orderBy } = queryConfig
            query += ` ORDER BY ${orderBy}`
        }

        query += ';'

        return await this.execQuery(query)
    }

    private createJoin(currentQuery: string, joinObject: Join): string {
        if(joinObject) {
            const { table, on } = joinObject
            currentQuery += ` JOIN ${table} ON ${on}`

            if(joinObject.join) {
                return this.createJoin(currentQuery, joinObject.join)
            }
        }
        return currentQuery
    }

    async insert(insertValues: ValuesInsert) {
        const { values } = insertValues

        if(Array.isArray(values)) {
            this.insertFromArrayValues(values)
        } else {
            this.insertFromObject(values)
        }
    }

    private async insertFromArrayValues(values: (string | number | boolean)[]) {
        let valuesQuery = ''

        values.forEach((value, index) => {
            if(index) {
                valuesQuery += `, ${value}`
            } else {
                valuesQuery += value
            }
        })

        const query = `INSERT INTO ${this.table} VALUES(${valuesQuery})`

        return null
    }

    private async insertFromObject(value: object) {
        return null
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