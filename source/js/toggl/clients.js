import { getProjectEntries } from './projects'
import { db, store } from './db'
import {
  indexBy,
  trace,
  traceError
} from './utils'

// setClients :: {db} -> [...client] -> void
export const setClients = db => clients => {
  db.clientNames = clients.reduce((acc, x) => (acc[x.name] = x.id, acc), {})
  db.clients = clients.reduce(indexBy('id'), {})
}

// getClient :: {db} -> String -> {client}
export const getClient = db => client => {
  const cid = db.clientNames[client]
  return db.clients[cid]
}

// addClient :: {db} -> {client} -> void
export const addClient = db => client => {
  if (!client.error) {
    db.clients[client.data.id] = client.data
    db.clientNames[client.data.name] = client.data.id
    store('toggl', db)
 }
}
// createClient :: {client} -> Promise(client)
export const createClient = client => {
  if (!client.name) {
    throw new Error('you need to specify a client name')
  }
  return post('/clients', {
    client: Object.assign({}, {
      wid: 1016808
    }, client)
  })
  .catch(traceError('client creation failed: ' + client.name))
  .then(db.addClient)
  .then(trace('created client: ' + client.name))
}

// getClientEntries :: {db} -> String -> [...project]
export const getClientEntries = db => name => {
  const client = db.clients[db.clientNames[name]]
  const projects = []
  for (let key in db.projects) {
    if (db.projects[key].cid && db.projects[key].cid === client.id) {
      projects.push(db.projects[key])
    }
  }
  return projects.reduce((acc, project) => {
    return acc.concat(getProjectEntries(db)(project.name))
  }, [])
}

// createOrGetClient :: _ -> {client} -> Promise(client)
export const createOrGetClient = db => client => {
  const execRequest = () => {
    let savedClient = null
    if ((savedClient = getClient(db)(client.name))) {
      return new Promise((resolve,_) => resolve(savedClient))
    }
    const clientObj = {
      client: Object.assign({}, {
        wid: 1016808
      }, client)
    }
    return post('/clients', clientObj)
      .catch(traceError('client creation failed: ' + client.name))
      .then(response => response.data)
  }
  return execRequest()
    .then(trace('createOrGetClient'))
}
