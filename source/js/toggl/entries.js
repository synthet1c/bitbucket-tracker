import { roundMinutes } from './utils'

// getByTimestamp :: {db} -> _ -> [...entry]
export const getByTimestamp = db => () => {
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

// getEntryProject :: {db} -> {entry} -> project
export const getEntryProject = db => entry => db.projects[entry.pid]


// setCurrent :: {db} -> {entry} -> void
export const setCurrent = db => entry => {
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


// setEntries :: {db} -> [...entry] -> [...entry]
export const setEntries = db => entries => {
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
