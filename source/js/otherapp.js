'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import { classNames } from 'utils'
import _, {
  map,
  compose,
  reverse,
  curry,
  over,
  lensProp,
  lensPath,
  pipe,
} from 'ramda'

const reduceInternals = (internals, state, props, dispatch) => {
  return internals.reduce((acc, x) => ({
    ...acc,
    ...x({ state, props, dispatch })
  }), {})
}

const diff = (left = {}, right = {}) => {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  if (rightKeys.length !== rightKeys.length) {
    return true
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    return leftKeys.some((key) => {
      return diff(left[key], right[key])
    })
  }
  for (let ii = 0, ll = leftKeys.length; ii < ll; ii++) {
    const leftKey = leftKeys[ii]
    const rightKey = rightKeys[ii]
    if (leftKey !== rightKey) {
      return true
    }
    if (Array.isArray(left[leftKey])) {
      return diff(left[leftKey], right[rightKey])
    }
    if (left[leftKey] !== right[rightKey]) {
      return true
    }
  }
  return false
}

const component = (...internals) => fn => store => {
  return React.createClass({
    displayName: fn.name,
    componentDidMount() {
      pinkLog('componentDidMount', this)
      this.__state = store.getState()
    },
    componentWillReceiveProps(nextProps) {
      pinkLog('componentWillReceiveProps', this, nextProps)
    },
    shouldComponentUpdate() {
      const shouldUpdate = diff(this.__state, store.getState())
      pinkLog('shouldComponentUpdate', shouldUpdate)
      return shouldUpdate
    },
    render() {
      return fn.call(
        this,
        reduceInternals(
          internals,
          store.getState(),
          this.props,
          store.dispatch
        )
      )
    }
  })
}

const randomNumber = () => Math.ceil(Math.random() * 12 - 6)

const defineEvents = ({ dispatch }) => ({
  clickHeader() {
    dispatch(PIPE, { age: randomNumber(), number: 666 })
    dispatch(FLIP_ITEMS)
  },
  clickAge() {
    dispatch(CHANGE_WITH_PROPS, { age: 40 })
  }
})

const defineProps = ({ state }) => ({
  name: state.name,
  address: state.address,
  items: state.items || [],
  age: state.age,
})

const classy = (...classes) => {

}

const Thing = ({
  name,
  age,
  address,
  items,
  clickHeader,
  clickAge,
}) => {
  return (
    <div className="thing">
      <h3 onClick={clickHeader}>
        {name}
      </h3>
      <p onClick={clickAge}>{age}</p>
      <p>{address.street}</p>
      <ul className='list'>
        {map(item =>
          <li {...classNames('list__item')} key={item.key}>
            <span className='list__copy'>{item.name}</span>
          </li>
        )(items)}
      </ul>
    </div>
  )
}

class State {
  constructor(value) {
    this.__value = Object.freeze(value)
  }
  map(fn) {
    return State.of(fn(this.__value))
  }
  static of(value) {
    return new State(value)
  }
}

const fluent = fn => function(...args) {
  const ret = fn.apply(this, args)
  return ret
    ? ret
    : this
}

const Store = (initialValue = {}) => {

  let state = new State(initialValue)
  let actions = {}
  let listeners = []

  return {
    subscribe: fluent(fn => {
      listeners.push(fn)
    }),
    register: fluent(reducers => {
      actions = { ...reducers }
    }),
    dispatch: fluent((action, ...rest ) => {
      const newState = (rest.length)
        ? actions[action](...rest)(state)
        : actions[action](state)

      listeners.forEach(fn => fn(newState.__value, action))
      state = newState
    }),
    getState: () => Object.freeze(state.__value)
  }
}

const log = curry((color, name, ...args) => {
  console.log(`%c${name}`, `color:${color};font-weight:bold`, ...args)
})

const blueLog = log('#3cf')
const pinkLog = log('#f3c')

const define = (name, value) => window[name] = value || name
const add = curry((a, b) => a + b)
const upper = str => str.toUpperCase()
const lower = str => str.toLowerCase()
const set = curry((val, __) => val)

define('BIRTHDAY')
define('REVERSE_NAME')
define('RESTORE_NAME')
define('LOWERCASE')
define('PIPE')
define('SET')
define('FLIP_ITEMS')
define('CHANGE_WITH_PROPS')

const lens = curry((props, fn) => {
  if (typeof props === 'string') {
    props = props.split('.')
  }
  const _lens = (props.length > 1)
    ? lensPath(props)
    : lensProp(props[0])

  return map(over(_lens, fn))
})

const lenses = {}
lenses.age = lens('age')
lenses.name = lens('name')
lenses.thing = lens('thing')
lenses.items = lens('items')

lenses.address = lens('address')
lenses.address.street = lens('address.street')
lenses.address.number = lens('address.number')

const actions = {
  [BIRTHDAY]     : lenses.age(add(1)),
  [REVERSE_NAME] : lenses.name(compose(upper, reverse)),
  [RESTORE_NAME] : lenses.name(compose(lower, reverse)),
  [LOWERCASE]    : lenses.address.street(lower),
  [SET]          : lenses.thing(set('thing')),
  [FLIP_ITEMS]   : lenses.items(reverse),
  [PIPE]         : ({ age, number }) => pipe(
    lenses.name(upper),
    lenses.address.street(reverse),
    lenses.age(add(age)),
    lenses.address.number(set(number))
  ),
  [CHANGE_WITH_PROPS] : ({ age }) => lenses.age(set(age))
}

const store = Store({
  name: 'andrew',
  age: 32,
  address: {
    street: 'Pascoe Vale Rd'
  },
  items: [
    { key: 1, name: 'one', active: false },
    { key: 2, name: 'two', active: true },
    { key: 3, name: 'three', active: false },
  ]
})

store.register(actions)

class Container extends React.Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.state = this.store.getState()
  }
  componentDidMount() {
    this.store.subscribe((state, action) => {
      this.setState(state)
      blueLog('didMount', { action, state })
    })
  }
  componentWillReceiveProps(nextProps) {
    debugger
    blueLog('componentWillReceiveProps', this, nextProps)
  }
  // componentWillUpdate() {
  //   blueLog('componentWillUpdate', this)
  // }
  // componentDidUpdate() {
  //   blueLog('componentDidUpdate', this)
  // }
  // componentWillUnmount() {
  //   blueLog('componentWillUnmount', this)
  // }
  render() {
    return (
      <div>
        <span>{this.state.name}</span>
        <Thingy test={'test'}/>
      </div>
    )
  }
}

const Thingy = component(
  defineEvents,
  defineProps
)(Thing)(store)

// const Thingy = component(Thing, props, events)(state)

ReactDOM.render(
  <Container store={store} />,
  document.getElementById('thing')
)

const operations = [
  REVERSE_NAME,
  BIRTHDAY,
  RESTORE_NAME,
  LOWERCASE,
  // PIPE,
  SET,
]

const timer = (operations) => {
  let ii = 0
  const go = () => {
    store.dispatch(operations[ii])
    if (++ii < operations.length) {
      setTimeout(go, 1000)
    }
  }
  go()
}
timer(operations)

// store
//   .dispatch(REVERSE_NAME)
//   .dispatch(BIRTHDAY)
//   .dispatch(RESTORE_NAME)
//   .dispatch(LOWERCASE)
//   .dispatch(PIPE)
//   .dispatch(SET)
