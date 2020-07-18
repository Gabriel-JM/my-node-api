import Service from '../../core/abstract/Service'
import { ProductCategory } from './ProductsCategories'
import ProductsRepository from './ProductsCategoriesRepository'

const repository = new ProductsRepository()

class ProductsCategoriesService extends Service<ProductCategory> {
  constructor() {
    super(repository)
  }
}

export default ProductsCategoriesService
