import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import CommitItem from './CommitItem'
import { addCommit } from '../actions/commits'

const CommitList = ({ commits }) => (
  <div className="list list--commits">
    <div className="list__inner">
      <div className="list__heading">
        <h3 className="list__heading">Commits</h3>
      </div>
      <div className="list__content">
        <ul className="list__list">
          {commits && commits.items.map(commit =>
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
