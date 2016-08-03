import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import CommitItem from './CommitItem'
import { addCommit } from '../actions/commits'

const CommitList = ({ commits }) => (
  !commits
  ? null
  : <div className="table table--commits">
    <div className="table__inner">
      <div className="table__heading">
        <h3 className="table__heading">Commits</h3>
      </div>
      <div className="table__content">
        <table className="table__table">
          <thead className="table__header">
            <tr className="table__row">
              <th className="table__heading"></th>
              <th className="table__heading">Commit</th>
              <th className="table__heading">Repository</th>
              <th className="table__heading">Last updated</th>
            </tr>
          </thead>
          <tbody className="table__body">
            {commits.items.map(commit =>
              <CommitItem key={commit.hash} commit={commit} />
            )}
          </tbody>
        </table>
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
