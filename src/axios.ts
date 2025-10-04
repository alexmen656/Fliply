import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.fliply.sites.control-center.eu',
})

export default axiosInstance
