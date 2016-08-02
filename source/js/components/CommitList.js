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
        <section className="table__table">
          <div className="table__header">
            <div className="table__row">
              <div className="table__heading"></div>
              <div className="table__heading">Commit</div>
              <div className="table__heading">Last updated</div>
            </div>
          </div>
          <div className="table__body">
            {commits.items.map(commit =>
              <CommitItem key={commit.hash} commit={commit} />
            )}
          </div>
        </section>
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
