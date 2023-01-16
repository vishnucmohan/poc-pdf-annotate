import axios from 'axios'

const error = () => {
    console.error('API error');
}
export const baseURL = 'https://casebundle.bigformula.com/api';

const service = axios.create({
  baseURL: baseURL,
  timeout: 5000 
})


service.interceptors.request.use(
  config => {
    return config
  },
  err => {
    error()
    Promise.reject(err)
  }
)


service.interceptors.response.use(
  response => {
    return response.data
  },
  err => {
    error()
    return Promise.reject(err)
  }
)

export default service