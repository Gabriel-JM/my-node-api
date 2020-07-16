import { ValidationObject } from '@core/types/types-interfaces'

export interface Product {
  name: string
  brand: string
  price: number
  weight: number
  productCategory: number
}

export default <ValidationObject> {
  id: {
    type: 'number',
    optional: true
  },
  name: {
    type: 'string',
    maxLength: 120
  },
  brand: {
    type: 'string',
    maxLength: 60
  },
  price: {
    type: 'number',
    minValue: 0
  },
  weight: {
    type: 'number',
    minValue: 0
  },
  productCategory: {
    type: 'number',
    minValue: 1
  }
}
