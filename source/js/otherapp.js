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
    listen: fluent((fn) => {
      listeners.push(fn)
    }),
    register: fluent((reducers) => {
      actions = { ...reducers }
    }),
    dispatch: fluent((action) => {
      const newState = actions[action](state)
      listeners.forEach(fn => fn(newState.__value, action))
      state = newState
    })
  }
}

const stater = Store({
  name: 'andrew',
  age: 32,
  address: {
    street: 'Pascoe Vale Rd'
  }
})

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

const set = curry((val, obj) => val)

const lenses = {}
lenses.age = lens('age')
lenses.name = lens('name')
lenses.thing = lens('thing')

lenses.address = lens('address')
lenses.address.street = lens('address.street')

const actions = {
  [BIRTHDAY]     : lens('age', add(1)),
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
  )

console.log({ actions })

stater
  .register(actions)
  .listen((state, action) => {
    console.log({ action, state })
  })
  .dispatch(REVERSE_NAME)
  .dispatch(BIRTHDAY)
  .dispatch(RESTORE_NAME)
  .dispatch(LOWERCASE)
  .dispatch(PIPE)
  .dispatch(SET)

const Thingy = component(
  defineEvents,
  defineProps
)(Thing)(state)

// const Thingy = component(Thing, props, events)(state)

ReactDOM.render(
  <Thingy />,
  document.getElementById('thing')
)
