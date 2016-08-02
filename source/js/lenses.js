import _ from 'ramda'

export const commits = _.lensProp('commits')
export const repositories = _.lensProp('repositories')
export const items = _.lensProp('items')
export const didInvalidate = _.lensProp('didInvalidate')
export const isFetching = _.lensProp('isFetching')
export const lastUpdated = _.lensProp('lastUpdated')
export const next = _.lensProp('next')
export const page = _.lensProp('page')
export const pageLen = _.lensProp('pageLen')
export const repository = _.lensProp('repository')
export const timestamp = _.lensProp('timestamp')
export const date = _.lensProp('date')

export const set = {
  commits: _.set(commits),
  didInvalidate: _.set(didInvalidate),
  isFetching: _.set(isFetching),
  lastUpdated: _.set(lastUpdated),
  next: _.set(next),
  page: _.set(page),
  pageLen: _.set(pageLen),
}

export const over = {
  commits: _.over(commits),
  items: _.over(items),
  repositories: _.over(repositories),
}
