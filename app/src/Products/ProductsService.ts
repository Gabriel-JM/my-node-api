import Service from '../../../core/abstract/Service'
import { Product } from './Product'
import ProductsRepository from './ProductsRepository'

const repository = new ProductsRepository()

class ProductsService extends Service<Product> {
  constructor() {
    super(repository)
  }
}

export default ProductsService
