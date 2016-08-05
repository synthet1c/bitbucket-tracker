import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import CommitItem from './CommitItem'
import { addCommit } from '../actions/commits'

const CommitList = ({ commits }) => (
  !commits
  ? null
  : <div className="collection collection--commits">
    <div className="collection__inner">
      <div className="collection__heading">
        <h3 className="collection__heading">Commits</h3>
      </div>
      <div className="collection__content">
        <ul className="collection__list">
          {commits.items.map(commit =>
            <CommitItem key={commit.hash} commit={commit} />
          )}
        </ul>
      </div>
    </div>
  </div>
)

const mapStateToProps = (state) => {
  console.log('CommitList', state)
  return {
    commits: state.entities.commits
  }
}

export default connect(
  mapStateToProps
)(CommitList)
