import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { addCommit, fetchCommits } from '../actions/commits'

const timestamp = str => moment(str).format()
const humanize = str => moment(str).format('dddd, MMMM Do, h:mm:ss a')

const CommitItem = ({
  commit
}) => {
  return (
    <tr className="table__row">
      <td className="table__cell table__cell--checkbox">
        <input className="form__input"
          type="checkbox"
          name={commit.hash}
          id={commit.message} />
      </td>
      <td className="table__cell table__cell--heading"
        data-value={commit.message}>
        <label htmlFor={commit.hash}>{commit.message}</label>
      </td>
      <td className="table__cell table__cell--name"
        data-value="{commit.repository.name}">
        {commit.repository.name}
      </td>
      <td className="table__cell table__cell--updated_at"
        data-value={timestamp(commit.date)}>
        {humanize(commit.date)}
      </td>
    </tr>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    frontend: state.frontend,
    commits: state.entities.commits
  }
}

// const mapDispatchToProps = (dispatch, ownProps) => ({
//   onCheckboxChange: name => {
//     dispatch(fetchCommits('bwiredintegration', name))
//   }
// })

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(CommitItem)
