const nativeStorageJwtTokenKey = "user_jwt_token"

export class AuthTokenService {

  private _jwtToken: string | null
  saveToken(jwtToken: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this.localStorage.setItem(nativeStorageJwtTokenKey, jwtToken)
        this._jwtToken = jwtToken
        resolve(jwtToken)
      } catch (e) {
        reject(e)
      }
    })
  }

  clearToken(): Promise<any> {
    this._jwtToken = null
    return new Promise((resolve, reject) => {
      try {
        this.localStorage.removeItem(nativeStorageJwtTokenKey)
        resolve()
      } catch (e) {
        reject(e)
      }
    })

  }

  get jwtToken(): Promise<string> {
    if (this._jwtToken) {
      return Promise.resolve(this._jwtToken)
    } else {
      return new Promise((resolve, reject) => {
        const token = this.localStorage.getItem(nativeStorageJwtTokenKey)
        if (token !== null) {
          this._jwtToken = token
          resolve(token)
        } else {
          reject(new Error(`There was no token found for the key ${nativeStorageJwtTokenKey}`))
        }
      })
    }
  }


  constructor(
    private localStorage: Storage
  ) { }

}
