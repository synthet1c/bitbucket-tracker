import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { addRepository } from '../actions/repositories'
import { fetchCommits } from '../actions/commits'
import _ from 'ramda'

const trace = _.curry((name, x) => (console.log(name, x), x))
const timestamp = str => moment(str).format()
const humanize = str => moment(str).fromNow()

const RepositoryItem = ({
  repository,
  onCheckboxChange
}) => {
  return (
    <tr className="table__row">
      <td className="table__cell table__cell--checkbox">
        <input className="form__input"
          onClick={e => onCheckboxChange(repository.name)}
          type="checkbox"
          name={repository.name}
          id={repository.name} />
      </td>
      <td className="table__cell table__cell--heading"
        data-value={repository.name}>
        <label htmlFor={repository.name}>{repository.name}</label>
      </td>
      <td className="table__cell table__cell--updated_at"
        data-value={timestamp(repository.updated_on)}>
        {humanize(repository.updated_on)}
      </td>
    </tr>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    frontend: state.frontend
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCheckboxChange: name => {
    dispatch(addRepository(name))
    dispatch(fetchCommits('bwiredintegration', name))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryItem)
