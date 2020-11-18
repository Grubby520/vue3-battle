import { get } from '@shared/http'
import RECOMMENDURLS from './url'
const RECOMMEND = {
  getList ({ ...params }) {
    return get(RECOMMENDURLS.recommendProducts, params)
  }
}
export default RECOMMEND
