import _ from 'ramda'
import { combineReducers } from 'redux'
import { repositoriesReducer } from './reducers/repositories'
import { commitsReducer } from './reducers/commits'
import bitbucket from './bitbucket'
import * as lenses from './lenses'
import { arrayToggle, trace } from './utils'

import { CHANGE_PAGE } from './actions/actions'

import {
  ADD_COMMIT,
  SELECT_COMMIT,
  REQUEST_REPOSITORY_COMMITS,
  RECIEVE_REPOSITORY_COMMITS,
  LOAD_MORE_REPOSITORIES,
  REFRESH_COMMITS,
} from './actions/commits'

import {
  ADD_REPOSITORY,
  SELECT_REPOSITORY,
  REQUEST_REPOSITORIES,
  RECIEVE_REPOSITORIES,
  TOGGLE_REPOSITORY,
} from './actions/repositories'

const entities = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_REPOSITORIES:
    case RECIEVE_REPOSITORIES:
    case TOGGLE_REPOSITORY:
      return {
        ...state,
        repositories: repositoriesReducer(state.repositories, action)
      }
    case REQUEST_REPOSITORY_COMMITS:
    case RECIEVE_REPOSITORY_COMMITS:
    case REFRESH_COMMITS:
      return {
        ...state,
        commits: commitsReducer(state.commits, action)
      }
    default:
      return state
  }
}

const frontend = (state = {
  repositories: [],
  commits: []
}, action) => {
  switch (action.type) {
    case CHANGE_PAGE:
      return _.set(lenses.page, action.page)(state)
    case ADD_REPOSITORY:
      return _.over(lenses.repositories, _.concat([action.repository]))(state)
    case TOGGLE_REPOSITORY:
      console.log(action)
      const doAction = _.compose(trace('lenses.repositories'), arrayToggle(action.name))
      return _.over(lenses.repositories, doAction)(state)
    case ADD_COMMIT:
      return _.over(lenses.commits, _.concat(action.commit))(state)
    default:
      return state
  }
}

const rootReducer = combineReducers({
  frontend,
  entities
})

export default rootReducer
