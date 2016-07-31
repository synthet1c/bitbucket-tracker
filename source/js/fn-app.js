import _ from 'ramda'
import moment from 'moment'
import React from 'react'
import { render } from 'react-dom'
import bitbucketInit, * as bitbucket from './bitbucket'

import App from './components/app'

bitbucketInit({
  username: 'andrewFountain',
  password: 'synthet1c'
})

const { map, prop } = _
const trace = _.curry((name, x) => (console.log(name, x), x))
const then = _.curry((fn, promise) => promise.then(fn))

// lensValues :: f -> [*] -> [f(*)]
const lensValues = _.lensProp('values')

// overValues :: f -> [*] -> [f(*)]
const overValues = _.over(_.lensProp('values'))

// minimiseResponse :: [a] -> [a]
const minimiseResponse = overValues(values =>
  values.map(value => ({
    message: value.message,
    start: moment(value.date)
  })
))

// flattenDuplicates :: [a] -> [a]
const flattenDuplicates = overValues(values =>
  values.reduce((acc, value, ii) => {
    const last = _.last(acc)
    if (ii !== 0 && last.message === value.message) {
      last.count += 1
      return acc
    }
    return acc.concat(Object.assign({}, value, { count: 1 }))
  }, []))

// calculateTimes :: [a] -> [a]
const calculateTimes = overValues(values => {
  return values.map((value, ii, arr) => {
    const last = arr[ii - 1]
    const start = last ? last.start : moment().hour(9)
    const duration = moment.duration(start.diff(value.start))
    return Object.assign({}, value, {
      totalTime: duration
    })
  })
})

// formatResponse :: [a] -> [a]
const formatResponse = _.compose(calculateTimes, flattenDuplicates, minimiseResponse)

// getCommits :: (account, repo) -> Task [{a}]
const getCommits = _.compose(map(formatResponse), bitbucket.commits)

const getRepositories = _.compose(map(trace('getRepos')), bitbucket.repositories)

const app = getCommits('bwiredintegration', 'demo-b2bwatchescorednacom')

app.fork(
  error => console.error(error),
  state => {
    render(
      <App {...state} />,
      document.getElementById('app')
    )
  }
)
