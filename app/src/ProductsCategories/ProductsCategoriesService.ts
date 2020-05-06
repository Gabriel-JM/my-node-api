import Service from '../../../core/abstract/Service'
import { ProductCategory } from './ProductsCategories'

class ProductsCategoriesService extends Service<ProductCategory> {
  constructor() {
    super('products_categories')
  }
}

export default ProductsCategoriesService