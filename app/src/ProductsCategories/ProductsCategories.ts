export interface ProductCategory {
  name: string
  color: string
}

export default {
  name: {
    type: 'string',
    maxLength: 80
  },
  color: {
    type: 'string',
    length: 7
  }
}