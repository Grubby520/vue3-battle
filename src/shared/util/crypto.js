import MD5 from 'crypto-js/md5'

export function valueToMd5 (val) {
  return MD5(val).toString()
}
