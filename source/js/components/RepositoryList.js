import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import RepositoryItem from './RepositoryItem'

const RepositoryList = ({ repositories }) => (
  <div className="list list--repositories">
    <div className="list__inner">
      <div className="list__heading">
        <h3 className="list__heading">Repositories</h3>
      </div>
      <div className="list__content">
        <ul className="list__list">
          {repositories.items.map(repository =>
            <RepositoryItem key={repository.uuid} repository={repository} />
          )}
        </ul>
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
