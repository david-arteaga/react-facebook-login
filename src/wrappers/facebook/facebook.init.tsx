import * as React from 'react'
import { Observable, Subscriber } from 'rxjs'
import { EventEmitter } from 'events';

const forEmitter = (eventEmitter: EventEmitter) => (key: string) => (observer: Subscriber<fb.AuthResponse>) => {
  eventEmitter.on(key, auth => observer.next(auth))
}

const onlogin_callback_function = '___facebook_init_facebook_login_callback'

export class Facebook {
  readonly onFbInitLoggedIn: Observable<fb.AuthResponse>
  readonly onLogin: Observable<fb.AuthResponse>
  readonly onLogout: Observable<fb.AuthResponse>
  readonly onInit: Observable<void>

  private eventEmitter: EventEmitter

  constructor(facebookConfig: fb.InitParams) {
    // configure observables
    this.eventEmitter = new EventEmitter()
    const forKey = forEmitter(this.eventEmitter)
    this.onFbInitLoggedIn = new Observable(forKey('onFbInitLoggedIn'))
    this.onLogin = new Observable(forKey('onLogin'))
    this.onLogout = new Observable(forKey('onLogout'))
    this.onInit = new Observable(obs => { this.eventEmitter.on('onInit', () => obs.next() )})

    this.configureFacebook(facebookConfig)
  }

  private configureFacebook(facebookConfig: fb.InitParams) {
    // Load the SDK asynchronously
    (function(d: any, s: any, id: any) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/es_LA/sdk.js";
      fjs.parentNode!.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    const self = this

    ;
    (window as any)[onlogin_callback_function] = function facebookLoginCallback(response: facebook.AuthResponse) {
      console.debug(onlogin_callback_function)
      self.respondToFbLoginStatus(response)
    }

    ;
    (window as any).fbAsyncInit = function() {
      FB.init(facebookConfig)
      self.eventEmitter.emit('onInit')
      FB.getLoginStatus(response => {
        console.debug(response)
        if (response.authResponse && response.status === 'connected') {
          self.eventEmitter.emit('onFbInitLoggedIn', response)
        } else {
          console.debug('user is not logged in')
        }
      })
    };

    // FB.init(facebookConfig);
  }

  private respondToFbLoginStatus(response: facebook.AuthResponse) {
    console.debug(response)
    if (response.authResponse && response.status === 'connected') {
      // user is logged in with facebook and has authorized app
      console.debug('******user has logged in')
      this.eventEmitter.emit('onLogin', response)
    } else if (response.authResponse && response.status === 'unknown') {
      // user just logged out of facebook
      console.debug('******user has LOGGED OUT')
      this.eventEmitter.emit('onLogout', response)
    }
  }


}

export class FacebookLoginButton extends React.Component<{}> {

  componentDidMount() {
    console.log(FB)
    if (FB && FB.XFBML && FB.XFBML.parse) {
      FB.XFBML.parse()
    }
  }

  render () {
    return (
      <div
        className="fb-login-button"
        data-max-rows="1"
        data-size="large"
        data-show-faces="false"
        data-auto-logout-link="false"
        data-use-continue-as="false"
        data-onlogin={onlogin_callback_function}
      />
    )
  }

}

//
// respondToFbLoginStatus(response: facebook.AuthResponse) {
//   console.debug(response)
//   if (response.authResponse && response.status === 'connected') {
//     // user is logged in with facebook and has authorized app
//     console.debug('******user has logged in')
//     this.eventEmitter.emit('onLogin', response)
//     // this.loggedIn = true
//     // this.ref.detectChanges()
//     // const existed = await this.authService.getUserExists(response.authResponse.userID)
//     // this.authService.loginUserWithToken(response.authResponse.accessToken)
//     //   .then(res => {
//     //     this.__loadUser(res.user)
//     //     if (!existed) {
//     //       console.debug('user is new')
//     //       // take current values of bets and save them in backend
//     //       this.__saveBets()
//     //         .then(bets => {
//     //           console.debug(bets)
//     //           console.debug('bets saved')
//     //         })
//     //         .catch(e => {
//     //           console.error(e)
//     //           console.error('could not save bets')
//     //         })
//     //     } else {
//     //       console.debug('user already existed')
//     //       // ignore current values of bets and load values from backend
//     //       this.__loadBets()
//     //     }
//     //   })
//     //   .catch(e => {
//     //     console.error(e)
//     //     console.error('Could not login user on backend')
//     //   })
//   } else if (response.authResponse === undefined && response.status === 'unknown') {
//     // user is not logged in with facebook
//     // could have already logged in with jwt token
//     console.debug('******user is not logged in SHOULD ONLY RUN AT FB INIT')
//     // this.authTokenService.jwtToken
//     //   .then(token => {
//     //     // user has already logged in before, but logged out of facebook, but not out of the app
//     //     console.debug('token found')
//     //     const fbLoginButton = document.getElementById('facebook-login-button')
//     //     fbLoginButton.parentNode.removeChild(fbLoginButton)
//     //     this.__loadUser()
//     //   })
//     //   .catch(e => {
//     //     // user is not logged in with facebook or with jwt token
//     //     console.debug('no fb no token')
//     //   })
//     // console.debug('User has not logged in with facebook')
//   } else if (response.authResponse && response.status === 'unknown') {
//     // user just logged out of facebook
//     console.debug('******user has LOGGED OUT')
//     this.eventEmitter.emit('onLogout', response)
//     // this.loggedIn = false
//     // this.ref.detectChanges()
//     // this.logout()
//   }
// }
