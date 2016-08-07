import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import RepositoryItem from './RepositoryItem'
import { addRepository, fetchRepositories } from '../actions/repositories'

const RepositoryList = ({ repositories, loadMore }) => (
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
      <div className="list__cta">
        <button className="list__button"
          onClick={loadMore(repositories.name, repositories.page + 1)}>
          load more
        </button>
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

const mapDispatchToProps = (dispatch, props) => ({
  loadMore: (name, page) => () => {
    dispatch(fetchRepositories('bwiredintegration', name, page))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryList)
