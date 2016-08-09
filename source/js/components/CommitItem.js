import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { addCommit, fetchCommits } from '../actions/commits'
import * as bitbucket from '../bitbucket'

const timestamp = str => moment(str).format()
const humanize = str => moment(str).format('dddd, MMMM Do, h:mm:ss a')

const CommitItem = ({
  commit
}) => {
  const hash = commit.hash.slice(-7)
  return (
    <li className="list__item list__item--commit">
      <label className="commit" htmlFor={hash}>
        <div className="commit__cell--index">
          <span>{commit.hash.slice(-7)}</span>
        </div>
        <div className="commit__wrapper commit__wrapper--title">
          <div className="commit__cell commit__cell--name"
            data-value="{commit.repository.name}">
            <span onClick={bitbucket.exec(commit.links.comments.href)}>
              {commit.repository.name}
            </span>
          </div>
          <div className="commit__cell commit__cell--heading"
            data-value={commit.message}>
            <span>{commit.message}</span>
          </div>
        </div>
        <div className="commit__wrapper commit__wrapper--times">
          <div className="commit__cell commit__cell--day"
            data-value={commit.date.format('dddd')}>
            {commit.date.format('dddd Do')}
          </div>
          <div className="commit__cell commit__cell--updated_at"
            data-value={commit.date.format('LT')}>
            {commit.date.format('LT')}
          </div>
        </div>
      </label>
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
