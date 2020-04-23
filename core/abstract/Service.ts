import Dolphin from '../../database/Dolphin'
import { BodyContent } from '../types/interfaces'

export default abstract class Service {
    
    protected dolphin: Dolphin
    
    constructor(protected tableName: string) {
        this.dolphin = new Dolphin(tableName)
    }

    async getAll(): Promise<any> {
        return await this.defaultGetAll()
    }

    protected async defaultGetAll() {
        try {
            const {rows}: any = await this.dolphin.selectAll()

            return rows
        } catch(err) {
            console.error(err)
            return null
        }
    }

    async getOne(id: number): Promise<any> {
        return await this.defaultGetOne(id)
    }

    protected async defaultGetOne(id: number) {
        try {
            const {rows}: any = await this.dolphin.select({
                values: '*',
                where: ['id', id]
            })

            return rows[0]
        } catch(err) {
            console.error(err)
            return null
        }
    }

    async postOne(contentBody: object): Promise<any> {
        return await this.defaultPostOne(contentBody)
    }

    protected async defaultPostOne(contentBody: object) {
        try {
            const {rows}: any = await this.dolphin.insert({
                values: Object.values(contentBody as object)
            })

            return this.defaultGetOne(rows.insertId)
        } catch(err) {
            console.error(err)
            return null
        }
    }

    async putOne(contentBody: BodyContent): Promise<any> {
        return await this.defaultPutOne(contentBody as { id: number })
    }

    protected async defaultPutOne(contentBody: { id: number }) {
        try {
            const {rows}: any = await this.dolphin.update({
                values: contentBody as object,
                where: ['id', contentBody.id]
            })

            return (
                rows.affectedRows ?
                    this.defaultGetOne(contentBody.id) : null
            )
        } catch(err) {
            console.error(err)
            return null
        }
    }

    async deleteOne(id: number): Promise<any> {
        return await this.defaultDeleteOne(id)
    }

    protected async defaultDeleteOne(id: number) {
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
            return null
        }
    }

}