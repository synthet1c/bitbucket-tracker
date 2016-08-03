import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import RepositoryItem from './RepositoryItem'
import { addRepository } from '../actions/repositories'

const RepositoryList = ({ repositories }) => (
  <div className="table table--repositories">
    <div className="table__inner">
      <div className="table__heading">
        <h3 className="table__heading">Repositories</h3>
      </div>
      <div className="table__content">
        <table className="table__table">
          <thead className="table__header">
            <tr className="table__row">
              <th className="table__heading"></th>
              <th className="table__heading">Repository</th>
              <th className="table__heading">Last updated</th>
            </tr>
          </thead>
          <tbody className="table__body">
            {repositories.items.map(repository =>
              <RepositoryItem key={repository.uuid} repository={repository} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

const mapStateToProps = (state) => {
  console.log('RepositoryList', state)
  return {
    repositories: state.entities.repositories
  }
}

export default connect(
  mapStateToProps
)(RepositoryList)
