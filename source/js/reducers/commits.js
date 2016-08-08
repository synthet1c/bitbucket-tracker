import _ from 'ramda'
import * as lenses from '../lenses'
import { indexBy } from '../utils'
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

// getHash :: {hash} -> String
const getHash = _.compose(_.slice(-7, Infinity), _.prop('hash'))

const mutateCommits = (obj, commits) => {
  obj.hashes = {}
  const items = []
  for (let ii = 0, ll = commits.length; ii < ll; ii++) {
    commits[ii].fullHash = commits[ii].hash
    commits[ii].active = false
    commits[ii].hash = commits[ii].hash.slice(-7)
    obj.hashes[commits[ii].hash.slice(-7)] = commits[ii]
    items[ii] = commits[ii]
  }
  obj.items = obj.items.concat(items)
  return obj
}

const addRepository = (state) => {

}
const indexRepository = _.over(_.lensProp('repositories'), addRepository )

export const commitsReducer = (state = {
  isFetching: false,
  didInvalidate: false,
  items: [],
  repositories: {},
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
      const items = sortByTimestamp(state.items.concat(commits))
      return {
        ...state,
        didInvalidate: false,
        isFetching: false,
        items: items,
        hashes: indexBy('hash', items),
        lastUpdated: action.receivedAt,
        next: action.commits.next,
        pageLen: action.commits.pageLen,
      }
    default:
      return state
  }
}

export default commitsReducer
