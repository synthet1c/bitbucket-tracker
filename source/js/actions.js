import * as commits from './actions/commits'
import * as repositories from './actions/repositories'
import * as dateRange from './actions/dateRange'

export default {
  ...commits,
  ...repositories,
  ...dateRange,
}
