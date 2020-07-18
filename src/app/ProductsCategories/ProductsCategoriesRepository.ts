import Repository from '../../core/abstract/Repository'
import { ProductCategory } from './ProductsCategories'

class ProductsRepository extends Repository<ProductCategory> {

  constructor() {
    super('products_categories')
  }

}

export default ProductsRepository
