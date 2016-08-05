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
    <li className="collection__item commit">
      <div className="commit__cell commit__cell--checkbox">
        <input className="form__input"
          type="checkbox"
          name={commit.hash}
          id={commit.message} />
      </div>
      <div className="commit__cell commit__cell--heading"
        data-value={commit.message}>
        <label htmlFor={commit.hash}>{commit.message}</label>
      </div>
      <div className="commit__cell commit__cell--name"
        data-value="{commit.repository.name}">
        <span>
          {commit.repository.name}
        </span>
      </div>
      <div className="commit__cell commit__cell--day"
        data-value={commit.date.format('dddd')}>
        {commit.date.format('dddd')}
      </div>
      <div className="commit__cell commit__cell--updated_at"
        data-value={commit.date.format('LT')}>
        {commit.date.format('LT')}
      </div>
    </li>
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
