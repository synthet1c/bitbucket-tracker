import * as projects from './projects'
import * as clients from './clients'


export const makeRequest = (method = 'GET') => (uri, data = {}) => {
  return new Promise((resolve,reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, 'https://www.toggl.com/api/v8' + uri, true)
    xhr.setRequestHeader('Authorization', 'Basic '+ btoa("ef689c80ab1d8dfb7b3a22288812b567:api_token"))
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject({ error: xhr.responseText })
        }
      }
    }
    xhr.send(JSON.stringify(data))
  })
}

export const makeFetch = method => (uri, data) => {
  const request = new Request('https://www.toggl.com/api/v8' + uri, {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    cache: 'no-cache',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('ef689c80ab1d8dfb7b3a22288812b567:api_token')
    }),
    data: JSON.stringify(data)
  })

  const init = {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    cache: 'no-cache',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('ef689c80ab1d8dfb7b3a22288812b567:api_token')
    }),
    data: JSON.stringify(data)
  }
  return fetch('https://www.toggl.com/api/v8' + uri, init)
    .then(trace('fetch'))
    .then((response) => response.json())
}

export const query = makeRequest('GET')
export const post = makeRequest('POST')

export const getProject = () => query('/project')

export const store = (key, value) => localStorage.setItem(key, JSON.stringify(value))





export const saveEntries = db => store('toggl', db)

export const retrieve = key => {
  const item = localStorage.getItem(key)
  return item
    ? JSON.parse(item)
    : {}
}

console.log('roundMinutes', roundMinutes(6801))
console.log('roundMinutes', roundMinutes(3600))

const DB = schema => {
  const db = Object.assign({}, schema, retrieve('toggl'))
  return {
    setEntries: setEntries(db),
    getEntries: () => db.entries,
    getProjectEntries: getProjectEntries(db),
    setCurrent: setCurrent(db),
    setProjects: setProjects(db),
    setClients: setClients(db),
    getClient: getClient(db),
    addClient: addClient(db),
    getClientEntries: getClientEntries(db),
    setNames: setNames(db),
    getDB: () => db,
    save: () => store('toggl', db),
    getByTimestamp: getByTimestamp(db)
  }
}

const db = DB({
  state: {
    lastUpdated: 0,
    projects: 0,
    entries: 0
  },
  projects: {},
  names: {},
  entries: {},
  current: {},
  timestamp: []
})

// initProjects :: _ -> Promise.then
export const initProjects = () => {
  return Promise.all([
    query('/time_entries'),
    query('/time_entries/current'),
    query('/workspaces/1016808/projects'),
    query('/clients'),
  ])
  .then(trace('toggl'))
  .then(([ timeEntries, current, projects, clients ]) => {
    db.setEntries(timeEntries)
    db.setClients(clients)
    db.setProjects(projects)
    db.setNames(projects)
    db.setCurrent(current)
    log('getClientEntries', db.getClientEntries('bwiredcomau'))
    log('getByTimestamp', db.getByTimestamp())
    store('toggl', db.getDB())
  })
}

initProjects()
  .then(() => {

  })

// createProject({
//   name: 'aae'
// })


createOrGetClient({ name: 'another-16' })
