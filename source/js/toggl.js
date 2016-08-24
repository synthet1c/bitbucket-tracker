const query = (uri) => {
  return new Promise((resolve,reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", 'https://www.toggl.com/api/v8' + uri, true)
    xhr.setRequestHeader('Authorization', 'Basic '+ btoa("ef689c80ab1d8dfb7b3a22288812b567:api_token"))
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(xhr.responseText)
        }
      }
    }
    xhr.send()
  })
}

const parameterize = (obj) => {
  const arr = []
  for (let key in obj) {
    arr.push(key + '=' + obj[key])
  }
  return arr.join('&')
}

const post = (uri, data) => {
  return new Promise((resolve,reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", 'https://www.toggl.com/api/v8' + uri, true)
    xhr.setRequestHeader('Authorization', 'Basic '+ btoa("ef689c80ab1d8dfb7b3a22288812b567:api_token"))
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(xhr.responseText)
        }
      }
    }
    xhr.send(parameterize(data))
  })
}

const store = (key, value) => localStorage.setItem(key, JSON.stringify(value))

const trace = name => x => (console.log(name, x), x)

const saveEntries = db => store('toggl', db)

const retrieve = key => {
  const item = localStorage.getItem(key)
  return item
    ? JSON.parse(item)
    : {}
}

const setProjects = db => projects => {
  db.state.lastUpdated = Date.now()
  projects.forEach(project => db.projects[project.id] = project)
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
    return {
      description: entry.description,
      duration: entry.duration,
      start: entry.start,
      stop: entry.stop,
      project: (project && project.name) || 'null'
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

  return (Math.round(hours * 4) / 4).toFixed(2);
}

console.log('roundMinutes', roundMinutes(4601))
console.log('roundMinutes', roundMinutes(3770))

const getEntryProject = db => entry => db.projects[entry.pid]

const DB = schema => {
  const db = Object.assign({} ,schema, retrieve('toggl'))
  return {
    setEntries: setEntries(db),
    getEntries: () => db.entries,
    getProjectEntries: getProjectEntries(db),
    setCurrent: setCurrent(db),
    setProjects: setProjects(db),
    setNames: setNames(db),
    getDB: () => db,
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

Promise.all([
  query('/time_entries'),
  query('/time_entries/current'),
  query('/workspaces/1016808/projects'),
])
.then(([ timeEntries, current, projects ]) => {
  db.setEntries(timeEntries)
  db.setProjects(projects)
  db.setNames(projects)
  db.setCurrent(current)
  store('toggl', db.getDB())
  console.log('toggle', retrieve('toggl'))
  console.log('timestamp', db.getByTimestamp())
  console.log('staples', db.getProjectEntries('staples'))
})


post('/projects', {
  "name":"an-awesome-project",
  "wid":777,
  "template_id":10237,
  "is_private":true,
  "cid":123397
})
.then((reponse) => console.log(response))
