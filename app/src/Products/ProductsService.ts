import Service from '../../../core/abstract/Service'
import { Product } from './Product'

class ProductsService extends Service<Product> {
  constructor() {
    super('products')
  }
}

export default ProductsService
