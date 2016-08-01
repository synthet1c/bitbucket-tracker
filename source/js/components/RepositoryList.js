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
        <section className="table__table">
          <div className="table__header">
            <div className="table__row">
              <div className="table__heading"></div>
              <div className="table__heading">Repository</div>
              <div className="table__heading">Last updated</div>
            </div>
          </div>
          <div className="table__body">
            {repositories.items.map(repository =>
              <RepositoryItem key={repository.uuid} repository={repository} />
            )}
          </div>
        </section>
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
