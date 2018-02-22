import { AuthService } from "./auth.service/auth.service";
import { AuthTokenService } from "./auth-token.service/auth-token.service";
import { getAxios } from "./axios/axios.service";

export const authTokenService = new AuthTokenService(window.localStorage)
const axios = getAxios(authTokenService)
export const authService = new AuthService(axios, authTokenService)
