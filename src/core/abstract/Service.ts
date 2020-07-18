import Repository from './Repository'

export default abstract class Service<TYPE extends object> {
  
  constructor(protected repository: Repository<TYPE>) {}

  async findAll() {
    return await this.repository.findAll()
  }

  async findById(id: number) {
    return await this.repository.findById(id)
  }

  async create(contentBody: TYPE) {
    return await this.repository.create(contentBody)
  }

  async update(contentBody: TYPE) {
    return await this.repository.update(contentBody)
  }

  async destroy(id: number) {
    return await this.repository.destroy(id)
  }

}
