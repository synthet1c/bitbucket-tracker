import _ from 'ramda'
import { combineReducers } from 'redux'
import { repositoriesReducer } from './reducers/repositories'
import { commitsReducer } from './reducers/commits'
import bitbucket from './bitbucket'
import * as lenses from './lenses'

import { CHANGE_PAGE } from './actions/actions'

import {
  ADD_COMMIT,
  SELECT_COMMIT,
  REQUEST_REPOSITORY_COMMITS,
  RECIEVE_REPOSITORY_COMMITS,
  LOAD_MORE_REPOSITORIES
} from './actions/commits'

import {
  ADD_REPOSITORY,
  SELECT_REPOSITORY,
  REQUEST_REPOSITORIES,
  RECIEVE_REPOSITORIES
} from './actions/repositories'

const selectedRepository = (state = '', action) => {
  switch (action.type) {
    case SELECT_REPOSITORY:
      return action.repository
    default:
      return state
  }
}

const selectedCommit = (state = '', action) => {
  switch (action.type) {
    case SELECT_COMMIT:
      return action.commit
    default:
      return state
  }
}

const changePage = (state = '', action) => {
  switch (action.type) {
    case CHANGE_PAGE:
      return action.page
    default:
      return state
  }
}

const entities = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_REPOSITORIES:
    case RECIEVE_REPOSITORIES:
      return {
        ...state,
        repositories: repositoriesReducer(state.repositories, action)
      }
    case REQUEST_REPOSITORY_COMMITS:
    case RECIEVE_REPOSITORY_COMMITS:
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
    case ADD_COMMIT:
      return _.over(lenses.commits, _.concat(action.commit))(state)
    default:
      return state
  }
}

const rootReducer = combineReducers({
  selectedRepository,
  selectedCommit,
  frontend,
  entities
})

export default rootReducer
