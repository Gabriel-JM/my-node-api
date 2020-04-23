import Controller from '../../../core/abstract/Controller'
import ProductsCategoriesService from './ProductsCategoriesService'
import { RequestContent } from '../../../core/types/interfaces'

const service = new ProductsCategoriesService()

class ProductsCategoriesController extends Controller {

  constructor(protected content: RequestContent) {
    super(content, service)
  }

  postObject() {
    const { ...body }: any = this.content

    return { name: body.name, color: body.color }
  }

}

export default ProductsCategoriesController