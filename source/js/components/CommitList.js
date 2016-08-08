import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import CommitItem from './CommitItem'
import { addCommit } from '../actions/commits'

const CommitList = ({ commits }) => (
  <div className="list list--commits">
    <div className="list__inner">
      <div className="list__heading">
        <h3 className="list__heading">Commits</h3>
      </div>
      <div className="list__content">
        <ul className="list__list">
          <li className="list__item list__item--commit list__item--heading">
            <label className="commit" htmlFor="hash">
              <div className="commit__cell--index">
                <span>hash</span>
              </div>
              <div className="commit__wrapper commit__wrapper--title">
                <div className="commit__cell commit__cell--name"
                  data-value="Repository name">
                  <span>
                    Repository name
                  </span>
                </div>
                <div className="commit__cell commit__cell--heading"
                  data-value="Commit message">
                  <span>Commit message</span>
                </div>
              </div>
              <div className="commit__wrapper commit__wrapper--times">
                <div className="commit__cell commit__cell--day"
                  data-value="Commit Date">
                  <span>Date</span>
                </div>
                <div className="commit__cell commit__cell--updated_at"
                  data-value="Updated on">
                  <span>Updated on</span>
                </div>
              </div>
            </label>
          </li>
          {commits && commits.items.map(commit =>
            <CommitItem key={commit.hash} commit={commit} />
          )}
        </ul>
      </div>
    </div>
  </div>
)

const mapStateToProps = (state) => {
  console.log('CommitList', state)
  return {
    commits: state.entities.commits
  }
}

export default connect(
  mapStateToProps
)(CommitList)
