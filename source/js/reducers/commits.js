import _ from 'ramda'
import * as lenses from '../lenses'
import moment from 'moment'

import {
  GET_COMMITS,
  GET_USER_COMMITS,
  REQUEST_REPOSITORY_COMMITS,
  RECIEVE_REPOSITORY_COMMITS
} from '../actions/commits'

const trace = _.curry((name, x) => (console.log(name, x), x))

const momentBefore = (a, b) => {
  return a.date.isBefore(b.date) ? 1 : -1
}

const sortByTimestamp = (arr) => {
  const unsorted = _.map(item => _.set(lenses.date, moment(item.date))(item), arr)
  const sorted = _.sort(momentBefore, unsorted)
  return sorted
}

const filterByAuthor = _.curry((author, commit) => commit.author.raw.match(author))
const addMoment = (commit) => _.set(lenses.date, moment(commit.date), commit)
const reduceCommits = _.compose(_.map(addMoment), _.filter(filterByAuthor('andrewFountain')))

export const commitsReducer = (state = {
  isFetching: false,
  didInvalidate: false,
  items: [],
  hashes: []
}, action) => {
  switch (action.type) {
    case REQUEST_REPOSITORY_COMMITS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      }
    case RECIEVE_REPOSITORY_COMMITS:
      const commits = reduceCommits(action.commits.values)
      return {
        ...state,
        didInvalidate: false,
        isFetching: false,
        items: sortByTimestamp(state.items.concat(commits)),
        hashes: state.hashes.concat(commits.map(_.prop('hash'))),
        lastUpdated: action.receivedAt,
        next: action.commits.next,
        pageLen: action.commits.pageLen,
      }
    default:
      return state
  }
}

export default commitsReducer
