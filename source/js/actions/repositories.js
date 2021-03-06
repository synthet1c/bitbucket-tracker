import _ from 'ramda'
import bitbucketInit, { repositories } from '../bitbucket'
import { indexBy } from '../utils'

bitbucketInit('andrewFountain', 'synthet1c')

export const ADD_REPOSITORY = 'ADD_REPOSITORY'
export const addRepository = (repository) => {
  return {
    type: ADD_REPOSITORY,
    repository
  }
}

export const REQUEST_REPOSITORIES = 'REQUEST_REPOSITORIES'
export const requestRepositories = (account, repository, startDate, endDate) => ({
  type: REQUEST_REPOSITORIES,
  account,
  repository,
  startDate,
  endDate,
})

export const LOAD_MORE_REPOSITORIES = 'LOAD_MORE_REPOSITORIES'
export const loadMoreRepositories = (account, repository) => ({
  type: LOAD_MORE_REPOSITORIES,
  account,
  repository
})


export const SELECT_REPOSITORY = 'SELECT_REPOSITORY'
export const selectRepository = (account, repository) => ({
  type: SELECT_REPOSITORY,
  account,
  repository
})

export const TOGGLE_REPOSITORY = 'TOGGLE_REPOSITORY'
export const toggleRepository = (name) => ({
  type: TOGGLE_REPOSITORY,
  name
})

export const RECIEVE_REPOSITORIES = 'RECIEVE_REPOSITORIES'
export const recieveRepositories = (repositories) => ({
  type: RECIEVE_REPOSITORIES,
  repositories,
  indexed: indexBy('name', repositories.values),
  recievedAt: Date.now()
})



export const FAILED_REPOSITORIES_REQUEST = 'FAILED_REPOSITORIES_REQUEST'

export const failedRepositoriesRequest = (error) => ({
  type: FAILED_REPOSITORIES_REQUEST,
  error,
  recievedAt: Date.now()
})

export const fetchRepositories = (account, repository, page, startDate, endDate) => (dispatch) => {

  dispatch(requestRepositories(account, repository, startDate, endDate))

  return repositories(account, repository, page, startDate, endDate)
    .fork(
      error => dispatch(failedRepositoriesRequest(error)),
      response => dispatch(recieveRepositories(response))
    )
}
