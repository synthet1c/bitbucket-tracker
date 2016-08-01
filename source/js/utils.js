import _ from 'ramda'

export const indexBy = _.curry((key, arr) => {
  return arr.reduce((acc, item) => {
    acc[item[key]] = item
    return acc
  }, {})
})
