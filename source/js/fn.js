const compose = (a, ...rest) => {
  return rest.length === 0
    ? a
    : c => a(compose(...rest))(c)
}

const curry = fn => {
  const arity = fn.length
  const _curry = (argsSoFar) => {
    const __curry = (...args) => {
      const totalArgs = [...argsSoFar, ...args]
      return totalArgs.length >= arity
        ? fn(...totalArgs)
        : _curry(totalArgs)
    }
    __curry.arity = arity
    return __curry
  }
  return _curry([])
}

const reverse = arr => [...arr.reverse()]

const flip = fn => {
  const arity = fn.arity || fn.length
  const _curry = (argsSoFar) => {
    const __curry = (...args) => {
      const totalArgs = [...argsSoFar, ...args]
      return totalArgs.length >= arity
        ? fn(...reverse(totalArgs))
        : _curry(totalArgs)
    }
    __curry.arity = arity
    return __curry
  }
  return _curry([])
}

const prop = curry((key, obj) => obj[key])
const fProp = flip(prop)

console.log(fProp({ name: 'andrew' })('name'))

prop('name')({ name: 'andrew' })

var obj = {
  name: 'andrew',
  age: 32,
  address: {
    number: '157',
    street: 'Pascoe Vale Rd',
    town: 'Moonee Ponds',
    state: 'VIC'
  },
  job: 'web developer',
  personal: {
    hobies: [
      'drugs',
      'dota'
    ]
  }
}

const over = curry((lens, fn, obj) => {
  return { ...obj }
})

const view = curry((prop, obj) => {
  return { ...lens(obj) }
})

const lensProp = curry((prop, obj) => obj[prop])
const lensPath = curry((pathArr, fn, obj) => {
  let curr = null
  for (let ii = 0, ll = pathArr.length - 1; ii < ll; ii+=1) {
    curr = obj[pathArr[ii]]
  }
  fn(curr[pathArr[ii]])
  pathArr.reduce((obj, path, ii) => {
    if (ii < pathArr.length -1) {
      return { ...obj[path] }
    }
    obj[path] = fn(obj[path])
  }, obj)
  return { ...obj }
})

const capatilize = str => str.slice(0, 1).toUpperCase() + str.slice(1)
const caps = str => str.toUpperCase()

const map = curry((f, xs) => xs.map(f))

const setPath = (props, fn, obj) => {
  const go = (view, key, ...rest) => {
    if (rest) {
      return go(view[key], ...rest)
    }
    fn(view[key])
    return obj
  }
  return go(obj, ...props)
}

console.log(setPath)

const traverse = (props, fn, obj) => {
  const _clone = { ...obj }
  const go = (orig, clone, key, ...rest) => {
    // only copy the last object
    if (rest.length === 1) {
      clone[key] = { ...orig[key] }
    }
    if (rest.length) {
      return go(orig[key], clone[key], ...rest)
    }
    if (!clone[key]) {
      throw new Error(`traverse - unable to find property ${key}`)
    }
    clone[key] = fn(clone[key])
    return _clone
  }
  return go(obj, _clone, ...props)
}

const lens = curry((getter, setter, fn, obj) => {
  setter(fn, getter(obj))
  return obj
})

const type = obj => {
  if (Array.isArray(Object)) {
    return '[object Array]'
  }
  if (typeof obj === 'undefined') {
    return 'undefined'
  }
  if (obj === null) {
    return 'null'
  }
}

const assoc = curry((fn, obj) => {
  switch (type(obj)) {
    case '[object Object]': return fn({...obj})
    case '[object Array]':  return fn([...obj])
    default:
      return fn(obj)
  }
})

console.log('lens', lens(prop('name'), assoc, caps, obj))

const add = curry((a, b) => a + b)

console.log('street', traverse(['address', 'street'], caps, obj))
console.log('hobies', traverse(['personal', 'hobies'], map(caps), obj))
console.log('age', traverse(['age'], add(1), obj))
// over(lensProp('name'), capatilize)(obj)
