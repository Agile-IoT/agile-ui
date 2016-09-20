let BASE_API = 'http://217.77.95.110:8080/api'
let MIDDLEWARE_API = 'http://217.77.95.110:8080/data'

if (process.env.NODE_ENV === 'production') {
  BASE_API = '/api'
  MIDDLEWARE_API = '/data'
}

export { BASE_API, MIDDLEWARE_API }
