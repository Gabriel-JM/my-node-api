import { Join, whereValue, keyValuePair } from '../types/types-interfaces'

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
      const questionMarks = values.reduce(acc => {
        return acc + ', ?'
      }, '')

      const query = `INSERT INTO ${table} VALUES(default${questionMarks});`
      return query
    }

    return ''
  }

  insertFromObject(table: string, value: object) {
    value = this.preventNoIdKey(value)
    const objKeys = Object.keys(value)
    const values = Object.values(value)

    if(values.length) {
      const keys = this.createKeysString(objKeys)
      const questionMarks = values.reduce(acc => {
        return acc ? acc + ', ?' : acc + '?'
      }, '')

      const query = `INSERT INTO ${table}(${keys}) VALUES(${questionMarks});`

      return query
    }

    return ''
  }

  private preventNoIdKey(obj: object): object {
    if(!('id' in obj)) {
      Object.assign(obj, { id: 'default' })
    }

    return obj
  }

  private createKeysString(objKeys: string[]) {
    if(objKeys.length) {
      const keys = objKeys.reduce((acc, entry, index) => {
        if(index) {
          return acc + `, ${entry}`
        } else {
          return acc + entry
        }
      }, '')

      return keys
    }

    return ''
  }

  updateValuesString(obj: object) {
    const entries = Object.entries(obj)

    const finalString = entries.reduce((acc, entry, index) => {
      const [key, value] = entry
      if(index) {
        return acc + `, ${key} = '${value}'`
      } else {
        return acc + `${key} = '${value}'`
      }
    }, '')

    return finalString
  }
}