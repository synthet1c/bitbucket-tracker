import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import timesheetApp from './reducers'
import App from './components/App'
import actions from './actions.js'
import './otherapp'
import './toggl/db'

const state = {
  selectedRepositiory: 'demo-b2bwatchescorednacom',
  selectedCommit: '',
  entities: {
    repositories: {},
    commits: {}
  },
  page: 'repositories',
  frontend: {
    repositories: {
      isFetching: true,
      didInvalidate: false,
      items: []
    },
    commits: {
      isFetching: true,
      didInvalidate: false,
      items: []
    }
  }
}

// const loggerMiddleware = createLogger()

let store = createStore(
  timesheetApp,
  applyMiddleware(
    thunkMiddleware,
  )
)

console.log(actions)
store.dispatch(
  actions.fetchRepositories('bwiredintegration', 'demo-b2bwatchescorednacom')
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
