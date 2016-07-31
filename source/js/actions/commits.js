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


export const GET_REPOSITORY_COMMITS = 'GET_REPOSITORY_COMMITS'

export const getRepositoryCommits = (account, repository) => ({
  type: GET_REPOSITORY_COMMITS,
  account,
  repository
})


export const SELECT_COMMIT = 'SELECT_COMMIT'

export const selectCommit = (commit) => ({
  type: SELECT_COMMIT,
  commit
})
