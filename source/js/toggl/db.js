import {
  getProjectEntries,
  getProject,
  setProjects,
  addProject,
  createProject,
  setNames,
} from './projects'

import {
  getByTimestamp,
  getEntryProject,
  setCurrent,
  setEntries,
} from './entries'

import {
  setClients,
  getClient,
  addClient,
  getClientEntries,
  createOrGetClient,
} from './clients'

import {
  makeRequest,
  log,
  trace,
  traceError,
  colorLog,
  prop,
  mixin,
  roundMinutes,
  query,
  post,
} from './utils'

export const store = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export const saveEntries = db => store('toggl', db)

export const retrieve = key => {
  const item = localStorage.getItem(key)
  return item
    ? JSON.parse(item)
    : {}
}

const DB = schema => {
  const db = Object.assign({}, schema, retrieve('toggl'))
  return Object.assign({},
    {
      getDB: () => db,
      save: () => store('toggl', db),
      getEntries: () => db.entries,
    },
    mixin(
      setEntries,
      getProjectEntries,
      setCurrent,
      setProjects,
      setClients,
      getClient,
      addClient,
      setNames,
      getByTimestamp,
      getClientEntries,
      createOrGetClient,
    )(db)
  )
}

export const db = DB({
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
  .then((args) => {
    const [ timeEntries, current, projects, clients ] = args
    log('toggl', { timeEntries, current, projects, clients })
    return args
  })
  .then(([ timeEntries, current, projects, clients ]) => {
    db.setEntries(timeEntries)
    db.setClients(clients)
    db.setProjects(projects)
    db.setNames(projects)
    db.setCurrent(current)
    store('toggl', db.getDB())
  })
}

initProjects()
  .then(() => {
    log('getClientEntries', db.getClientEntries('bwiredcomau'))
    log('getByTimestamp', db.getByTimestamp())
    db.createOrGetClient({ name: 'another-11' })
  })

// createProject({
//   name: 'aae'
// })

console.log('dbee', db)
