// setProjects :: {db} -> {projects} -> void
export const setProjects = db => projects => {
  db.state.lastUpdated = Date.now()
  projects.forEach(project => {
    db.projects[project.id] = Object.assign({},
      project,
      { client: db.clients[project.cid] || null }
    )
  })
}

// addProject :: {db} -> {project} -> void
export const addProject = db => project => {
  if (!project.error) {
    db.projects[project.data.id] = project.data
    db.names[project.data.name] = project.data.id
    store('toggl', db)
  }
}

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

// getProjectEntries :: {db} -> String -> [...entry]
export const getProjectEntries = db => name => {
  const pid = db.names[name]
  const entries = []
  for (let key in db.entries) {
    if (db.entries[key].pid === pid) {
      entries.push(db.entries[key])
    }
  }
  return entries
}

// setNames :: {db} -> [...project] -> void
export const setNames = db => projects => {
  db.names = projects.reduce((acc, project) => (acc[project.name] = project.id, acc), {})
}
