import {
  GET_COMMITS,
  GET_USER_COMMITS,
  GET_REPOSITORY_COMMITS
} from '../actions/commits'

const commits = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case REQUEST_COMMITS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECIEVE_COMMITS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false
      }
    default:
      return state
  }
}

export default commits
