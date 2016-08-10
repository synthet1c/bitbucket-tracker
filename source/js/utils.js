import _ from 'ramda'

export const indexBy = _.curry((key, arr) => {
  return arr.reduce((acc, item) => {
    acc[item[key]] = item
    return acc
  }, {})
})

export const arrayToggle = _.curry((item, arr) => {
  let index
  if ((index = arr.indexOf(item) > -1)) {
    return [
      ...state.repositories.slice(index, index + 1),
      ...state.repositories.slice(index + 1)
    ]
  }
  return [...arr, item]
})

export const trace = name => x => (console.log(name, x), x)
