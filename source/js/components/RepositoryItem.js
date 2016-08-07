import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { addRepository, toggleRepository } from '../actions/repositories'
import { fetchCommits } from '../actions/commits'
import _ from 'ramda'

const trace = _.curry((name, x) => (console.log(name, x), x))
const timestamp = str => moment(str).format()
const humanize = str => moment(str).fromNow()

const classNames = (...classes) => {

  const className = classes.reduce((acc, clazz) => {
    if (typeof clazz === 'string' || Array.isArray(clazz)) {
      return acc.concat(clazz)
    }
    for (let key in clazz) {
      if (clazz[key]) {
        acc = acc.concat(key)
      }
    }
    return acc
  }, []).join(' ')

  return {
    className
  }
}

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
      dispatch(toggleRepository(repository.name))
      dispatch(addRepository(repository.name))
      dispatch(fetchCommits('bwiredintegration', repository.name))
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
