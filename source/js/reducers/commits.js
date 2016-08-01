import * as lenses from '../lenses'

import {
  GET_COMMITS,
  GET_USER_COMMITS,
  REQUEST_REPOSITORY_COMMITS,
  RECIEVE_REPOSITORY_COMMITS
} from '../actions/commits'

const commitsReducer = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case REQUEST_REPOSITORY_COMMITS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      }
    case RECIEVE_REPOSITORY_COMMITS:
      return {
        ...state,
        didInvalidate: false,
        isFetching: false,
        items: _.over(lenses.items, _.concat(action.repositories.values))(state.items),
        lastUpdated: action.receivedAt,
        next: action.repositories.next,
        pageLen: action.repositories.pageLen,
      }
    default:
      return state
  }
}

export default commitsReducer
