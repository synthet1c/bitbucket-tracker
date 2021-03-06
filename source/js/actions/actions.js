import * as commits from './commits'
import * as repositories from './repositories'
import * as dateRange from './dateRange'

export const CHANGE_PAGE = 'CHANGE_PAGE'

export const changePage = (page) => ({
  type: CHANGE_PAGE,
  page
})

export default {
  ...commits,
  ...repositories,
  ...dateRange,
  changePage
}
