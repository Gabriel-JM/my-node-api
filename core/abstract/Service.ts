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
            const allItems = await this.dolphin.selectAll()

            return allItems
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
            const item = await this.dolphin.select({
                where: ['id', id]
            })

            return item
        } catch(err) {
            console.error(err)
            return null
        }
    }

    async postOne(contentBody: BodyContent): Promise<any> {
        return await this.defaultPostOne(contentBody)
    }

    protected async defaultPostOne(contentBody: BodyContent) {
        try {
            const result = await this.dolphin.insert({
                values: Object.values(contentBody as object)
            })

            return result
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
            const result = await this.dolphin.update({
                values: contentBody as object,
                where: ['id', contentBody.id]
            })

            return result
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
            const result = await this.dolphin.delete(id)

            return result
        } catch(err) {
            console.error(err)
            return null
        }
    }

}