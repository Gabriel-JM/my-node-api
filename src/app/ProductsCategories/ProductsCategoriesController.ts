import Controller from '../../core/abstract/Controller'
import ProductsCategoriesService from './ProductsCategoriesService'
import ProductsCategoriesModel, { ProductCategory } from './ProductsCategories'
import { RequestContent } from '../../core/types/types-interfaces'

const service = new ProductsCategoriesService()

class ProductsCategoriesController extends Controller<ProductCategory> {

  constructor(protected content: RequestContent) {
    super(content, service, ProductsCategoriesModel)
  }

}

export default ProductsCategoriesController
