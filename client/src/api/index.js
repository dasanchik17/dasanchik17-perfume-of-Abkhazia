import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use(config => {
    const auth  = JSON.parse(localStorage.getItem('auth') || '{}')
    const token = auth?.state?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default api