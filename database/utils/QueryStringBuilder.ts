import { Join, whereValue, keyValuePair } from "../types/interfaces"

export default class QueryStringBuilder {

    [key: string]: any

    createJoin(currentQuery: string, joinObject: Join): string {
        if(joinObject) {
            const { table, on } = joinObject
            currentQuery += ` JOIN ${table} ON ${on}`

            if(joinObject.join) {
                return this.createJoin(currentQuery, joinObject.join)
            }
        }
        return currentQuery
    }

    createWhereQuery(value: whereValue | keyValuePair) {
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

    insertFromArrayValues(table: string, values: any[]) {
        if(values.length) {
            const query = `INSERT INTO ${table} VALUES(?);`

            return query
        }

        return ''
    }

    insertFromObject(table: string, value: object) {
        const objKeys = Object.keys(value)
        const values = Object.values(value)

        if(values.length) {
            const keys = this.createKeysString(objKeys)
    
            const query = `INSERT INTO ${table}(${keys}) VALUES(?);`
    
            return query
        }

        return ''
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
}