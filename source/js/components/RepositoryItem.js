import React, { PropTypes } from 'react'

const RepositoryItem = ({ repository }) => (
  <div className="list__item">
    <div className="form__field">
      <input className="form__input"
        type="checkbox"
        name={repository.name}
        id={repository.name} />
      <label className="form__label"
        htmlFor={repository.name}>{repository.name}</label>
    </div>
  </div>
)

export default RepositoryItem
