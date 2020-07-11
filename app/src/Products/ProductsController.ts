import Controller from '../../../core/abstract/Controller'
import ProductsService from './ProductsService'
import ProductsModel, { Product } from './Product'
import { RequestContent } from '../../../core/types/types-interfaces'

const service = new ProductsService()

class ProductsController extends Controller<Product> {
  constructor(protected content: RequestContent) {
    super(content, service, ProductsModel)
  }
}

export default ProductsController
