import _ from 'ramda'
import * as bitbicket from '../bitbucket'

export const ADD_COMMIT = 'ADD_COMMIT'
export const addCommits = (account, repository) => ({
  type: GET_COMMITS,
  account,
  repository
})

export const GET_COMMITS = 'GET_COMMITS'
export const getCommits = (account, repository) => ({
  type: GET_COMMITS,
  account,
  repository
})


export const GET_USER_COMMITS = 'GET_USER_COMMITS'
export const getUserCommits = (account, user) => ({
  type: GET_USER_COMMITS,
  account,
  user
})


export const REQUEST_REPOSITORY_COMMITS = 'GET_REPOSITORY_COMMITS'
export const requestRepositoryCommits = (account, repository) => ({
  type: REQUEST_REPOSITORY_COMMITS,
  account,
  repository
})

export const RECIEVE_REPOSITORY_COMMITS = 'RECIEVE_REPOSITORY_COMMITS'
export const recieveRepositoryCommits = (commits) => ({
  type: RECIEVE_REPOSITORY_COMMITS,
  commits
})

export const ADD_REPOSITORY_COMMIT = 'ADD_REPOSITORY_COMMIT'
export const addRepositoryCommit = (repository) => ({
  type: ADD_REPOSITORY_COMMITS,
  repository
})

export const FILTER_REPOSITORY_COMMITS = 'FILTER_REPOSITORY_COMMITS'
export const filterRepositoryCommits = (commits) => ({
  type: FILTER_REPOSITORY_COMMITS,
  commits
})


export const SELECT_COMMIT = 'SELECT_COMMIT'
export const selectCommit = (commit) => ({
  type: SELECT_COMMIT,
  commit
})

export const REFRESH_COMMITS = 'REFRESH_COMMITS'
export const refreshCommits = () => ({
  type: REFRESH_COMMITS
})

export const fetchCommits = (account, repository, startDate, endDate) => (dispatch) => {

  dispatch(requestRepositoryCommits(account, repository, startDate, endDate))

  return bitbicket.commits(account, repository, startDate, endDate)
    .fork(
      error => dispatch(failedRepositoriesRequest(error)),
      response => dispatch(recieveRepositoryCommits(response))
    )
}
