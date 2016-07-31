import * as commits from './actions/commits'
import * as repositories from './actions/repositories'

export default {
  ...commits,
  ...repositories,
}
