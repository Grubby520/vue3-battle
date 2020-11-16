import { get } from '../../shared/http'
console.log('ssss', get)
const recommond = {
  getList ({ ...params }) {
    return get(`products/product-variant-offline-plan`, params)
  }
}
export default recommond
