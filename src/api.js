import axios from 'axios'

// const API_URL = 'http://192.168.1.14:9000'
let API_URL = 'http://localhost:9000'
let API_URL_FRONT = 'http://localhost:8080'

const fetcher = {
  get: url => axios.get(`${API_URL}/${url}`),
  post: (url, data) => axios.post(`${API_URL}/${url}`, data)
}

export const apiUrlFront = {
  API_URL_FRONT
}

export const getLieux = () => fetcher.get('lieux')

export const getNbStagiaireByCours = () => fetcher.get('stagiaireCours')

export const getConstraints = () => fetcher.get('constraints')

export const getFormations = () => fetcher.get('formations')

export const getModulesByCodeFormation = codeFormation => fetcher.get(`formations/${codeFormation}/modules`)

export const incrementCours = idCours => fetcher.get(`increment/${idCours}`)

export const dincrementCours = idCours => fetcher.get(`dincrement/${idCours}`)

export const getModulePrerequisByFormationAndModule = (codeFormation, idModule) => fetcher.get(`modulesPrerequis/formations/${codeFormation}/modules/${idModule}`)

export const createModulesPrerequis = modulesPrerequis => fetcher.post('modulesPrerequis', modulesPrerequis)

export const createModulesPrerequisPlanning = modulesPrerequisPlanning => fetcher.post('modulesPrerequisPlanning', modulesPrerequisPlanning)

export const getModulesPrerequisPlanning = () => fetcher.get('modulesPrerequisPlanning')

export const updateModulesPrerequis = modulesPrerequis => fetcher.post('modulesPrerequisUpdate', modulesPrerequis)

export const getModulesHorsCodeFormation = codeFormation => fetcher.get(`formations/${codeFormation}/notmodules`)

export const getCoursByModules = idModule => fetcher.get(`modules/${idModule}/cours`)

export const generateCalendar = params => fetcher.post('generationCal', params)

export const saveCal = params => fetcher.post('saveCal', params)

export const updateCalendar = params => fetcher.post('updateCal', params)

export const verifierCalendar = idCalendar => fetcher.get(`verificationCal/${idCalendar}`)

export const saveCalendar = params => fetcher.post('saveCal', params)

export const saveConstraint = params => fetcher.post('constraints', params)

export const getStagiaires = () => fetcher.get('stagiaires')

export const getCalendriers = () => fetcher.get('calendriers')

export const getCalendriersById = idCalendrier => fetcher.get(`calendriers/${idCalendrier}`)

export const getModules = () => fetcher.get('modules')

export const getModulesPrerequis = () => fetcher.get('modulesPrerequis')

export const getModulesId = moduleId => fetcher.get(`modules/${moduleId}`)

export const getAlerteNm = alerte => fetcher.get(`status/${alerte}`)

export const synchronise = () => fetcher.get('synchronise')

export const getModulesPrerequisPlanningById = id => fetcher.get(`modulesPrerequisPlanning/${id}`)

export const loadConfig = async () => {
  const { data } = await axios.get('/static/config.json')
  if (data && data.backend) API_URL = data.backend
  return API_URL
}
