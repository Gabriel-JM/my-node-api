import connection from './connection'
import {
    keyValuePair,
    whereValue,
    QueryObject,
    Join,
    ValuesInsert,
    ValuesUpdate
} from './types/interfaces'

export default class Dolphin {

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
            query += this.createWhereQuery(queryConfig.where)
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

    private createWhereQuery(value: whereValue | keyValuePair) {
        let query = ' WHERE'

        if(value as keyValuePair) {
            const [toBeCompared, valueToCompare] = value
            query += ` ${toBeCompared} = ${valueToCompare}`
            
            return query
        }

        if(value as whereValue) {
            value.forEach((pair: any) => {
                const [toBeCompared, valueToCompare] = pair
                query += ` AND ${toBeCompared} = ${valueToCompare}`
            })

            return query
        }
    }

    async insert(insertValues: ValuesInsert) {
        const { values } = insertValues

        if(Array.isArray(values)) {
            return await this.insertFromArrayValues(values)
        }
            
        return await this.insertFromObject(values) 
    }

    private async insertFromArrayValues(values: (string | number | boolean)[]) {
        if(values.length) {
            const query = `INSERT INTO ${this.table} VALUES(?);`

            return await this.execQuery(query, values)
        }

        return null
    }

    private async insertFromObject(value: object) {
        const objKeys = Object.keys(value)
        const values = Object.values(value)

        if(values.length) {
            const keys = this.createKeysString(objKeys)
    
            const query = `INSERT INTO ${this.table}(${keys}) VALUES(?);`
    
            return await this.execQuery(query, values)
        }

        return null
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

    private createKeysString(objKeys: string[]) {
        let keys = ''

        if(objKeys.length) {
            objKeys.forEach((entry, index) => {
                const [key] = entry

                if(index) {
                    keys += `, ${key}`
                } else {
                    keys += key
                }
            })
        }

        return keys
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