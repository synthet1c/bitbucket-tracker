import { indexBy } from '../utils'
import _ from 'ramda'

import {
  GET_REPOSITORIES,
  REQUEST_REPOSITORIES,
  RECIEVE_REPOSITORIES,
  TOGGLE_REPOSITORY,
} from '../actions/repositories'

import {
  RECIEVE_REPOSITORY_COMMITS
} from '../actions/commits'

const mutateRepositories = (obj, repositories) => {
  obj.items = []
  obj.names = {}
  for (let ii = 0, ll = repositories.length; ii < ll; ii++) {
    repositories[ii].active = false
    obj.items[ii] = repositories[ii]
    obj.names[repositories[ii].name] = repositories[ii]
  }
  return obj
}

const toggle = _.curry((name, prop, obj) => obj.name === name && (obj[prop] = !obj[prop]))
const toggleItemActive = name => _.over(_.lensProp('items'), _.map(toggle('active', name)))

const modifyRepository = _.curry((cb, action, state) => {
  const setItem = (repository) => {
    return repository.name === action.name
      ? cb(action, repository)
      : repository
  }
  return _.over(_.lensProp('items'), setItem, state)
})

const setRepositoryCommits = modifyRepository((action, repository) => ({
  ...repository,
  commits: repository.commits.concat(action.commits)
}))

export const repositoriesReducer = (state = {
  didInvalidate: false,
  isFetching: false,
  items: [],
  next: null,
  page: 0,
  pageLen: 0,
}, action) => {
  switch (action.type) {
    case REQUEST_REPOSITORIES:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      }
    case TOGGLE_REPOSITORY:
      // return toggleItemActive(action.name, state)
      return {
        ...state,
        items: state.items.map(repository => {
          if (repository.name === action.name) {
            return {
              ...repository,
              active: !repository.active
            }
          }
          return repository
        })
      }
    case RECIEVE_REPOSITORIES:
      return {
        ...state,
        didInvalidate: false,
        isFetching: false,
        items: state.items.concat(action.repositories.values),
        indexed: indexBy('name', action.repositories.values),
        page: action.repositories.page,
        lastUpdated: action.receivedAt,
        next: action.repositories.next,
        pageLen: action.repositories.pageLen,
      }
    case RECIEVE_REPOSITORY_COMMITS:
      debugger
      return setRepositoryCommits(action, state)
    default:
      return state
  }
}

export default repositoriesReducer
