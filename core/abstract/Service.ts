import Dolphin from '../../database/Dolphin'

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

    async postOne(contentBody: object): Promise<any> {
        return null
    }

}