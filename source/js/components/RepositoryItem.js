import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { addRepository } from '../actions/repositories'

const timestamp = str => moment(str).format()
const humanize = str => moment(str).from(moment(new Date))

const RepositoryItem = ({
  repository,
  onCheckboxChange
}) => {
  return (
    <div className="table__row">
      <div className="table__cell table__cell--checkbox">
        <input className="form__input"
          onClick={e => onCheckboxChange(repository.name)}
          type="checkbox"
          name={repository.name}
          id={repository.name} />
      </div>
      <div className="table__cell table__cell--heading"
        data-value={repository.name}>
        <label htmlFor={repository.name}>{repository.name}</label>
      </div>
      <div className="table__cell table__cell--updated_at"
        data-value={timestamp(repository.update_at)}>
        {humanize(repository.updated_at)}
      </div>
    </div>
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
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryItem)
