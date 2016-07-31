import _ from 'ramda'
import moment from 'moment'
import config from './config.json'

const Task = require('data.task')

let auth = null

const trace = _.curry((name, x) => (console.log(name, x), x))

const bitbucketInit = ({ username, password }) => {
  auth = btoa(`${username}:${password}`)
}

const query = (url) => {
  return new Task((reject, resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          return resolve(JSON.parse(xhr.response), xhr)
        }
        return reject(xhr)
      }
    }
    xhr.open('GET', url)
    xhr.setRequestHeader(
      'Content-Type',
      'application/json; charset=UTF-8'
    )
    xhr.setRequestHeader(
      'Authorization',
      `Basic ` + btoa(config.bitbucket.username + ':' + config.bitbucket.password)
    )
    xhr.send()
  })
}

const serialize = (obj) => {
  console.log(_.toPairs(obj))
  // return _.toPairs(obj).map(param => param.join('=')).join('&')
}

export const commits = (account, repo) => {
  const url = `https://api.bitbucket.org/2.0/repositories/${account}/${repo}/commits?limit=50`
  return query(url)
}

export const myRepositories = (account) => {
  const url = `https://api.bitbucket.org/2.0/repositories/andrewFountain?sort=-updated_on`
  return query(url)
}

export const repositories = (account, repo) => {
  console.log('moment', moment())
  const date = moment().day(1).format()
  console.log('moment', moment)
  const queryString = '' // encodeURIComponent(`updated_on=2016-07-25`)
  const url = `https://api.bitbucket.org/2.0/repositories/${account}?sort=-updated_on`
  return query(url)
}

export default bitbucketInit
