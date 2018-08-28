import axios from 'axios'

const API_URL = 'http://192.168.1.14:9000'

const fetcher = {
  get: url => axios.get(`${API_URL}/${url}`),
  post: (url, data) => axios.post(`${API_URL}/${url}`, data)
}

export const getLieux = () => fetcher.get('lieux')

export const getFormations = () => fetcher.get('formations')

export const getModulesByCodeFormation = codeFormation => fetcher.get(`formations/${codeFormation}/modules`)

export const generateCalendar = params => fetcher.post('generationCal', params)

export const getStagiaires = () => fetcher.get('stagiaires')

export const getModules = () => fetcher.get('modules')
