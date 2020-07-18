import Dolphin from '../../database/Dolphin'
import { RepositoryResultError, RepositoryResult, MinimumBodyContent } from 'src/app/Products/node_modules/@core/types/types-interfaces'

export default class Repository<TYPE extends object> {
  protected dolphin: Dolphin

  constructor(protected tableName: string) {
    this.dolphin = new Dolphin(tableName)
  }

  async findAll(): RepositoryResult<TYPE> {
    try {
      const {rows}: any = await this.dolphin.selectAll()

      return rows
    } catch(err) {
      console.error(err)
      return this.resultError(err, 'findAll')
    }
  }

  async findById(id: number): RepositoryResult<TYPE> {
    try {
      const {rows}: any = await this.dolphin.select({
        values: '*',
        where: ['id', id]
      })

      return rows[0]
    } catch(err) {
      console.error(err)
      return this.resultError(err, 'findById')
    }
  }

  async create(contentBody: TYPE): RepositoryResult<TYPE> {
    try {
      const {rows}: any = await this.dolphin.insert({
        values: Object.values(contentBody as object)
      })

      return this.findById(await rows.insertId)
    } catch(err) {
      console.error(err)
      return this.resultError(err, 'create')
    }
  }

  async update(contentBody: TYPE): RepositoryResult<TYPE> {
    try {
      const {rows}: any = await this.dolphin.update({
        values: contentBody as object,
        where: ['id', (contentBody as MinimumBodyContent).id]
      })

      return (
        rows.affectedRows
          ? this.findById((contentBody as MinimumBodyContent).id)
          : this.resultError(new Error('Didn\'t affect any rows'), 'update')
      )
    } catch(err) {
      console.error(err)
      return this.resultError(err, 'update')
    }
  }

  async destroy(id: number) {
    try {
      const {rows} : any = await this.dolphin.delete(id)

      if(rows.affectedRows) {
        return {
          message: 'Successful delete!',
          objectId: id,
          ok: true
        }
      }

      return {
        message: 'Not found ID!',
        objectId: id,
        ok: false
      }

    } catch(err) {
      console.error(err)
      return this.resultError(err, 'destroy')
    }
  }

  private resultError(error: Error, method: string) {
    return <RepositoryResultError> { error, method, ok: false }
  }
}
