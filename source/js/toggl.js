const makeRequest = (method = 'GET') => (uri, data = {}) => {
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

const makeFetch = method => (uri, data) => {
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

const query = makeRequest('GET')
const post = makeRequest('POST')

const getProject = () => query('/project')

const store = (key, value) => localStorage.setItem(key, JSON.stringify(value))

const colorLog = color => name => x => {
  console.log('%c' + name, 'color:' + color + ';font-weight:bold', x)
  return x
}
const log = (name, x) => colorLog('#3cf')(name)(x)
const trace = colorLog('#a3c')
const traceError = colorLog('#a00')

const prop = name => obj => obj[name]

const indexBy = prop => (acc, x) => (acc[x[prop]] = x, acc)

const saveEntries = db => store('toggl', db)

const retrieve = key => {
  const item = localStorage.getItem(key)
  return item
    ? JSON.parse(item)
    : {}
}

const setProjects = db => projects => {
  db.state.lastUpdated = Date.now()
  projects.forEach(project => {
    db.projects[project.id] = Object.assign({},
      project,
      { client: db.clients[project.cid] || null }
    )
  })
}

const addProject = db => project => {
  if (!project.error) {
    db.projects[project.data.id] = project.data
    db.names[project.data.name] = project.data.id
    store('toggl', db)
  }
}

const setClients = db => clients => {
  db.clientNames = clients.reduce((acc, x) => (acc[x.name] = x.id, acc), {})
  db.clients = clients.reduce(indexBy('id'), {})
}

const getClient = db => client => {
  const cid = db.clientNames[client]
  return db.clients[cid]
}

const addClient = db => client => {
  if (!client.error) {
    db.clients[client.data.id] = client.data
    db.clientNames[client.data.name] = client.data.id
    store('toggl', db)
  }
}

const getClientEntries = db => name => {
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

const setNames = db => projects => {
  db.names = projects.reduce((acc, project) => (acc[project.name] = project.id, acc), {})
}

const setCurrent = db => entry => {
  if (entry.data) {
    db.current = Object.assign({}, entry.data, {
      project: entry.data && entry.data.pid
        ? db.projects[entry.data.pid]
        : null
    })
  } else {
    db.current = false
  }
}

const setEntries = db => entries => {
  // set by timestamp
  db.timestamp = entries.map(entry => ({
    pid: entry.pid,
    id: entry.id,
    end: new Date(entry.at).getTime()
  }))

  return entries.reduce((entries, entry) => {
    db.entries[entry.id] = entry
    return entries
  }, db)
}

const getByTimestamp = db => () => {
  return db.timestamp.map(({ id, pid }) => {
    const entry = db.entries[id]
    const project = db.projects[pid]
    const client = project && db.clients[project.cid]
    const projectName = (project && project.name) || null
    const clientName = (client && client.name) || null
    return {
      description: entry.description,
      duration: entry.duration,
      durationHours: roundMinutes(entry.duration),
      start: entry.start,
      stop: entry.stop,
      project: projectName,
      client: clientName,
    }
  })
}

const getProjectEntries = db => name => {
  const pid = db.names[name]
  const entries = []
  for (let key in db.entries) {
    if (db.entries[key].pid === pid) {
      entries.push(db.entries[key])
    }
  }
  return entries
}

const roundMinutes = (seconds) => {
  const hours = seconds / 60 / 60

  return (Math.round(hours * 4) / 4).toFixed(2)
}

console.log('roundMinutes', roundMinutes(6801))
console.log('roundMinutes', roundMinutes(3600))

const getEntryProject = db => entry => db.projects[entry.pid]

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

// createProject :: {project} -> Promise.then
export const createProject = (project) => {
  if (!project.name) {
    throw new Error('you need to specify a project name')
  }
  return post('/projects', {
    project: Object.assign({}, {
      wid: 1016808,
      template_id: 10237,
      is_private: true,
    }, project)
  })
  .catch(traceError('project creation failed: ' + project.name))
  .then(db.addProject)
  .then(trace('project created: ' + project.name))
}

// createProject({
//   name: 'aae'
// })

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

const createOrGetClient = (client) => {
  const execRequest = () => {
    let savedClient = null
    if ((savedClient = db.getClient(client.name))) {
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

createOrGetClient({
  name: 'another-14'
})
