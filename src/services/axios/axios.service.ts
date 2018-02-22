import Axios, { AxiosRequestConfig } from 'axios'
import { AuthTokenService } from '../auth-token.service/auth-token.service';
import { baseURL } from '../../config/base-url.config';

export const getAxios = (authTokenService: AuthTokenService) => {
  const axios = Axios.create({
    baseURL
  })

  axios.interceptors.request.use((config) => {
    return addJwtTokenHeader(config, authTokenService)
  })

  return axios
}

const addJwtTokenHeader = async (config: AxiosRequestConfig, authTokenService: AuthTokenService) => {
  console.debug('running axios interceptos jwt')
  try {
    const jwtToken = await authTokenService.jwtToken
    config.headers = {
      Authorization: `Bearer ${jwtToken}`,
    }
  } catch {
  }
  return config
}
