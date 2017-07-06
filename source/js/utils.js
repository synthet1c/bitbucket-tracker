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
      ...arr.slice(index, index + 1),
      ...arr.slice(index + 1)
    ]
  }
  return [...arr, item]
})

export const trace = name => x => (console.log(name, x), x)

export const classNames = (...classes) => {

  const className = classes.reduce((acc, clazz) => {
    if (typeof clazz === 'string' || Array.isArray(clazz)) {
      return acc.concat(clazz)
    }
    for (let key in clazz) {
      if (clazz[key]) {
        acc = acc.concat(key)
      }
    }
    return acc
  }, []).join(' ')

  return {
    className
  }
}
// parameterize :: Object -> String
export const parameterize = obj => {
  const arr = []
  for (let key in obj) {
    arr.push(key + '=' + obj[key])
  }
  return arr.join('&')
}
