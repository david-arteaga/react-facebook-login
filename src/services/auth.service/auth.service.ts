import { AxiosInstance } from "axios";
import { AuthTokenService } from "../auth-token.service/auth-token.service";

export class AuthService {

  isLoggedIn() {
    return new Promise<boolean>((resolve, reject) => {
      this.getUser()
        .then(user => resolve(true))
        .catch(e => resolve(false))
    })
  }

  getUser() {
    return this.axios.get<User>('/api/v1/user').then(res => res.data)
  }

  getUserExists(id: string) {
    // return this.http.get<{ exists: boolean }>('/api/v1/auth/userExists', { params: { id } }).toPromise().then(r => r.exists)
  }

  logout() {
    // this.authTokenService.clearToken().catch(e => console.debug(e))
    // clearBets()
  }

  loginUserWithFacebookToken(access_token: string) {
    return this.axios.post<AuthResponse>('/api/v1/auth/facebook', { access_token })
      .then(res => res.data)
      .then(res => this.authTokenService.saveToken(res.jwtToken).then(t => res))
    // return fetch('http://localhost:3001/api/v1/auth/facebook', {
    //   method: 'POST',
    //   body: JSON.stringify({ access_token }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(r => r.json() as Promise<AuthResponse>)
    // return this.http.post<AuthResponse>('/api/v1/auth/facebook', { access_token })
    //   .toPromise()
    //   .then(response => {
    //     return this.authTokenService.saveToken(response.jwtToken).then(_ => response)
    //   })
  }

  constructor(
    private axios: AxiosInstance,
    private authTokenService: AuthTokenService,
  ) {}

}

interface AuthResponse {
  jwtToken: string
  user: User
}

export interface User {
  id: string
  fullname: string
  email: string
  fb_token: string
  photo_url: string
}
