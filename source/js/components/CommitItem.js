import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { addCommit, fetchCommits } from '../actions/commits'

const timestamp = str => moment(str).format()
const humanize = str => moment(str).from(moment(new Date))

const CommitItem = ({
  commit,
  onCheckboxChange
}) => {
  return (
    <div className="table__row">
      <div className="table__cell table__cell--checkbox">
        <input className="form__input"
          onClick={e => onCheckboxChange(commit.message)}
          type="checkbox"
          name={commit.hash}
          id={commit.message} />
      </div>
      <div className="table__cell table__cell--heading"
        data-value={commit.message}>
        <label htmlFor={commit.hash}>{commit.message}</label>
      </div>
      <div className="table__cell table__cell--updated_at"
        data-value={timestamp(commit.update_at)}>
        {humanize(commit.updated_at)}
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    frontend: state.frontend,
    commits: state.entities.commits
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCheckboxChange: name => {
    dispatch(fetchCommits('bwiredintegration', name))
  }
})

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(CommitItem)
