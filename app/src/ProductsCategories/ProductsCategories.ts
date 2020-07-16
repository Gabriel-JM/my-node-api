import { ValidationObject } from '@core/types/types-interfaces'

export interface ProductCategory {
  name: string
  color: string
}

export default <ValidationObject> {
  id: {
    type: 'number',
    optional: true
  },
  name: {
    type: 'string',
    maxLength: 80
  },
  color: {
    type: 'string',
    length: 7
  }
}
