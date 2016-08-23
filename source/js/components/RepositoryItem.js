import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { addRepository, toggleRepository } from '../actions/repositories'
import { fetchCommits, refreshCommits } from '../actions/commits'
import _ from 'ramda'
import { classNames } from '../utils'

const trace = _.curry((name, x) => (console.log(name, x), x))
const timestamp = str => moment(str).format()
const humanize = str => moment(str).fromNow()

const RepositoryItem = ({
  repository,
  repositoryEvents,
}) => {
  const classes = classNames({
    repository: true,
    active: repository.active,
  })
  return (
    <li className="list__item">
      <div {...classes}
        {...repositoryEvents(repository)}>
        <div className="repository__cell repository__cell--heading"
          data-value={repository.name}>
          <span>{repository.name}</span>
        </div>
        <div className="repository__cell repository__cell--date">
          <span>{humanize(repository.updated_on)}</span>
        </div>
      </div>
    </li>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    frontend: state.frontend
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  repositoryEvents: repository => ({
    onClick: e => {
      dispatch(fetchCommits('bwiredintegration', repository.name))
      // dispatch(addRepository(repository.name))
      dispatch(toggleRepository(repository.name))
      dispatch(refreshCommits())
    }
  })
})

//
// const mapDispatchToProps = (dispatch, ownProps) => ({
//   onCheckboxChange: name => e => {
//     dispatch(addRepository(name))
//     dispatch(fetchCommits('bwiredintegration', name))
//   },
//   toggleActive: name => e => {
//     dispatch(toggleRepository(name))
//     dispatch(addRepository(name))
//     dispatch(fetchCommits('bwiredintegration', name))
//   }
// })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryItem)
