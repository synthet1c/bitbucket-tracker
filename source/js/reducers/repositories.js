import { indexBy } from '../utils'

import {
  GET_REPOSITORIES,
  REQUEST_REPOSITORIES,
  RECIEVE_REPOSITORIES
} from '../actions/repositories'

export const repositoriesReducer = (state = {
  didInvalidate: false,
  isFetching: false,
  items: [],
  next: null,
  page: 1,
  pageLen: 0,
}, action) => {
  switch (action.type) {
    case REQUEST_REPOSITORIES:
      return {
        ...state,
        isfetching: true,
        didInvalidate: false
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
    default:
      return state
  }
}

export default repositoriesReducer
