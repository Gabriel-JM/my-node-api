export interface ProductCategory {
  name: string
  color: string
}

export default {
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
