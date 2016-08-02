import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import RepositoryList from './RepositoryList'
import CommitList from './CommitList'

const App = ({ repositories }) => {
  return (
    <main className="main">
      <div className="main__inner">
        <div className="main__header">
          <h3 className="main__heading">Main</h3>
        </div>
        <div className="main__content">
          <RepositoryList />
          <CommitList />
        </div>
      </div>
    </main>
  )
}

const mapStateToProps = (state) => {
  return {
    repositories: state.entities.repositories
  }
}

export default connect(
  mapStateToProps
)(App)
