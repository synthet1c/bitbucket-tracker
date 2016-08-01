import _ from 'ramda'
import { combineReducers } from 'redux'
import { repositories } from './reducers/repositories'
import { commits } from './reducers/commits'
import bitbucket from './bitbucket'

import { CHANGE_PAGE } from './actions/actions'

import {
  ADD_COMMIT,
  SELECT_COMMIT,
  REQUEST_COMMITS,
  RECIEVE_COMMITS
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
        repositories: repositories(state.repositories, action)
      }
    case REQUEST_COMMITS:
    case RECIEVE_COMMITS:
      return {
        ...state,
        commits: commits(state.commits, action)
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
      return _.set(_.lensProp('page'), action.page)(state)
    case ADD_REPOSITORY:
      return _.over(_.lensProp('repositories'), _.concat([action.repository]))(state)
    case ADD_COMMIT:
      return _.over(_.lensProp('commits'), _.concat(action.commit))(state)
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
