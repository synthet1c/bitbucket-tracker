import {
  getProjectEntries,
  setProjects,
} from './projects'

import {

} from './entries'

import {
  setClients,
  getClient,
  addClient,
  getClientEntries,
} from './clients'

import {
  makeRequest,
  log,
  trace,
  traceError,
  colorLog,
  prop,
} from './utils'

export const store = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export const saveEntries = db => store('toggl', db)

export const retrieve = key => {
  const item = localStorage.getItem(key)
  return item
    ? JSON.parse(item)
    : {}
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
