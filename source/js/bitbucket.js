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
  const params = 'q=updated_on+>+' + encodeURIComponent(new Date().setDate(new Date().getDay() - 7).toISOString())
  const url = `https://api.bitbucket.org/2.0/repositories/andrewFountain?sort=-updated_on&${params}`
  return query(url)
}

export const repositories = (account, repo, page = 1) => {
  console.log('moment', moment())
  const date = moment().day(-7).format('YYYY-MM-DD')
  console.log('moment', moment)
  const aWeekAgo = new Date(new Date().setDate(new Date().getDay() - 7)).toISOString()
  const params = 'updated_on+>+' + encodeURIComponent(date)
  const url = `https://api.bitbucket.org/2.0/repositories/${account}?sort=-updated_on&page=${page}&q=${params}`
  return query(url)
}

export default bitbucketInit
