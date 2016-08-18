'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
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

const component = (...internals) => fn => state => {
  const dispatch = (action) => {
    console.log('dispatch', action)
  }
  return React.createClass({
    displayName: fn.name,
    render: function() {
      return fn.call(this, reduceInternals(internals, state, this.props, dispatch))
    },
  })
}

const defineEvents = ({ dispatch }) => ({
  clickEvent() {
    console.log('click')
    dispatch('DO_SOMETHING')
  }
})

const defineProps = ({ state }) => ({
  name: state.name,
  address: state.address
})

const Thing = ({
  name,
  clickEvent
}) => {
  return (
    <div className="thing">
      <h3 onClick={clickEvent}>{name}</h3>
    </div>
  )
}

const state = {
  name: 'andrew'
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
    listen: fluent(fn => {
      listeners.push(fn)
    }),
    register: fluent(reducers => {
      actions = { ...reducers }
    }),
    dispatch: fluent(action => {
      const newState = actions[action](state)
      listeners.forEach(fn => fn(newState.__value, action))
      state = newState
    }),
    getState: () => Object.freeze(state.__value)
  }
}

const stater = Store({
  name: 'andrew',
  age: 32,
  address: {
    street: 'Pascoe Vale Rd'
  }
})

const log = (name, ...args) => {
  console.log(...['%c ' + name + ' ', 'background:#3cf;color:#fff;font-weight:bold', ...args])
}

const define = (name, value) => window[name] = value || name
const add = curry((a, b) => a + b)
const upper = str => str.toUpperCase()
const lower = str => str.toLowerCase()

define('BIRTHDAY')
define('REVERSE_NAME')
define('RESTORE_NAME')
define('LOWERCASE')
define('PIPE')
define('SET')

const lens = curry((props, fn) => {
  if (typeof props === 'string') {
    props = props.split('.')
  }
  const _lens = (props.length > 1)
    ? lensPath(props)
    : lensProp(...props)

  return map(over(_lens, fn))
})

const set = curry((val, __) => val)

const lenses = {}
lenses.age = lens('age')
lenses.name = lens('name')
lenses.thing = lens('thing')

lenses.address = lens('address')
lenses.address.street = lens('address.street')
lenses.address.number = lens('address.number')

const actions = {
  [BIRTHDAY]     : lenses.age(add(1)),
  [REVERSE_NAME] : lenses.name(compose(upper, reverse)),
  [RESTORE_NAME] : lenses.name(compose(lower, reverse)),
  [LOWERCASE]    : lenses.address.street(lower),
  [SET]          : lenses.thing(set('thing')),
}

actions
  [PIPE] = pipe(
    lenses.name(upper),
    lenses.address.street(reverse),
    lenses.age(add(10)),
    lenses.address.number(set(157))
  )

console.log({ actions })

stater.register(actions)

class Container extends React.Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.state = this.store.getState()
    log('constructor', this.store)
  }
  componentDidMount() {
    log('componentDidMount', this)
    this.store.listen((state, action) => {
      this.setState(state)
      console.log({ action, state })
    })
  }
  componentWillReceiveProps(nextProps) {
    log('componentWillReceiveProps', this, nextProps)
  }
  componentWillUpdate() {
    log('componentWillUpdate', this)
  }
  componentDidUpdate() {
    log('componentDidUpdate', this)
  }
  componentWillUnmount() {
    log('componentWillUnmount', this)
  }
  render() {
    log('arguments', arguments)
    return (
      <div>
        <span>{this.state.name}</span>
        <Thingy />
      </div>
    )
  }
}

const Thingy = component(
  defineEvents,
  defineProps
)(Thing)(state)

// const Thingy = component(Thing, props, events)(state)

ReactDOM.render(
  <Container store={stater} />,
  document.getElementById('thing')
)

const operations = [
  REVERSE_NAME,
  BIRTHDAY,
  RESTORE_NAME,
  LOWERCASE,
  PIPE,
  SET,
]

const timer = (operations) => {
  let ii = 0
  const go = () => {
    stater.dispatch(operations[ii])
    if (++ii < operations.length) {
      setTimeout(go, 1000)
    }
  }
  go()
}
timer(operations)

// stater
//   .dispatch(REVERSE_NAME)
//   .dispatch(BIRTHDAY)
//   .dispatch(RESTORE_NAME)
//   .dispatch(LOWERCASE)
//   .dispatch(PIPE)
//   .dispatch(SET)
