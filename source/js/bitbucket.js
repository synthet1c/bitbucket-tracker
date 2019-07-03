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

export const commits = (account, repo) => {
  const url = `https://api.bitbucket.org/2.0/repositories/${account}/${repo}/commits?limit=50`
  return query(url)
}

export const myRepositories = (account) => {
  const params = 'q=updated_on+>+' + encodeURIComponent(new Date().setDate(new Date().getDay() - 9).toISOString())
  const url = `https://api.bitbucket.org/2.0/repositories/andrewFountain?sort=-updated_on&${params}`
  return query(url)
}

export const repositories = (account, repo, page = 1, startDate, endDate) => {
  console.log('moment', moment())
  const date = moment().day(-9).format('YYYY-MM-DD')
  console.log('moment', moment)
  const aWeekAgo = new Date(new Date().setDate(new Date().getDay() - 9)).toISOString()
  const params = serialize({
    page,
    sort: '-updated_on',
    q: {
      updated_on: ['>', date]
    }
  })
  const url = `https://api.bitbucket.org/2.0/repositories/${account}${params}`
  return query(url)
}

const serialize = (params, encode = false) => {
  let arr = []
  let comparitor = '='
  let value = ''
  for (let key in params) {
    if (key === 'q') {
      arr.push('q=' + encodeURIComponent(serialize(params[key], true)))
    } else {
      if (Array.isArray(params[key])) {
        comparitor = params[key][0]
        value = params[key][1]
      } else {
        value = params[key]
      }
      value = encodeURIComponent(value)
      if (encode) {
        arr = arr.concat(`${key} ${comparitor} ${value}`)
      } else {
        arr = arr.concat(`${key}=${value}`)
      }
    }
  }
  if (encode) {
    return arr
  }
  return '?' + arr.join('&')
}

export const exec = (url, params = {page: 1}) => e => {
  const _params = {
    page: 1,
    updated_on: ['>', '2016-08-04']
  }
  return query(url + serializeParams(_params))
}



export default bitbucketInit
