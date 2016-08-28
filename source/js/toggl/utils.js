// colorLog :: String -> String -> a -> a
export const colorLog = color => name => x => {
  console.log('%c' + name, 'color:' + color + ';font-weight:bold', x)
  return x
}

// log :: (String, a) -> a
export const log = (name, x) => colorLog('#3cf')(name)(x)

// trace :: (String, a) -> a
export const trace = colorLog('#a3c')

// traceError :: (String, a) -> a
export const traceError = colorLog('#a00')

// prop :: String -> {} -> a
export const prop = name => obj => obj[name]

// indexBy :: String -> {}
export const indexBy = prop => (acc, x) => (acc[x[prop]] = x, acc)

// roundMinutes :: Int -> String
const roundMinutes = (seconds) => {
  const hours = seconds / 60 / 60
  return (Math.round(hours * 4) / 4).toFixed(2)
}

// makeRequest :: String -> (String, Object) -> Promise(xhr)
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
