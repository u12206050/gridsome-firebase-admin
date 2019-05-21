export const objectDisplay = (field, obj) => {
  if (!obj) return 'none'
  let o = ''
  const oK = Object.keys(obj)
  oK.forEach(k => {
    o += k + ': ' + obj[k] + '<br/>'
  })
  return o
}