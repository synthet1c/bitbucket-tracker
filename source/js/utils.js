import _ from 'ramda'

export const indexBy = _.curry((key, arr) => {
  return arr.reduce((acc, item) => {
    acc[item[key]] = item
    return acc
  }, {})
})

export const parameterize = obj => {
  const arr = []
  for (let key in obj) {
    arr.push(key + '=' + obj[key])
  }
  return arr.join('&')
}
