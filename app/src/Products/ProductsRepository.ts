import Repository from '../../../core/abstract/Repository'
import { Product } from './Product'

class ProductsRepository extends Repository<Product> {

  constructor() {
    super('products')
  }

}

export default ProductsRepository
